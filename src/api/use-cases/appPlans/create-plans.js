const fromEntities = require('../../entity');
const stripe = require('../../lib/payment/connection');

exports.createPlans = ({
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
                const { body } = request;

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

                const entity = (
                    await fromEntities.entities.AppPlans.CreatePlan({
                        CreateError,
                        DataValidator,
                        logger,
                        translate,
                        lang,
                        params: {
                            ...body,
                        },
                    }).generate()
                ).data.entity;

                // creating a plan product
                const product_plan = await stripe.products.create({
                    name: entity.plan_name,
                });

                // creating a plan
                let amount = parseInt(body.amount);

                const plan = await stripe.plans.create({
                    nickname: 'Licence fee',
                    amount: amount,
                    currency: body.currency,
                    interval: body.interval,
                    product: product_plan.id,
                    interval_count: body.interval_count,
                });

                const product_price = await stripe.products.create({
                    name: entity.price_name,
                });

                const price = await stripe.prices.create({
                    nickname: 'Traffic(per minute treatment)',
                    tiers: [
                        { unit_amount: body.metered_amount, up_to: 'inf' },
                    ],
                    currency: body.currency,
                    recurring: { interval: body.metered_interval, usage_type: 'metered' },
                    product: product_price.id,
                    tiers_mode: 'graduated',
                    billing_scheme: 'tiered',
                    expand: ['tiers'],
                });

                entity.plan_stripe_id = plan.id;

                entity.price_stripe_id = price.id;
                entity.metered_interval = body.metered_interval;
                entity.metered_amount = body.metered_amount;


                // register  plan
                const plansTable = db.methods.AppPlans({
                    translate,
                    logger,
                    CreateError,
                    lang,
                });

                const plans = (await plansTable.create({ ...entity }))
                    .data.plans;

                return {
                    msg: translate(lang, 'plan_created_success'),
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