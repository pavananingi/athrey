const fromEntity = require('../../entity');


/*
 * @desc Update the documents by UID
*/
module.exports = ({
    CreateError,
    logger,
    translate,
    request,
    db,
    ac,
    DataValidator
}) => {
    return Object.freeze({
        execute: async () => {
            try {
                const lang = request.lang;
                let userUID = request.locals.uid;
                const role = request.locals.role;
                const queryParams = request.queryParams;
                const urlParams = request.urlParams;
                const body = request.body;

                if (userUID === undefined) {
                    throw new CreateError(translate(lang, 'invalid_details'));
                }

                let permission = ac.can(role).updateOwn('documents');

                if (urlParams.userUID) {
                    if (urlParams.userUID !== userUID) {
                        permission = ac.can(role).updateAny('documents');
                        userUID = urlParams.userUID;
                    }
                }

                if (role === 'admin' || role === 'superadmin') {
                    permission = ac.can(role).updateAny('documents');
                }

                if (!permission.granted) {
                    throw new CreateError(translate(lang, 'forbidden'), 403)
                }

                const entity = (await fromEntity.entities.Documents
                    .UpdateDocuments({
                        CreateError, DataValidator, logger, translate, lang,
                        params: body
                    }).generate()).data.entity;

                const udpateStatus = (await db.methods.Documents({ translate, logger, CreateError, lang })
                    .updateByUID({
                        documentUID: [urlParams.documentUID],
                        params: entity
                    }));

                const status = (await db.methods.Documents({ translate, logger, CreateError, lang })
                    .findByUID({
                        documentUID: [urlParams.documentUID]
                    })).data.documents;

                return {
                    msg: translate(lang, 'success'),
                    data: {
                        documents: status
                    }
                }

            } catch (error) {
                if (error instanceof CreateError) {
                    throw error;
                }
                logger.error(`Failed to update documents: %s`, error);
                throw new Error(error.message);
            }
        }
    })
}