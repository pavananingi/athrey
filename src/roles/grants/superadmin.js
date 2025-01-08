module.exports.superadmin = {
    profile: {
        // 'create:any': ['*', '!views'],
        'read:any': ['*', '!password',],
        'update:any': ['*', '!password', '!created_at', '!updated_at'],
        // 'delete:any': ['*']
    },
    device: {
        'create:own': ['*'],
        'update:any': [
            'device_name',
            'notification_id'
        ],
        'read:any': ['*'],
        'delete:any': ['*']
    },
    doctor: {
        'create:any': ['*', '!created_at', '!updated_at'],
        'read:any': ['*'],
        'update:any': ['*', '!created_at', '!updated_at'],
        'delete:any': ['*']
    },
    practice: {
        'create:any': ['*'],
        'read:any': ['*'],
        'update:any': ['*'],
        'delete:any': ['*']
    },
    treatmentCategories: {
        'create:any': ['*'],
        'read:any': ['*'],
        'update:any': ['*'],
        'delete:any': ['*']
    },
    treatment: {
        'create:any': ['*'],
        'read:any': ['*'],
        'update:any': ['*'],
        'delete:any': ['*']
    },
    specialization: {
        'create:any': ['*'],
        'read:any': ['*'],
        'update:any': ['*'],
        'delete:any': ['*']
    },
    consultation: {
        'create:any': ['*'],
        'read:any': ['*'],
        'update:any': [
            'status',
            'preferred_schedule',
            'duration',
            'is_valid',
            'preferred_lang'
        ],
        'delete:any': ['*']
    },
    "consultationDoctor": {
        'create:any': ['confirmed_schedule', 'duration'],
        'read:any': ['*'],
        'update:any': ['*'],
        'delete:any': ['*']
    },
    callLog: {
        'create:any': ['*'],
        'read:any': ['*'],
        // 'update:any': ['rating', 'review'],
        'delete:any': ['*']
    },
    doctorLogs: {
        'read:any': ['*'],
    },
    insurance: {
        'create:any': ['*'],
        'read:any': ['*'],
        'update:any': ['*'],
        'delete:any': ['*']
    },
    token: {
        'create:any': ['*'],
    },
    medicalRates: {
        'create:any': ['*'],
        'read:any': ['*'],
        'update:any': ['*'],
        'delete:any': ['*']
    },
    admin: {
        'create:any': ['*'],
        'read:any': ['*'],
        'update:any': ['*'],
        'delete:any': ['*']
    },
    superadmin: {
        'create:any': ['*'],
        'read:any': ['*'],
        'update:any': ['*'],
        'delete:any': ['*']
    }
}