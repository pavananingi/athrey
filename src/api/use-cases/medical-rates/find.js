
/*
 * @desc Find the medical rate
 * @returns [array]medical rates - updated details of the registered medical rate 
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

                let permission = ac.can(role).readAny('medicalRates');

                // if (role === 'admin' || role === 'superadmin') {
                //     permission = ac.can(role).readAny('medicalRates');
                // }

                if (!permission.granted) {
                    throw new CreateError(translate(lang, 'forbidden'), 403)
                }

                const medicalRatesTable = db.methods.MedicalRates({ translate, logger, CreateError, lang });

                // find medical rates
                const status = (await medicalRatesTable
                    .findAll({}))
                    .data.medicalRates;

                return {
                    msg: translate(lang, 'success'),
                    data: { medical_rates: status }
                }

            } catch (error) {
                if (error instanceof CreateError) {
                    throw error;
                }
                logger.error(`Failed to find medical rates: %s`, error);
                throw new Error(error.message);
            }
        }
    })
}