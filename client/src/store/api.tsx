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

// Define the API response structure
interface GenerateIdeasResponse {
  statusCode: number;
  data: ContentIdea[];
  message: string;
  success: boolean;
}

interface GenerateCarouselResponse {
  statusCode: number;
  data: CarouselContent[];
  message: string;
  success: boolean;
}

export const api = createApi({
  reducerPath: 'api',
  baseQuery: fetchBaseQuery({ baseUrl: 'http://localhost:4000/api/v1' }),
  endpoints: (builder) => ({
    generateIdeas: builder.mutation<GenerateIdeasResponse, { topic: string }>({
      query: (body) => ({
        url: '/ideas',
        method: 'POST',
        body,
      }),
    }),
    generateImage: builder.mutation<{ data: string }, { prompt: string }>({
      query: (body) => ({
        url: '/generate-image',
        method: 'POST',
        body,
      }),
    }),
    postContent: builder.mutation<any, FormData>({
      query: (formData) => ({
        url: '/post',
        method: 'POST',
        body: formData,
      }),
    }),
    generateCarousel: builder.mutation<GenerateCarouselResponse, { topic: string }>({
      query: (body) => ({
        url: '/generate-carousel',
        method: 'POST',
        body,
      }),
    }),
    uploadCarousel: builder.mutation< any, FormData>({
      query: (body) => ({
        url: '/upload-carousel',
        method: 'POST',
        body,
      }),
    }),
    uploadImageToCloudinary: builder.mutation<any, FormData>({
      query: (formData) => ({
        url: '/upload-single', 
        method: 'POST',
        body: formData,
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
  useUploadImageToCloudinaryMutation
} = api;