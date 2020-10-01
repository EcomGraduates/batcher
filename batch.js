
var fs = require('fs');
const remote = require('electron').remote

const PRODUCT = 17;
const QUANTITY = 16;
const SHIPPING_METHOD = 14;
const BATCH_SIZE = 30;
const INVOICE = 0;
class Batch {
    constructor(labels) {
        this.labels = labels;
    }
};

class Order {
    constructor(labels, invoice, hasPriority) {
        this.labels = labels;
        this.invoice = invoice;
        this.hasPriority = hasPriority
    }
};
class Label {

    constructor(invoice, quantity, fline, sline) {
        this.invoice = invoice;
        this.firstLine = fline
        this.secondLine = sline;
        this.quantity = quantity;
    }
};

function makeLabel(product, quantity, invoice) {
    let { firstLine, secondLine } = parseProduct(product); // each label has two lines of text that are made from full product description
    return new Label(invoice, quantity, firstLine, secondLine);
}

function cleanInvoiceNumber(invoiceNumber) {

    return invoiceNumber.replace(/\D/g, '');

}
function makeOrder(items) {
    invoice = cleanInvoiceNumber(items[0][INVOICE]);
    let labels = [];
    items.forEach(item => {
        labels.push(makeLabel(item[PRODUCT], item[QUANTITY], invoice));
    });
    return new Order(labels, invoice, isPriority(items[0][SHIPPING_METHOD]));
}

function isPriority(shippingMethod) {
    return (shippingMethod === "FEDEX 2 Day");
}


function extractOrders() {
    let items = extractItems()
    let orders = [];

    if (items.length > 0) {
        let index = 0;
        let previousInvoice = items[0][INVOICE];
        while (items.length > 0) {

            if (index == items.length) {
                orders.push(makeOrder(items.splice(0, index)))
                return orders;
            }

            if (invoiceChanged(previousInvoice, items[index][INVOICE])) {
                orders.push(makeOrder(items.splice(0, index)))
                index = 0;
                previousInvoice = items[0][INVOICE];
            }
            index++;
        }
    }

    return orders;
}

function invoiceChanged(previousInvoice, currentInvoice) {
    return previousInvoice != currentInvoice;
}
function sortOrders(orders) {
    orders.sort(function (a, b) {

        if (a.hasPriority) {
            if (b.hasPriority) {
                return 0;
            }
            return -1;
        } else if (b.hasPriority) {
            if (a.hasPriority) {
                return 0;
            }
            return 1;
        }
        if (a.invoice < b.invoice) {
            return -1;

        }
        else if (a.invoice > b.invoice) {
            return 1;
        }
        else {
            return 0;
        }

    });
}

function sortBatches(batches) {

    batches.forEach(batch => {

        batch.labels.sort(function (a, b) {
            if (a.secondLine < b.secondLine) {
                return -1;

            }
            else if (a.secondLine > b.secondLine) {
                return 1;
            }
            else {
                if (a.firstLine < b.firstLine) {
                    return -1;
                }
                else if (a.firstLine > b.firstLine) {
                    return 1;
                }
                else return 0;
            }
        });

    });
}

function createBatches() {
    let orders = extractOrders();
    sortOrders(orders);

    let batches = [];
    while (orders.length > 0) {
        let batchLabels = [];
        let ordersForBatch = [];
        if (orders.length < BATCH_SIZE) {
            ordersForBatch = orders.splice(0, orders.length);
        }
        else {
            ordersForBatch = orders.splice(0, BATCH_SIZE);
        }

        ordersForBatch.forEach(order => {
            order.labels.forEach(label => {
                batchLabels.push(label);
            });

        });
        batches.push(new Batch(batchLabels));
    }
    createFirstLabelPageDiv();
    sortBatches(batches);
    batches[0].labels.forEach(label => {
        newLabelDiv(label);
    });
    var child = document.getElementById("ruler");

    document.body.removeChild(child);
    saveLabelsAsPDF();

  remote.getCurrentWebContents().print();
}


function parseProduct(product) {

    let productElements = product.split(" - ");
    let firstLine;
    let secondLine = "";

    if (productElements.length >= 2) {
        firstLine = productElements[0];
        secondLine = productElements[1];
    }
    else if (productElements.length == 1) {
        firstLine = productElements[0];
    }


    if (firstLine.indexOf("Compare to") !== -1) {
        firstLine = firstLine.replace("Compare to ", "");
        firstLine += " Type*";
    }
    return { firstLine, secondLine };

}

function printLabel(label) {
    console.log(label.invoice + " " + label.firstLine + " " + label.secondLine)
}

function printLabels(batch) {
    batch.labels.forEach(label => {
        printLabel(label);
    });
}

function saveLabelsAsPDF() {
  
    remote.getCurrentWebContents().printToPDF(pdfSettings(), (error, data) => {
    if (error) throw error
    fs.writeFile('print.pdf', data, (error) => {
      if (error) throw error
      console.log('Write PDF successfully.')
    })
  })

}

function pdfSettings() {
    var option = {
        landscape: false,
        marginsType: 0,
        printBackground: false,
        printSelectionOnly: false,
        pageSize: "Letter"
    };
  return option;
}
document.querySelector('#createBatches').addEventListener('click', createBatches)
