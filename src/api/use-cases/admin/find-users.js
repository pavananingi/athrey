const env = process.env.NODE_ENV || 'development';
const Minio = require('minio');

exports.FindUsers = ({
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

                if (userUID === undefined) {
                    throw new CreateError(translate(lang, 'invalid_details'));
                }

                let permission = ac.can(role).readAny('doctor');

                if (role === 'admin' || role === 'superadmin') {
                    permission = ac.can(role).readAny('admin');
                }

                if (!permission.granted) {
                    throw new CreateError(translate(lang, 'forbidden'), 403)
                }

                const userTable = db.methods.User({ translate, logger, CreateError, lang });

                const user = (
                    await userTable.findAllUsers(
                        {
                            status: queryParams.requested == 'true' ? "pending" : "approved",
                            doctor: queryParams.role == "doctor" ? true : false,
                            patient: queryParams.role == "doctor" ? false : true
                        })
                ).data.users;

                for (let data of user) {
                    if (data?.id_cirtificate_uid) {
                        let result = (await db.methods.Documents({ translate, logger, CreateError, lang })
                            .findByUID({ documentUID: data.id_cirtificate_uid })).data.documents;

                        const minioClient = new Minio.Client({
                            endPoint: 's3.amazonaws.com',
                            port: 443,
                            useSSL: true,
                            accessKey: process.env.S3_ACCESS_KEY,
                            secretKey: process.env.S3_SECRET_ACCESS_KEY,
                        });
                        data.dataValues.cirtificate = await minioClient.presignedUrl(
                            'GET',
                            process.env.S3_BUCKET_NAME,
                            result.url,
                            24 * 60 * 60 * 7
                        );
                    }
                }
                return {
                    msg: translate(lang, 'success'),
                    data: { user }
                }

            } catch (error) {
                if (error instanceof CreateError) {
                    throw error;
                }
                logger.error(`Failed to find admins: %s`, error);
                throw new Error(error.message);
            }
        }
    });
}