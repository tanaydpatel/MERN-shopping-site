import mongoose from "mongoose";
import crypto from "crypto";
import { v4 as uuidv4 } from "uuid";

const { Schema } = mongoose;

//schema of user
const userSchema = new Schema({
  name: {
    type: String,
    required: true,
    trim: true,
    maxlength: 32,
  },
  lastName: {
    type: String,
    trim: true,
    maxlength: 32,
  },
  email: {
    type: String,
    required: true,
    trim: true,
    unique: true,
  },
  userInfo: {
    type: String,
    trim: true,
  },
  encrypPassword: {
    type: String,
    required: true,
  },
  salt: srting,
  role: {
    type: Number,
    default: 0,
  },
  purchases: {
    type: Array,
    default: [],
  },
});

//virtual fields
userSchema
  .virtual("password")
  .set(function (password) {
    this._password = password;
    this.salt = uuidv4();
    this.encrypPassword = securePassword(password);
  })
  .get(function () {
    return this._password;
  });

//schema method
userSchema.method = {
  //authentication method
  authenticate: function (plainpassword) {
    return this.securePassword(plainpassword) === this.encry_password;
  },

  //create hash of the password
  securePassword: function (plainPassword) {
    if (!plainPassword) {
      return "";
    }
    try {
      return crypto
        .createHmac("sha256", this.salt)
        .update("I loVe cupcakes")
        .digest("hex");
    } catch (error) {
      return "";
    }
  },
};

//export model
module.exports = mongoose.model("User", userSchema);
