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

interface AppState {
  contentType: 'post' | 'reel' | null;
  selectedTopic: string;
  selectedIdea: ContentIdea | null;
  selectedFile: SelectedFileData | null;
  posted: string[];
  ideas: ContentIdea[];
  selectedDoYouKnowTemplate: string | null; // Add this field
}

const initialState: AppState = {
  contentType: null,
  selectedTopic: '',
  selectedIdea: null,
  selectedFile: null,
  posted: [],
  ideas: [],
  selectedDoYouKnowTemplate: null, // Initialize the new field
};

const appSlice = createSlice({
  name: 'app',
  initialState,
  reducers: {
    setContentType(state, action: PayloadAction<'post' | 'reel' | null>) {
      state.contentType = action.payload;
    },
    setSelectedTopic(state, action: PayloadAction<string>) {
      state.selectedTopic = action.payload;
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
    resetState(state) {
      state.contentType = null;
      state.selectedTopic = '';
      state.selectedIdea = null;
      state.selectedFile = null;
      state.posted = [];
      state.ideas = [];
      state.selectedDoYouKnowTemplate = null; // Reset the new field
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
  setSelectedDoYouKnowTemplate, // Export the new action
  resetState,
} = appSlice.actions;

export default appSlice.reducer;