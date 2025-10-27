import { Link } from 'react-router-dom';

const Nav = () => {
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
    <nav className="flex justify-between items-center px-16 py-6">
        <h1 className="text-3xl font-black">BUBBLE</h1>
        <div className="flex items-center gap-6">
            <AnimatedButton text="Login" to="/login" />
            <AnimatedButton text="Signup" to="/signup" />
        </div>
    </nav>
  )
}

export default Nav