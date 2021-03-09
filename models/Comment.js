const { Schema, model } = require("mongoose");

const CommentSchema = new Schema(
  {
    body: {
      type: String,
      required: [true, "Please provide comment text"],
    },
    author: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    post: {
      type: Schema.Types.ObjectId,
      ref: "Post",
    },
  },
  { timestamps: true }
);

module.exports = model("Comment", CommentSchema);
