import mongoose from "mongoose";

const userSchema = new mongoose.Schema({

    username: { type: String, required: function(){ return !this.googleId}},
    email: { type: String, required: true, unique: true },
    password: { type: String, required: function () { return !this.googleId } },
    googleId: { type: String, unique: true, sparse: true },
    role: {
        type: String,
        enum: ['user', 'admin'],
        default: 'user'
    },
    cart: [{
        productId: { type: mongoose.Schema.Types.ObjectId, ref: 'product', required: true },
        quantity: { type: Number, required: true, default: 1, min: 1 }
    }]

}, { timestamps: true });

const userModel = mongoose.model("user", userSchema);

export default userModel;