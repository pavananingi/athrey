const fromEntity = require('../../entity');

/*
 * @desc Update the practice details
 * @params {object}body - object under request.body
 * @returns {object}practice - updated practice details 
*/
exports.UpdateDoctorPractice = ({
    CreateError,
    DataValidator,
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

                if (userUID === undefined) {
                    throw new CreateError(translate(lang, 'invalid_details'));
                }

                let permission = ac.can(role).updateOwn('practice');

                if (urlParams.userUID) {
                    if (urlParams.userUID !== userUID) {
                        permission = ac.can(role).updateAny('practice');
                    }
                }

                if (role === 'admin' || role === 'superadmin') {
                    permission = ac.can(role).updateAny('practice');
                }

                if (!permission.granted) {
                    throw new CreateError(translate(lang, 'forbidden'), 403)
                }


                // filter body based on the role
                const body = permission.filter(request.body);

                // select ID
                let resourceUID;
                if (urlParams.userUID) {
                    resourceUID = urlParams.userUID;
                } else {
                    resourceUID = userUID;
                }


                const entity = (fromEntity.entities
                    .Doctor
                    .UpdateDoctorPractice({
                        CreateError,
                        DataValidator,
                        logger,
                        translate,
                        lang,
                        params: {
                            ...body
                        }
                    }).generate()).data.entity

                const practiceTable = db.methods.PracticeDetails({ translate, logger, CreateError, lang });

                const updateDoctor = (await practiceTable
                    .updateByUserUID({ userUID: resourceUID, params: entity }));

                const updatedDetails = (await practiceTable
                    .findByUserUID({ userUID: resourceUID }))
                    .data.practice;


                if (updatedDetails === null) {
                    throw new CreateError(translate(lang, 'practice_details_not_found'), 404);
                }

                return {
                    msg: translate(lang, 'success'),
                    data: { practice: updatedDetails }
                }

            } catch (error) {
                if (error instanceof CreateError) {
                    throw error;
                }
                logger.error(`Failed to udpate practice: %s`, error);
                throw new Error(error.message);
            }
        }
    })
}