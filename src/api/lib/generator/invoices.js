'use strict';
const PDFLib = require('pdf-lib');
const fs = require('fs');
const fetch = require('node-fetch');
const fontkit = require('@pdf-lib/fontkit');
const moment = require('moment');
moment.locale('de');
const env = process.env.NODE_ENV || 'development';
const Minio = require('minio');
const path = require('path');

const fontBytesUbuntuR = fs.readFileSync(path.join(__dirname, 'assets', 'Ubuntu-Regular.ttf'));
const fontBytesUbuntuB = fs.readFileSync(path.join(__dirname, 'assets', 'Ubuntu-Bold.ttf'));


// top margin: 750
// left margin: 54

const leftMargin = 54;
const rightMargin = 54;
const topMargin = 750;
const pageWidth = 595;
const pageHeight = 842;
const printArea = pageWidth - leftMargin - rightMargin;



module.exports = async ({ consultation, handler }) => {
    console.log('Generating invoices report for:', consultation.uid);

    const pdfDoc = await PDFLib.PDFDocument.create();

    pdfDoc.registerFontkit(fontkit);

    // Embed our custom font in the document
    const customFontR = await pdfDoc.embedFont(fontBytesUbuntuR);
    const customFontB = await pdfDoc.embedFont(fontBytesUbuntuB);

    let page = await addNewPage({ pdfDoc, font: customFontR });
    const fontSize = 9;

    const { width, height } = page.getSize();


    const patientAddress = getAddress(consultation.patient);
    const doctorAddress = getAddress(consultation.doctor);

    if (!consultation?.manual_invoice?.consultation_date) {
        consultation.manual_invoice.consultation_date = consultation.confirmed_schedule;
    }

    // name and address added
    let cursor = topMargin;
    [cursor, page] = await addText({ pdfDoc, page, text: doctorAddress, fontSize: fontSize, cursor: cursor, font: customFontR, fitWidth: false });

    cursor = cursor - 15;
    [cursor, page] = await addText({ pdfDoc, page, text: patientAddress, fontSize: fontSize, cursor: cursor, font: customFontR, fitWidth: false });

    // invoice number and other detail added
    const invoiceData = getInvoice(consultation.manual_invoice, consultation.manual_invoice.consultation_date, getName(consultation.patient), consultation?.patient?.dob)
    let maxLenText = invoiceData?.split('\n')?.reduce((a, b) => a.length > b.length ? a : b);
    let consultationDateXPos = width - rightMargin - customFontR.widthOfTextAtSize(maxLenText, fontSize);
    cursor = cursor - 15;

    [cursor, page] = await addText({ pdfDoc, page, text: invoiceData, fontSize: fontSize, cursor: cursor + 120, font: customFontR, startPosition: consultationDateXPos - 100, fitWidth: false });

    // adding heading
    cursor = cursor - 30;
    const headingConstDate = consultation?.manual_invoice.consultation_date ? moment(consultation.manual_invoice.consultation_date).format('DD.MM.yyyy') : '';
    [cursor, page] = await addText({ pdfDoc, page, text: `Bill of ${headingConstDate}`, fontSize: fontSize, cursor: cursor - 15, font: customFontB });

    // adding statement
    cursor = cursor - 15;
    [cursor, page] = await addText({ pdfDoc, page, text: `Dear ${getName(consultation.patient)},`, fontSize: fontSize, cursor: cursor, font: customFontR });
    consultation.manual_invoice.dob = consultation?.patient?.dob ? moment(consultation?.patient?.dob).format('DD.MM.yyyy') : '';
    consultation.manual_invoice.consultation_date = consultation?.manual_invoice?.consultation_date ? moment(consultation?.manual_invoice?.consultation_date).format('DD.MM.yyyy') : '';
    consultation.manual_invoice.total = consultation.manual_invoice.total || '';

    let diagnosis = "";
    consultation?.diagnosis?.map(data => {
        diagnosis = diagnosis + "\n" + data
    })
    let tempText = `For medical treatment on ${consultation.manual_invoice.consultation_date}, I allow myself to invoice the following contributions.\n\nDiagnosis(s):${diagnosis}\n\nCalculated according to the fee schedule for doctors (GOÄ) (as of January 1, 2002)`;

    cursor = cursor - 15;
    [cursor, page] = await addText({ pdfDoc, page, text: tempText, fontSize: fontSize, cursor: cursor, font: customFontR });

    // table
    cursor = cursor - 15;
    [cursor, page] = await addInvoiceTable({ pdfDoc, page, data: consultation?.manual_invoice?.entries, fontSize: fontSize, cursor: cursor, font: customFontR, consultation });

    // total
    cursor = cursor;
    [cursor, page] = await addInvoiceAmount({ pdfDoc, page, textArray: ['Invoice amount', `${consultation.manual_invoice.total}€`], fontSize: fontSize, cursor: cursor, font: customFontR, width });

    // staement
    cursor = cursor;
    [cursor, page] = await addText({ pdfDoc, page, text: `VAT-free according to Section 4 Paragraph 14 UstG`, fontSize: fontSize, cursor: cursor, font: customFontR, startPosition: 350 });

    // statement
    consultation.manual_invoice.due_date = consultation?.manual_invoice?.due_date ? moment(consultation.manual_invoice.due_date).format('DD.MM.yyyy') : '';
    cursor = cursor - 15;
    [cursor, page] = await addText({ pdfDoc, page, text: `Please transfer the amount by stating the invoice number and date ${consultation.manual_invoice.due_date} to the account specified below`, fontSize: fontSize, cursor: cursor, font: customFontR });

    // bank details
    cursor = cursor - 45;
    consultation.bank_details.IBAN = consultation.bank_details.IBAN || '';
    consultation.bank_details.BIC = consultation.bank_details.BIC || '';
    [cursor, page] = await addText({ pdfDoc, page, text: `Doctor's name: ${getName(consultation.doctor)}\nAddress: ${consultation.doctor.address_line_1 || ""}, ${consultation.doctor.address_line_2 ? consultation.doctor.address_line_2 + "," : ""} ${consultation.doctor.postal_code || ""}, ${consultation.doctor.city || ""}`, fontSize: fontSize, cursor: cursor, font: customFontR });
    // \nBIC: ${consultation.bank_details.BIC}\nIBAN: ${consultation.bank_details.IBAN}
    // save to file
    const pdfBytes = await pdfDoc.save();

    // fs.writeFile('C:/Users/user/Desktop/test1.pdf', pdfBytes, (err) => {
    //     if (err) {
    //         return console.log(err)
    //     } else {
    //         console.log('Generated invoices report for ', consultation.uid);
    //     }
    // });

    // return await fetch(consultation.urls[0], {
    //     method: 'PUT',
    //     body: pdfBytes,
    //     headers: { 'Content-Type': 'application/pdf' },
    // })
    //     .then(res => handler)
    //     .catch(err => {
    //         console.error(`Failed to upload the generated invoices document: ${consultation.uid}`, err)
    //         return false
    //     })

    const bucketName = process.env.S3_BUCKET_NAME;
    const metaData = {
        'Content-Type': "application/pdf"
    };

    const minioClient = new Minio.Client({
        endPoint: 's3.amazonaws.com',
        port: 443,
        useSSL: true,
        accessKey: process.env.S3_ACCESS_KEY,
        secretKey: process.env.S3_SECRET_ACCESS_KEY,
    });

    try {
        minioClient
            .putObject(bucketName, handler.objectKey, new Buffer(pdfBytes), metaData)
            .catch((e) => {
                console.log('Error while creating object from file data: ', e);
                throw e;
            });

    } catch (error) {
        console.log('error is', error);
    }
    return { status: true }
}


