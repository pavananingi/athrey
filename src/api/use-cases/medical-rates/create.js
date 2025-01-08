const fromEntity = require('../../entity');

/*
 * @desc Create medical rate
 * @params [object]body - object under request.body
 * @returns [object]medical rate - details of the registered medical rate
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

                if (role !== 'admin' && role !== 'superadmin') {
                    throw new CreateError(translate(lang, 'forbidden'), 403);
                }

                if (role === 'admin' || role === 'superadmin') {
                    permission = ac.can(role).createAny('medicalRates');
                }

                if (!permission.granted) {
                    throw new CreateError(translate(lang, 'forbidden'), 403)
                }

                const entity = (fromEntity.entities
                    .MedicalRates
                    .Create({
                        CreateError,
                        DataValidator,
                        logger,
                        translate,
                        lang,
                        params: {
                            ...request.body
                        }
                    }).generate()).data.entity

                const medicalRatesTable = db.methods.MedicalRates({ translate, logger, CreateError, lang });

                // create medical rate
                const createStatus = (await medicalRatesTable
                    .create({ ...entity }))
                    .data.medicalRates;

                return {
                    msg: translate(lang, 'success'),
                    data: { medical_rates: createStatus }
                }

            } catch (error) {
                if (error instanceof CreateError) {
                    throw error;
                }
                logger.error(`Failed to register medical-rates: %s`, error);
                throw new Error(error.message);
            }
        }
    })
}