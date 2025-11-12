import React from "react";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import defaultProfileImg from "../../assets/images/profile.png";

const Header = () => {
  const { currentUser } = useSelector((state) => state.user);
  
  return (
    <>
  <div className="bg-slate-400 p-4 flex justify-between items-center">
        <Link
          to={`/`}
          aria-label="Home"
          className="h-min top-[9px] text-2xl font-bold relative no-underline"
          style={{
            color: "transparent",
            WebkitTextStroke: "0.7px",
            WebkitTextStrokeColor: "#fff",
            display: "inline-block",
          }}
        >
          Tale
          <span
            className="  rounded-lg text-slate-700 text-0.9xl absolute left-0 top-[-18px] text-center "
            style={{
              WebkitTextStroke: "0",
            }}
          >
            Stay
          </span>
        </Link>
        <ul className="flex flex-nowrap items-center justify-center gap-4 sm:gap-6 md:gap-10 text-white text-sm sm:text-base font-semibold list-none whitespace-nowrap overflow-x-auto">
  <li className="hover:underline hover:scale-105 transition-all duration-150">
    <Link to={`/`}>Home</Link>
  </li>
  <li className="hover:underline hover:scale-105 transition-all duration-150">
    <Link to={`/search`}>Packages</Link>
  </li>
  <li className="hover:underline hover:scale-105 transition-all duration-150">
    <Link to={`/about`}>About</Link>
  </li>
  <li className="w-10 h-10 flex items-center justify-center">
    {currentUser ? (
      <Link
        to={`/profile/${currentUser.role === 'admin' ? 'admin' : 'user'}`}
      >
        <img
          src={currentUser.avatar || defaultProfileImg}
          alt={currentUser.username}
          className="border w-10 h-10 border-black rounded-[50%]"
        />
      </Link>
    ) : (
      <Link to={`/login`}>Login</Link>
    )}
  </li>
</ul>

      </div>
    </>
  );
};

export default Header;
