import mongoose from "mongoose";

const wordpressCredentialsSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User'},
    wordpress_username: { type: String },
    wordpress_password: { type: String },
    isAuthenticate: {type: Boolean, default: false}
}, {timestamps: true})

const WordpressCredentials = mongoose.model("WordpressCredentials", wordpressCredentialsSchema)

export default WordpressCredentials;