import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const API_URL = 'http://localhost:5000/api/problems';

const initialState = {
    problems: [],
    currentProblem: null,
    isLoading: false,
    error: null
};

export const fetchProblems = createAsyncThunk('problems/fetchAll', async (_, thunkAPI) => {
    try {
        const response = await axios.get(API_URL);
        return response.data.problems;
    } catch (error) {
        return thunkAPI.rejectWithValue(error.response.data.message);
    }
});

export const fetchProblem = createAsyncThunk('problems/fetchOne', async (id, thunkAPI) => {
    try {
        const response = await axios.get(`${API_URL}/${id}`);
        return response.data.problem;
    } catch (error) {
        return thunkAPI.rejectWithValue(error.response.data.message);
    }
});

const problemSlice = createSlice({
    name: 'problems',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchProblems.pending, (state) => { state.isLoading = true; })
            .addCase(fetchProblems.fulfilled, (state, action) => {
                state.isLoading = false;
                state.problems = action.payload;
            })
            .addCase(fetchProblems.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload;
            })
            .addCase(fetchProblem.pending, (state) => { state.isLoading = true; })
            .addCase(fetchProblem.fulfilled, (state, action) => {
                state.isLoading = false;
                state.currentProblem = action.payload;
            })
            .addCase(fetchProblem.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload;
            });
    }
});

export default problemSlice.reducer;
