import { addChat, setChats } from "../reducers/chatSlice";
import axios from "../api/axiosConfig";

export const createChat = (title) => async (dispatch) => {
    try {
        console.log(title);
        
        const { data } = await axios.post(`/api/chat`, {title},{
            withCredentials: true       
        });
        console.log(data);
        
        // dispatch(addChat(data.chat));
    } catch (error) {
        console.log(error);
    }
};

// export const getCurrentUserChat = () => async (dispatch) => {
//     try {
//         const { data } = await axios.get(`/api/chat`, {
//             withCredentials: true
//         });
//         dispatch(setChats(data.chat));
//     } catch (error) {
//         console.log(error);
//     }
// };

