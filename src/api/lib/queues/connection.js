/*
// Password expires after 3 months
// Token expires after 24hrs
*/
const moment = require('moment');
const fetch = require('node-fetch');

const config = require('../../../config/queues.config.json');
const projectID = config[process.env.NODE_ENV].otc.projectID;
const username = config[process.env.NODE_ENV].otc.username;
const domain = config[process.env.NODE_ENV].otc.domain;
const password = config[process.env.NODE_ENV].otc.password;
const tokenEndpoint = config[process.env.NODE_ENV].otc.tokenEndPoint;

function Connection({
    projectID,
    username,
    domain,
    password,
    tokenEndpoint,
}) {
    try {
        let token = null;
        this.expiresAt = null;
        const body = {
            "auth": {
                "identity": {
                    "methods": [
                        "password"
                    ],
                    "password": {
                        "user": {
                            "name": username,
                            "password": password,
                            "domain": {
                                "name": domain
                            }
                        }
                    }
                },
                "scope": {
                    "project": {
                        "id": projectID
                    }
                }
            }
        };
        this.getToken = () => {
            if (this.token && this.expiresAt) {
                if (this.expiresAt > moment().valueOf()) {
                    return new Promise((resolve, reject) => {
                        resolve(this.token)
                    })
                }
            }
            return fetch(tokenEndpoint, {
                method: 'POST',
                body: JSON.stringify(body),
                headers: { 'Content-Type': 'application/json' }
            }).then(response => {
                console.log('Generated new auth token');
                this.token = response.headers.get('X-Subject-Token');
                return response.json();
            }).then(data => {
                this.expiresAt = moment(data.token.expires_at).subtract(1, 'hour').valueOf();
                return this.token;
            }).catch(error => {
                console.error('Failed to generate the auth token', error);
                return false;
            })
        }
    } catch (error) {
        console.log('Failed to get the token', error);
        return false
    }
}
const connection = new Connection({
    projectID,
    username,
    domain,
    password,
    tokenEndpoint,
});
module.exports = connection;