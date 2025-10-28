import axios from "axios";
import { Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { loginUser } from "../actions/userAction";
import { useDispatch } from "react-redux";

const Login = () => {
  const dispatch = useDispatch();
  const {
    register,
    handleSubmit,
    reset,
  } = useForm();

  const onSubmit = async (data) => {
    dispatch(loginUser(data));
    reset();
  };

  return (
    <div className="flex items-center justify-center min-h-[80vh]">
      <form
        className="bg-[#10101053] p-8 rounded-lg shadow-lg w-full max-w-md"
        onSubmit={handleSubmit(onSubmit)}
      >
        <h2 className="text-4xl font-black mb-6 uppercase text-center">
          Login
        </h2>
        <div className="mb-4">
          <label htmlFor="email" className="block mb-2 text-sm font-medium">
            Email
          </label>
          <input
            type="email"
            id="email"
            name="email"
            {...register("email", { required: true })}
            className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-[#096FFC]"
            required
          />
        </div>
        <div className="mb-6">
          <label htmlFor="password" className="block mb-2 text-sm font-medium">
            Password
          </label>
          <input
            type="password"
            id="password"
            name="password"
            {...register("password", { required: true })}
            className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-[#096FFC]"
            required
          />
        </div>
        <button
          type="submit"
          className="group cursor-pointer relative h-11 w-full overflow-hidden rounded-md bg-gradient-to-r from-[#096FFC] to-[#05C7F2] text-lg font-semibold text-white"
        >
          <div className="absolute inset-0 w-full transition-transform duration-300 ease-in-out group-hover:-translate-y-full">
            <span className="flex h-full w-full items-center justify-center">
              Login
            </span>
          </div>
          <div className="absolute inset-0 w-full translate-y-full transition-transform duration-300 ease-in-out group-hover:translate-y-0">
            <span className="flex h-full w-full items-center justify-center">
              Login
            </span>
          </div>
        </button>
        <p className="mt-6 text-center text-sm text-gray-400">
          Don't have an account?{" "}
          <Link to="/signup" className="font-medium text-white hover:underline">
            Sign Up
          </Link>
        </p>
      </form>
    </div>
  );
};

export default Login;
