
/*
 * @desc Delete the medical rate
 * @returns
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
                const id = request.urlParams.id;

                if (role !== 'admin' && role !== 'superadmin') {
                    throw new CreateError(translate(lang, 'forbidden'), 403);
                }

                if (role === 'admin' || role === 'superadmin') {
                    permission = ac.can(role).deleteAny('medicalRates');
                }

                if (!permission.granted) {
                    throw new CreateError(translate(lang, 'forbidden'), 403)
                }

                const medicalRatesTable = db.methods.MedicalRates({ translate, logger, CreateError, lang });

                const recordsDeleted = (await medicalRatesTable
                    .deleteByID({
                        id: id,
                    })).data.deleted;

                return {
                    msg: translate(lang, 'success'),
                    data: { deleted: recordsDeleted }
                }

            } catch (error) {
                if (error instanceof CreateError) {
                    throw error;
                }
                logger.error(`Failed to delete medical rates: %s`, error);
                throw new Error(error.message);
            }
        }
    })
}