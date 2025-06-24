import {
  createApi,
  fetchBaseQuery,
  BaseQueryFn,
  FetchArgs,
  FetchBaseQueryError,
} from '@reduxjs/toolkit/query/react';
import { setUser, clearUser, setCsrfToken, clearCsrfToken, setSessionWarning, setSessionWarningToExpire } from './appSlice';
import { backendURL } from '../constants/urls';
import logger from '../Utilities/logger';
import { store } from "./index"

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

interface GenerateTopicsResponse {
  topics: string[];
}

interface ApiResponse<T> {
  statusCode: number;
  data: T;
  message: string;
  success: boolean;
}

export interface PaymentInitiateRequest {
  amount: number,
  planTitle: string,
  billing: string,
  phone: string,
  name: string,
  email: string,
  transactionId: string,
  subscriptionId: string,
}

interface SavePostRequest {
  postContentId: string;
  topic: string;
  topicSetId: string;
  type: 'image' | 'carousel' | 'doyouknow' | 'festival' | 'product';
  status?: 'pending' | 'error' | 'success';
  images?: { url: string; label: string }[];
  contentId?: string;
  contentType?: 'ImageContent' | 'CarouselContent' | 'DYKContent' | 'FestivalContent' | 'ProductContent';
}

interface UserState {
  email: string;
  expiresAt: number;
  role: string;
  login?: boolean;
}


const throttle = <T extends (...args: any[]) => any>(
  func: T,
  limit: number
): ((...args: Parameters<T>) => Promise<ReturnType<T>>) => {
  let lastCall = 0;
  return async (...args: Parameters<T>): Promise<ReturnType<T>> => {
    const now = Date.now();
    if (now - lastCall >= limit) {
      lastCall = now;
      return func(...args);
    }
    throw new Error('Rate limit exceeded');
  };
};

// Cross-tab communication
const authChannel = typeof BroadcastChannel !== 'undefined' ? new BroadcastChannel('auth_channel') : null;

const fetchCsrfToken = async (dispatch: any): Promise<string | null> => {
  try {
    const response = await fetch(`${backendURL}/csrf/csrf-token`, {
      method: 'GET',
      credentials: 'include',
      headers: { Accept: 'application/json' },
    });
    if (!response.ok) {
      throw new Error(`Failed to fetch CSRF token: ${response.status}`);
    }
    const data = await response.json();
    if (data.success) {
      dispatch(setCsrfToken({ token: data.data.csrfToken, expiresAt: data.data.expiresAt }));
      if (authChannel) {
        authChannel.postMessage({ type: 'CSRF_UPDATE', payload: data.data });
      }
      return data.data.csrfToken;
    }
    throw new Error('CSRF token fetch failed');
  } catch (error) {
    logger.error('Error fetching CSRF token', { error });
    return null;
  }
};

