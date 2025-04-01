// src/store/slices/appSlice.ts
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
}
interface AppState {
  contentType: 'post' | 'reel' | 'carousel' | 'doyouknow' | null; // Added more types
  selectedTopic: string;
  selectedIdea: ContentIdea | null;
  selectedFile: SelectedFileData | null;
  posted: string[]; // Array of post identifiers (e.g., URLs or IDs)
  ideas: ContentIdea[];
  selectedDoYouKnowTemplate: string | null;
  user: { email: string } | null;
  token: string | null;
  selectedBusiness: string | null;
  posts: Post[];
  apiTopics: string[];
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
  token: null,
  selectedBusiness: null,
  posts: [],
  apiTopics: [],
};


const appSlice = createSlice({
  name: 'app',
  initialState,
  reducers: {
    setContentType(
      state,
      action: PayloadAction<'post' | 'reel' | 'carousel' | 'doyouknow' | null>
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
    setUser(state, action: PayloadAction<{ email: string; token: string }>) {
      state.user = { email: action.payload.email };
      state.token = action.payload.token;
    },

    setPosts: (state, action: PayloadAction<Post[]>) => {
      state.posts = action.payload;
    },
    logout(state) {
      state.user = null;
      state.token = null;
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
  setSelectedBusiness,
  setPosts,
  setApiTopics
} = appSlice.actions;

export default appSlice.reducer;