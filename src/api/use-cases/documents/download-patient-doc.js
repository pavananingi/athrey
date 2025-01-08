const fromEntity = require('../../entity');

/*
 * @desc Get the documents urls in database based on document UID
 * @returns [object]urls - urls 
*/
const env = process.env.NODE_ENV || 'development';
const Minio = require('minio');

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
                let userUID = request.locals.uid;
                const role = request.locals.role;
                const queryParams = request.queryParams;
                const urlParams = request.urlParams;

                if (userUID === undefined) {
                    throw new CreateError(translate(lang, 'invalid_details'));
                }

                if (!urlParams.documentUID) {
                    throw new CreateError(translate(lang, 'invalid_details'));
                }

                let permission = ac.can(role).readOwn('documents');

                if (urlParams.userUID) {
                    if (urlParams.userUID !== userUID) {
                        permission = ac.can(role).readAny('documents');
                        userUID = urlParams.userUID;
                    }
                }

                if (role === 'admin' || role === 'superadmin') {
                    permission = ac.can(role).readAny('documents');
                }

                if (!permission.granted) {
                    throw new CreateError(translate(lang, 'forbidden'), 403)
                }


                const result = (await db.methods.Documents({ translate, logger, CreateError, lang })
                    .findByUID({ documentUID: urlParams.documentUID })).data.documents;


                if (result === null) {
                    throw new CreateError(translate(lang, 'document_not_found'))
                }

                const bucketName = process.env.S3_BUCKET_NAME;

                const minioClient = new Minio.Client({
                    endPoint: 's3.amazonaws.com',
                    port: 443,
                    useSSL: true,
                    accessKey: process.env.S3_ACCESS_KEY,
                    secretKey: process.env.S3_SECRET_ACCESS_KEY,
                });

                result.url = await minioClient.presignedUrl(
                    'GET',
                    bucketName,
                    result.url,
                    24 * 60 * 60 * 7
                );

                return {
                    msg: translate(lang, 'success'),
                    data: {
                        documents: {
                            ...result,
                        },
                    }
                }

            } catch (error) {
                if (error instanceof CreateError) {
                    throw error;
                }
                logger.error(`Failed to get document: %s`, error);
                throw new Error(error.message);
            }
        }
    })
}