const { query } = require("winston");

/*
 * @desc Find the doctors details
 * @returns [object]devices - list of doctors
*/
const env = process.env.NODE_ENV || 'development';
const Minio = require('minio');

exports.FindDoctors = ({
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
                const urlParams = request.urlParams;
                const queryParams = request.queryParams;

                if (userUID === undefined) {
                    throw new CreateError(translate(lang, 'invalid_details'));
                }

                let permission = ac.can(role).readOwn('doctor');

                if (urlParams.userUID) {
                    if (urlParams.userUID !== userUID) {
                        permission = ac.can(role).readAny('doctor');
                    }
                }

                if (role === 'admin' || role === 'superadmin') {
                    permission = ac.can(role).readAny('doctor');
                }

                if (!permission.granted) {
                    throw new CreateError(translate(lang, 'forbidden'), 403)
                }

                const doctorTable = db.methods.DoctorDetails({ translate, logger, CreateError, lang });


                // resource id
                let customerUID;
                if (urlParams.userUID) {
                    customerUID = urlParams.userUID;
                } else {
                    customerUID = userUID;
                }

                if ((role === 'admin' || role === 'superadmin') && !urlParams.userUID) {
                    let allDoctors = (await doctorTable
                        .findAll(
                            {
                                offset: queryParams.offset,
                                limit: queryParams.limit,
                                sortBy: queryParams.sort_by,
                                order: queryParams.order
                            }
                        ))
                        .data;
                    return {
                        msg: translate(lang, 'success'),
                        data: {
                            doctors: allDoctors.doctors,
                            offset: allDoctors.offset,
                            limit: allDoctors.limit,
                            sort_by: allDoctors.sortBy,
                            order: allDoctors.order,
                            sortable_columns: allDoctors.sortableColumns,
                            total: allDoctors.total
                        }
                    }
                } else {
                    let doctors = (await doctorTable
                        .findByUserUID({ userUID: customerUID }))
                        .data.doctors;

                    if (doctors === null) {
                        throw new CreateError(translate(lang, 'doctor_details_not_found'), 404)
                    } else {
                        doctors = [doctors];
                    }
                    if (doctors[0]?.id_photo_uid) {
                        let result = (await db.methods.Documents({ translate, logger, CreateError, lang })
                            .findByUID({ documentUID: doctors[0].id_photo_uid }))?.data?.documents;

                        const minioClient = new Minio.Client({
                            endPoint: 's3.amazonaws.com',
                            port: 443,
                            useSSL: true,
                            accessKey: process.env.S3_ACCESS_KEY,
                            secretKey: process.env.S3_SECRET_ACCESS_KEY,
                        });

                        if (result) {
                            doctors[0].id_photo =
                                await minioClient.presignedUrl(
                                    'GET',
                                    process.env.S3_BUCKET_NAME,
                                    result.url,
                                    24 * 60 * 60 * 7
                                )
                        }
                    }
                    return {
                        msg: translate(lang, 'success'),
                        data: { doctors: doctors }
                    }
                }

            } catch (error) {
                if (error instanceof CreateError) {
                    throw error;
                }
                logger.error(`Failed to find doctors: %s`, error);
                throw new Error(error.message);
            }
        }
    })
}