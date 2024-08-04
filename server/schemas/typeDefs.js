const typeDefs = `
    type User {
        _id: ID
        usernane: String!
        email: String!
        bookCount: Int
        savedBooks: [Book]
    }

    type Book {
        bookId: String!
        authors: [String]
        description: String!
        title: String!
        image: String
        link: String
    }

    type Query {
        me: User
    }

    type Mutation {
        login(email: String!, password: String!): Auth
        addUser(username: String!, email: String!, password: String!): Auth
        saveBook():
        removeBook(bookId: ID!): User
    }

    type Auth {
        token: ID!
        user: User
  }
`

module.exports = typeDefs