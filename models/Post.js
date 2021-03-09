const { Schema, model } = require("mongoose");

const PostSchema = new Schema(
  {
    title: {
      type: String,
      required: [true, "Please provide post title"],
    },
    description: {
      type: String,
      required: [true, "Please provide post description"],
    },
    body: {
      type: String,
      required: [true, "Please provide post text"],
    },
    author: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    likes: {
      type: Number,
      default: 0,
    },
    isPublished: {
      type: Boolean,
      default: false,
    },
    comments: [
      {
        type: [Schema.Types.ObjectId],
        ref: "Comment",
      },
    ],
  },
  { timestamps: true }
);

module.exports = model("Post", PostSchema);
