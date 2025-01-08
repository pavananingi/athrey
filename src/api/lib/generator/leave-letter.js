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

const doctorLetter1 = fs.readFileSync(path.join(__dirname, 'assets', 'leave-letter', '1.pdf'));
const doctorLetter2 = fs.readFileSync(path.join(__dirname, 'assets', 'leave-letter', '2.pdf'));
const doctorLetter3 = fs.readFileSync(path.join(__dirname, 'assets', 'leave-letter', '3.pdf'));
const patientLetter4 = fs.readFileSync(path.join(__dirname, 'assets', 'leave-letter', '4.pdf'));


/*
// type 'patient', 'employer'
*/
module.exports = async ({ consultation, handler }) => {
    return Promise.all([
        generateLetter({ consultation, letter: doctorLetter1, type: 'employer', objectKey: handler.objectKey[0] }),
        generateLetter({ consultation, letter: doctorLetter2, type: 'employer', objectKey: handler.objectKey[1] }),
        generateLetter({ consultation, letter: doctorLetter3, type: 'employer', objectKey: handler.objectKey[2] }),
        generateLetter({ consultation, letter: patientLetter4, type: 'patient', objectKey: handler.objectKey[3] }),
    ]).then((values) => {
        return handler
    }).catch(err => console.error('Failed to generate all leave letters', err));
}

const generateLetter = async ({ consultation, letter, type = 'patient', objectKey }) => {
    console.log('Generating leave letter for ', consultation.uid);

    const pdfDoc = await PDFLib.PDFDocument.load(letter);

    pdfDoc.registerFontkit(fontkit);

    // Embed our custom font in the document
    const customFontR = await pdfDoc.embedFont(fontBytesUbuntuR);
    const customFontB = await pdfDoc.embedFont(fontBytesUbuntuB);

    const fontSize = 12;

    const pages = pdfDoc.getPages();
    let firstPage = pages[0];
    const { width, height } = firstPage.getSize();

    const appointmentDate = moment(consultation.confirmed_schedule).format('DD.MM.yyyy');

    const patientDetails = getAddress(consultation.patient);
    const doctorDetails = getAddress(consultation.doctor);

    firstPage = addInsuranceName({ name: consultation.leave_letter.insurance, page: firstPage, fontSize, font: customFontB });
    firstPage = addDateOfBirth({ dob: consultation.patient.dob, page: firstPage, fontSize, font: customFontB });
    firstPage = addAppointmentDate({ appointmentDate: appointmentDate, page: firstPage, fontSize, font: customFontB });
    firstPage = addLeaveDates({ from: consultation.leave_letter?.leaves?.from, to: consultation.leave_letter?.leaves?.to, appointmentDate: consultation.confirmed_schedule, page: firstPage, fontSize, font: customFontB });
    firstPage = addPatientDetails({ patientDetails: patientDetails, page: firstPage, fontSize, font: customFontB });
    firstPage = addDoctorDetails({ doctorDetails: doctorDetails, page: firstPage, fontSize: 10, font: customFontR });
    firstPage = addCostID({ costId: consultation.leave_letter.cost_id, page: firstPage, fontSize, font: customFontB });
    firstPage = addInsuranceNumber({ insuranceNum: consultation.leave_letter.insurance_num, page: firstPage, fontSize, font: customFontB });
    firstPage = addDoctorID({ doctor_id: consultation.leave_letter.lanr, page: firstPage, fontSize, font: customFontB });
    firstPage = addEmployerID({ emp_id: consultation.leave_letter.employer_num, page: firstPage, fontSize, font: customFontB });
    firstPage = markCertificate({ certificate: consultation.leave_letter.certificate, page: firstPage });
    firstPage = markDoctorType({ type: consultation.leave_letter.doctor_type, page: firstPage });
    if (type === 'employer') {
        firstPage = markSpecialMeasures({ measures: consultation.leave_letter.special_measures, page: firstPage, fontSize, font: customFontB })
        firstPage = markTenders({ tenders: consultation.leave_letter.tenders, page: firstPage });
        firstPage = markreason({ reason: consultation.leave_letter.reason, page: firstPage });
        firstPage = addICD({ icd: consultation.leave_letter.diagnosis, page: firstPage, fontSize, font: customFontB });
    }

    // save to file
    const pdfBytes = await pdfDoc.save();
    // const time = new Date().getTime();
    // fs.writeFile(`C:\\Users\\chann\\Desktop\\documents\\create_${time}.pdf`, pdfBytes, (err) => {
    //     if (err) {
    //         return console.log(err)
    //     } else {
    //         // console.log('Generated leaveletter for ', consultation.uid);
    //     }
    // });

    // return await fetch(url, {
    //     method: 'PUT',
    //     body: pdfBytes,
    //     headers: { 'Content-Type': 'application/pdf' },
    // })
    //     .then(res => true)
    //     .catch(err => {
    //         console.error(`Failed to upload the generated leave letter document: ${consultation.uid}`, err)
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
            .putObject(bucketName, objectKey, new Buffer(pdfBytes), metaData)
            .catch((e) => {
                console.log('Error while creating object from file data: ', e);
                throw e;
            });

    } catch (error) {
        console.log('error is', error);
    }
    return { status: true }
}

