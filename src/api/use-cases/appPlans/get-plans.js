const fromEntities = require('../../entity');

exports.getPlans = ({
    CreateError,
    DataValidator,
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
                const userUID = request.locals.uid;
                const role = request.locals.role;
                const urlParams = request.urlParams;

                if (userUID === undefined) {
                    throw new CreateError(translate(lang, 'invalid_details'));
                }

                let permission = ac.can(role).readOwn('plans');

                if (urlParams.userUID) {
                    if (urlParams.userUID !== userUID) {
                        permission = ac.can(role).readAny('plans');
                    }
                }

                if (!permission.granted) {
                    throw new CreateError(translate(lang, 'forbidden'), 403)
                }

                const plansTable = db.methods.AppPlans({ translate, logger, CreateError, lang });

                const plans = (await plansTable
                    .findAll())
                    .data.plans;

                return {
                    msg: translate(lang, 'plan_gets_success'),
                    data: { plans }
                }
            } catch (error) {
                if (error instanceof CreateError) {
                    throw error;
                }
                logger.error(`Failed to create plan: %s`, error);
                throw new Error(error.message);
            }
        }
    })
}