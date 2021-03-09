exports.resolvers = {
  Query: {
    getAllPosts: async (root, args, { Post }) => {
      const posts = await Post.find()
        .sort({ createdAt: "desc" })
        .populate("author");

      return posts;
    },
    getPost: async (root, { _id }, { Post }) => {
      const post = await Post.findById(_id)
        .populate("author")
        .populate({ path: "comments", populate: { path: "author" } });

      return post;
    },
    getCurrentUser: async (root, args, { currentUser, User }) => {
      const user = await User.findById(currentUser._id).populate(
        "bookmarks",
        "_id title"
      );
      return user;
    },
  },
  Mutation: {
    addPost: async (
      root,
      { title, body, description, isPublished },
      { Post, currentUser }
    ) => {
      let newPost = await new Post({
        title,
        body,
        description,
        isPublished,
        author: currentUser._id,
      }).save();

      newPost = await newPost.populate("author").execPopulate();
      return newPost;
    },

    likePost: async (root, { _id }, { Post, User, currentUser }) => {
      const post = await Post.findOneAndUpdate({ _id }, { $inc: { likes: 1 } });
      await User.findOneAndUpdate(
        { _id: currentUser._id },
        { $addToSet: { likes: _id } }
      );
      return post;
    },
    unlikePost: async (root, { _id }, { Post, User, currentUser }) => {
      const post = await Post.findOneAndUpdate(
        { _id },
        { $inc: { likes: -1 } }
      );
      await User.findOneAndUpdate(
        { _id: currentUser._id },
        { $pull: { likes: _id } }
      );
      return post;
    },
    bookmarkPost: async (root, { _id }, { Post, User, currentUser }) => {
      const post = await Post.findById(_id);
      await User.findOneAndUpdate(
        { _id: currentUser._id },
        { $addToSet: { bookmarks: { _id } } }
      );
      return post;
    },
    unbookmarkPost: async (root, { _id }, { Post, User, currentUser }) => {
      const post = await Post.findById(_id);
      await User.findOneAndUpdate(
        { _id: currentUser._id },
        { $pull: { bookmarks: _id } }
      );
      return post;
    },
    addComment: async (
      root,
      { body, post },
      { Comment, Post, currentUser }
    ) => {
      let newComment = await new Comment({
        body,
        post,
        author: currentUser._id,
      }).save();
      const postObj = await Post.findByIdAndUpdate(post, {
        $push: { comments: newComment._id },
      });
      newComment = await newComment.populate("author").execPopulate();

      return newComment;
    },

    signUpUser: async (root, { username, email, password }, { User }) => {
      const newUser = await new User({ username, email, password }).save();
      const token = await newUser.getSignedJwtToken();
      return { token };
    },
    signInUser: async (root, { email, password }, { User }) => {
      const user = await User.findOne({ email }).select("+password");
      if (!user) throw new Error("Incorrect email or password");

      const match = await user.matchPassword(password);
      if (!match) throw new Error("Incorrect email or password");

      const token = await user.getSignedJwtToken();
      return { token };
    },
    updateAvatar: async (root, args, context) => {
      console.log(args);
      return "fhdfhkdskjfhds";
    },
  },
};
