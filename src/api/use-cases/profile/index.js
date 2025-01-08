const fromGetProfile = require('./find');
const fromUpdateProfile = require('./update');

exports.profileUseCases = {
    GetProfile: fromGetProfile.GetProfile,
    UpdateProfile: fromUpdateProfile.UpdateProfile
}
