const sgMail = require("@sendgrid/mail");

// Configure API key authorization: api-key
let apiKey = process.env.SG_API_KEY;
sgMail.setApiKey(apiKey);


exports.connection = () => Object.freeze({
    sendEmail: (details) => {
        const msg = {
            personalizations: details.personalizations,
            from: {
                name: process.env.SG_SENDER_NAME,
                email: process.env.SG_SENDER_EMAIL,
            },
        };

        if (details?.subject !== undefined) {
            msg.subject = details.subject;
        }

        if (details?.content !== undefined) {
            msg.content = [
                {
                    type: "text/html",
                    value: details?.content,
                },
            ];
        }

        sgMail
            .send(msg)
            .then((response) => {
                console.log(`Email delivered with status: ${response}`);
            })
            .catch((error) => {
                console.log(error?.response?.body);
            });
    }
})