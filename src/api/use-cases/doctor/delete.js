'use strict';

/*
 * @desc Delete the doctor details
 * @returns {object}records
*/
exports.DeleteDoctor = ({
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
                const deviceId = request.urlParams.deviceId;


                if (userUID === undefined) {
                    throw new CreateError(translate(lang, 'invalid_details'));
                }

                let permission = ac.can(role).deleteOwn('doctor');

                if (urlParams.userUID) {
                    if (urlParams.userUID !== userUID) {
                        permission = ac.can(role).deleteAny('doctor');
                    }
                }

                if (role === 'admin' || role === 'superadmin') {
                    permission = ac.can(role).deleteAny('doctor');
                }

                if (!permission.granted) {
                    throw new CreateError(translate(lang, 'forbidden'), 403)
                }

                const doctorTable = db.methods.DoctorDetails({ translate, logger, CreateError, lang });

                // update device
                let customerUID;
                if (urlParams.userUID) {
                    customerUID = urlParams.userUID;
                } else {
                    customerUID = userUID;
                }

                const recordsDeleted = (await doctorTable
                    .deleteByUserUID({
                        userUID: customerUID,
                    })).data.deleted;

                if (recordsDeleted === 0) {
                    throw new CreateError(translate(lang, 'no_records_found'), 404)
                }

                return {
                    msg: translate(lang, 'success'),
                    data: { deleted: recordsDeleted }
                }

            } catch (error) {
                if (error instanceof CreateError) {
                    throw error;
                }
                logger.error(`Failed to delete doctor details: %s`, error);
                throw new Error(error.message);
            }
        }
    })
}