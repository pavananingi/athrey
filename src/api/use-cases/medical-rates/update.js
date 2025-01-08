const fromEntity = require('../../entity');

/*
 * @desc update medical rate
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

                if (!urlParams.id) {
                    throw new CreateError(translate(lang, 'invalid_medical_rate_id'), 403);
                }

                if (role !== 'admin' && role !== 'superadmin') {
                    throw new CreateError(translate(lang, 'forbidden'), 403);
                }

                if (role === 'admin' || role === 'superadmin') {
                    permission = ac.can(role).updateAny('medicalRates');
                }

                if (!permission.granted) {
                    throw new CreateError(translate(lang, 'forbidden'), 403)
                }

                const entity = (fromEntity.entities
                    .MedicalRates
                    .Update({
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

                // update medical rate
                const update = (await medicalRatesTable
                    .updateByID({ params: { ...entity }, id: urlParams.id }))
                    .data.medicalRates;

                const updatedStatus = (await medicalRatesTable
                    .findByID({ id: urlParams.id }))
                    .data.medicalRates;

                return {
                    msg: translate(lang, 'success'),
                    data: { medical_rates: updatedStatus }
                }

            } catch (error) {
                if (error instanceof CreateError) {
                    throw error;
                }
                logger.error(`Failed to update medical-rates: %s`, error);
                throw new Error(error.message);
            }
        }
    })
}