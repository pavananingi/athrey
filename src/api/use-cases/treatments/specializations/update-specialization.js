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
                const specializationUID = request.urlParams.uid;


                if (!specializationUID) {
                    throw new CreateError(translate(lang, 'required_specialization_uid'))
                }

                if (role !== 'admin' && role !== 'superadmin') {
                    throw new CreateError(translate(lang, 'forbidden'), 403);
                }

                let permission = ac.can(role).updateAny('specialization');

                if (!permission.granted) {
                    throw new CreateError(translate(lang, 'forbidden'), 403)
                }


                const entity = (await fromEntites.entities
                    .Treatment
                    .UpdateSpecialization({
                        CreateError, DataValidator, logger, translate, lang, params: {
                            ...body
                        }
                    }).generate()).data.entity;


                const specializationTable = db.methods.Specializations({
                    translate, logger, CreateError, lang
                })

                const updateStatus = await specializationTable.updateByUID({ params: entity, specializationUID: specializationUID });

                const updatedDetails = await specializationTable.findByUID(specializationUID);

                return {
                    msg: translate(lang, 'success'),
                    data: { treatment: updatedDetails.data.specializations }
                }

            } catch (error) {
                if (error instanceof CreateError) {
                    throw error;
                }
                logger.error(`Failed to update specialization: %s`, error);
                throw new Error(error.message);
            }
        }
    })
}