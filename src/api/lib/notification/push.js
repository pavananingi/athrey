const admin = require('./connection').connection;

const limit = 499;

module.exports = ({ translate, logger, CreateError, lang }) => {
    return Object.freeze({
        send: ({ tokens = [], message }) => {
            try {

                const notificationMsg = {
                    notification: message,
                };

                const chops = getChops(0, tokens.length, []);

                chops.forEach(i => {
                    sendMulticastMsg({
                        ...notificationMsg,
                        tokens: [...tokens.slice(i[0], i[1])]
                    })
                });
            } catch (error) {
                logger.error('Failed to send push notifications %s %s', error.message, error);
                throw new CreateError(error.message);
            }
        }
    })
}

function sendMulticastMsg(message) {
    if (message?.tokens?.length == 0) {
        return
    }
    admin.messaging().sendMulticast(message)
        .then((response) => {
            // console.log(response.successCount + ' messages were sent successfully');
            // console.log(response.failureCount + ' messages were unsuccessfully');
            // if (response.failureCount > 0) {
            //     const failedTokens = [];
            //     response.responses.forEach((resp, idx) => {
            //         if (!resp.success) {
            //             failedTokens.push(message.tokens[idx]);
            //         }
            //     });
            //     console.log('List of tokens that caused failures: ' + failedTokens);
            // }
        }).catch((error) => {
            console.log('Error sending push message:', error);
        });
}


function getChops(start, length, chops) {
    const end = start + limit;

    if (end > length || end === length) {
        chops.push([start, length]);
        return chops;
    }
    chops.push([start, end]);
    return getChops(end, length, chops)
}
