
/*
 * @desc Find the insurance
 * @returns [array]insurances - updated details of the registered insurance 
*/
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
                const queryParams = request.queryParams;

                if (userUID === undefined) {
                    throw new CreateError(translate(lang, 'invalid_details'));
                }

                let permission = ac.can(role).readOwn('insurance');

                if (queryParams.user_uid) {
                    if (queryParams.user_uid !== userUID) {
                        permission = ac.can(role).readAny('insurance');
                    }
                }

                if (role === 'admin' || role === 'superadmin') {
                    permission = ac.can(role).readAny('insurance');
                }

                if (!permission.granted) {
                    throw new CreateError(translate(lang, 'forbidden'), 403)
                }

                const insuranceTable = db.methods.Insurance({ translate, logger, CreateError, lang });

                // update user_uid
                let customerUID;
                if (queryParams.user_uid) {
                    customerUID = queryParams.user_uid;
                } else {
                    customerUID = userUID;
                }

                let insurancesList = [];
                if (queryParams.uid) {
                    insurancesList = (await insuranceTable
                        .findByUID({ insuranceUID: queryParams.uid }))
                        .data.insurances;

                    if (insurancesList === null) {
                        throw new CreateError(translate(lang, 'device_not_found'), 404)
                    } else {
                        insurancesList = [insurancesList];
                    }
                } else {
                    insurancesList = (await insuranceTable
                        .findAllByUserUID({
                            userUID: customerUID
                        }))
                        .data.insurances;
                }

                return {
                    msg: translate(lang, 'success'),
                    data: { insurances: insurancesList }
                }

            } catch (error) {
                if (error instanceof CreateError) {
                    throw error;
                }
                logger.error(`Failed to find insurances: %s`, error);
                throw new Error(error.message);
            }
        }
    })
}