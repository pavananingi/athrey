const fromEntites = require('../../../entity');

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
                const role = request.locals.role;
                const body = request.body;
                const treatmentId = request.urlParams.treatmentId;
                const categoryUID = request.urlParams.uid;

                if (!treatmentId) {
                    throw new CreateError(translate(lang, 'required_treatment_id'))
                }

                if (!categoryUID) {
                    throw new CreateError(translate(lang, 'required_category_uid'))
                }

                if (role !== 'admin' && role !== 'superadmin') {
                    throw new CreateError(translate(lang, 'forbidden'), 403);
                }

                let permission = ac.can(role).updateAny('treatment');

                if (!permission.granted) {
                    throw new CreateError(translate(lang, 'forbidden'), 403)
                }

                const entity = (await fromEntites.entities
                    .Treatment
                    .UpdateTreatment({
                        CreateError, DataValidator, logger, translate, lang, params: {
                            ...body
                        }
                    }).generate()).data.entity;

                const treatmentsTable = db.methods.Treatments({
                    translate, logger, CreateError, lang
                })
                const updateStatus = await treatmentsTable.updateByID({ params: entity, id: treatmentId });

                const updatedDetails = await treatmentsTable.findByID(treatmentId);

                return {
                    msg: translate(lang, 'success'),
                    data: { treatments: updatedDetails.data.treatments }
                }

            } catch (error) {
                if (error instanceof CreateError) {
                    throw error;
                }
                logger.error(`Failed to update treatment: %s`, error);
                throw new Error(error.message);
            }
        }
    })
}