const baseQueryWithDispatch: BaseQueryFn<string | FetchArgs, unknown, FetchBaseQueryError> = async (
  args,
  api,
  extraOptions
) => {
  const { dispatch, getState } = api;
  const state = getState() as {
    app?: { user?: UserState; csrfToken?: string; csrfTokenExpiresAt?: number };
  };
  let csrfToken = state.app?.csrfToken;
  const method = typeof args === 'string' ? 'GET' : args.method || 'GET';
  const endpoint = typeof args === 'string' ? args : args.url;

  // Fetch CSRF token if needed
  if (
    !csrfToken ||
    (state.app?.csrfTokenExpiresAt && Date.now() >= state.app.csrfTokenExpiresAt) ||
    ['POST', 'PUT', 'DELETE'].includes(method)
  ) {
    const fetchedToken = await fetchCsrfToken(dispatch);
    console.log('Fetched CSRF Token:', fetchedToken);
    csrfToken = fetchedToken === null ? undefined : fetchedToken;
  }

  const baseQuery = fetchBaseQuery({
    baseUrl: backendURL,
    credentials: 'include',
    prepareHeaders: (headers, { getState }) => {
      const state = getState() as {
        app?: { user?: UserState; csrfToken?: string; csrfTokenExpiresAt?: number };
      };
      const user = state.app?.user;

      logger.info('Session state', { user, csrfToken, endpoint });

      // Session warning
      if (user?.expiresAt && user.expiresAt - Date.now() <= 5 * 60 * 1000) {
        dispatch(setSessionWarningToExpire(true));
      }

      // Set CSRF token for non-safe methods
      if (['POST', 'PUT', 'DELETE'].includes(method) && csrfToken) {
        headers.set('X-CSRF-Token', csrfToken);
      }

      headers.set('Accept', 'application/json');
      return headers;
    },
  });

  let result = await baseQuery(args, api, extraOptions);

  // Check for 401 Unauthorized (or whatever status you want to handle)
  if (result.error && result.error.status === 402) {
    dispatch(setSessionWarning(true));
    // try {
    //   // Use existing CSRF token or fetch a new one
    //   if (!csrfToken || (state.app?.csrfTokenExpiresAt && Date.now() >= state.app.csrfTokenExpiresAt)) {
    //     const fetchedToken = await fetchCsrfToken(dispatch);
    //     console.log('CSRF Token fetched for refresh:', fetchedToken);
    //     csrfToken = fetchedToken === null ? undefined : fetchedToken;
    //   }

    //   if (!csrfToken) {
    //     // Return the original result if we can't get a CSRF token
    //     return result;
    //   }

    //   const refreshResult = await baseQuery(
    //     {
    //       url: '/auth/refresh-token',
    //       method: 'POST',
    //       headers: { 'X-CSRF-Token': csrfToken },
    //     },
    //     api,
    //     extraOptions
    //   );

    //   console.log('Refresh result:', refreshResult);

    //   if (refreshResult.data && (refreshResult.data as ApiResponse<any>).success) {
    //     const { email, role, expiresAt, csrfToken: newCsrfToken, csrfExpiresAt } = (
    //       refreshResult.data as ApiResponse<any>
    //     ).data;
    //     dispatch(
    //       setUser({
    //         email,
    //         expiresAt: expiresAt,
    //         role,
    //         authenticate: true,
    //       })
    //     );
    //     dispatch(
    //       setCsrfToken({
    //         token: newCsrfToken,
    //         expiresAt: csrfExpiresAt,
    //       })
    //     );
    //     if (authChannel) {
    //       authChannel.postMessage({ type: 'AUTH_REFRESH', payload: { email, role, expiresAt: expiresAt } });
    //     }
    //     // Retry the original request
    //     result = await baseQuery(args, api, extraOptions);
    //   }
    // } catch (error) {
    //   logger.error('Token refresh failed:', { error });
    // }
  } else if (result.error && result.error.status === 401) {
    dispatch(clearUser());
    dispatch(clearCsrfToken());
    dispatch(setSessionWarning(false));
    dispatch(setSessionWarningToExpire(false));
    window.location.href = '/signin';

  }

  // Refetch CSRF token after non-safe methods
  if (typeof args !== 'string' && ['POST', 'PUT', 'DELETE'].includes(args.method || '')) {
    await fetchCsrfToken(dispatch);
  }

  // Always return a QueryReturnValue
  return result;
};

