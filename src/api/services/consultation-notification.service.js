const fromDatabase = require('../lib/database').database;

module.exports = ({ translate, logger, CreateError, lang, notifications, db }) => {
    return Object.freeze({
        new: ({ consultationUID }) => {
            // send to all the doctors
            db.methods.User({ translate, logger, CreateError, lang })
                .findAllDoctors()
                .then(result => {
                    // get the list of doctors
                    const doctorsList = result.data.users
                    let doctorUIDs = [];
                    doctorUIDs = doctorsList.map(u => u.uid);

                    return db.methods
                        .NotificationDevice({ translate, logger, CreateError, lang })
                        .findAllByUserUIDs({ userUIDs: doctorUIDs });
                }).then(devices => {
                    // get the list of devices registered
                    devices = devices.data.devices;
                    const notificationIdList = devices.map(d => d.notification_id);
                    notifications
                        .push({ translate, logger, CreateError, lang })
                        .send({
                            tokens: notificationIdList,
                            message: {
                                "title": "Athrey",
                                "body": "Neue Beratung ist verfügbar."
                            }
                        });
                });

            db.methods.Consultations({ translate, logger, CreateError, lang })
                .findByUID({ consultationUID }).then(result => {
                    const consultation = result.data.consultations;
                    return db.methods
                        .NotificationDevice({ translate, logger, CreateError, lang })
                        .findAllByUserUID({ userUID: consultation.patient_uid })
                }).then(devices => {
                    // get the list of devices registered
                    devices = devices.data.devices;
                    const notificationIdList = devices.map(d => d.notification_id);
                    notifications
                        .push({ translate, logger, CreateError, lang })
                        .send({
                            tokens: notificationIdList,
                            message: {
                                "title": "Athrey",
                                "body": "Ihre Beratungsanfrage wurde erstellt."
                            }
                        });
                });
        },
        scheduled: ({ consultationUID }) => {
            // send to patient and doctor

            // patients
            fromDatabase.methods.Consultations({ translate, logger, CreateError, lang })
                .findByUID({ consultationUID }).then(result => {
                    const consultation = result.data.consultations;
                    return fromDatabase.methods
                        .NotificationDevice({ translate, logger, CreateError, lang })
                        .findAllByUserUID({ userUID: consultation.patient_uid })
                }).then(devices => {
                    // get the list of devices registered
                    devices = devices.data.devices;
                    const notificationIdList = devices.map(d => d.notification_id);
                    notifications
                        .push({ translate, logger, CreateError, lang })
                        .send({
                            tokens: notificationIdList,
                            message: {
                                "title": "Athrey",
                                "body": "Ihre Sprechstunde wird mit dem Arzt vereinbart."
                            }
                        });
                });
        },
        cancelled: ({ consultationUID }) => {
            // send to patient by doctor

            // patients
            fromDatabase.methods.Consultations({ translate, logger, CreateError, lang })
                .findByUID({ consultationUID }).then(result => {
                    const consultation = result.data.consultations;
                    return fromDatabase.methods
                        .NotificationDevice({ translate, logger, CreateError, lang })
                        .findAllByUserUID({ userUID: consultation.patient_uid })
                }).then(devices => {
                    // get the list of devices registered
                    devices = devices.data.devices;
                    const notificationIdList = devices.map(d => d.notification_id);
                    notifications
                        .push({ translate, logger, CreateError, lang })
                        .send({
                            tokens: notificationIdList,
                            message: {
                                "title": "Athrey",
                                "body": "Der Arzt hat die Konsultation abgebrochen."
                            }
                        });
                });
        },
        document: ({ consultationUID }) => {
            // send to patient and doctor
            console.log('consultation document notification', consultationUID);
        }
    })
}