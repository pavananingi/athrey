module.exports = async ({
    CreateError,
    logger,
    translate,
    lang,
    db,
    payment,
    user
}) => {
    try {

        const customerMethods = payment.methods.Customer({ translate, logger, CreateError, lang });
        const createCustomer = (await customerMethods.createCustomer(user)).data.customer;

        const usersTable = db.methods.User({ translate, logger, CreateError, lang });
        const patientDetails = await usersTable.updateByUID({
            uid: user.uid, params: {
                customer_id: createCustomer.id
            }
        });

        return {
            data: { customer: createCustomer },
            msg: 'success'
        };

    } catch (error) {
        if (error instanceof CreateError) {
            throw error;
        }
        logger.error('Failed create customer in the payment gateway %s', error);
        throw new Error(translate(lang, 'error_unknown'));
    }
}