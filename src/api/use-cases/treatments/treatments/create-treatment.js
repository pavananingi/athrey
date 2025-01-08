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

                let permission = ac.can(role).createAny('treatment');

                if (!permission.granted) {
                    throw new CreateError(translate(lang, 'forbidden'), 403)
                }

                const entity = (await fromEntites.entities.Treatment.CreateTreatment({
                    CreateError, DataValidator, logger, translate, lang, params: {
                        ...body,
                        category_uid: categoryUID
                    }
                }).generate()).data.entity;

                const treatment = (await db.methods.Treatments({
                    translate, logger, CreateError, lang
                }).create(entity)).data.treatments;

                return {
                    msg: translate(lang, 'success'),
                    data: { treatments: treatment }
                }

            } catch (error) {
                if (error instanceof CreateError) {
                    throw error;
                }
                logger.error(`Failed to create treatment: %s`, error);
                throw new Error(error.message);
            }
        }
    })
}