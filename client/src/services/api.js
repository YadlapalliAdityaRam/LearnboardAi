import { gql } from '@apollo/client';
import { client } from '../graphql/client';

const GENERATE_LESSON = gql`
  mutation GenerateLesson($topic: String!, $pages: Int!) {
    generateLesson(topic: $topic, pages: $pages) {
      slides {
        title
        content
        explanation
      }
    }
  }
`;

const ANALYZE_PDF = gql`
  mutation AnalyzePdf($fileBase64: String!) {
    analyzePdf(fileBase64: $fileBase64) {
      slides {
        title
        content
        explanation
      }
    }
  }
`;

const ASK_TUTOR = gql`
  mutation AskTutor($question: String!, $context: String!) {
    askTutor(question: $question, context: $context)
  }
`;

const GENERATE_QUIZ = gql`
  mutation GenerateQuiz($content: String!) {
    generateQuiz(content: $content) {
      questions {
        question
        options
        correct
      }
    }
  }
`;

const GENERATE_FLASHCARDS = gql`
  mutation GenerateFlashcards($content: String!) {
    generateFlashcards(content: $content) {
      cards {
        front
        back
      }
    }
  }
`;

const HEALTH_CHECK = gql`
  query HealthCheck {
    healthCheck
  }
`;

const fileToBase64 = (file) => new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
        const base64 = reader.result.split(',')[1];
        resolve(base64);
    };
    reader.onerror = (error) => reject(error);
});

export async function generateLesson(topic, pages) {
    const { data } = await client.mutate({
        mutation: GENERATE_LESSON,
        variables: { topic, pages }
    });
    return data.generateLesson;
}

export async function analyzePDF(file) {
    const fileBase64 = await fileToBase64(file);
    const { data } = await client.mutate({
        mutation: ANALYZE_PDF,
        variables: { fileBase64 }
    });
    return data.analyzePdf;
}

export async function askTutor(question, context) {
    const { data } = await client.mutate({
        mutation: ASK_TUTOR,
        variables: { question, context }
    });
    return data.askTutor;
}

export async function generateQuiz(content) {
    const { data } = await client.mutate({
        mutation: GENERATE_QUIZ,
        variables: { content }
    });
    return data.generateQuiz;
}

export async function generateFlashcards(content) {
    const { data } = await client.mutate({
        mutation: GENERATE_FLASHCARDS,
        variables: { content }
    });
    return data.generateFlashcards;
}

export async function healthCheck() {
    const { data } = await client.query({
        query: HEALTH_CHECK,
    });
    return data;
}
