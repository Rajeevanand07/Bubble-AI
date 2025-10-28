import { addMessage, setMessages } from "../reducers/messageSlice";
import axios from "../api/axiosConfig";

export const getMessages = () => async (dispatch) => {
    try {
        const { data } = await axios.get(`/api/message`, {
            withCredentials: true
        });
        dispatch(setMessages(data.messages));
    } catch (error) {
        console.log(error);
    }
};

export const addMessageToChat = (message) => (dispatch) => {
    dispatch(addMessage(message));
};