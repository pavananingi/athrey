const fromPayment = require('./connection');

/* If tax rate change in future then
plz make changes in current plan too(in amount)*/

module.exports = ({ translate, logger, CreateError, lang = 'de' }) => {
    const stripeCon = fromPayment;

    return Object.freeze({
        verifyCard: async (cardDetails) => {
            try {
                const cardMethod = await stripeCon.sources.create({
                    type: 'card',
                    card: {
                        number: cardDetails.card_number,
                        exp_month: cardDetails.exp_month,
                        exp_year: cardDetails.exp_year,
                        cvc: cardDetails.secret_num,
                    }
                });
                return { error: false, msg: '', data: '' };
            } catch (error) {
                return { error: true, msg: error.message, data: error };
            }
        },
        verifyIban: async (ibanDetails) => {
            try {
                const ibanSource = await stripeCon.sources.create({
                    type: 'sepa_debit',
                    owner: {
                      name: 'verify',
                      address: {
                        line1: 'verify',
                        city: 'verify',
                        // country: userDetails.user_country, // Alpha numeric country code
                        postal_code: 'verify'
                      },
                      email: 'verify@careberri.com',
                    },
                    currency: "eur",
                    sepa_debit: {
                      iban: ibanDetails.iban
                    }
                  });
                  return { error: false, msg: '', data: '' };
            } catch (error) {
                return { error: true, msg: error.message, data: error };
            }
        }
    });
}