const mongoose = require("mongoose");
const crypto = require("crypto");
const uuidv1 = require("uuid/v1");

const { Schema } = mongoose;

//schema of user
const userSchema = new Schema(
  {
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
    salt: String,
    role: {
      type: Number,
      default: 0,
    },
    purchases: {
      type: Array,
      default: [],
    },
  },
  { timestamps: true }
);

//virtual fields
userSchema
  .virtual("password")
  .set(function (password) {
    this._password = password;
    this.salt = uuidv1();
    this.encrypPassword = this.securePassword(password);
  })
  .get(function () {
    return this._password;
  });

//schema method
userSchema.methods = {
  //authentication method
  authenticate: function (plainPassword) {
    return this.securePassword(plainPassword) === this.encrypPassword;
  },

  //create hash of the password
  securePassword: function (plainPassword) {
    if (!plainPassword) {
      return "";
    }
    try {
      return crypto
        .createHmac("sha256", this.salt)
        .update(plainPassword)
        .digest("hex");
    } catch (error) {
      return "";
    }
  },
};

//export model
module.exports = mongoose.model("User", userSchema);
