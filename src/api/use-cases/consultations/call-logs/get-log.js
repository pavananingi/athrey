'use strict';

module.exports = ({
    CreateError,
    DataValidator,
    logger,
    translate,
    request,
    db,
    ac,
}) => {
    return Object.freeze({
        execute: async () => {
            try {
                const lang = request.lang;
                const userUID = request.locals.uid;
                const role = request.locals.role;
                const urlParams = request.urlParams;
                const consultationUID = request.urlParams.uid;

                if (userUID === undefined) {
                    throw new CreateError(translate(lang, 'invalid_details'));
                }

                let permission = ac.can(role).readOwn('callLog');

                if (urlParams.userUID) {
                    if (urlParams.userUID !== userUID) {
                        permission = ac.can(role).readAny('callLog');
                    }
                }

                if (role === 'admin' || role === 'superadmin') {
                    permission = ac.can(role).readAny('callLog');
                }

                if (!permission.granted) {
                    throw new CreateError(translate(lang, 'forbidden'), 403)
                }

                const status = (await db.methods
                    .CallLogs({ translate, logger, CreateError, lang })
                    .findByConsUID({ consultationUID: consultationUID }))
                    .data.logs;

                return {
                    msg: translate(lang, 'success'),
                    data: { logs: status }
                }
            }
            catch (error) {
                if (error instanceof CreateError) {
                    throw error;
                }
                logger.error(`Failed to get call logs: %s`, error);
                throw new Error(error.message);
            }
        }
    })
}