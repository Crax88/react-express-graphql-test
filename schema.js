const { gql } = require("apollo-server-express");

exports.typeDefs = gql`
  type User {
    _id: ID
    username: String!
    email: String!
    password: String!
    avatar: String
    likes: [ID]!
    bookmarks: [Post]!
    createdAt: String
    updatedAt: String
  }

  type Post {
    _id: ID
    title: String!
    description: String!
    body: String!
    author: User
    likes: Int
    isPublished: Boolean
    comments: [Comment]!
    createdAt: String
    updatedAt: String
  }

  type Comment {
    _id: ID
    body: String!
    author: User!
    post: ID!
    createdAt: String
    updatedAt: String
  }

  type Token {
    token: String
  }

  type UpdateAvatarResponse {
    url: String!
  }

  type Query {
    getAllPosts: [Post]!
    getPost(_id: ID!): Post!
    searchPost(searchTerm: String): [Post]!

    getCurrentUser: User
  }

  type Mutation {
    addPost(
      title: String!
      description: String!
      body: String!
      isPublished: Boolean
    ): Post
    likePost(_id: ID!): Post!
    unlikePost(_id: ID!): Post!
    bookmarkPost(_id: ID!): Post!
    unbookmarkPost(_id: ID!): Post!
    addComment(body: String!, post: ID!): Comment

    signUpUser(username: String!, email: String!, password: String!): Token
    signInUser(email: String!, password: String!): Token
    updateAvatar(file: Upload!): UpdateAvatarResponse
  }
`;
