import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

interface ContentIdea {
  title: string;
  content: string;
  hashtags: string[];
}

interface CarouselContent {
  tagline?: string;
  title: string;
  description?: string;
}

interface GenerateDoYouKnowResponse {
  title: string;
  description: string;
}

interface GenerateTopicsResponse {
  topics: string[];
}

// Generic API response structure
interface ApiResponse<T> {
  statusCode: number;
  data: T;
  message: string;
  success: boolean;
}

export const api = createApi({
  reducerPath: 'api',
  baseQuery: fetchBaseQuery({
    baseUrl: 'http://localhost:4000/api/v1',
    // prepareHeaders: (headers, { getState }) => {
    //   const token = (getState() as any).auth.token; // Assuming auth slice has a token
    //   if (token) {
    //     headers.set('Authorization', `Bearer ${token}`);
    //   }
    //   return headers;
    // },
  }),
  endpoints: (builder) => ({
    generateIdeas: builder.mutation<ApiResponse<ContentIdea[]>, { topic: string }>({
      query: (body) => ({
        url: '/ideas',
        method: 'POST',
        body,
      }),
    }),
    generateImage: builder.mutation<ApiResponse<string>, { prompt: string }>({
      query: (body) => ({
        url: '/generate-image',
        method: 'POST',
        body,
      }),
    }),
    postContent: builder.mutation<ApiResponse<any>, FormData>({
      query: (formData) => ({
        url: '/post',
        method: 'POST',
        body: formData,
      }),
    }),
    generateCarousel: builder.mutation<ApiResponse<CarouselContent[]>, { topic: string }>({
      query: (body) => ({
        url: '/generate-carousel',
        method: 'POST',
        body,
      }),
    }),
    uploadCarousel: builder.mutation<ApiResponse<any>, FormData>({
      query: (body) => ({
        url: '/upload-carousel',
        method: 'POST',
        body,
      }),
    }),
    uploadImageToCloudinary: builder.mutation<ApiResponse<any>, FormData>({
      query: (formData) => ({
        url: '/upload-single',
        method: 'POST',
        body: formData,
      }),
    }),
    generateDoYouKnow: builder.mutation<ApiResponse<GenerateDoYouKnowResponse>, { topic: string }>({
      query: (body) => ({
        url: '/generate-doyouknow',
        method: 'POST',
        body,
      }),
    }),
    signUp: builder.mutation<ApiResponse<{ email: string; token: string }>, { email: string; password: string }>({
      query: (body) => ({
        url: '/signup',
        method: 'POST',
        body,
      }),
    }),
    signIn: builder.mutation<ApiResponse<{ email: string; token: string }>, { email: string; password: string }>({
      query: (body) => ({
        url: '/signin',
        method: 'POST',
        body,
      }),
    }),
    generateTopics: builder.mutation<ApiResponse<GenerateTopicsResponse>, { business: string }>({
      query: (body) => ({
        url: '/topics',
        method: 'POST',
        body,
      }),
    }),
  }),
});

export const {
  useGenerateIdeasMutation,
  useGenerateImageMutation,
  usePostContentMutation,
  useGenerateCarouselMutation,
  useUploadCarouselMutation,
  useUploadImageToCloudinaryMutation,
  useGenerateDoYouKnowMutation,
  useSignUpMutation,
  useSignInMutation,
  useGenerateTopicsMutation,
} = api;