module.exports.doctor = {
    profile: {
        // 'create:any': ['*', '!views'],
        'read:own': [
            '*',
            '!password',
            '!invalid_attempts',
            '!force_reset_password'
        ],
        'read:own': [
            '*',
            '!password',
            '!invalid_attempts',
            '!force_reset_password'
        ],
        'update:own': [
            'salute',
            'title',
            'avatar_url',
            'address',
            'address_line_1',
            'address_line_2',
            'city',
            'dob',
            'postal_code',
            'country',
            'state',
            'lanugage',
            'first_login',
            'fax',
            'phone',
            'telephone'
        ],
        // 'delete:any': ['*']
    },
    device: {
        'create:own': ['*'],
        'update:own': [
            'device_name',
            'notification_id'
        ],
        'read:own': ['*'],
        'delete:own': ['*']
    },
    doctor: {
        'create:own': [
            'specialization',
            'biography',
            'qualification',
            'experience',
            'lanr',
            'bsnr',
            'id_front_uid',
            'id_back_uid',
            'id_photo_uid'
        ],
        'read:own': ['*'],
        'update:own': [
            'specialization',
            'biography',
            'qualification',
            'experience',
            'lanr',
            'bsnr',
            'id_front_uid',
            'id_back_uid',
            'id_photo_uid'
        ],
    },
    practice: {
        'create:own': ['*'],
        'read:own': ['*'],
        'update:own': ['*'],
        'delete:own': ['*']
    },
    bank: {
        'read:own': [
            'account_institution_name',
            'account_holder_name',
            'account_iban',
            'account_bic'
        ],
        'update:own': [
            'account_institution_name',
            'account_holder_name',
            'account_iban',
            'account_bic'
        ],
    },
    treatmentCategories: {
        'read:any': ['*'],
    },
    treatment: {
        'read:any': ['*'],
    },
    specialization: {
        'read:any': ['*'],
    },
    consultation: {
        // 'create:own': ['*'],
        'read:any': ['*'],
        'update:own': ['status', 'new_schedule', 'duration'],
        // 'delete:own': ['*']
    },
    consultationDoctor: {
        'create:own': ['confirmed_schedule', 'duration'],
        'read:own': ['*'],
        'update:own': ['*'],
        // 'delete:own': ['*']
    },
    documents: {
        'create:own': ['*'],
        'read:any': ['*'],
        // 'update:own': ['*'],
        // 'delete:own': ['*']
    },
    callLog: {
        'create:own': ['*'],
        'read:own': ['*'],
        'update:own': ['rating', 'review'],
        // 'delete:own': ['*']
    },
    medicalRates: {
        // 'create:own': ['*'],
        'read:any': ['*'],
        // 'update:own': ['*'],
        // 'delete:own': ['*']
    },
    plans: {
        'read:own': ['*'],
    },
    paymentIntent: {
        'create:own': ['*'],
    }
}
