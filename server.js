require("dotenv").config();
const path = require("path");
const express = require("express");
const fileUpload = require("express-fileupload");
const { ApolloServer } = require("apollo-server-express");
const jwt = require("jsonwebtoken");
const cors = require("cors");

const connectDB = require("./dbConnect");
const { typeDefs } = require("./schema");
const { resolvers } = require("./resolvers");
const User = require("./models/User");
const Post = require("./models/Post");
const Comment = require("./models/Comment");

const app = express();

app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  })
);
app.use("/public", express.static(path.join(__dirname, "public")));
app.use(fileUpload());
app.use("/upload", async (req, res, next) => {
  const file = req.files.upload;
  const path = "/public/images/" + file.name;
  try {
    await file.mv(`.${path}`);
    res.json({ url: `http://localhost:4000${path}` });
  } catch (error) {
    console.error(error);
  }
  // next();
});
const server = new ApolloServer({
  typeDefs,
  resolvers,
  formatError: (err) => {
    let error = { ...err };
    error.message = err.message;
    // Mongoose bad ObjectId
    if (error.extensions.exception.name === "CastError") {
      error.message = "Resource not found";
    }

    // Mongoose duplicate key
    if (error.extensions.exception.code === 11000) {
      const key = Object.keys(
        err.extensions.exception.keyPattern
      )[0].toLowerCase();
      error.message = `${key} already exists`;
    }

    // Mongoose validation error
    if (error.extensions.exception.name === "ValidationError") {
      error.message = Object.values(err.errors).map((val) => val.message);
    }
    return error;
  },
  context: async ({ req }) => {
    const token = req.headers["authorization"];
    let currentUser = {};
    if (token !== "null") {
      const decoded = await jwt.verify(token, process.env.JWT_SECRET);
      currentUser = await User.findById(decoded.id);
    }
    return {
      User,
      Post,
      Comment,
      currentUser,
    };
  },
});
server.applyMiddleware({
  app,
  path: "/graphql",
  cors: { origin: "http://localhost:3000", credentials: true },
});

const PORT = process.env.PORT || 4000;

const start = async () => {
  try {
    await connectDB();
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  } catch (err) {
    console.log("START: ", err.message);
  }
};

start();
