var bcrypt = require('bcrypt');

module.exports.cryptPassword = function (password, progress, callback) {
    bcrypt.genSalt(10, function (err, salt) {
        if (err)
            return callback(err);

        bcrypt.hash(password, salt, progress, function (err, hash) {
            return callback(err, hash, password);
        });


    });
};

module.exports.comparePassword = function (password, userPassword, callback) {
    bcrypt.compare(password, userPassword, function (err, isPasswordMatch) {
        if (err)
            return callback(err);
        return callback(null, isPasswordMatch);
    });
};