function addInsuranceName({ name, page, fontSize = 10, font }) {
    page.drawText(name || "", {
        x: 20,
        y: 805,
        size: fontSize,
        font: font,
    });

    return page;
}

function addDateOfBirth({ dob, page, fontSize = 10, font }) {
    if (dob?.split(".")?.length !== 3 &&
        dob.length !== 10
    ) {
        dob = moment(dob).format('DD.MM.yyyy');
    }
    page.drawText(dob || "", {
        x: 278,
        y: 740,
        size: fontSize,
        font: font,
    });

    return page;
}

function addAppointmentDate({ appointmentDate, page, fontSize = 10, font }) {
    page.drawText(appointmentDate || "", {
        x: 260,
        y: 645,
        size: fontSize,
        font: font,
    });

    return page;
}

function addDoctorID({ doctor_id, page, fontSize = 10, font }) {
    page.drawText(doctor_id || "", {
        x: 138,
        y: 645,
        size: fontSize,
        font: font,
    });

    return page;
}

function addEmployerID({ emp_id, page, fontSize = 10, font }) {
    page.drawText(emp_id || "", {
        x: 20,
        y: 645,
        size: fontSize,
        font: font,
    });

    return page;
}

function addLeaveDates({ from = '', to = '', appointmentDate, page, fontSize = 10, font }) {
    from = moment(from).format('DDMMYY');
    to = moment(to).format('DDMMYY');
    appointmentDate = moment(appointmentDate).format('DDMMYY');
    const startX = 216;
    const startY = 568;
    const letterSpacing = 22;
    const nextLine = 36;
    for (let i = 0; i < 6; i++) {
        page.drawText(from[i] || "", {
            x: startX + (i * letterSpacing),
            y: startY,
            size: fontSize,
            font: font,
        });
    }
    for (let i = 0; i < 6; i++) {
        page.drawText(to[i] || "", {
            x: startX + (i * letterSpacing),
            y: startY - (nextLine),
            size: fontSize,
            font: font,
        });
    }
    for (let i = 0; i < 6; i++) {
        page.drawText(appointmentDate[i] || "", {
            x: startX + (i * letterSpacing),
            y: startY - (nextLine * 2),
            size: fontSize,
            font: font,
        });
    }
    return page;
}

