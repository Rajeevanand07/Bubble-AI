import { addChat, setChats, setCurrentChat } from "../reducers/chatSlice";
import axios from "../api/axiosConfig";

export const createChat = (title) => async (dispatch) => {
    try {
        const { data } = await axios.post(`/api/chat`, {title},{
            withCredentials: true       
        });
        dispatch(addChat(data.chat));
    } catch (error) {
        console.log(error);
    }
};

export const getChats = () => async (dispatch) => {
    try {
        const { data } = await axios.get(`/api/chat`, {
            withCredentials: true
        }); 
        dispatch(setChats(data.chats));
    } catch (error) {
        console.log(error);
    }
};

export const getCurrentUserChat = (chatId) => async (dispatch) => {
    dispatch(setCurrentChat(chatId));
};

