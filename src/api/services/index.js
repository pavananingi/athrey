const fromFormValidator = require('../services/form-validator.service');
const fromConsultationNotification = require('../services/consultation-notification.service');

exports.Services = {
    DataValidator: fromFormValidator.DataValidator,
    ConsultationNotification: fromConsultationNotification
}