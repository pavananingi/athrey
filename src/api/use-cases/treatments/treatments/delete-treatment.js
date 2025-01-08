const fromEntites = require('../../../entity');

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
                const treatmentId = request.urlParams.treatmentId;

                if (!treatmentId) {
                    throw new CreateError('required_treatment_id');
                }

                if (role !== 'admin' && role !== 'superadmin') {
                    throw new CreateError(translate(lang, 'forbidden'), 403);
                }

                let permission = ac.can(role).deleteAny('treatment');

                if (!permission.granted) {
                    throw new CreateError(translate(lang, 'forbidden'), 403)
                }

                const recordsDeleted = (await db.methods.Treatments({
                    translate, logger, CreateError, lang
                }).deleteByID({ id: treatmentId })).data.deleted;

                if (recordsDeleted === 0) {
                    throw new CreateError(translate(lang,'no_records_found'),404)
                }

                return {
                    msg: translate(lang, 'success'),
                    data: { deleted: recordsDeleted }
                }

            } catch (error) {
                if (error instanceof CreateError) {
                    throw error;
                }
                logger.error(`Failed to delete treatments: %s`, error);
                throw new Error(error.message);
            }
        }
    })
}