'use strict';

module.exports = ({
    CreateError,
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
                const queryParams = request.queryParams;

                if (userUID === undefined) {
                    throw new CreateError(translate(lang, 'invalid_details'));
                }

                let permission = ac.can(role).readOwn('doctorLogs');

                if (urlParams.userUID) {
                    if (urlParams.userUID !== userUID) {
                        permission = ac.can(role).readAny('doctorLogs');
                    }
                }

                if (role === 'admin' || role === 'superadmin') {
                    permission = ac.can(role).readAny('doctorLogs');
                }

                if (!permission.granted) {
                    throw new CreateError(translate(lang, 'forbidden'), 403)
                }

                const startDate = queryParams.startDate;
                const endDate = queryParams.endDate;

                if (!startDate || !endDate) {
                    throw new CreateError(translate(lang, 'missing_query_params'))
                }

                const status = (await db.methods
                    .CallLogs({ translate, logger, CreateError, lang })
                    .findByUserUID({ userUID: urlParams.userUID, startDate, endDate }))
                    .data;

                return {
                    msg: translate(lang, 'success'),
                    data: {
                        logs: status.logs,
                        total_duration: status.totalDuration,
                        filters: {
                            start_date: startDate,
                            end_date: endDate
                        }
                    }
                }
            }
            catch (error) {
                if (error instanceof CreateError) {
                    throw error;
                }
                logger.error(`Failed to get call logs of doctor: %s`, error);
                throw new Error(error.message);
            }
        }
    })
}