const mongoose = require('mongoose');
const passportLocalMongoose = require('passport-local-mongoose');

const UserSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    firstname: { type: String, required: true},
    lastname: { type: String, require: true},
    phonenumber:{ type: Number, required: true},
    profilePicture:{ type: String, requires: true},
    email: { 
        type: String, 
        required: true, 
        unique: true, 
        match: /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/
    },
    password:{ type: String, required: true },
    resetPasswordToken: String,
    resetPasswordExpires: {
        type: Date
    }
    
});
module.exports = mongoose.model('User', UserSchema);
