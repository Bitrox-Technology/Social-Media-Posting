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
    prepareHeaders: (headers, { getState }) => {
      const state = getState() as { app?: { user?: { token?: string } } };
      
      console.log(state);
      const token = state.app?.user?.token;
      console.log('Token:', token);
      if (token) {
        headers.set('Authorization', `Bearer ${token}`);
      }
      console.log('Headers:', headers);
      return headers;
    },
  }),
  tagTypes: ['Auth'],
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
    signUp: builder.mutation<ApiResponse<any>, { email: string; password: string }>({
      query: (body) => ({
        url: '/user/signup',
        method: 'POST',
        body,
      }),
    }),
    signIn: builder.mutation<ApiResponse<any>, { email: string; password: string }>({
      query: (body) => ({
        url: '/user/signin',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['Auth'],
    }),
    generateTopics: builder.mutation<ApiResponse<GenerateTopicsResponse>, { business: string }>({
      query: (body) => ({
        url: '/topics',
        method: 'POST',
        body,
      }),
    }),
    generateImageContent: builder.mutation<{ data: { title: string; description: string } }, { topic: string }>({
      query: (body) => ({
        url: '/image-content',
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
  useGenerateImageContentMutation
} = api;