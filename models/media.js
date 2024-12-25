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
        type: Date,
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
        ref: 'user'
    }
}, {
    timestamps: true
});

const showSchema = new Schema ({
    title: {
        type: String,
        required: true
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
        type: Date,
        required: true
    },
    owner: {
        type: Schema.Types.ObjectId,
        ref: 'user'
    }
}, {
    timestamps: true
});

const seriesSchema = new Schema ({
    title: {
        type: String,
        required: true
    },
    genre: {
        type: String,
        required: true
    },
    year: {
        type: Date,
        required: true
    },
    completed: {
        type: Boolean
    },
    movies: [{
        type: Schema.Types.ObjectId, 
        ref: 'Movie'
    }],
    owner: {
        type: Schema.Types.ObjectId,
        ref: 'user'
    }
}, {
    timestamps: true
});

const mediaSchema = new Schema ({
    contentType: {
        type: String,
        enum: ['movie', 'show', 'series'],
        required: true
    },
    owner: {
        type: Schema.Types.ObjectId,
        ref: 'user'
    },
    movie: movieSchema,
    show: showSchema,
    series: seriesSchema,
});


module.exports = mongoose.model('Media', mediaSchema);