const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const skillSchema = new Schema({
    title: {type: String, required: true},
    about: {type: String, required: true},
    stateofoperation: {type: String, required: true},
    localgovernment: { type: String, required: true},
    nearestlandMark: {type: String, required: true},
    phoneNumber: {type: Number, required: true},
    email: {
            type: String,
            unique: true,
            match: /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/
        },

    skillImage: { type: String, required: true},
    owner: { type: Schema.Types.ObjectId, ref: 'User'}
});

module.exports = mongoose.model('Skill', skillSchema);
