const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const movieSchema = new Schema ({
    title: {
        type: String,
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
    description: {
        type: String,
        required: true
    },
    note: {
        type: String,
        required: false
    },
    imageUrl: {
        type: String,
        required: false
    },
    owner: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    type: { type: String, default: 'Movie' }
}, {
    timestamps: true,
});

module.exports = mongoose.model('Movie', movieSchema);