'use strict';

/*
 * @desc Delete the doctor practice
 * @returns {object}records
*/
exports.DeleteDoctorPractice = ({
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


                if (userUID === undefined) {
                    throw new CreateError(translate(lang, 'invalid_details'));
                }

                let permission = ac.can(role).deleteOwn('practice');

                if (urlParams.userUID) {
                    if (urlParams.userUID !== userUID) {
                        permission = ac.can(role).deleteAny('practice');
                    }
                }

                if (role === 'admin' || role === 'superadmin') {
                    permission = ac.can(role).deleteAny('practice');
                }

                if (!permission.granted) {
                    throw new CreateError(translate(lang, 'forbidden'), 403)
                }

                const practiceTable = db.methods.PracticeDetails({ translate, logger, CreateError, lang });

                // update device
                let customerUID;
                if (urlParams.userUID) {
                    customerUID = urlParams.userUID;
                } else {
                    customerUID = userUID;
                }

                const recordsDeleted = (await practiceTable
                    .deleteByUserUID({
                        userUID: customerUID,
                    })).data.deleted;

                return {
                    msg: translate(lang, 'success'),
                    data: { deleted: recordsDeleted }
                }

            } catch (error) {
                if (error instanceof CreateError) {
                    throw error;
                }
                logger.error(`Failed to delete practice details: %s`, error);
                throw new Error(error.message);
            }
        }
    })
}