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

const mrDoc = fs.readFileSync(path.join(__dirname, 'assets', 'medical-rates', 'medical-rates.pdf'));


module.exports = async ({ consultation, handler }) => {
    try {
        console.log('Generating Medical rates for: ', consultation.uid)

        const pdfDoc = await PDFLib.PDFDocument.load(mrDoc);

        pdfDoc.registerFontkit(fontkit);

        // Embed our custom font in the document
        const customFontR = await pdfDoc.embedFont(fontBytesUbuntuR);
        const customFontB = await pdfDoc.embedFont(fontBytesUbuntuB);
        const fontSize = 12;

        const pages = pdfDoc.getPages();
        let firstPage = pages[0];
        const { width, height } = firstPage.getSize();

        const doctorName = getName(consultation.doctor);
        const doctorAddress = getAddress(consultation.doctor);
        const doctorCity = getCity(consultation.doctor);
        const patientName = getName(consultation.patient);
        const patientAddress = getAddress(consultation.patient);
        const patientCity = getCity(consultation.patient);


        // const patientName = getName(consultation.patient);

        firstPage = addDoctorAddressName({ name: doctorName, page: firstPage, fontSize: 10, font: customFontB });
        firstPage = addDoctorAddress({ address: doctorAddress, page: firstPage, fontSize: 9, font: customFontR });
        firstPage = addDoctorAddressCity({ city: doctorCity, page: firstPage, fontSize: 9, font: customFontR });

        firstPage = addPatientName({ name: patientName, page: firstPage, fontSize: 10, font: customFontB });
        firstPage = addPatientAddress({ address: patientAddress, page: firstPage, fontSize: 9, font: customFontR });
        firstPage = addPatientCity({ city: patientCity, page: firstPage, fontSize: 9, font: customFontR });

        firstPage = addDoctorName({ name: doctorName, page: firstPage, fontSize: 9, font: customFontR });
        const items = consultation.medical_charges.items
        for (let i = 0; i < items.length; i++) {
            let positions = itemXY[items[i].code];
            firstPage = addItemMultiplier({ value: items[i].multiplier, x: positions.multiplier.x, y: positions.multiplier.y, page: firstPage, fontSize: 9, font: customFontR });
            firstPage = addItemTotal({ value: (items[i].total / 100).toFixed(2), x: positions.total.x, y: positions.total.y, page: firstPage, fontSize: 9, font: customFontR });
            firstPage = addItemMarker({ x: positions.checkbox.x, y: positions.checkbox.y, page: firstPage });
        }

        firstPage = addTotal({ value: (consultation.medical_charges.total / 100).toFixed(2), page: firstPage, fontSize: 9, font: customFontB });

        // save to file
        const pdfBytes = await pdfDoc.save();

        // fs.writeFile('C:\\Users\\chann\\Desktop\\documents\\medical-charges.pdf', pdfBytes, (err) => {
        //     if (err) {
        //         return console.log(err)
        //     } else {
        //         console.log('Generated medical-charge for ', consultation.uid);
        //     }
        // });

        // return await fetch(consultation.urls[0], {
        //     method: 'PUT',
        //     body: pdfBytes,
        //     headers: { 'Content-Type': 'application/pdf' },
        // })
        //     .then(res => handler)
        //     .catch(err => {
        //         console.error(`Failed to upload the generated medical-charge document: ${consultation.uid}`, err)
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
        console.error('Failed to create medical-charge', error);
    }
}

function addTotal({ value, page, fontSize = 9, font }) {
    value = String(value);
    value = value.replace('.', ',')
    page.drawText(value, {
        x: 470,
        y: 27,
        size: fontSize,
        font: font,
    });
    return page;
}

function addItemMultiplier({ value, x, y, page, fontSize = 9, font }) {
    value = String(value);
    page.drawText(value, {
        x: x,
        y: y,
        size: fontSize,
        font: font,
    });
    return page;
}

function addItemTotal({ value, x, y, page, fontSize = 9, font }) {
    value = String(value);
    value = value.replace('.', ',');
    page.drawText(value, {
        x: x,
        y: y,
        size: fontSize,
        font: font,
    });
    return page;
}

