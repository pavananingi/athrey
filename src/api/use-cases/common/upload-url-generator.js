
/*
 * @desc Generates the urls for the requested files
 * @returns [object]urls - urls 
 * @returns [object]headers - headers to include 
*/
exports.GenerateUploadUrls = ({
    CreateError,
    logger,
    translate,
    request,
    storage
}) => {
    return Object.freeze({
        execute: async () => {
            try {
                const lang = request.lang;
                const userUID = request.locals.uid;
                const role = request.locals.role;
                const queryParams = request.queryParams;
                let body = request.body;

                if (userUID === undefined) {
                    throw new CreateError(translate(lang, 'invalid_details'));
                }


                if (Object.keys(body).length > 10) {
                    throw new CreateError(translate(lang, 'upload_limit'), 401);
                }

                const type = request.queryParams.type;
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


                for await (const f of Object.keys(body)) {
                    const fileProperty = body[f];

                    if (!fileProperty.hasOwnProperty('type') || !fileProperty.type) {
                        throw new CreateError(translate(lang, 'required_file_type'), 401);
                    }

                    if (!fileProperty.hasOwnProperty('name') || !fileProperty.name) {
                        throw new CreateError(translate(lang, 'required_file_name'), 401);
                    }

                    const urls = storage.methods
                        .GenerateUploadURL({
                            lang,
                            CreateError,
                            translate,
                            logger,
                            type: type,
                            userUID: userUID,
                            fileName: fileProperty.name,
                            isAppointment: isAppointment
                        }).data

                    body[f].headers = urls.headers;
                    body[f].url = urls.url;
                    const parsedURL = new URL(urls.url);
                    body[f].path = `${parsedURL.origin}${parsedURL.pathname}`;
                }

                return {
                    msg: translate(lang, 'success'),
                    data: {
                        type,
                        urls: { ...body }
                    }
                }

            } catch (error) {
                if (error instanceof CreateError) {
                    throw error;
                }
                logger.error(`Failed to generate urls: %s`, error);
                throw new Error(error.message);
            }
        }
    })
}