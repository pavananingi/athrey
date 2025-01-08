const { mailer } = require("../../lib/mailer");

exports.UpdateDoctorStatus = ({
    CreateError,
    logger,
    translate,
    request,
    db,
    ac,
    crypto
}) => {
    return Object.freeze({
        execute: async () => {
            try {
                const lang = request.lang;
                const role = request.locals.role;
                const urlParams = request.urlParams;
                const queryParams = request.queryParams;
                const userUID = urlParams.doctorUID;

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

                if (queryParams?.status == "declined") {

                    await userTable.updateStatusByUID(
                        {
                            uid: userUID,
                            status: "declined"
                        })

                } else {
                    await userTable.updateStatusByUID(
                        {
                            uid: userUID,
                            status: "approved"
                        })

                    let user = (
                        await userTable.findByUID(
                            {
                                uid: userUID,
                            })
                    )?.data?.users

                    const token = crypto.b64.encode(`${user.email}  ${new Date().getTime() + 2 * 24 * 60 * 60 * 1000}`).data.value;

                    mailer.methods
                        .Send({ CreateError, translate, logger, lang })
                        .generateDoctorPassword({
                            to: user.email,
                            firstname: user.firstname,
                            lastname: user.lastname,
                            link: "https://athrey-wdev.edalytics.com/auth/generate-password/" + token,
                        });
                }

                return {
                    msg: translate(lang, 'success'),
                    data: {}
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