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

                let permission = ac.can(role).createAny('treatmentCategories');

                if (!permission.granted) {
                    throw new CreateError(translate(lang, 'forbidden'), 403)
                }

                const entity = (await fromEntites.entities.Treatment.CreateCategory({
                    CreateError, DataValidator, logger, translate, lang, params: {
                        ...body
                    }
                }).generate()).data.entity;

                const treatmentCategoriesTable = await db.methods.TreatmentCategories({
                    translate, logger, CreateError, lang
                }).createBulk(entity.categories);

                return {
                    msg: translate(lang, 'success'),
                    data: { categories: treatmentCategoriesTable.data.treatmentCategories }
                }

            } catch (error) {
                if (error instanceof CreateError) {
                    throw error;
                }
                logger.error(`Failed to create categories: %s`, error);
                throw new Error(error.message);
            }
        }
    })
}