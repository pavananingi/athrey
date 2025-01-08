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

const blueslip = fs.readFileSync(path.join(__dirname, 'assets', 'prescription', 'blue.pdf'));



module.exports = async ({ consultation, handler }) => {
    try {
        console.log('Generating prescription for: ', consultation.uid)

        let pdfDoc = await PDFLib.PDFDocument.create();

        pdfDoc.registerFontkit(fontkit);

        // Embed our custom font in the document
        const customFontR = await pdfDoc.embedFont(fontBytesUbuntuR);
        const customFontB = await pdfDoc.embedFont(fontBytesUbuntuB);
        const fontSize = 12;

        // let page = await addNewPage({ consultation: consultation, fontSize: fontSize, pdfDoc: pdfDoc, font: customFontR });
        let page = await addMedicines({ pdfDoc, consultation: consultation, fontSize: 10, font: customFontR });

        page = await addSomeText({ page, fontSize: 12, font: customFontR });

        // save to file
        const pdfBytes = await pdfDoc.save();

        // fs.writeFile('C:\\Users\\chann\\Desktop\\documents\\blue-slip.pdf', pdfBytes, (err) => {
        //     if (err) {
        //         return console.log(err)
        //     } else {
        //         console.log('Generated prescription for ', consultation.uid);
        //     }
        // });

        // return await fetch(consultation.urls[0], {
        //     method: 'PUT',
        //     body: pdfBytes,
        //     headers: { 'Content-Type': 'application/pdf' },
        // })
        //     .then(res => handler)
        //     .catch(err => {
        //         console.error(`Failed to upload the generated prescription document: ${consultation.uid}`, err)
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

    } catch (error) {
        console.error('Failed to create prescription', error);
    }
}

function addSomeText({ page, fontSize = 10, font }) {
    // page.drawText("- Rezeptende -", {
    //     x: 120,
    //     y: 530,
    //     size: fontSize,
    //     font: font,
    // });

    return page;
}

function addInsuranceName({ name, page, fontSize = 10, font }) {
    page.drawText(name, {
        x: 50,
        y: 792,
        size: fontSize,
        font: font,
    });

    return page;
}

function addDateOfBirth({ dob, page, fontSize = 10, font }) {
    page.drawText(dob, {
        x: 263,
        y: 743,
        size: fontSize,
        font: font,
    });

    return page;
}

function addAppointmentDate({ appointmentDate, page, fontSize = 10, font }) {
    page.drawText(appointmentDate, {
        x: 260,
        y: 653,
        size: fontSize,
        font: font,
    });

    return page;
}

async function addMedicines({ pdfDoc, fontSize = 10, font, consultation }) {
    const medicines = consultation.prescription.medicines;

    if (!medicines) {
        console.log('No medicines');
    }
    const lineHeight = 0;
    const startPosition = 50;
    let page;

    for (let i = 0; i < medicines.length; i++) {
        const position = i % 3;
        if (position === 0) {
            page = await addNewPage({ consultation: consultation, fontSize: fontSize, pdfDoc: pdfDoc, font: font });
        }
        const medicine = medicines[i].name + ` >>${medicines[i].intake}<<`
        page = await addText({ page, text: medicine, fontSize, font, lineHeight: lineHeight, startPosition: startPosition, position: position });
    }
    return page
}


