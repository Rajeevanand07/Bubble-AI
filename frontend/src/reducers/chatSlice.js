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
    },
});

export const { setChats, addChat, setCurrentChat } = chatSlice.actions;
export default chatSlice.reducer;
