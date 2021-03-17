const PDFDocument = require('pdfkit');
const fs = require('fs');



function createReceipt(details){

const doc = new PDFDocument({margin: 50});

receiptHeader(doc);
shippingInfo(doc, details);
receiptTable(doc, details);
receiptFooter(doc);
doc.end();

doc.pipe(fs.createWriteStream(`./receipts/${details.saveAs}.pdf`));

}

function receiptHeader(doc){
  
        doc.fillColor("#444444")
        .fontSize(20)
        .text("AMWINE Shop.", 110, 57)
        .fontSize(10)
        .text("Bhaktapur", 200, 65, { align: "right" })
        .text("Bagmati Province, Nepal, 44122", 200, 80, { align: "right" })
        .moveDown();



}

function receiptFooter(doc){
 
    doc.fontSize(10)
       .text(
       "You will be called before Delivery!",
       50,
       780,
       { align: "center", width: 500 }
        );

}
function generateHr(doc, y) {
    doc
      .strokeColor("#aaaaaa")
      .lineWidth(1)
      .moveTo(50, y)
      .lineTo(580, y)
      .stroke();
  }
function shippingInfo(doc, details){
  
    const shipping = details.shipping;
    doc
    .text(`Invoice Number: ${details.id}`, 50, 200)
    .text(`Invoice Date: ${new Date()}`, 50, 215)
    .text(`Balance Due: ${details.total - details.paid}`, 50, 130)
    .text(shipping.name, 300, 200)
    .text(shipping.address, 350, 215)
    .moveDown();
}

function tableRow(doc, y,c1,c2,c3,c4,c5, size = 10, font = 'Helvetica'){

    doc
    .font(font)
    .fontSize(size)
    .text(c1, 50, y)
    .text(c2, 150, y)
    .text(c3, 280, y, { width: 90, align: "right" })
    .text(c4, 370, y, { width: 90, align: "right" })
    .text(c5, 0, y, { align: "right" });

}

function receiptTable(doc, details){
 
    let i,  
    invoiceTableTop = 300;
   
    tableRow(
    doc,
    invoiceTableTop,
    "Name",
    "Type",
    "Variety",
    "Quantity",
    "Price",
    15,
    'Helvetica-Bold'
    );
    generateHr(doc,invoiceTableTop +15)
    for (i = 0; i < details.items.length; i++) {
        
    const item = details.items[i];
    const position = invoiceTableTop + (i + 1) * 30;
    tableRow(
    doc,
    position,
    item.name,
    item.type,
    item.variety,
    item.quantity,
    item.price,
    );
    generateHr(doc,position+10)
    }

    tableRow(
        doc,
        invoiceTableTop + (i + 1) * 30,
        "SubTotal",
        "",
        "",
        "",
        details.subTotal,
        10, 
        'Helvetica-Bold'
     );
     generateHr(doc,invoiceTableTop + (i + 1) * 30+10)
     tableRow(
        doc,
        invoiceTableTop + (i + 2) * 30,
        "Shipping Fee",
        "",
        "",
        "",
        details.subTotal,
        10, 
        'Helvetica-Bold'
     
     );
     generateHr(doc,invoiceTableTop + (i + 2) * 30+10)
     tableRow(
        doc,
        invoiceTableTop + (i + 3) * 30,
        "Total",
        "",
        "",
        "",
        details.total,
        10, 
    'Helvetica-Bold'
     
     );
     generateHr(doc,invoiceTableTop + (i + 3) * 30+10)
     tableRow(
        doc,
        invoiceTableTop + (i + 4) * 30,
        "Paid",
        "",
        "",
        "",
        details.paid,
        10, 
        'Helvetica-Bold'
     
     );
     generateHr(doc,invoiceTableTop + (i + 4) * 30+10)
     tableRow(
        doc,
        invoiceTableTop + (i + 5) * 30,
        "Due",
        "",
        "",
        "",
        details.total - details.paid,
        10, 
        'Helvetica-Bold'
     
     );
     generateHr(doc,invoiceTableTop + (i + 5) * 30+10)
        
}

module.exports = createReceipt;