module.exports = async ({
    CreateError,
    logger,
    translate,
    lang,
    db,
    payment,
    paymentMethodDetails,
    user
}) => {
    try {
        // creating payment method
        const paymentMethods = payment.methods.PaymentMethod({ translate, logger, CreateError, lang });

        const paymentDetails = (await paymentMethods.createAndAttachSources({ paymentMethodDetails, user })).data.details;

        const paymentMethodObj = {
            user_uid: user.uid,
            method_stripe_id: paymentDetails.id,
            cus_id: paymentMethodDetails.customer_id,
            method: paymentDetails.type === 'sepa_debit' ? 'IBAN' : 'OTHER',
            iban: paymentMethodDetails.iban,
            last_digits: paymentDetails.sepa_debit.last4,
            bankcode: paymentDetails.sepa_debit.bank_code,
            branchcode: paymentDetails.sepa_debit.branch_code,
            country: paymentDetails.sepa_debit.country,
            fingerprint: paymentDetails.sepa_debit.fingerprint,
            firstname: paymentMethodDetails.firstname,
            lastname: paymentMethodDetails.lastname,
            address: `${user.address_line_1} ${user.address_line_2}`,
            postal: user.postal_code,
            city: user.city,
            status: 'proccessing'
        }

        // table
        const methodTable = db.methods.PaymentMethods({ translate, logger, CreateError, lang });

        // find or update
        const findPaymentMethodCus = (await methodTable
            .findByUserUID({ user_uid: user.uid }))
            .data.methods;

        if (findPaymentMethodCus === null) {
            const createCustomerPaymentMethod = (await methodTable
                .create({ ...paymentMethodObj }))
                .data.methods;
        } else {
            const updatePaymentMethod = (await methodTable
                .updateByUserUID({ user_uid: user.uid, params: paymentMethodObj }))
                .data.methods;
        }

        return {
            data: { paymentDetails: paymentDetails },
            msg: 'success'
        };

    } catch (error) {
        if (error instanceof CreateError) {
            throw error;
        }
        logger.error('Failed create pay method in the payment gateway %s', error);
        throw new Error(translate(lang, 'error_unknown'));
    }
}