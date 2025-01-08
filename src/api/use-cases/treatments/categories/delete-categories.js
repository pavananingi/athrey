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
                const role = request.locals.role;
                const categoryUID = request.urlParams.uid;

                if (!categoryUID) {
                    throw new CreateError('required_category_uid');
                }

                if (role !== 'admin' && role !== 'superadmin') {
                    throw new CreateError(translate(lang, 'forbidden'), 403);
                }

                let permission = ac.can(role).deleteAny('treatmentCategories');

                if (!permission.granted) {
                    throw new CreateError(translate(lang, 'forbidden'), 403)
                }

                const recordsDeleted = (await db.methods.TreatmentCategories({
                    translate, logger, CreateError, lang
                }).deleteByUID({ uid: categoryUID })).data.deleted;

                if (recordsDeleted === 0) {
                    throw new CreateError(translate(lang, 'no_records_found'), 404)
                }

                return {
                    msg: translate(lang, 'success'),
                    data: { deleted: recordsDeleted }
                }

            } catch (error) {
                if (error instanceof CreateError) {
                    throw error;
                }
                logger.error(`Failed to delete category: %s`, error);
                throw new Error(error.message);
            }
        }
    })
}