const fromEntity = require('../../entity');

/*
 * @desc Create the documents urls in database
 * @returns [object]urls - urls 
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
                let body = request.body;

                if (userUID === undefined) {
                    throw new CreateError(translate(lang, 'invalid_details'));
                }


                let permission = ac.can(role).createOwn('documents');

                if (urlParams.userUID) {
                    if (urlParams.userUID !== userUID) {
                        permission = ac.can(role).createAny('documents');
                        userUID = urlParams.userUID;
                    }
                }

                if (role === 'admin' || role === 'superadmin') {
                    permission = ac.can(role).createAny('documents');
                }

                if (!permission.granted) {
                    throw new CreateError(translate(lang, 'forbidden'), 403)
                }

                const entity = (await fromEntity.entities.Documents
                    .CreateDocuments({
                        CreateError, DataValidator, logger, translate, lang,
                        params: {
                            user_uid: userUID,
                            documents: body
                        }
                    }).generate()).data.entity;

                const status = (await db.methods.Documents({ translate, logger, CreateError, lang })
                    .createBulk(entity.documents)).data.documents;


                return {
                    msg: translate(lang, 'success'),
                    data: { documents: status }
                }

            } catch (error) {
                if (error instanceof CreateError) {
                    throw error;
                }
                logger.error(`Failed to create documents: %s`, error);
                throw new Error(error.message);
            }
        }
    })
}