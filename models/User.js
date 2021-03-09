const { Schema, model } = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const UserSchema = new Schema(
  {
    username: {
      type: String,
      required: [true, "Please provide username"],
    },
    email: {
      type: String,
      required: [true, "Please provide email"],
      unique: [true, "Email already exists"],
      match: [
        /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
        "Please provide a valid email",
      ],
    },
    password: {
      type: String,
      required: [true, "Please add password"],
      match: [
        /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$.!%*#?&])[A-Za-z\d@$.!%*#?&]{8,}$/,
        "Password must be minimum 8 characters long at least one letter one number and one special character",
      ],
      select: false,
    },
    likes: {
      type: [Schema.Types.ObjectId],
      ref: "Post",
    },

    bookmarks: [
      {
        type: [Schema.Types.ObjectId],
        ref: "Post",
      },
    ],

    avatar: {
      type: String,
    },
  },
  { timestamps: true }
);

UserSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    next();
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

UserSchema.methods.getSignedJwtToken = async function () {
  return jwt.sign({ id: this._id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES,
  });
};

UserSchema.methods.matchPassword = async function (password) {
  return await bcrypt.compare(password, this.password);
};

module.exports = model("User", UserSchema);