/*
// Add text into parapgraphs and returns new cursor position
*/
async function addText({ pdfDoc, page, text, fontSize = 10, cursor = topMargin, font, lineHeight = 5, startPosition = leftMargin, fitWidth = true }) {
    text = text ? text : '';
    if (fitWidth) {
        text = fillParagraph({ text, font, fontSize, maxWidth: printArea })
    }

    const textArray = text.split('\n');

    for (let i = 0; i < textArray.length; i++) {
        if (cursor < 60) {
            page = await addNewPage({ pdfDoc, font: font });
            cursor = topMargin
        }
        page.drawText(textArray[i] || "", {
            x: startPosition,
            y: cursor,
            size: fontSize,
            font: font,
        });
        cursor = cursor - (font.heightAtSize(fontSize) + lineHeight);
    }

    return [cursor, page];
}

async function addInvoiceTable({ pdfDoc, page, data = [], fontSize = 10, cursor = topMargin, font, lineHeight = 5, startPosition = leftMargin, fitWidth = true, consultation }) {
    if (cursor < 60) {
        page = await addNewPage({ pdfDoc, font: font });
        cursor = topMargin
    }

    // creating row and column
    let colArr = ['Date    ', 'No.(GOÄ)', 'Performance designation', 'EB €', 'Increase rate', 'Amount     '];
    let startPositionArr = [];
    const lineStartPos = startPosition;

    for (let i = 0; i < colArr?.length; i++) {
        page = lineDraw(page, startPosition - 7, cursor + 12, startPosition - 7, cursor - fontSize + 5, 1);
        page.drawText(colArr[i] || "", {
            x: startPosition,
            y: cursor,
            size: fontSize,
            font: font,
        });
        startPositionArr.push(startPosition)

        startPosition += font.widthOfTextAtSize(colArr[i], fontSize) + 30;
        if (colArr[i] == "Performance designation") {
            startPosition += 30
        }
    }

    page = lineDraw(page, lineStartPos - 7, cursor + 12, startPositionArr[5] + 34, cursor + 12, 1);

    page = lineDraw(page, startPositionArr[5] + 34, cursor + 12, startPositionArr[5] + 34, cursor - fontSize + 5, 1);

    for (let i = 0; i < data?.length; i++) {
        cursor = cursor - (font.heightAtSize(fontSize) + lineHeight)
        if (cursor < 60) {
            page = await addNewPage({ pdfDoc, font: font });
            cursor = topMargin
        }
        page = lineDraw(page, lineStartPos - 7, cursor + 12, startPositionArr[5] + 34, cursor + 12, 1);

        consultation.manual_invoice.consultation_date = consultation.manual_invoice.consultation_date || "";
        page.drawText(consultation.manual_invoice.consultation_date, {
            x: startPositionArr[0],
            y: cursor,
            size: fontSize,
            font: font,
        });

        if (!data[i]?.items?.length) {
            page = lineDraw(page, startPositionArr[0] - 7, cursor + 12 - (font.heightAtSize(fontSize) + lineHeight), startPositionArr[5] + 34, cursor + 12 - (font.heightAtSize(fontSize) + lineHeight), 1);

            for (let i = 0; i < startPositionArr.length; i++) {
                page = lineDraw(page, startPositionArr[i] - 7, cursor + 12, startPositionArr[i] - 7, cursor + 12 - (font.heightAtSize(fontSize) + lineHeight), 1);
            }
            page = lineDraw(page, startPositionArr[5] + 34, cursor + 12, startPositionArr[5] + 34, cursor + 12 - (font.heightAtSize(fontSize) + lineHeight), 1);
        }

        for (let j = 0; j < data[i]?.items?.length; j++) {
            const description = wrap(data[i].items[j].description?.toString(), 33);
            const dummyCurser = cursor - description.length * (font.heightAtSize(fontSize) + lineHeight);
            if (dummyCurser < 60) {
                page = await addNewPage({ pdfDoc, font: font });
                cursor = topMargin
            }

            if (cursor < 60) {
                page = await addNewPage({ pdfDoc, font: font });
                cursor = topMargin
            }
            page.drawText(data[i].items[j].code?.toString() || "", {
                x: startPositionArr[1],
                y: cursor,
                size: fontSize,
                font: font,
            });

            const beforCursor = cursor;
            let afterCursor;
            for (let k = 0; k < description.length; k++) {
                let descriptionText = description[k];
                page.drawText(descriptionText?.toString() || "", {
                    x: startPositionArr[2],
                    y: cursor,
                    size: fontSize,
                    font: font,
                });
                cursor = cursor - (font.heightAtSize(fontSize) + lineHeight);
                afterCursor = cursor;
            }
            cursor = beforCursor;
            page.drawText(data[i].items[j].quantity?.toString() || "", {
                x: startPositionArr[3],
                y: cursor,
                size: fontSize,
                font: font,
            });
            page.drawText(data[i].items[j].multiplier?.toString() || "", {
                x: +startPositionArr[4],
                y: cursor,
                size: fontSize,
                font: font,
            });
            page.drawText(data[i].items[j].total + '€', {
                x: startPositionArr[5],
                y: cursor,
                size: fontSize,
                font: font,
            });
            cursor = afterCursor;
            page = lineDraw(page, startPositionArr[1] - 7, cursor + 12, startPositionArr[5] + 34, cursor + 12, 1);

            for (let i = 0; i < startPositionArr.length; i++) {
                page = lineDraw(page, startPositionArr[i] - 7, beforCursor + 12, startPositionArr[i] - 7, cursor + 12, 1);
            }
            page = lineDraw(page, startPositionArr[5] + 34, beforCursor + 12, startPositionArr[5] + 34, cursor + 12, 1);
        }

        page = lineDraw(page, startPositionArr[0] - 7, cursor + 12, startPositionArr[5] + 34, cursor + 12, 1);
    }
    cursor = cursor - (font.heightAtSize(fontSize) + lineHeight);

    return [cursor, page];
}

