/* globals require module */

const mongoose = require('mongoose'),
    commentSchema = require('./comment-model').commentSchema,
    Schema = mongoose.Schema;

let newsEntrySchema = new Schema({
    title: {
        type: String,
        required: true,
        minlength: 5,
        maxlength: 100
    },
    description: {
        type: String,
        required: true,
        maxlength: 1000
    },
    author: {
        type: String,
        required: true,
        maxlength: 30
    },
    imageUrl: {
        type: String,
        required: true
    },
    content: {
        type: String,
        required: true,
        minlength: 5,
        maxlength: 5000
    },
    tags: {
        type: [String]
    },
    isDeleted: {
        type: Boolean,
        default: false
    },
    createdOn: {
        type: Date,
        default: new Date
    },
    comments: {
        type: [commentSchema]
    },
    likes: {
        type: [String]
    }
});

mongoose.model('news-entry', newsEntrySchema);
let NewsEntry = mongoose.model('news-entry');

module.exports.NewsEntry = NewsEntry;