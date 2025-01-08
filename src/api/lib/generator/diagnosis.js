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
    console.log('Generating diagnosis report for:', consultation.uid);

    const pdfDoc = await PDFLib.PDFDocument.create();

    pdfDoc.registerFontkit(fontkit);

    // Embed our custom font in the document
    const customFontR = await pdfDoc.embedFont(fontBytesUbuntuR);
    const customFontB = await pdfDoc.embedFont(fontBytesUbuntuB);

    let page = await addNewPage({ pdfDoc, font: customFontR });
    const fontSize = 10;

    const { width, height } = page.getSize();


    const patientAddress = getAddress(consultation.patient);
    const doctorAddress = getAddress(consultation.doctor);

    let cursor = topMargin;
    [cursor, page] = await addText({ pdfDoc, page, text: patientAddress, fontSize: fontSize, cursor: cursor, font: customFontB, fitWidth: false });

    cursor = cursor - 15;
    [cursor, page] = await addText({ pdfDoc, page, text: doctorAddress, fontSize: fontSize, cursor: cursor, font: customFontR, fitWidth: false });

    const consultationDate = 'Date of findings: ' + moment(consultation.confirmed_schedule).format('DD.MMM yyyy');
    let consultationDateXPos = width - rightMargin - customFontR.widthOfTextAtSize(consultationDate, fontSize);
    cursor = cursor - 15;
    [cursor, page] = await addText({ pdfDoc, page, text: consultationDate, fontSize: fontSize - 2, cursor: cursor - 10, font: customFontB, startPosition: consultationDateXPos, fitWidth: false });

    // medical examination heading
    cursor = cursor + 10;
    [cursor, page] = await addText({ pdfDoc, page, text: 'Findings report', fontSize: fontSize + 3, cursor: cursor, font: customFontB });

    // history heading
    cursor = cursor;
    [cursor, page] = await addText({ pdfDoc, page, text: 'Previous illnesses', fontSize: fontSize, cursor: cursor, font: customFontB });
    [cursor, page] = await addText({ pdfDoc, page, text: consultation.diagnosis.history, fontSize: fontSize, cursor: cursor, font: customFontR });

    // findings heading
    cursor = cursor - 15;
    [cursor, page] = await addText({ pdfDoc, page, text: 'Results', fontSize: fontSize, cursor: cursor, font: customFontB });
    [cursor, page] = await addText({ pdfDoc, page, text: consultation.diagnosis.findings, fontSize: fontSize, cursor: cursor, font: customFontR });


    // Diagnose heading
    cursor = cursor - 15;
    [cursor, page] = await addText({ pdfDoc, page, text: 'Diagnosis', fontSize: fontSize, cursor: cursor, font: customFontB });
    for (let i = 0; i < consultation.diagnosis.diagnosis.length; i++) {
        const diagnosisText = consultation.diagnosis.diagnosis[i];
        [cursor, page] = await addText({ pdfDoc, page, text: diagnosisText, fontSize: fontSize, cursor: cursor, font: customFontR });
    }

    // therapy heading
    cursor = cursor - 15;
    [cursor, page] = await addText({ pdfDoc, page, text: 'Therapy/Recommendation', fontSize: fontSize, cursor: cursor, font: customFontB });
    [cursor, page] = await addText({ pdfDoc, page, text: consultation.diagnosis.therapy, fontSize: fontSize, cursor: cursor, font: customFontR });


    // signature
    cursor = cursor - 30;
    [cursor, page] = await addText({ pdfDoc, page, text: `Best regards`, fontSize: fontSize, cursor: cursor, font: customFontR });
    cursor = cursor;
    [cursor, page] = await addText({ pdfDoc, page, text: getName(consultation.doctor), fontSize: fontSize, cursor: cursor, font: customFontB });

    // save to file
    const pdfBytes = await pdfDoc.save();

    // fs.writeFile('C:\\Users\\chann\\Desktop\\documents\\create.pdf', pdfBytes, (err) => {
    //     if (err) {
    //         return console.log(err)
    //     } else {
    //         console.log('Generated diagnosis report for ', consultation.uid);
    //     }
    // });

    // return await fetch(consultation.urls[0], {
    //     method: 'PUT',
    //     body: pdfBytes,
    //     headers: { 'Content-Type': 'application/pdf' },
    // })
    //     .then(res => handler)
    //     .catch(err => {
    //         console.error(`Failed to upload the generated diagnosis document: ${consultation.uid}`, err)
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
        page.drawText(textArray[i], {
            x: startPosition,
            y: cursor,
            size: fontSize,
            font: font,
        });
        cursor = cursor - (font.heightAtSize(fontSize) + lineHeight);
    }

    return [cursor, page];
}

/*
// 595x842
// Add new page with logo as header and footer
//  
*/
async function addNewPage({ pdfDoc, font }) {
    const pngImageBytes = fs.readFileSync(path.join(__dirname, 'assets', 'logo-stacked-512.png'));
    const pngImage = await pdfDoc.embedPng(pngImageBytes)


    const page = pdfDoc.addPage();
    const { width, height } = page.getSize();

    page.drawImage(pngImage, {
        x: leftMargin,
        y: page.getHeight() - 50,
        width: 39,
        height: 26,
    })

    const fontSize = 8
    const footerText1 = 'Athrey'
    const footerText2 = '';

    page.drawText(footerText1, {
        x: (width - font.widthOfTextAtSize(footerText1, fontSize)) / 2,
        y: 10 + font.heightAtSize(fontSize) + 5,
        size: fontSize,
        font: font,
    });
    page.drawText(footerText2, {
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
