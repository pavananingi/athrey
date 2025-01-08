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
                const specializationUID = request.urlParams.uid;

                if (!specializationUID) {
                    throw new CreateError('required_specialization_uid');
                }

                if (role !== 'admin' && role !== 'superadmin') {
                    throw new CreateError(translate(lang, 'forbidden'), 403);
                }

                let permission = ac.can(role).deleteAny('specialization');

                if (!permission.granted) {
                    throw new CreateError(translate(lang, 'forbidden'), 403)
                }

                const recordsDeleted = (await db.methods.Specializations({
                    translate, logger, CreateError, lang
                }).deleteByUID({ uid: specializationUID })).data.deleted;

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
                logger.error(`Failed to delete specialization: %s`, error);
                throw new Error(error.message);
            }
        }
    })
}