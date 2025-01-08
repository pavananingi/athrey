const grants = {
    superadmin: {
        video: {
            'create:any': ['*'],
            'read:any': ['*'],
            'update:any': ['*'],
            'delete:any': ['*']
        }
    },
    admin: {
        video: {
            'create:own': ['*'],
            'read:any': ['*'],
            'update:own': ['*'],
            'delete:own': ['*']
        }
    },
    doctor: {
        patient: {
            'read:any': ['*'],
            'update:own': ['*']
        }
    },
    patient: {
        profile: {
            'read:own': ['*'],
            'update:own': ['*']
        }
    }
};

module.exports = { grants };
