
/*
 * @desc Delete the documents by UID
*/
module.exports = ({
    CreateError,
    logger,
    translate,
    request,
    db,
    ac
}) => {
    return Object.freeze({
        execute: async () => {
            try {
                const lang = request.lang;
                let userUID = request.locals.uid;
                const role = request.locals.role;
                const queryParams = request.queryParams;
                const urlParams = request.urlParams;

                if (userUID === undefined) {
                    throw new CreateError(translate(lang, 'invalid_details'));
                }

                let permission = ac.can(role).deleteOwn('documents');

                if (urlParams.userUID) {
                    if (urlParams.userUID !== userUID) {
                        permission = ac.can(role).deleteAny('documents');
                        userUID = urlParams.userUID;
                    }
                }

                if (role === 'admin' || role === 'superadmin') {
                    permission = ac.can(role).deleteAny('documents');
                }

                if (!permission.granted) {
                    throw new CreateError(translate(lang, 'forbidden'), 403)
                }


                // const status = (await db.methods.Documents({ translate, logger, CreateError, lang })
                //     .deleteByUID({
                //         documentUID: [urlParams.documentUID]
                //     })).data.deleted;

                // if (status === 0) {
                //     throw new CreateError(translate(lang, 'invalid_document_UID'));
                // }

                const udpateStatus = (await db.methods.Documents({ translate, logger, CreateError, lang })
                    .updateByUID({
                        documentUID: [urlParams.documentUID],
                        params: {
                            deleted: true,
                            deleted_on: new Date().toISOString()
                        }
                    }));

                return {
                    msg: translate(lang, 'success'),
                    data: {
                        deleted: true
                    }
                }

            } catch (error) {
                if (error instanceof CreateError) {
                    throw error;
                }
                logger.error(`Failed to delete documents: %s`, error);
                throw new Error(error.message);
            }
        }
    })
}