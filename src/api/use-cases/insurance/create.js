const fromEntity = require('../../entity');

/*
 * @desc Create insurnace
 * @params [object]body - object under request.body
 * @returns [object]insurance - details of the registered insurance
*/
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

                if (userUID === undefined) {
                    throw new CreateError(translate(lang, 'invalid_details'));
                }

                let permission = ac.can(role).createOwn('insurance');

                if (urlParams.userUID) {
                    if (urlParams.userUID !== userUID) {
                        permission = ac.can(role).createAny('insurance');
                    }
                }

                if (role === 'admin' || role === 'superadmin') {
                    permission = ac.can(role).createAny('insurance');
                }

                if (!permission.granted) {
                    throw new CreateError(translate(lang, 'forbidden'), 403)
                }

                const insuranceTable = db.methods.Insurance({ translate, logger, CreateError, lang });

                // find insurance
                const findInsurance = (await insuranceTable
                    .findByUserUID({ userUID: userUID }))
                    .data.insurances;

                if (findInsurance) {
                    throw new CreateError(translate(lang, 'insurance_duplicate'))
                }

                const entity = (fromEntity.entities
                    .Insurance
                    .CreateInsurance({
                        CreateError,
                        DataValidator,
                        logger,
                        translate,
                        lang,
                        params: {
                            ...request.body,
                            user_uid: userUID
                        }
                    }).generate()).data.entity


                // create insurance
                const createStatus = (await insuranceTable
                    .create({ ...entity }))
                    .data.insurances;

                return {
                    msg: translate(lang, 'success'),
                    data: { insurances: [createStatus] }
                }

            } catch (error) {
                if (error instanceof CreateError) {
                    throw error;
                }
                logger.error(`Failed to register insurance: %s`, error);
                throw new Error(error.message);
            }
        }
    })
}