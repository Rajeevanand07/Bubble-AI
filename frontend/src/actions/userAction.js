import { setUser } from "../reducers/userSlice";
import axios from "../api/axiosConfig";
import { clearChats, clearCurrentChat } from "../reducers/chatSlice";
import { toast } from "react-toastify";
import { clearMessages } from "../reducers/messageSlice";

export const getCurrentUser = () => async(dispatch) => {
    try {
        const {data} = await axios.get("api/auth/current-user", {
            withCredentials: true
        });
        dispatch(setUser(data.user));
        return { success: true };
    } catch (error) {
        console.log(error);
        return { success: false };
    }
}

export const loginUser = (user) => async(dispatch) => {
    try {
        const {data} = await axios.post("api/auth/login", user,{
            withCredentials: true
        });
        toast("Login Successfull")
        dispatch(setUser(data.user));
        return { success: true, user: data.user};
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
        return { success: true , user: data.user};
    } catch (error) {
        toast("Register Failed")
        console.log(error);
        return { success: false };
    }
};

export const logoutUser = () => async(dispatch) => {
    try {
        await axios.post("api/auth/logout", {}, {
            withCredentials: true
        });
        toast("Logout Successfull")
        dispatch(setUser(null));
        dispatch(clearChats());
        dispatch(clearCurrentChat());
        dispatch(clearMessages());
        return { success: true };
    } catch (error) {
        toast("Logout Failed")
        console.log(error);
        return { success: false };
    }
};