export const api = createApi({
  reducerPath: 'api',
  baseQuery: baseQueryWithDispatch,
  tagTypes: ['Auth'],
  endpoints: (builder) => ({
    checkAuthStatus: builder.query<ApiResponse<any>, void>({
      query: () => ({
        url: '/auth/auth-status',
        method: 'GET',
      }),
      providesTags: ['Auth'],
      keepUnusedDataFor: 300,
    }),
    validateSession: builder.query<ApiResponse<any>, void>({
      query: () => ({
        url: '/auth/validate-session',
        method: 'GET',
      }),
      providesTags: ['Auth'],
    }),
    refreshAuth: builder.mutation<ApiResponse<any>, void>({
      query: () => ({
        url: '/auth/refresh-token',
        method: 'POST',
      }),
      invalidatesTags: ['Auth'],
    }),
    getCsrfToken: builder.query<ApiResponse<{ csrfToken: string; expiresAt: number }>, void>({
      query: () => ({
        url: '/csrf/csrf-token',
        method: 'GET',
      }),
    }),
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
    uploadCarouselToCloudinary: builder.mutation<ApiResponse<any>, FormData>({
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
    generateDoYouKnow: builder.mutation<ApiResponse<any>, { topic: string }>({
      query: (body) => ({
        url: '/generate-doyouknow',
        method: 'POST',
        body,
      }),
    }),
    signUp: builder.mutation<ApiResponse<any>, { email: string; password: string; }>({
      query: (body) => ({
        url: '/user/signup',
        method: 'POST',
        body,
      }),
    }),
    signUpAndSigninByProvider: builder.mutation<ApiResponse<any>, { email: string; provider: string; uid: string }>({
      query: (body) => ({
        url: '/user/provider',
        method: 'POST',
        body,
      }),
    }),
    verifyOTP: builder.mutation<ApiResponse<any>, { email: string; otp: string }>({
      query: (body) => ({
        url: '/user/verify-otp',
        method: 'POST',
        body,
      }),
    }),
    resendOTP: builder.mutation<ApiResponse<any>, { email: string; }>({
      query: (body) => ({
        url: '/user/resend',
        method: 'POST',
        body,
      }),
    }),
    forgetPassword: builder.mutation<ApiResponse<any>, { email: string; newPassword: string }>({
      query: (body) => ({
        url: '/user/forget-password',
        method: 'POST',
        body,
      }),
    }),
    signIn: builder.mutation<ApiResponse<any>, { email: string; password: string; }>({
      query: (body) => ({
        url: '/user/signin',
        method: 'POST',
        body,
      }),
    }),
    logout: builder.mutation<ApiResponse<any>, void>({
      query: () => ({
        url: '/user/logout',
        method: 'POST',
      }),
    }),
    userDetails: builder.mutation<ApiResponse<any>, FormData>({
      query: (formData) => ({
        url: '/user/user-details',
        method: 'POST',
        body: formData,
      }),
    }),
    getUserProfile: builder.query<ApiResponse<any>, void>({
      query: () => ({
        url: '/user/get-user-profile',
        method: 'GET',
      }),
    }),
    generateTopics: builder.mutation<ApiResponse<GenerateTopicsResponse>, { business: string }>({
      query: (body) => ({
        url: '/topics',
        method: 'POST',
        body,
      }),
    }),
    generateImageContent: builder.mutation<ApiResponse<any>, { topic: string }>({
      query: (body) => ({
        url: '/image-content',
        method: 'POST',
        body,
      }),
    }),
    generateBlog: builder.mutation<ApiResponse<any>, { topic: string }>({
      query: (topic) => ({
        url: '/generate-blog',
        method: 'POST',
        body: { topic },
      }),
    }),
    savePostContent: builder.mutation<ApiResponse<any>, { topics: string[] }>({
      query: (topics) => ({
        url: '/user/save-topics',
        method: 'POST',
        body: topics,
      }),
    }),
    getPendingPosts: builder.query<ApiResponse<any>, void>({
      query: () => ({
        url: `/user/get-pending-topics`,
        method: 'GET',
      }),
    }),
    getPostContent: builder.query<ApiResponse<any>, { postContentId: string }>({
      query: ({ postContentId }) => ({
        url: `/user/get-topics/${postContentId}`,
        method: 'GET',
      }),
    }),
    imageContent: builder.mutation<ApiResponse<any>, { postContentId: string; topic: string; templateId: string; content: object; hashtags: [string]; status: string }>({
      query: (body) => ({
        url: '/user/image-content',
        method: 'POST',
        body,
      }),
    }),
    carouselContent: builder.mutation<ApiResponse<any>, { postContentId: string; topic: string; templateId: string; content: any[]; status: string }>({
      query: (body) => ({
        url: '/user/carousel-content',
        method: 'POST',
        body,
      }),
    }),
    dykContent: builder.mutation<ApiResponse<any>, { postContentId: string; topic: string; templateId: string; content: object; hashtags: [string]; status: string }>({
      query: (body) => ({
        url: '/user/dyk-content',
        method: 'POST',
        body,
      }),
    }),
    savePosts: builder.mutation<ApiResponse<any>, SavePostRequest>({
      query: (posts) => ({
        url: '/user/save-posts',
        method: 'POST',
        body: posts,
      }),
    }),
    getSavePosts: builder.query<ApiResponse<any>, { postContentId: string }>({
      query: ({ postContentId }) => ({
        url: `/user/get-posts/${postContentId}`,
        method: 'GET',
      }),
    }),
    getImageContent: builder.query<ApiResponse<any>, { contentId: string }>({
      query: ({ contentId }) => ({
        url: `/user/get-image-content/${contentId}`,
        method: 'GET',
      }),
    }),
    getCarouselContent: builder.query<ApiResponse<any>, { contentId: string }>({
      query: ({ contentId }) => ({
        url: `/user/get-carousel-content/${contentId}`,
        method: 'GET',
      }),
    }),
    getDYKContent: builder.query<ApiResponse<any>, { contentId: string }>({
      query: ({ contentId }) => ({
        url: `/user/get-dyk-content/${contentId}`,
        method: 'GET',
      }),
    }),
    updatePost: builder.mutation<ApiResponse<any>, { contentId: string; contentType: string; images?: { url: string; label: string }[] }>({
      query: ({ contentId, ...body }) => ({
        url: `/user/update-posts/${contentId}`,
        method: 'PUT',
        body,
      }),
    }),
    updatePostTopicStatus: builder.mutation<ApiResponse<any>, { postTopicId: string; status: string }>({
      query: ({ postTopicId, ...body }) => ({
        url: `/user/update-post-topic/${postTopicId}`,
        method: 'PUT',
        body,
      }),
    }),
    getUserAllPosts: builder.query<ApiResponse<any>, void>({
      query: () => ({
        url: `/user/get-all-posts`,
        method: 'GET',

      }),
    }),
    getUserPostDetail: builder.query<ApiResponse<any>, { postId: string }>({
      query: ({ postId }) => ({
        url: `/user/get-user-post/${postId}`,
        method: 'GET',

      }),
    }),
    generateCode: builder.mutation<ApiResponse<any>, FormData>({
      query: (formData) => ({
        url: '/generate-code',
        method: 'POST',
        body: formData
      }),
    }),
    saveBlog: builder.mutation<ApiResponse<any>, { title: string, content: string, metaDescription: string, categories: string[]; tags: string[]; slug: string; focusKeyword: string; excerpt: string; imageUrl: string, imageAltText: string }>({
      query: (body) => ({
        url: '/user/save-blog',
        method: 'POST',
        body: body
      }),
    }),
    postBlog: builder.mutation<ApiResponse<any>, { title: string, content: string, metaDescription: string, categories: string[]; tags: string[]; slug: string; focusKeyword: string; excerpt: string; imageUrl: string, imageAltText: string; section: string; scheduleTime: string, wordpress_username: string; wordpress_password: string }>({
      query: (body) => ({
        url: '/user/blog-post',
        method: 'POST',
        body: body
      }),
    }),
    getBlogById: builder.query<ApiResponse<any>, { blogId: string }>({
      query: ({ blogId }) => ({
        url: `/user/get-blog/${blogId}`,
        method: 'GET',
      }),
    }),
    getAllBlogs: builder.query<ApiResponse<any>, void>({
      query: () => ({
        url: `/user/get-all-blogs`,
        method: 'GET',
      }),
    }),
    authLinkedIn: builder.query<ApiResponse<any>, void>({
      query: () => ({
        url: '/social/linkedin/auth',
        method: 'GET',
      }),
    }),
    authFacebook: builder.query<ApiResponse<any>, void>({
      query: () => ({
        url: '/social/facebook/auth',
        method: 'GET',
      }),
    }),
    authInstagram: builder.query<ApiResponse<any>, void>({
      query: () => ({
        url: '/social/instagram/auth',
        method: 'GET',
      }),
    }),
    linkedInPost: builder.mutation<ApiResponse<any>, { title: string; description: string, hashTags: string, imagesUrl: string[]; scheduleTime: string, person_urn: string, accessToken: string }>({
      query: (body) => ({
        url: '/social/linkedin/post',
        method: 'POST',
        body
      }),
    }),
    facebookPagePost: builder.mutation<ApiResponse<any>, { title: string; description: string, hashTags: string, imagesUrl: string[]; scheduleTime: string, pageAccessToken: string, pageId: string }>({
      query: (body) => ({
        url: '/social/facebook/post',
        method: 'POST',
        body
      }),
    }),
    instagramBusinessPost: builder.mutation<ApiResponse<any>, { title: string; description: string, hashTags: string, imagesUrl: string[]; scheduleTime: string, pageAccessToken: string, igBusinessId: string }>({
      query: (body) => ({
        url: '/social/instagram/post',
        method: 'POST',
        body
      }),
    }),
    getSocialAuth: builder.query<ApiResponse<any>, void>({
      query: () => ({
        url: '/social/auth/get-auth-detail',
        method: 'GET',
      }),
    }),
    getUserScheduledPosts: builder.query<ApiResponse<any>, void>({
      query: () => ({
        url: '/user/get-scheduled-posts',
        method: 'GET',
      }),
    }),
    festivalContent: builder.mutation<ApiResponse<any>, FormData>({
      query: (formData) => ({
        url: '/user/festival-content',
        method: 'POST',
        body: formData
      }),
    }),
    getFestivalContent: builder.query<ApiResponse<any>, { contentId: String }>({
      query: ({ contentId }) => ({
        url: `/user/get-festival-content/${contentId}`,
        method: 'GET',
      }),
    }),
    phonePeInitiatePayment: builder.mutation<ApiResponse<any>, PaymentInitiateRequest>({
      query: (body) => ({
        url: '/payment/phone-pe/payment-initiate',
        method: 'POST',
        body,
      }),
    }),
    phonePeCheckStatus: builder.mutation<ApiResponse<any>, {transactionId: string;}>({
      query: (body) => ({
        url: '/payment/phone-pe/status',
        method: 'POST',
        body,
      }),
    }),
    createSubscription: builder.mutation<ApiResponse<any>, {planTitle: string; billing: string; amount: number}>({
      query: (body) => ({
        url: '/user/phone-pe/subscription',
        method: 'POST',
        body,
      }),
    }),
    getSubscription: builder.query<ApiResponse<any>, void>({
      query: () => ({
        url: `/user/phone-pe/get-subscription`,
        method: 'GET',
      }),
    }),
    getPayment: builder.query<ApiResponse<any>, {transactionId: string}>({
      query: ({transactionId}) => ({
        url: `/payment/phone-pe/get-payment/${transactionId}`,
        method: 'GET',
      }),
    }),
    verifyPayment: builder.query<ApiResponse<any>, { orderId: string }>({
      query: ({ orderId }) => ({
        url: `/payment/verify?orderId=${orderId}`,
        method: 'GET',
      }),
    }),
    holidays: builder.query<ApiResponse<any>, void>({
      query: () => ({
        url: `/holidays`,
        method: 'GET',

      }),
    }),
    wordpressAuth: builder.mutation<ApiResponse<any>, { wordpress_username: string, wordpress_password: string }>({
      query: (body) => ({
        url: '/user/wordpress-auth',
        method: 'POST',
        body,
      }),
    }),
    getWordpressAuth: builder.query<ApiResponse<any>, void>({
      query: () => ({
        url: `/user/get-wordpress-auth`,
        method: 'GET',
      }),
    }),
    productContent: builder.mutation<ApiResponse<any>, FormData>({
      query: (formData) => ({
        url: '/user/product-content',
        method: 'POST',
        body: formData
      }),
    }),
    getProductContent: builder.query<ApiResponse<any>, { contentId: String }>({
      query: ({ contentId }) => ({
        url: `/user/get-product-content/${contentId}`,
        method: 'GET',
      }),
    }),

  }),
});

if (authChannel) {
  authChannel.onmessage = (event) => {
    const { type, payload } = event.data;
    if (type === 'AUTH_UPDATE' || type === 'AUTH_REFRESH') {
      // Avoid redundant updates by checking current state
      const currentUser = (store.getState() as { app: { user?: UserState } }).app.user;
      if (currentUser?.email !== payload.email || currentUser?.expiresAt !== payload.expiresAt) {
        store.dispatch(setUser(payload));
        logger.info('Cross-tab auth update', { email: payload.email });
      }
    } else if (type === 'CSRF_UPDATE') {
      const currentCsrfToken = store.getState().app.csrfToken;
      if (currentCsrfToken !== payload.token) {
        store.dispatch(setCsrfToken(payload));
        logger.info('Cross-tab CSRF update', { token: payload.token });
      }
    }
  };
}

export const {
  useCheckAuthStatusQuery,
  useGetCsrfTokenQuery,
  useLazyCheckAuthStatusQuery,
  useRefreshAuthMutation,
  useLazyValidateSessionQuery,
  useValidateSessionQuery,
  useLazyGetCsrfTokenQuery,
  useGenerateIdeasMutation,
  useGenerateImageMutation,
  usePostContentMutation,
  useGenerateCarouselMutation,
  useUploadCarouselToCloudinaryMutation,
  useUploadImageToCloudinaryMutation,
  useGenerateDoYouKnowMutation,
  useLazyGetAllBlogsQuery,
  useSignUpMutation,
  useSignInMutation,
  useLogoutMutation,
  useSignUpAndSigninByProviderMutation,
  useVerifyOTPMutation,
  useGenerateTopicsMutation,
  useGenerateImageContentMutation,
  useSavePostsMutation,
  usePostBlogMutation,
  useGenerateBlogMutation,
  useLazyGetBlogByIdQuery,
  useSavePostContentMutation,
  useLazyGetPostContentQuery,
  useImageContentMutation,
  useCarouselContentMutation,
  useDykContentMutation,
  useLazyGetSavePostsQuery,
  useLazyGetImageContentQuery,
  useLazyGetCarouselContentQuery,
  useLazyGetDYKContentQuery,
  useUpdatePostMutation,
  useSaveBlogMutation,
  useResendOTPMutation,
  useForgetPasswordMutation,
  useUserDetailsMutation,
  useLazyGetUserProfileQuery,
  useLazyAuthLinkedInQuery,
  useGenerateCodeMutation,
  useUpdatePostTopicStatusMutation,
  useLazyGetUserAllPostsQuery,
  useLazyGetUserPostDetailQuery,
  useLazyGetPendingPostsQuery,
  useLazyAuthFacebookQuery,
  useLazyAuthInstagramQuery,
  useLinkedInPostMutation,
  useFacebookPagePostMutation,
  useInstagramBusinessPostMutation,
  useLazyGetSocialAuthQuery,
  useLazyGetUserScheduledPostsQuery,
  useFestivalContentMutation,
  useLazyGetFestivalContentQuery,
  useVerifyPaymentQuery,
  useLazyHolidaysQuery,
  useWordpressAuthMutation,
  useLazyGetWordpressAuthQuery,
  useProductContentMutation,
  useLazyGetProductContentQuery,

  usePhonePeInitiatePaymentMutation,
  usePhonePeCheckStatusMutation,
  useCreateSubscriptionMutation,
  useLazyGetPaymentQuery,
  useLazyGetSubscriptionQuery
} = api;