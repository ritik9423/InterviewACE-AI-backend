export const API_PATHS = {
  AUTH: {
    LOGIN: `/api/auth/login`,
    SIGNUP: `/api/auth/register`,
  },
  SESSION: {
    CREATE: `/api/sessions/create`,
    GET_ALL: `/api/sessions/my-sessions`,
    GET_ONE: `/api/sessions`, // usage: GET_ONE/:id
  },
  AI: {
    GENERATE_QUESTIONS: `/api/ai/generate-questions`,
    EXPLAIN: `/api/ai/generate-explanation`,
    EVALUATE: `/api/ai/evaluate-answer`,
    GET_SESSION: `/api/ai/session`, // usage: GET_SESSION/:id
  },
};