async function addInvoiceAmount({ pdfDoc, page, textArray, fontSize = 10, cursor = topMargin, font, lineHeight = 5, startPosition = leftMargin, width }) {
    // textArray = ["Text1", "Text2"]
    textArray = typeof textArray == 'object' ? textArray : [];

    if (cursor < 60) {
        page = await addNewPage({ pdfDoc, font: font });
        cursor = topMargin
    }
    page.drawText(textArray[0] || "", {
        x: startPosition,
        y: cursor,
        size: fontSize,
        font: font,
    });
    page.drawText(textArray[1] || "", {
        x: width - rightMargin - font.widthOfTextAtSize(textArray[1], fontSize) - 35,
        y: cursor,
        size: fontSize,
        font: font,
    });

    cursor = cursor - (font.heightAtSize(fontSize) + lineHeight);

    return [cursor, page];
}

/*
// 595x842
// Add new page with logo as header and footer
//  
*/
async function addNewPage({ pdfDoc, font }) {
    // const pngImageBytes = fs.readFileSync(path.join(__dirname, 'assets', 'logo-stacked-512.png'));
    // const pngImage = await pdfDoc.embedPng(pngImageBytes)


    const page = pdfDoc.addPage();
    const { width, height } = page.getSize();

    // page.drawImage(pngImage, {
    //     x: leftMargin,
    //     y: page.getHeight() - 50,
    //     width: 39,
    //     height: 26,
    // })

    const fontSize = 8
    const footerText1 = 'Athrey'
    const footerText2 = '';

    page.drawText(footerText1 || "", {
        x: (width - font.widthOfTextAtSize(footerText1, fontSize)) / 2,
        y: 10 + font.heightAtSize(fontSize) + 5,
        size: fontSize,
        font: font,
    });
    page.drawText(footerText2 || "", {
        x: (width - font.widthOfTextAtSize(footerText2, fontSize)) / 2,
        y: 10,
        size: fontSize,
        font: font,
    });

    return page
}

