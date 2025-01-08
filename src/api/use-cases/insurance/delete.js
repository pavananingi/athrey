
/*
 * @desc Delete the insrance
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
                const queryParams = request.queryParams;
                const insuranceUID = request.urlParams.insuranceUID;


                if (userUID === undefined) {
                    throw new CreateError(translate(lang, 'invalid_details'));
                }

                if (!insuranceUID) {
                    throw new CreateError(translate(lang, 'required_insruance_uid'))
                }


                let permission = ac.can(role).deleteOwn('insurance');

                if (queryParams.user_uid) {
                    if (queryParams.user_uid !== userUID) {
                        permission = ac.can(role).deleteAny('insurance');
                    }
                }

                if (role === 'admin' || role === 'superadmin') {
                    permission = ac.can(role).deleteAny('insurance');
                }

                if (!permission.granted) {
                    throw new CreateError(translate(lang, 'forbidden'), 403)
                }

                const insuranceTable = db.methods.Insurance({ translate, logger, CreateError, lang });

                // update id
                let customerUID;
                if (queryParams.user_uid) {
                    customerUID = queryParams.user_uid;
                } else {
                    customerUID = userUID;
                }

                const recordsDeleted = (await insuranceTable
                    .deleteByUID({
                        userUID: customerUID,
                        insuranceUID: insuranceUID
                    })).data.deleted;

                return {
                    msg: translate(lang, 'success'),
                    data: { deleted: recordsDeleted }
                }

            } catch (error) {
                if (error instanceof CreateError) {
                    throw error;
                }
                logger.error(`Failed to delete insurance: %s`, error);
                throw new Error(error.message);
            }
        }
    })
}