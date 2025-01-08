module.exports = ({
    CreateError,
    DataValidator,
    logger,
    translate,
    lang,
    params = {
        confirmed_schedule,
        duration,
        notes,
        status,
        leave_letter,
        prescription,
        diagnosis,
        rating,
        review,
        manual_invoice
    }
}) => {
    return Object.freeze({
        async generate() {
            try {
                const validate = DataValidator({ CreateError, lang, translate });

                let entity = {
                    confirmed_schedule: null,
                    duration: null,
                    notes: null,
                    status: null,
                    leave_letter: null,
                    prescription: null,
                    diagnosis: {
                        diagnosis: null,
                        history: null,
                        findings: null,
                        therapy: null,
                    },
                    rating: null,
                    review: null,
                    manual_invoice: null
                }

                if (params.confirmed_schedule) {
                    entity.confirmed_schedule = validate.timestamp(params.confirmed_schedule).data.value;
                } else {
                    delete entity.confirmed_schedule;
                }

                if (params.duration) {
                    entity.duration = validate.duration(params.duration).data.value;
                } else {
                    delete entity.duration;
                }

                if (params.notes) {
                    entity.notes = validate.toString(params.notes).data.value;
                } else {
                    delete entity.notes;
                }

                if (params.status) {
                    entity.status = validate.consultationStatus(params.status).data.value;
                } else {
                    delete entity.status;
                }

                if (params.leave_letter) {
                    entity.leave_letter = params.leave_letter;
                } else {
                    delete entity.leave_letter;
                }

                if (params.prescription) {
                    entity.prescription = {
                        medicines: []
                    }

                    const medicines = params.prescription.medicines;
                    if (!medicines) {
                        throw new CreateError(translate(lang, 'required_medicines', 422))
                    }

                    for (let i = 0; i < medicines.length; i++) {
                        await validate.medicine(medicines[i])
                            .then(r => {
                                if (r.name && r.intake) {
                                    entity.prescription.medicines.push(r)
                                }
                            })
                            .catch(error => {
                                throw new CreateError(error)
                            })
                    }
                } else {
                    delete entity.prescription;
                }

                if (params.diagnosis) {
                    // diagnosis
                    const diagnosisArray = validate.diagnosisDataType(params.diagnosis.diagnosis).data.value;
                    entity.diagnosis.diagnosis = [];
                    for (let i = 0; i < diagnosisArray.length; i++) {
                        await validate.diagnosis(params.diagnosis.diagnosis[i])
                            .then(r => entity.diagnosis.diagnosis.push(r))
                            .catch(error => {
                                throw new CreateError(error)
                            })
                    }

                    // history
                    if (params.diagnosis.history) {
                        entity.diagnosis.history = validate.toString(params.diagnosis.history).data.value;
                    } else {
                        entity.diagnosis.history = null;
                    }

                    // findings
                    if (params.diagnosis.findings) {
                        entity.diagnosis.findings = validate.toString(params.diagnosis.findings).data.value;
                    } else {
                        entity.diagnosis.findings = null;
                    }

                    // therapy
                    if (params.diagnosis.therapy) {
                        entity.diagnosis.therapy = validate.toString(params.diagnosis.therapy).data.value;
                    } else {
                        entity.diagnosis.therapy = null;
                    }

                } else {
                    delete entity.diagnosis;
                }

                if (params.rating) {
                    entity.rating = validate.toString(params.rating).data.value;
                } else {
                    delete entity.rating;
                }

                if (params.review) {
                    entity.review = validate.toString(params.review).data.value;
                } else {
                    delete entity.review;
                }
                if (params.manual_invoice) {
                    entity.manual_invoice = params.manual_invoice;
                } else {
                    delete entity.manual_invoice;
                }

                return {
                    msg: 'success',
                    data: { entity }
                }

            } catch (error) {
                logger.error('Failed to create update consultation doctor report entity: %s', error);
                if (error instanceof CreateError) {
                    throw error;
                }
                throw new Error(translate(lang, 'error_unknown'))
            }
        }
    })
}
