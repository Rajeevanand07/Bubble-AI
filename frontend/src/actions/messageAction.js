import { setMessages } from "../reducers/messageSlice";
import axios from "../api/axiosConfig";

export const asyncSetMessages = (chatId) => async (dispatch) => {
    try {
        const { data } = await axios.get(`/api/chat/messages?chat=${chatId}`,{
            withCredentials: true
        });
        dispatch(setMessages(data.messages));
    } catch (error) {
        console.log(error);
    }
};

