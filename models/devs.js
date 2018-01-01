const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const DevsSchema = new Schema({
    owner: { type: Schema.Types.ObjectId, ref: 'User'},
    title: String,
    category: String,
    about: String,
    price: Number,
    state: String,
    region: String,
    busstop: String,
    picture: { type: String, required: true },
    created: { type: Date, deafault: Date.now }
});

module.exports = mongoose.model('Devs', DevsSchema);