
var path = "/home/matthew/Downloads/"

function parseFile(filePath) {

    var lines = fs.readFileSync(filePath, "utf8").split((/\r?\n/))
    var rows = [];

    lines.forEach(line => {
        let fields = parseFields(line);
        if (areFieldsValid(fields)) {
            rows.push(fields);
        }
    });

    rows.shift() // first row is removed since is just column names

    return rows;
}

function areFieldsValid(fields) {
    return fields.length > 1;
}

function parseFields(line) {


    var fields = [];
    while (true) {

        if (isNextFieldInQuotes(line)) {
            fieldLength = fieldInQuotesLength(line);
            fields.push(cleanField(line.slice(1, fieldLength)));
            line = line.slice(fieldLength + 2); // todo string length issue
        } else {
            let commaIndex = line.indexOf(',');
            if (commaIndex != -1) {
                fields.push(cleanField(line.slice(0, commaIndex)));
                line = line.slice(commaIndex + 1);
            } else {
                fields.push(cleanField(line));
                return fields;
            }

        }

    }

}

function cleanField(field) {

    return field.replace("\"\"", "\"");

}


// determines if the next field in record is in quotes. Fields in quotes can have commas. 
function isNextFieldInQuotes(line) {

    var isInQuotes = false;
    if (line.length > 0 && line.charAt(0) == "\"") {
        isInQuotes = true

        let charIndex = 0;
        while (++charIndex < line.length && line.charAt(charIndex) == "\"") {
            isInQuotes = !isInQuotes;
        }
    }
    return isInQuotes;
}

function fieldInQuotesLength(line) {

    var charIndex = 1; // skips first quotation 
    while (charIndex < line.length - 1) {
        if (line.charAt(charIndex) == "\"") {
            if (line.charAt(charIndex + 1) == "\"") {
                charIndex++;
            }
            else {
                return charIndex;
            }

        }

        charIndex++;

    }
    return charIndex;



}

function getExportFiles() {

    var exportFiles = [];
    fs.readdirSync(path).forEach(file => {
        if (file.toString().startsWith("orders_export") && file.toString().endsWith(".csv")) {
            exportFiles.push(path + file.toString());
        }
    })
   

    return exportFiles;

}

function extractItems() {

    let files = getExportFiles();
    let items = [];
    files.forEach(file => {
        items = items.concat(parseFile(file)); //TODO does this push individual elements or array objects
    })
    return items;

}