const { gql } = require('graphql-tag');

const typeDefs = gql`
  type Slide {
    title: String!
    content: String!
    explanation: [String!]
  }

  type Lesson {
    slides: [Slide!]!
  }

  type QuizQuestion {
    question: String!
    options: [String!]!
    correct: Int!
  }

  type Quiz {
    questions: [QuizQuestion!]!
  }

  type Flashcard {
    front: String!
    back: String!
  }

  type Flashcards {
    cards: [Flashcard!]!
  }

  type Query {
    healthCheck: String!
  }

  type Mutation {
    generateLesson(topic: String!, pages: Int!): Lesson!
    analyzePdf(fileBase64: String!): Lesson!
    askTutor(question: String!, context: String!): String!
    generateQuiz(content: String!): Quiz!
    generateFlashcards(content: String!): Flashcards!
  }
`;

module.exports = typeDefs;