function addItemMarker({ x, y, page }) {
    const lengthX = 7;
    const lengthY = 7;
    x = x + lengthX;
    y = y + lengthY;

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

function addDoctorName({ name, page, fontSize = 9, font }) {
    page.drawText(name, {
        x: 270,
        y: 504,
        size: fontSize,
        font: font,
    });
    return page;
}

function addPatientName({ name, page, fontSize = 9, font }) {
    page.drawText(name, {
        x: 70,
        y: 598,
        size: fontSize,
        font: font,
    });
    return page;
}

function addPatientAddress({ address, page, fontSize = 9, font }) {
    page.drawText(address, {
        x: 105,
        y: 581.5,
        size: fontSize,
        font: font,
    });
    return page;
}

function addPatientCity({ city, page, fontSize = 9, font }) {
    page.drawText(city, {
        x: 110,
        y: 568.5,
        size: fontSize,
        font: font,
    });
    return page;
}

function addDoctorAddressName({ name, page, fontSize = 9, font }) {
    page.drawText(name, {
        x: 70,
        y: 700,
        size: fontSize,
        font: font,
    });
    return page;
}

function addDoctorAddress({ address, page, fontSize = 9, font }) {
    page.drawText(address, {
        x: 105,
        y: 671.5,
        size: fontSize,
        font: font,
    });
    return page;
}

function addDoctorAddressCity({ city, page, fontSize = 9, font }) {
    page.drawText(city, {
        x: 110,
        y: 657.5,
        size: fontSize,
        font: font,
    });
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
// Construct the address
*/
function getAddress(user) {
    let address = user.address_line_1 ? user.address_line_1 : '';
    if (user?.address_line_2) {
        address = address + ' ' + user?.address_line_2;
    }
    return address;
}

/*
// Construct the city
*/
function getCity(user) {
    const postalCode = user.postal_code ? String(user.postal_code) : '';
    const city = user.city ? user.city : '';
    if (postalCode && city) {
        return `${postalCode}, ${city}`
    }
    if (postalCode)
        return String(postalCode)
    if (city)
        return city
}

// single row y difference 14
// double row y difference 24
const multiplierX = 445;
const totalX = 470;
const checkboxX = 503.5;
const itemXY = {
    "3": {
        "code": "3",
        "multiplier": {
            "x": multiplierX,
            "y": 443
        },
        "total": {
            "x": totalX,
            "y": 443
        },
        "checkbox": {
            "x": checkboxX,
            "y": 443
        }
    },
    "4": {
        "code": "4",
        "multiplier": {
            "x": multiplierX,
            "y": 419
        },
        "total": {
            "x": totalX,
            "y": 419
        },
        "checkbox": {
            "x": checkboxX,
            "y": 419
        }
    },
    "15": {
        "code": "15",
        "multiplier": {
            "x": multiplierX,
            "y": 405
        },
        "total": {
            "x": totalX,
            "y": 405
        },
        "checkbox": {
            "x": checkboxX,
            "y": 405
        }
    },
    "22": {
        "code": "22",
        "multiplier": {
            "x": multiplierX,
            "y": 380
        },
        "total": {
            "x": totalX,
            "y": 380
        },
        "checkbox": {
            "x": checkboxX,
            "y": 380
        }
    },
    "33": {
        "code": "33",
        "multiplier": {
            "x": multiplierX,
            "y": 366
        },
        "total": {
            "x": totalX,
            "y": 366
        },
        "checkbox": {
            "x": checkboxX,
            "y": 366
        }
    },
    "21": {
        "code": "21",
        "multiplier": {
            "x": multiplierX,
            "y": 352
        },
        "total": {
            "x": totalX,
            "y": 352
        },
        "checkbox": {
            "x": checkboxX,
            "y": 352
        }
    },
    "30": {
        "code": "30",
        "multiplier": {
            "x": multiplierX,
            "y": 338
        },
        "total": {
            "x": totalX,
            "y": 338
        },
        "checkbox": {
            "x": checkboxX,
            "y": 338
        }
    },
    "31": {
        "code": "31",
        "multiplier": {
            "x": multiplierX,
            "y": 324
        },
        "total": {
            "x": totalX,
            "y": 324
        },
        "checkbox": {
            "x": checkboxX,
            "y": 324
        }
    },
    "34": {
        "code": "34",
        "multiplier": {
            "x": multiplierX,
            "y": 310
        },
        "total": {
            "x": totalX,
            "y": 310
        },
        "checkbox": {
            "x": checkboxX,
            "y": 310
        }
    },
    "70": {
        "code": "70",
        "multiplier": {
            "x": multiplierX,
            "y": 286
        },
        "total": {
            "x": totalX,
            "y": 286
        },
        "checkbox": {
            "x": checkboxX,
            "y": 286
        }
    },
    "75": {
        "code": "75",
        "multiplier": {
            "x": multiplierX,
            "y": 272
        },
        "total": {
            "x": totalX,
            "y": 272
        },
        "checkbox": {
            "x": checkboxX,
            "y": 272
        }
    },
    "85": {
        "code": "85",
        "multiplier": {
            "x": multiplierX,
            "y": 258
        },
        "total": {
            "x": totalX,
            "y": 258
        },
        "checkbox": {
            "x": checkboxX,
            "y": 258
        }
    },
    "95": {
        "code": "95",
        "multiplier": {
            "x": multiplierX,
            "y": 244
        },
        "total": {
            "x": totalX,
            "y": 244
        },
        "checkbox": {
            "x": checkboxX,
            "y": 244
        }
    },
    "804": {
        "code": "804",
        "multiplier": {
            "x": multiplierX,
            "y": 230
        },
        "total": {
            "x": totalX,
            "y": 230
        },
        "checkbox": {
            "x": checkboxX,
            "y": 230
        }
    },
    "807": {
        "code": "807",
        "multiplier": {
            "x": multiplierX,
            "y": 216
        },
        "total": {
            "x": totalX,
            "y": 216
        },
        "checkbox": {
            "x": checkboxX,
            "y": 216
        }
    },
    "812": {
        "code": "812",
        "multiplier": {
            "x": multiplierX,
            "y": 192
        },
        "total": {
            "x": totalX,
            "y": 192
        },
        "checkbox": {
            "x": checkboxX,
            "y": 192
        }
    },
    "817": {
        "code": "817",
        "multiplier": {
            "x": multiplierX,
            "y": 178
        },
        "total": {
            "x": totalX,
            "y": 178
        },
        "checkbox": {
            "x": checkboxX,
            "y": 178
        }
    },
    "835": {
        "code": "835",
        "multiplier": {
            "x": multiplierX,
            "y": 164
        },
        "total": {
            "x": totalX,
            "y": 164
        },
        "checkbox": {
            "x": checkboxX,
            "y": 164
        }
    },
    "846": {
        "code": "846",
        "multiplier": {
            "x": multiplierX,
            "y": 150
        },
        "total": {
            "x": totalX,
            "y": 150
        },
        "checkbox": {
            "x": checkboxX,
            "y": 150
        }
    },
    "849": {
        "code": "849",
        "multiplier": {
            "x": multiplierX,
            "y": 136
        },
        "total": {
            "x": totalX,
            "y": 136
        },
        "checkbox": {
            "x": checkboxX,
            "y": 136
        }
    },
    "861": {
        "code": "861",
        "multiplier": {
            "x": multiplierX,
            "y": 122
        },
        "total": {
            "x": totalX,
            "y": 122
        },
        "checkbox": {
            "x": checkboxX,
            "y": 122
        }
    },
    "863": {
        "code": "863",
        "multiplier": {
            "x": multiplierX,
            "y": 108
        },
        "total": {
            "x": totalX,
            "y": 108
        },
        "checkbox": {
            "x": checkboxX,
            "y": 108
        }
    },
    "865": {
        "code": "865",
        "multiplier": {
            "x": multiplierX,
            "y": 94
        },
        "total": {
            "x": totalX,
            "y": 94
        },
        "checkbox": {
            "x": checkboxX,
            "y": 94
        }
    },
    "870": {
        "code": "870",
        "multiplier": {
            "x": multiplierX,
            "y": 80
        },
        "total": {
            "x": totalX,
            "y": 80
        },
        "checkbox": {
            "x": checkboxX,
            "y": 80
        }
    },
    "A36": {
        "code": "A36",
        "multiplier": {
            "x": multiplierX,
            "y": 66
        },
        "total": {
            "x": totalX,
            "y": 66
        },
        "checkbox": {
            "x": checkboxX,
            "y": 66
        }
    },
    "B": {
        "code": "B",
        "multiplier": {
            "x": multiplierX,
            "y": 52
        },
        "total": {
            "x": totalX,
            "y": 52
        },
        "checkbox": {
            "x": checkboxX,
            "y": 52
        }
    },
    "C": {
        "code": "C",
        "multiplier": {
            "x": multiplierX,
            "y": 38
        },
        "total": {
            "x": totalX,
            "y": 38
        },
        "checkbox": {
            "x": checkboxX,
            "y": 38
        }
    }
}

const consultation = {
    "uid": "17c06b0b-cd69-44a6-a63c-24cf504480af",
    "patient": {
        "dob": "01.02.1994",
        "salute": "Mrs.",
        "title": null,
        "firstname": "Patient",
        "lastname": "Name",
        "address_line_1": "Alter Wall 74",
        "address_line_2": "",
        "city": "Karlstadt",
        "state": "Freistaat Bayern",
        "country": "Germany",
        "postal_code": 97753,
        "phone": "09352 24 82 54"
    },
    "doctor": {
        "uid": "",
        "salute": "Mrs.",
        "title": "Dr. med",
        "firstname": "Doctor",
        "lastname": "Name",
        "address_line_1": "Rathausstrasse 19",
        "address_line_2": "",
        "city": "Fürth",
        "state": "Freistaat Bayern",
        "country": "Germany",
        "postal_code": 90762,
        "phone": "0911 80 85 59"
    },
    "medical_charges": {
        items: [
            {
                "code": "3",
                "charge": "0874",
                "multiplier": 1,
                "total": "1234"
            },
            // {
            //     "code": "4",
            //     "charge": "1282",
            //     "multiplier": 1,
            //     "total": "1234"
            // },
            // {
            //     "code": "15",
            //     "charge": "1749",
            //     "multiplier": 1,
            //     "total": "1234"
            // },
            // {
            //     "code": "22",
            //     "charge": "1749",
            //     "multiplier": 1,
            //     "total": "1234"
            // },
            // {
            //     "code": "33",
            //     "charge": "1749",
            //     "multiplier": 1,
            //     "total": "1234"
            // },
            {
                "code": "21",
                "charge": "2098",
                "multiplier": 1,
                "total": "1234"
            },
            // {
            //     "code": "30",
            //     "charge": "5246",
            //     "multiplier": 1,
            //     "total": "1234"
            // },
            {
                "code": "31",
                "charge": "2623",
                "multiplier": 1,
                "total": "1234"
            },
            // {
            //     "code": "34",
            //     "charge": "1749",
            //     "multiplier": 1,
            //     "total": "1234"
            // },
            // {
            //     "code": "70",
            //     "charge": "0233",
            //     "multiplier": 1,
            //     "total": "1234"
            // },
            // {
            //     "code": "75",
            //     "charge": "0758",
            //     "multiplier": 1,
            //     "total": "1234"
            // },
            // {
            //     "code": "85",
            //     "charge": "2914",
            //     "multiplier": 1,
            //     "total": "1234"
            // },
            // {
            //     "code": "95",
            //     "charge": "0350",
            //     "multiplier": 1,
            //     "total": "1234"
            // },
            // {
            //     "code": "804",
            //     "charge": "0874",
            //     "multiplier": 1,
            //     "total": "1234"
            // },
            // {
            //     "code": "807",
            //     "charge": "2331",
            //     "multiplier": 1,
            //     "total": "1234"
            // },
            // {
            //     "code": "812",
            //     "charge": "2914",
            //     "multiplier": 1,
            //     "total": "1234"
            // },
            // {
            //     "code": "817",
            //     "charge": "1049",
            //     "multiplier": 1,
            //     "total": "1234"
            // },
            // {
            //     "code": "835",
            //     "charge": "0373",
            //     "multiplier": 1,
            //     "total": "1234"
            // },
            // // {
            // //     "code": "846",
            // //     "charge": "0874",
            // //     "multiplier": 1,
            // //     "total": "1234"
            // // },
            // {
            //     "code": "849",
            //     "charge": "1341",
            //     "multiplier": 1,
            //     "total": "1234"
            // },
            // {
            //     "code": "861",
            //     "charge": "4022",
            //     "multiplier": 1,
            //     "total": "1234"
            // },
            // {
            //     "code": "863",
            //     "charge": "4022",
            //     "multiplier": 1,
            //     "total": "1234"
            // },
            // {
            //     "code": "865",
            //     "charge": "2011",
            //     "multiplier": 1,
            //     "total": "1234"
            // },
            // {
            //     "code": "870",
            //     "charge": "4372",
            //     "multiplier": 1,
            //     "total": "1234"
            // },
            // {
            //     "code": "A36",
            //     "charge": "1749",
            //     "multiplier": 1,
            //     "total": "1234"
            // },
            // {
            //     "code": "B",
            //     "charge": "1049",
            //     "multiplier": 1,
            //     "total": "1234"
            // },
            {
                "code": "C",
                "charge": "1865",
                "multiplier": 1,
                "total": "1234"
            },
        ],
        total: "1234"
    }
}

