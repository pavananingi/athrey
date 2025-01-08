const fromEntity = require('../../entity');

/*
 * @desc Register the device under notification devices
 * @params [object]body - object under request.body
 * @returns [object]devices - details of the registered device 
*/
exports.UpdateDoctor = ({
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

                let permission = ac.can(role).updateOwn('doctor');

                if (urlParams.userUID) {
                    if (urlParams.userUID !== userUID) {
                        permission = ac.can(role).updateAny('doctor');
                    }
                }

                if (role === 'admin' || role === 'superadmin') {
                    permission = ac.can(role).updateAny('doctor');
                }

                if (!permission.granted) {
                    throw new CreateError(translate(lang, 'forbidden'), 403)
                }


                // filter body based on the role
                const body = permission.filter(request.body);

                // select ID
                let resourceUID;
                if (urlParams.userUID) {
                    resourceUID = urlParams.userUID;
                } else {
                    resourceUID = userUID;
                }


                const entity = (fromEntity.entities
                    .Doctor
                    .UpdateDoctor({
                        CreateError,
                        DataValidator,
                        logger,
                        translate,
                        lang,
                        params: {
                            ...body,
                            user_uid: resourceUID
                        }
                    }).generate()).data.entity

                const doctorTable = db.methods.DoctorDetails({ translate, logger, CreateError, lang });

                const updateDoctor = (await doctorTable
                    .updateByUserUID({ userUID: resourceUID, params: entity }));

                const updatedDetails = (await doctorTable
                    .findByUserUID({ userUID: resourceUID }))
                    .data.doctors;


                if (updatedDetails === null) {
                    throw new CreateError(translate(lang, 'doctor_details_not_found'), 404);
                }

                return {
                    msg: translate(lang, 'success'),
                    data: { doctors: updatedDetails }
                }

            } catch (error) {
                if (error instanceof CreateError) {
                    throw error;
                }
                logger.error(`Failed to register doctor: %s`, error);
                throw new Error(error.message);
            }
        }
    })
}