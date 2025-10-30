import { Link } from 'react-router-dom';
import logo from '../assets/paw.png';
import { useSelector } from 'react-redux';
import { useDispatch } from 'react-redux';
import { getCurrentUser, logoutUser } from '../actions/userAction';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Nav = () => {
  const {user} = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  console.log(user);

  useEffect(() => {
    dispatch(getCurrentUser());
  }, []);

  const handleLogout = () => {
    console.log("hey");
    const result = dispatch(logoutUser());
     if (result?.success) {
        navigate("/");
    }
  };

  const AnimatedButton = ({ text, to }) => (
    <Link to={to} className="group cursor-pointer relative h-7 overflow-hidden bg-transparent text-xl">
      <span className="block transition-transform duration-300 ease-in-out group-hover:-translate-y-full">
        {text}
      </span>
      <span className="absolute top-full block transition-transform duration-300 ease-in-out group-hover:-translate-y-full">
        {text}
      </span>
    </Link>
  );

  return (
    <nav className="flex justify-between items-center px-10 py-6">
        <Link to="/" className="text-3xl flex justify-center items-center gap-3 font-black"><div className='w-8'><img src={logo} alt="" /></div>BUBBLE</Link>
        <div className="flex items-center gap-6">
            {user !== null ? (
              <div className='cursor-pointer h-[50%] overflow-hidden' onClick={handleLogout}>
                <AnimatedButton text="Logout" to="/" />
              </div>
            ) : (
              <>
                <AnimatedButton text="Login" to="/login" />
                <AnimatedButton text="Signup" to="/signup" />
              </>
            )}
        </div>
    </nav>
  )
}

export default Nav