/*
// Construct the name and address
*/
function getAddress(user) {
    const name = getName(user);
    let address = '';
    if (user.address_line_1) {
        if (user.address_line_2) {
            address = `${user.address_line_1} ${user.address_line_2}`
        } else {
            address = `${user.address_line_1}`
        }
    } else if (user.address_line_2) {
        address = user.address_line_2
    }

    const city = user.city ? user.city : '';
    const postal_code = user.postal_code ? user.postal_code : '';
    return `${name}\n${address}\n${postal_code} ${city}`;
}

function getInvoice(invoice, appointmentDate, name, dob) {
    const date = invoice?.invoice_date ? moment(invoice?.invoice_date).format('DD.MM.yyyy') : '';
    appointmentDate = appointmentDate ? moment(appointmentDate).format('DD.MM.yyyy') : '';
    if (dob?.split(".")?.length !== 3 &&
        dob.length !== 10
    ) {
        dob = moment(dob).format('DD.MM.yyyy');
    }
    const number = invoice?.invoice_number || '';
    const patient_number = invoice?.patient_number || '';
    return `Date of invoice:      ${date}\nInvoice number:      ${number}\nDate of service:      ${appointmentDate}\nPatient:                     ${name}\nBirth date:                ${dob}\nPatient number:     ${patient_number}`;
}
// "Date of invoice:      A"
// "Invoice number:       A"
// "Date of service:      A"
// "Patient:              A"
// "Birth date:           A"
// "Patient number:       A"
/*
// Break the text to paragraph
*/
function fillParagraph({ text, font, fontSize, maxWidth }) {
    var paragraphs = text.split('\n');
    for (let index = 0; index < paragraphs.length; index++) {
        var paragraph = paragraphs[index];
        if (font.widthOfTextAtSize(paragraph, fontSize) > maxWidth) {
            var words = paragraph.split(' ');
            var newParagraph = [];
            var i = 0;
            newParagraph[i] = [];
            for (let k = 0; k < words.length; k++) {
                var word = words[k];
                newParagraph[i].push(word);
                if (font.widthOfTextAtSize(newParagraph[i].join(' '), fontSize) > maxWidth) {
                    newParagraph[i].splice(-1); // retira a ultima palavra
                    i = i + 1;
                    newParagraph[i] = [];
                    newParagraph[i].push(word);
                }
            }
            paragraphs[index] = newParagraph.map(p => p.join(' ')).join('\n');
        }
    }
    return paragraphs.join('\n');
}