function addPatientDetails({ patientDetails, page, fontSize = 10, font, lineHeight = 3 }) {

    const text = patientDetails ? patientDetails : '';
    const textArray = text.split('\n');
    let cursor = 765;
    for (let i = 0; i < textArray.length; i++) {
        page.drawText(textArray[i] || "", {
            x: 20,
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
    let cursor = 590
    for (let i = 0; i < textArray.length; i++) {
        page.drawText(textArray[i], {
            x: 380,
            y: cursor,
            size: fontSize,
            font: font,
        });
        cursor = cursor - (font.heightAtSize(fontSize) + lineHeight);
    }

    return page;
}


function addCostID({ costId, page, fontSize = 10, font }) {
    page.drawText(costId || "", {
        x: 20,
        y: 680,
        size: fontSize,
        font: font,
    });

    return page;
}

function addInsuranceNumber({ insuranceNum, page, fontSize = 10, font }) {
    page.drawText(insuranceNum || "", {
        x: 138,
        y: 680,
        size: fontSize,
        font: font,
    });

    return page;
}


function addICD({ icd, page, fontSize = 10, font }) {
    const nextLine = 36;
    const startX = 20;
    const startY = 362;
    const nextBox = 140;
    for (let i = 0; i < icd.length; i++) {
        page.drawText(icd[i] || "", {
            x: startX + ((nextBox * (i % 3))),
            y: startY - (nextLine * Math.floor(i / 3)),
            size: fontSize,
            font: font,
        });
    }
    return page;
}

function markCertificate({ certificate, page }) {
    if (certificate?.new) {
        page = crossCheckbox({ x: 372, y: 779, page })
    }
    if (certificate?.continued) {
        page = crossCheckbox({ x: 372, y: 743, page })
    }
    return page
}

function markDoctorType({ type, page }) {
    const lineHeight = 617;
    if (type?.occupational) {
        page = crossCheckbox({ x: 17, y: lineHeight, page })
    }
    if (type?.transit) {
        page = crossCheckbox({ x: 210, y: lineHeight, page })
    }
    return page
}


function markreason({ reason, page }) {
    const lineHeight1 = 266;
    if (reason?.another_accident) {
        page = crossCheckbox({ x: 17, y: lineHeight1, page })
    }
    if (reason?.supply_chain) {
        page = crossCheckbox({ x: 231, y: lineHeight1, page })
    }
    return page
}

function markSpecialMeasures({ measures, page, fontSize = 10, font }) {
    const lineHeight1 = 212;
    const lineHeight2 = lineHeight1 - 36;
    if (measures?.rehabilitation) {
        page = crossCheckbox({ x: 17, y: lineHeight1, page })
    }
    if (measures?.reintegration) {
        page = crossCheckbox({ x: 231, y: lineHeight1, page })
    }
    if (measures?.others) {
        page = crossCheckbox({ x: 17, y: lineHeight2, page })
        page.drawText(measures.others || "", {
            x: 112,
            y: lineHeight2 - 16,
            size: fontSize,
            font: font,
        });
    }
    return page
}

function markTenders({ tenders, page }) {
    const lineHeight = 122;
    if (tenders?.week) {
        page = crossCheckbox({ x: 156, y: lineHeight, page })
    }
    if (tenders?.final) {
        page = crossCheckbox({ x: 372, y: lineHeight, page })
    }
    return page
}


function crossCheckbox({ x, y, page }) {

    const lengthX = 21;
    const lengthY = 21;

    page.drawLine({
        start: { x: x, y: y },
        end: { x: x + lengthX, y: y - lengthY },
        thickness: 2,
        color: PDFLib.rgb(0, 0, 0),
        opacity: 1,
    })
    page.drawLine({
        start: { x: x + lengthX, y: y },
        end: { x: x, y: y - lengthY },
        thickness: 2,
        color: PDFLib.rgb(0, 0, 0),
        opacity: 1,
    })

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
    return ' ' + salute + ' ' + name;
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
//     "leave_letter": {
//         "insurance": "Name of the insurance company",
//         "insurance_num": "WAS122345",
//         "employer_num": "EMPNUM12345",
//         "lanr": "DOCLANR123",
//         "cost_id": "123434567",
//         "confirmed_schedule": "2021-06-23T17:46:14.235Z",
//         "leaves": {
//             "from": "2021-06-23T17:46:14.235Z",
//             "to": "2021-06-24T17:46:14.235Z"
//         },
//         "doctor_type": {
//             "occupational": true,
//             "transit": true
//         },
//         "special_measures": {
//             "rehabilitation": true,
//             "reintegration": true,
//             "others": "Other special measures"
//         },
//         "tenders": {
//             "week": true,
//             "final": true
//         },
//         "reason": {
//             "another_accident": true,
//             "supply_chain": true
//         },
//         "diagnosis": [
//             "ICD-001",
//             "ICD-002",
//             "ICD-003",
//             "ICD-004",
//             "ICD-005",
//             "ICD-006",
//             "ICD-007",
//             "ICD-008",
//             "ICD-009"
//         ],
//         "certificate": {
//             "new": true,
//             "continued": true
//         }
//     },
//     "urls": [
//         "https://dp-dev.obs.eu-de.otc.t-systems.com:443/4c12db17-f36b-4055-9557-fd644ea3e7b8/appointments/eff728a8-40f5-4025-b227-2443cdd3765b/created_1624108346664.pdf?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential=OLO79PLIOHHHIRQSECIL%2F20210619%2Fregion%2Fs3%2Faws4_request&X-Amz-Date=20210619T131226Z&X-Amz-Expires=3600&X-Amz-SignedHeaders=host&X-Amz-Signature=c7cf1345b80849133db712f036b895e6b8d890ac446bba257c8c8cecf29933dd",
//         "https://dp-dev.obs.eu-de.otc.t-systems.com:443/4c12db17-f36b-4055-9557-fd644ea3e7b8/appointments/eff728a8-40f5-4025-b227-2443cdd3765b/created_1624108346664.pdf?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential=OLO79PLIOHHHIRQSECIL%2F20210619%2Fregion%2Fs3%2Faws4_request&X-Amz-Date=20210619T131226Z&X-Amz-Expires=3600&X-Amz-SignedHeaders=host&X-Amz-Signature=c7cf1345b80849133db712f036b895e6b8d890ac446bba257c8c8cecf29933dd",
//         "https://dp-dev.obs.eu-de.otc.t-systems.com:443/4c12db17-f36b-4055-9557-fd644ea3e7b8/appointments/eff728a8-40f5-4025-b227-2443cdd3765b/created_1624108346664.pdf?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential=OLO79PLIOHHHIRQSECIL%2F20210619%2Fregion%2Fs3%2Faws4_request&X-Amz-Date=20210619T131226Z&X-Amz-Expires=3600&X-Amz-SignedHeaders=host&X-Amz-Signature=c7cf1345b80849133db712f036b895e6b8d890ac446bba257c8c8cecf29933dd",
//         "https://dp-dev.obs.eu-de.otc.t-systems.com:443/4c12db17-f36b-4055-9557-fd644ea3e7b8/appointments/eff728a8-40f5-4025-b227-2443cdd3765b/created_1624108346664.pdf?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential=OLO79PLIOHHHIRQSECIL%2F20210619%2Fregion%2Fs3%2Faws4_request&X-Amz-Date=20210619T131226Z&X-Amz-Expires=3600&X-Amz-SignedHeaders=host&X-Amz-Signature=c7cf1345b80849133db712f036b895e6b8d890ac446bba257c8c8cecf29933dd"
//     ]
// }