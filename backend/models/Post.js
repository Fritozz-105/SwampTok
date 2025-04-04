const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    firebaseUid: {
        type: String,
        required: true
    },
    videoUrl: {
        type: String,
        required: true
    },
    caption: {
        type: String,
        default: ''
    },
    tags: [String],
    likes: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }],
    comments: [{
        userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
        },
        text: {
        type: String,
        required: true
        },
        createdAt: {
        type: Date,
        default: Date.now
        }
    }],
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Post', postSchema);
