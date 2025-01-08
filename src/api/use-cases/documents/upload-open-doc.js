const fromEntity = require('../../entity');
const fs = require('fs');
const env = process.env.NODE_ENV || 'development';
const path = require('path');
const Minio = require('minio');


/*
 * @desc Upload documents and Create the documents urls in database
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
                const queryParams = request.queryParams;
                let body = request.body;

                // ____________TO UPLOAD FILE BY GENERATED URL_______________
                if (!body.file) {
                    throw new CreateError(translate(lang, 'required_file'), 400);
                }

                if (body?.file?.originalname !== body.filename) {
                    throw new CreateError(translate(lang, 'invalid_file_name'), 400);
                }

                const type = queryParams.type;
                let isAppointment = false;
                if (!type) {
                    throw new CreateError(translate(lang, 'required_upload_type'), 400);
                }

                if (type) {
                    // @todo validate for UUID format
                    // @todo check from appointments table
                    // 

                    if (/^[0-9a-fA-F]{8}\-[0-9a-fA-F]{4}\-[0-9a-fA-F]{4}\-[0-9a-fA-F]{4}\-[0-9a-fA-F]{12}$/.test(type)) {
                        isAppointment = true;
                    }
                }
                const folders = {
                    insurance: `insurance`,
                    personal: `documents`,
                }
                let folderName;
                if (isAppointment) {
                    folderName = 'appointments/' + type;
                } else {
                    folderName = folders[type]
                }

                let fileName = body?.filename?.split('.');
                if (!fileName) {
                    fileName = body?.file?.originalname?.split('.')
                }

                fileName[1] = body?.file?.mimetype?.split('/')[1]

                const objectKey = `athrey/register-doctor/${folderName}/${fileName[0]}_${new Date().getTime()}.${fileName[1]}`;

                const bucketName = process.env.S3_BUCKET_NAME;
                const localFilePath = path.join(__dirname + "/temp-documents" + `/${body?.file?.filename}`);
                const metaData = {
                    'Content-Type': fileName[1]
                };

                const minioClient = new Minio.Client({
                    endPoint: 's3.amazonaws.com',
                    port: 443,
                    useSSL: true,
                    accessKey: process.env.S3_ACCESS_KEY,
                    secretKey: process.env.S3_SECRET_ACCESS_KEY,
                });

                try {
                    minioClient
                        .fPutObject(bucketName, objectKey, localFilePath, metaData)
                        .catch((e) => {
                            console.log('Error while creating object from file data: ', e);
                            throw e;
                        });

                    // presignedUrl = await minioClient.presignedUrl(
                    //     'GET',
                    //     bucketName,
                    //     objectKey,
                    //     24 * 60 * 60 * 7
                    // );
                } catch (error) {
                    console.log('error is', error);
                }

                // ______________TO SAVE DATA OF UPLOADED FILE_____________
                const entity = (await fromEntity.entities.Documents
                    .CreateDocuments({
                        CreateError, DataValidator, logger, translate, lang,
                        params: {
                            documents: [{
                                url: objectKey,
                                name: body.filename
                            }]
                        }
                    }).generate()).data.entity;

                console.log("entity.documents", entity.documents)
                const status = (await db.methods.Documents({ translate, logger, CreateError, lang })
                    .createBulk(entity.documents)).data.documents;

                // delete local file
                fs.unlink(path.join(__dirname + "/temp-documents" + `/${request?.body?.file?.filename}`), (err) => {
                    console.log(err)
                });

                return {
                    msg: translate(lang, 'success'),
                    data: { documents: status }
                }

            } catch (error) {
                // delete local file
                fs.unlink(path.join(__dirname + "/temp-documents" + `/${request?.body?.file?.filename}`), (err) => {
                    console.log(err)
                });
                if (error instanceof CreateError) {
                    throw error;
                }
                logger.error(`Failed to upload file and create documents: %s`, error);
                throw new Error(error.message);
            }
        }
    })
}


