import { createSlice } from "@reduxjs/toolkit";

const chatSlice = createSlice({
    name: "chats",
    initialState: {
        currentChat: null,
        chats: [],
    },
    reducers: {
        setCurrentChat: (state, action) => {
            state.currentChat = action.payload;
        },
        setChats: (state, action) => {
            state.chats = action.payload;
        },
        addChat: (state, action) => {
            state.chats.push(action.payload);
        },
         clearChats: (state) => {
            state.chats = [];
            state.currentChat = null;
        },
        clearCurrentChat: (state) => {
            state.currentChat = null;
        },
    },
});

export const { setChats, addChat, setCurrentChat, clearChats, clearCurrentChat } = chatSlice.actions;
export default chatSlice.reducer;
