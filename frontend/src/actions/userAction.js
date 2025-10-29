import { setUser } from "../reducers/userSlice";
import axios from "../api/axiosConfig";
import { toast } from "react-toastify";

export const loginUser = (user) => async(dispatch) => {
    try {
        const {data} = await axios.post("api/auth/login", user,{
            withCredentials: true
        });
        toast("Login Successfull")
        dispatch(setUser(data.user));
        return { success: true };
    } catch (error) {
        toast("Login Failed")
        console.log(error);
        return { success: false };
    }
};

export const registerUser = (user) => async(dispatch) => {
    try {
        const {data} = await axios.post("api/auth/register", user,{
            withCredentials: true
        });
        toast("Register Successfull")
        dispatch(setUser(data.user));
        return { success: true };
    } catch (error) {
        toast("Register Failed")
        console.log(error);
        return { success: false };
    }
};
