Accounts.validateLoginAttempt(function (attempt) {
    console.log(attempt.user);
    if (!_.isEqual(attempt.user.profile.status, "active")) {
        attempt.allowed = false;
        throw new Meteor.Error(403, "Аккаунт заблокирован.");
    }
    return true;
});