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

                if (role !== 'admin' && role !== 'superadmin') {
                    throw new CreateError(translate(lang, 'forbidden'), 403);
                }

                let permission = ac.can(role).createAny('specialization');

                if (!permission.granted) {
                    throw new CreateError(translate(lang, 'forbidden'), 403)
                }

                const entity = (await fromEntites.entities
                    .Treatment
                    .CreateSpecialization({
                        CreateError, DataValidator, logger, translate, lang, params: {
                            ...body
                        }
                    }).generate()).data.entity;

                const status = (await db.methods.Specializations({
                    translate, logger, CreateError, lang
                }).create(entity)).data.specializations;

                return {
                    msg: translate(lang, 'success'),
                    data: { specializations: status }
                }

            } catch (error) {
                if (error instanceof CreateError) {
                    throw error;
                }
                logger.error(`Failed to create specialization: %s`, error);
                throw new Error(error.message);
            }
        }
    })
}