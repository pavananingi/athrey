const fromAdaptReq = require("../utils/adapt-req");
const translate = require("../i18n/msg")

exports.errorHandler = (err, req, res, next) => {
    console.log('ERROR', err);

    if (res.headersSent) {
        return next(err)
    }

    if (!err.date) {
        const request = fromAdaptReq.adaptReq(req, res);
        const msg = translate(request.lang, "unknown_error_contact_support")
        return res.status(500).json({
            msg,
            data: {}
        });
    }


    return res.status(err.status).json({
        msg: err.message,
        data: {}
    });
}