/*
// Construct the user name
*/
function getName({ salute, title, firstname, lastname }) {
    let name = firstname + ' ' + lastname;
    if (title) {
        return title + ' ' + name;
    }
    // if (salute == 'Mr.') {
    //     salute = 'Hr.';
    // } else if (salute == 'Ms.' || salute == 'Mrs.') {
    //     salute = 'Fr.';
    // }
    return salute + ' ' + name;
}

// wrap text
function wrap(str = "", maxWidth = 20) {
    let res = [];
    while (str.length > maxWidth) {
        let found = false;
        // Inserts new line at first whitespace of the line
        for (let i = maxWidth - 1; i >= 0; i--) {
            if (testWhite(str.charAt(i))) {
                res.push(str.slice(0, i));
                str = str.slice(i + 1);
                found = true;
                break;
            }
        }
        // Inserts new line at maxWidth position, the word is too long to wrap
        if (!found) {
            res.push(str.slice(0, maxWidth));
            str = str.slice(maxWidth);
        }
    }
    res.push(str)
    return res;
}

function testWhite(x) {
    var white = new RegExp(/^\s$/);
    return white.test(x.charAt(0));
};

function lineDraw(page, startX, startY, endX, endY, thick = 2) {
    page.drawLine({
        start: { x: startX, y: startY },
        end: { x: endX, y: endY },
        thickness: thick,
        color: PDFLib.rgb(0, 0, 0),
        opacity: 1,
    })
    return page
}