const { AuthenticationError, signToken } = require("../utils/auth");
const { User, Book } = require("../models");

const resolvers = {
  Query: {
    me: async (parent, args, context) => {
      if (context.user) {
        return await Profile.findById(context.user._id);
      }
      throw AuthenticationError;
    },
  },

  Mutation: {
    login: async (parent, { email, password }) => {
      const user = await User.findOne({ email });

      if (!user) {
        throw AuthenticationError;
      }

      const isCorrectPassword = user.isCorrectPassword(password);

      if (!isCorrectPassword) {
        throw AuthenticationError;
      }

      const token = signToken(user);
      return { token, user };
    },
    addUser: async (parent, { username, email, password }, context, info) => {
      const profile = await User.create({ username, email, password });

      const token = signToken(profile);

      return { token, profile };
    },
    saveBook: async (
      parent,
      { authors, description, title, bookId, image, link },
      context
    ) => {
      if (context.user) {
        return Profile.findOneAndUpdate(
          { _id: context.user._id },
          {
            $addToSet: {
              books: {
                bookId: bookId,
                authors: authors,
                description: description,
                title: title,
                image: image,
                link: link,
              },
            },
          },
          {
            new: true,
            runValidators: true,
          }
        );
      }
      throw AuthenticationError;
    },
    removeBook: async (parent, { bookId }, context) => {

        if (context.user) {
          return User.findOneAndUpdate(
            { _id: context.user._id },
            { $pull: { books: {bookId: bookId} } },
            { new: true }
          );
        }
        throw AuthenticationError
      },
  },
};

module.exports = resolvers;
