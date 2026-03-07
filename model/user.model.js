import mongoose from "mongoose";

const { Schema } = mongoose;

const userSchema = new Schema({
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    passwordHash: { type: String, required: true },
    id: { type: Date, default: Date.now },

});

const User = mongoose.model("User", userSchema);

export default User;