/*
// Add text into parapgraphs and returns new cursor position
*/
async function addText({ page, text, fontSize = 10, position, font, lineHeight = 5, startPosition = 50 }) {
    text = text ? text : '';
    text = fillParagraph({ text, font, fontSize, maxWidth: 300 })
    const textArray = text.split('\n');

    let cursor = 0;

    if (position === 0) {
        cursor = 610;
    } else if (position === 1) {
        cursor = 575;
    } else if (position === 2) {
        cursor = 540;
    } else {
        return;
    }


    for (let i = 0; i < textArray.length; i++) {
        page.drawText(textArray[i], {
            x: startPosition,
            y: cursor,
            size: fontSize,
            font: font,
        });
        cursor = cursor - (font.heightAtSize(fontSize) + lineHeight);
    }

    return page;
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
                    newParagraph[i].splice(-1);
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

function addPatientDetails({ patientDetails, page, fontSize = 10, font, lineHeight = 3 }) {

    const text = patientDetails ? patientDetails : '';
    const textArray = text.split('\n');
    let cursor = 760;
    for (let i = 0; i < textArray.length; i++) {
        page.drawText(textArray[i], {
            x: 50,
            y: cursor,
            size: fontSize,
            font: font,
        });
        cursor = cursor - (font.heightAtSize(fontSize) + lineHeight);
    }

    return page;
}

function addDoctorDetails({ doctorDetails, page, fontSize = 10, font, lineHeight = 2 }) {

    const text = doctorDetails ? doctorDetails : '';
    const textArray = text.split('\n');
    let cursor = 610
    for (let i = 0; i < textArray.length; i++) {
        page.drawText(textArray[i], {
            x: 420,
            y: cursor,
            size: fontSize,
            font: font,
        });
        cursor = cursor - (font.heightAtSize(fontSize) + lineHeight);
    }

    return page;
}

async function addNewPage({ consultation, fontSize, pdfDoc, font }) {

    const blueSlipPages = await PDFLib.PDFDocument.load(blueslip);
    const [existingPage] = await pdfDoc.copyPages(blueSlipPages, [0])

    let page = pdfDoc.addPage(existingPage);

    const appointmentDate = moment(consultation.confirmed_schedule).format('DD.MM.yyyy');

    const patientDetails = getAddress(consultation.patient);
    const doctorDetails = getAddress(consultation.doctor);

    page = addInsuranceName({ name: 'Privat', page: page, fontSize, font: font });

    let dob = consultation.patient.dob || "";
    if (dob?.split(".")?.length !== 3 &&
        dob.length !== 10
    ) {
        dob = moment(dob).format('DD.MM.yyyy');
    }
    consultation.patient.dob = dob
    page = addDateOfBirth({ dob: consultation.patient.dob, page: page, fontSize, font: font });
    page = addAppointmentDate({ appointmentDate: appointmentDate, page: page, fontSize, font: font });
    page = addPatientDetails({ patientDetails: patientDetails, page: page, fontSize, font: font });
    page = addDoctorDetails({ doctorDetails: doctorDetails, page: page, fontSize: 10, font: font });

    return page;
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


// const consultation = {
//     "uid": "17c06b0b-cd69-44a6-a63c-24cf504480af",
//     "patient": {
//         "dob": "01.02.1994",
//         "salute": "Mrs.",
//         "title": null,
//         "firstname": "Patient",
//         "lastname": "Name",
//         "address_line_1": "Alter Wall 74",
//         "address_line_2": "",
//         "city": "Karlstadt",
//         "state": "Freistaat Bayern",
//         "country": "Germany",
//         "postal_code": 97753,
//         "phone": "09352 24 82 54"
//     },
//     "doctor": {
//         "uid": "",
//         "salute": "Mrs.",
//         "title": "Dr. med",
//         "firstname": "Doctor",
//         "lastname": "Name",
//         "address_line_1": "Rathausstrasse 19",
//         "address_line_2": "",
//         "city": "Fürth",
//         "state": "Freistaat Bayern",
//         "country": "Germany",
//         "postal_code": 90762,
//         "phone": "0911 80 85 59"
//     },
//     "prescription": {
//         "medicines": [
//             {
//                 "name": "DEKRISTOL 2000 IE/ML TRO 0,5mg TEI 10ml N1 PZN16731987",
//                 "intake": "nach Anweisung"
//             },
//             {
//                 "name": "PARACETAMOL AL 500 500mg TAB 20St N2 PZN60718342",
//                 "intake": "b. Bedarf"
//             },
//             {
//                 "name": "AZITHROMYCIN ARISTO 500MG 512,03mg FTA 3St N1 PZN01347438",
//                 "intake": "1 x 1 am Tag"
//             },
//             {
//                 "name": "AZITHROMYCIN ARISTO 500MG 512,03mg FTA 3St N1 PZN01347438",
//                 "intake": "1 x 1 am Tag"
//             }
//         ]
//     },
//     "urls": [
//         "https://dp-dev.obs.eu-de.otc.t-systems.com:443/4c12db17-f36b-4055-9557-fd644ea3e7b8/appointments/eff728a8-40f5-4025-b227-2443cdd3765b/created_1624108346664.pdf?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential=OLO79PLIOHHHIRQSECIL%2F20210619%2Fregion%2Fs3%2Faws4_request&X-Amz-Date=20210619T131226Z&X-Amz-Expires=3600&X-Amz-SignedHeaders=host&X-Amz-Signature=c7cf1345b80849133db712f036b895e6b8d890ac446bba257c8c8cecf29933dd",
//     ]
// }