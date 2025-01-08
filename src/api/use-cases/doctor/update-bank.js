
const fromEntity = require('../../entity');

/*
 * @desc Create doctor bank details
 * @params [object]body - object under request.body
 * @returns [object]devices - details of the registered device 
*/
exports.UpdateDoctorBank = ({
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

                let permission = ac.can(role).updateOwn('bank');

                if (urlParams.userUID) {
                    if (urlParams.userUID !== userUID) {
                        permission = ac.can(role).createAny('bank');
                    }
                }

                if (role === 'admin' || role === 'superadmin') {
                    permission = ac.can(role).createAny('bank');
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
                    .UpdateDoctorBank({
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

                const bankTable = db.methods.BankDetails({ translate, logger, CreateError, lang });


                // // register doctor
                (await bankTable
                    .updateByUserUID(userUID, { ...entity }))
                    .data;

                const bank = (await bankTable
                    .findByUserUID({ userUID }))
                    .data.doctors;

                return {
                    msg: translate(lang, 'success'),
                    data: { bank }
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