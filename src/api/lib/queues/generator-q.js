const connection = require('./connection');
const fetch = require('node-fetch');

const config = require('../../../config/queues.config.json');
const endpoint = config[process.env.NODE_ENV].diagnosisReqQ.endpoint;
const projectID = config[process.env.NODE_ENV].otc.projectID;
const queueID = config[process.env.NODE_ENV].diagnosisReqQ.queueID;

const generatorQEndpoint = `${endpoint}/v1.0/${projectID}/queues/${queueID}/messages`


module.exports = () => {
    return Object.freeze({
        genConsDiagnosisDocs: async (consultation) => {
            const token = await connection.getToken();
            if (!token) {
                throw new Error('Token error');
            }
            const response = await fetch(generatorQEndpoint, {
                method: 'POST',
                headers: {
                    'X-Auth-Token': token,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    messages: [
                        {
                            body: consultation,
                            attributes: {
                                "type": "diagnosis"
                            }
                        }
                    ]
                })
            });
            if (response.status !== 201) {
                console.error('Failed to add to queue');
                return false;
            } else {
                return true;
            }
        },
        genConsInvoicesDocs: async (consultation) => {
            const token = await connection.getToken();
            if (!token) {
                throw new Error('Token error');
            }

            const response = await fetch(generatorQEndpoint, {
                method: 'POST',
                headers: {
                    'X-Auth-Token': token,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    messages: [
                        {
                            body: consultation,
                            attributes: {
                                "type": "invoices"
                            }
                        }
                    ]
                })
            });
            if (response.status !== 201) {
                console.error('Failed to add to queue');
                return false;
            } else {
                return true;
            }
        },
        genConsLeaveLetterDocs: async (consultation) => {
            const token = await connection.getToken();
            if (!token) {
                throw new Error('Token error');
            }
            const response = await fetch(generatorQEndpoint, {
                method: 'POST',
                headers: {
                    'X-Auth-Token': token,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    messages: [
                        {
                            body: consultation,
                            attributes: {
                                "type": "leave-letter"
                            }
                        }
                    ]
                })
            });
            if (response.status !== 201) {
                console.error('Failed to add to queue');
                return false;
            } else {
                return true;
            }
        },
        genConsPrescriptionDocs: async (consultation) => {
            const token = await connection.getToken();
            if (!token) {
                throw new Error('Token error');
            }
            const response = await fetch(generatorQEndpoint, {
                method: 'POST',
                headers: {
                    'X-Auth-Token': token,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    messages: [
                        {
                            body: consultation,
                            attributes: {
                                "type": "prescription"
                            }
                        }
                    ]
                })
            });
            if (response.status !== 201) {
                console.error('Failed to add to queue');
                return false;
            } else {
                return true;
            }
        },
        genConsMedicalChargesDocs: async (consultation) => {
            const token = await connection.getToken();
            if (!token) {
                throw new Error('Token error');
            }
            const response = await fetch(generatorQEndpoint, {
                method: 'POST',
                headers: {
                    'X-Auth-Token': token,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    messages: [
                        {
                            body: consultation,
                            attributes: {
                                "type": "medical-charges"
                            }
                        }
                    ]
                })
            });
            if (response.status !== 201) {
                console.error('Failed to add to queue');
                return false;
            } else {
                return true;
            }
        },

    })
}