import { addChat, setChats, setCurrentChat, clearCurrentChat } from "../reducers/chatSlice";
import axios from "../api/axiosConfig";
import { clearMessages } from "../reducers/messageSlice";

export const createChat = (title) => async (dispatch) => {
    try {
        const { data } = await axios.post(`/api/chat`, {title},{
            withCredentials: true       
        });
        dispatch(clearMessages());
        dispatch(addChat(data.chat));
        dispatch(setCurrentChat(data.chat._id))
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

