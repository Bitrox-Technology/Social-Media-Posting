import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface ContentIdea {
  title: string;
  content: string;
  hashtags: string[];
}

interface SelectedFileData {
  name: string;
  url: string;
}

interface CarouselContent {
  tagline?: string;
  title: string;
  description?: string;
}

interface DoYouKnowContent {
  title: string;
  description: string;
}

interface Post {
  topic: string;
  type: 'image' | 'carousel' | 'doyouknow';
  content: string | CarouselContent[] | DoYouKnowContent;
  images?: string[];
  templateId?: string;
}

interface User {
  email: string | null;
  token: string | null;
  expiresAt: number | null;
}

interface AppState {
  contentType: 'post' | 'blog' | 'carousel' | 'doyouknow' | null;
  selectedTopic: string;
  selectedIdea: ContentIdea | null;
  selectedFile: SelectedFileData | null;
  posted: string[];
  ideas: ContentIdea[];
  selectedDoYouKnowTemplate: string | null;
  user: User | null;
  selectedBusiness: string | null;
  posts: Post[];
  apiTopics: string[];
  customTopics: string[];
}

const initialState: AppState = {
  contentType: null,
  selectedTopic: '',
  selectedIdea: null,
  selectedFile: null,
  posted: [],
  ideas: [],
  selectedDoYouKnowTemplate: null,
  user: null,
  selectedBusiness: null,
  posts: [],
  apiTopics: [],
  customTopics: [],
};

const appSlice = createSlice({
  name: 'app',
  initialState,
  reducers: {
    setContentType(
      state,
      action: PayloadAction<'post' | 'blog' | 'carousel' | 'doyouknow' | null>
    ) {
      state.contentType = action.payload;
    },
    setSelectedTopic(state, action: PayloadAction<string>) {
      state.selectedTopic = action.payload;
    },
    setSelectedBusiness: (state, action: PayloadAction<string>) => {
      state.selectedBusiness = action.payload;
    },
    setSelectedIdea(state, action: PayloadAction<ContentIdea | null>) {
      state.selectedIdea = action.payload;
    },
    addCustomTopic(state, action: PayloadAction<string>) {
      if (!state.customTopics.includes(action.payload)) {
        state.customTopics.push(action.payload);
      }
    },
    clearCustomTopics(state) {
      state.customTopics = [];
    },
    setSelectedFile(state, action: PayloadAction<SelectedFileData | null>) {
      state.selectedFile = action.payload;
    },
    setPosted(state, action: PayloadAction<string[]>) {
      state.posted = action.payload;
    },
    setIdeas(state, action: PayloadAction<ContentIdea[]>) {
      state.ideas = action.payload;
    },
    setSelectedDoYouKnowTemplate(state, action: PayloadAction<string | null>) {
      state.selectedDoYouKnowTemplate = action.payload;
    },
    setUser: (
      state,
      action: PayloadAction<{ email: string; token: string; expiresAt: number }>
    ) => {
      state.user = {
        email: action.payload.email,
        token: action.payload.token,
        expiresAt: action.payload.expiresAt,
      };
    },
    clearUser(state) {
      state.user = null;
    },
    logout(state) {
      state.user = null;
    },
    setPosts: (state, action: PayloadAction<Post[]>) => {
      state.posts = action.payload;
    },
    setApiTopics: (state, action: PayloadAction<string[]>) => {
      state.apiTopics = action.payload;
    },
    resetState(state) {
      state.contentType = null;
      state.selectedTopic = '';
      state.selectedIdea = null;
      state.selectedFile = null;
      state.posted = [];
      state.ideas = [];
      state.selectedDoYouKnowTemplate = null;
    },
  },
});

export const {
  setContentType,
  setSelectedTopic,
  setSelectedIdea,
  setSelectedFile,
  setPosted,
  setIdeas,
  setSelectedDoYouKnowTemplate,
  resetState,
  setUser,
  logout,
  clearUser,
  setSelectedBusiness,
  setPosts,
  setApiTopics,
  addCustomTopic,
  clearCustomTopics,
} = appSlice.actions;

export default appSlice.reducer;