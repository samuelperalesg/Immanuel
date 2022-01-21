const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const postSchema = new Schema({
    title: String,
    link: String,
    scripture: String,
    description: String,
    createdBy: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    }
}, { timestamps: true });

module.exports = mongoose.model('Post', postSchema);

