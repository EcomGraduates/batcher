const electron = require('electron');
//const BrowserWindow = electron.remote.BrowserWindow

var labelPage = {
    currentColumn: null,
    currentPage: null,
    labelsOnPage: 0,
    columnsOnPage: 0
};


function createRuler() {
    let ruler = document.createElement("canvas");
    ruler.setAttribute("id", "ruler");
    document.body.appendChild(ruler);


    let sizeDiv = document.createElement("div");
    sizeDiv.setAttribute("id", "sizeRuler");
    sizeDiv.classList.add('size');
    document.body.appendChild(sizeDiv);
}
function createFirstLabelPageDiv() {

    document.body.innerHTML = '';

//     let win = new BrowserWindow({ width: 400, height: 200 })
//   win.on('close', function () { win = null })
//   win.loadFile("index.html")
//   win.show()
   
    createRuler();

    var pageDiv = document.createElement("div");
    pageDiv.classList.add('pageContainer');
    pageDiv.setAttribute("id", "hello there");
    labelPage.currentPage = pageDiv;
    document.body.appendChild(pageDiv);


    var columnDiv = document.createElement("div");
    columnDiv.classList.add('columnContainer');
    labelPage.currentColumn = columnDiv;
    labelPage.columnsOnPage++;
    labelPage.currentPage.appendChild(columnDiv);
}


function $(id) {
    return document.getElementById(id);
}

String.prototype.maxFontSize = function (element) {

    maxWidth = element.offsetWith;
    var ruler = $("ruler");
    var font = 8.0;

    var canvasText = ruler.getContext("2d");
    canvasText.font = font + "pt Arial";

    while (canvasText.measureText(this).width > maxWidth) {
        font -= .5;
        canvasText.font = font + "pt Arial";

    }
    return font;

}

function newLabelPage() {

    var pageDiv = document.createElement("div");
    pageDiv.classList.add('pageContainer');

    document.body.appendChild(pageDiv);
    labelPage.currentPage = pageDiv;
    labelPage.labelsOnPage = 0;
    labelPage.columnsOnPage = 0;


}

function newColumn() {

    var columnDiv = document.createElement("div");
    columnDiv.classList.add('columnContainer');

    if (labelPage.columnsOnPage > 3) {
        newLabelPage();
    }
    labelPage.currentColumn = columnDiv;
    labelPage.columnsOnPage++;
    labelPage.currentPage.appendChild(columnDiv);


}



function newLabelDiv(label) {

    var labelDiv = document.createElement("div");
    labelDiv.classList.add('label');

    let horizontalElementsDiv = newDiv(labelDiv, "", "horizontalElements");
    newProductDiv(horizontalElementsDiv, label.firstLine);
    newSizeDiv(horizontalElementsDiv, label.secondLine);
    newDiv(horizontalElementsDiv, "", "bottom");
    newDiv(labelDiv, label.invoice, "invoice");
    newDiv(labelDiv, "", "labelDivider");


    if (labelPage.labelsOnPage > 0 && labelPage.labelsOnPage % 15 == 0) {
        newColumn();
    }
    labelPage.labelsOnPage++;
    labelPage.currentColumn.appendChild(labelDiv)


}

function newProductDiv(parentDiv, content) {

    let productDiv = document.createElement("div");
    productDiv.classList.add('productDiv');
    innerDiv = document.createElement("div");
    innerDiv.classList.add('innerDiv');
    innerDiv.textContent = content;
    productDiv.appendChild(innerDiv);

    parentDiv.appendChild(productDiv);

}

function newDiv(parentDiv, content, classType) {

    let div = document.createElement("div");
    div.classList.add(classType);
    div.textContent = content;
    parentDiv.appendChild(div);

    return div;

}

function newSizeDiv(parentDiv, content) {

    let sizeDiv = document.createElement("div");
    sizeDiv.classList.add('size');
    parentDiv.appendChild(sizeDiv);
    sizeDiv.style.fontSize = content.maxFontSize(sizeDiv) + "pt";
    sizeDiv.textContent = content;

}


