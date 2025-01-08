const fromEntities = require('../../entity');
const stripe = require('../../lib/payment/connection');


exports.deletePlan = ({
    CreateError,
    DataValidator,
    logger,
    translate,
    request,
    db,
}) => {
    return Object.freeze({
        execute: async () => {
            try {
                const lang = request.locals.lang;
                const { plan_id } = request.urlParams;

                // const userUID = request.locals.uid;
                // const role = request.locals.role;
                // const queryParams = request.queryParams;

                // if (userUID === undefined) {
                //     throw new CreateError(translate(lang, 'invalid_details'));
                // }
                // let permission = ac.can(role).createOwn('appPlans');

                // if (role !== 'admin' || role !== 'superadmin') {
                //     permission = ac.can(role).createAny('consultationDoctor');
                // }

                // if (!permission.granted) {
                //     throw new CreateError(translate(lang, 'forbidden'), 403)
                // }

                const plansTable = db.methods.AppPlans({ translate, logger, CreateError, lang });

                const plan = (await plansTable
                    .findByPlanId({ plan_id }))
                    .data.plans;

                if (!plan) {
                    return {
                        msg: translate(lang, 'plan_deleted_success'),
                        data: {}
                    }
                }
                let planStripeData;

                try {
                    planStripeData = await stripe.plans.retrieve(
                        plan.plan_stripe_id
                    );

                    // delete plan
                    await stripe.plans.del(
                        plan.plan_stripe_id
                    );

                    // delete price
                    await stripe.plans.del(
                        plan.price_stripe_id
                    );

                    // product delete
                    await stripe.products.del(
                        planStripeData?.product
                    );

                } catch (error) {
                    console.log("Plan not found: ", plan.plan_stripe_id)
                }


                // delete from database
                (await plansTable
                    .deleteByPlanId({ plan_id }));

                return {
                    msg: translate(lang, 'plan_deleted_success'),
                    data: {}
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