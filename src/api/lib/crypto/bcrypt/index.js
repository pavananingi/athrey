const bcrypt = require('bcrypt');
const CONFIG = require('../../../../config/app.config.json');

exports.PasswordHash = ({ password, CreateError, translate, logger }) => {
    // return hashed password
    salt = CONFIG.password.salt;
    return Object.freeze({
        hashPassword: async () => {
            try {
                const hashedPassword = await bcrypt.hash(password, salt);
                return {
                    msg: `Hashed`,
                    data: {
                        hashedPassword: hashedPassword
                    }
                };
            } catch (error) {
                logger.error('Failed to hash password: %s', error);
                throw new CreateError(error.message)
            }

        },
        validatePassword: async (passwordHash) => {
            // return true/false
            try {
                const passwordValid = await bcrypt.compare(password, passwordHash);
                return {
                    msg: `Valid`,
                    data: {
                        valid: passwordValid
                    }
                };
            } catch (error) {
                logger.error('Failed to validate password: %s', error);
                throw new CreateError(error.message)
            }

        }
    })
}