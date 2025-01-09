
const fromEntity = require('../../entity');

/*
 * @desc find doctor practice details
 * @returns [object]practice - pracitce details
*/
exports.FindDoctorPractice = ({
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

                if (userUID === undefined) {
                    throw new CreateError(translate(lang, 'invalid_details'));
                }

                let permission = ac.can(role).readOwn('practice');

                if (urlParams.userUID) {
                    if (urlParams.userUID !== userUID) {
                        permission = ac.can(role).readAny('practice');
                    }
                }

                if (role === 'admin' || role === 'superadmin') {
                    permission = ac.can(role).readAny('practice');
                }

                if (!permission.granted) {
                    throw new CreateError(translate(lang, 'forbidden'), 403)
                }

                // select ID
                let resourceUID;
                if (urlParams.userUID) {
                    resourceUID = urlParams.userUID;
                } else {
                    resourceUID = userUID;
                }

                const practiceTable = db.methods.PracticeDetails({ translate, logger, CreateError, lang });

                // // register doctor
                const practice = (await practiceTable
                    .findByUserUID({ userUID: resourceUID }))
                    .data.practice;

                if (practice === null) {
                    throw new CreateError(translate(lang, 'practice_details_not_found'), 404)
                }

                return {
                    msg: translate(lang, 'success'),
                    data: { practice: practice }
                }

            } catch (error) {
                if (error instanceof CreateError) {
                    throw error;
                }
                logger.error(`Failed to find practice details: %s`, error);
                throw new Error(error.message);
            }
        }
    })
}