import { setUser } from "../reducers/userSlice";
import axios from "../api/axiosConfig";

export const loginUser = (user) => async(dispatch) => {
    try {
        const {data} = await axios.post("api/auth/login", user,{
            withCredentials: true
        });
        console.log(data);
        
        dispatch(setUser(data.user));
    } catch (error) {
        console.log(error);
    }
};

export const registerUser = (user) => async(dispatch) => {
    try {
        const {data} = await axios.post("api/auth/register", user,{
            withCredentials: true
        });
        console.log(data);
        
        dispatch(setUser(data.user));
    } catch (error) {
        console.log(error);
    }
};
