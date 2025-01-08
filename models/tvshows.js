const mongoose = require('mongoose');
const Schema = mongoose.Schema;



const showSchema = new Schema ({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    note: {
        type: String,
        required: false
    },
    seasons: {
        type: Number,
        required: true
    },
    episodes: {
        type: Number,
        required: true
    },
    genre: {
        type: String,
        required: true
    },
    year: {
        type: Number,
        required: true
    },
    rating: {
        type: Number,
        required: true
    },
    imageUrl: {
        type: String,
        required: false
    },
    owner: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    type: { type: String, default: 'Show' }
}, {
    timestamps: true,
});




module.exports = mongoose.model('Show', showSchema);