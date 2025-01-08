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
                const categoryUID = request.urlParams.uid;

                if (!categoryUID) {
                    throw new CreateError(translate(lang, 'required_category_uid'))
                }

                if (role !== 'admin' && role !== 'superadmin') {
                    throw new CreateError(translate(lang, 'forbidden'), 403);
                }

                let permission = ac.can(role).updateAny('treatmentCategories');

                if (!permission.granted) {
                    throw new CreateError(translate(lang, 'forbidden'), 403)
                }

                const entity = (await fromEntites.entities
                    .Treatment
                    .UpdateCategory({
                        CreateError, DataValidator, logger, translate, lang, params: {
                            ...body
                        }
                    }).generate()).data.entity;

                const treatmentCategoriesTable = db.methods.TreatmentCategories({
                    translate, logger, CreateError, lang
                })
                const updateStatus = await treatmentCategoriesTable.updateByUID({ params: entity, categoryUID });

                const updatedDetails = await treatmentCategoriesTable.findByUID(categoryUID);

                return {
                    msg: translate(lang, 'success'),
                    data: { categories: updatedDetails.data.categories }
                }

            } catch (error) {
                if (error instanceof CreateError) {
                    throw error;
                }
                logger.error(`Failed to update category: %s`, error);
                throw new Error(error.message);
            }
        }
    })
}