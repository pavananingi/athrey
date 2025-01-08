const fromPayment = require('./connection');

module.exports = ({ translate, logger, CreateError, lang = 'de' }) => {
    const stripeCon = fromPayment;

    const invoiceCustomFields = [
        {
            name: "USt-IdNr.",
            value: "DE298117549"
        },
        {
            name: "Steuernummer",
            value: "124/122/11640"
        }
    ]


    return Object.freeze({
        createCustomer: async (user) => {
            try {
                if (user.customer_id) {
                    if (user.customer_id !== null || user.customer_id !== '') {
                        const customer = await stripeCon.customers
                            .retrieve(user.customer_id)
                            .then(customer => {
                                return {
                                    data: { customer },
                                    error: false,
                                    msg: translate(lang, 'customer_registered')
                                };
                            }).catch(err => {
                                console.log("wrong customer stripe id!")
                            });
                    }
                }

                const customerName = `${user.salute} ${user.firstname} ${user.lastname}`;

                const createCustomer = await stripeCon
                    .customers
                    .create({
                        name: customerName,
                        email: user.email,
                        phone: user.phone,
                        preferred_locales: ['de'],
                        address: {
                            line1: user.address_line_1,
                            line2: user.address_line_2,
                            city: user.city,
                            country: user.country,
                            state: user.state,
                            postal_code: user.pincode
                        },
                        shipping: {
                            name: customerName,
                            address: {
                                line1: user.address_line_1,
                                line2: user.address_line_2,
                                city: user.city,
                                country: user.country,
                                state: user.state,
                                postal_code: user.pincode
                            }
                        },
                        invoice_settings: {
                            custom_fields: invoiceCustomFields,
                        },
                        preferred_locales: ['de'],
                        metadata: { uid: user.uid }
                    });

                return {
                    msg: translate(lang, 'customer_registered_success'),
                    data: { customer: createCustomer },
                };

            } catch (error) {
                if (error instanceof CreateError) {
                    throw error;
                }
                logger.error('Failed to register customer deatils with payment gateway %s', error);
                throw new Error(translate(lang, 'error_unknown'));
            }
        },
        findCusById: async ({ customerId = '' }) => {
            try {
                if (customerId === null || customerId === 'NA' || customerId === '') {
                    // throw new Error('Invalid customer-id');
                    return {
                        data: { customer: null },
                        msg: translate(lang, 'customer_id_invalid')
                    }
                }

                const customer = await stripeCon.customers
                    .retrieve(customerId, {
                        expand: ['subscription', 'default_source'],
                    });

                return {
                    data: { customer },
                    msg: 'success'
                };

            } catch (error) {
                if (error instanceof CreateError) {
                    throw error;
                }
                logger.error('Failed to retrive customer deatils with payment gateway %s', error);
                throw new Error(translate(lang, 'error_unknown'));
            }
        },
        attachSourceById: () => 'Method not implemented',
        changeDefaultPaymentById: () => 'Method not implemented',
        registerOrg: () => 'Method not implemented',
        updateCustomer: () => 'Method not implemented',
        deleteCustomer: () => 'Method not implemented'
    });

}