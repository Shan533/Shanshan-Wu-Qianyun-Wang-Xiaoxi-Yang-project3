import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function Navbar() {
  const navigate = useNavigate();
  // const [username, setUsername] = useState("");
  const [user, setUser] = useState(null);

  useEffect(() => {
    const fetchLoggedInUser = async () => {
      try {
        const token = localStorage.getItem("token");
        if (token) {
          axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
          const response = await axios.get(
            "/api/users/loggedIn"
          );
          setUser(response.data.user);
        }
      } catch (error) {
        console.log(error);
      }
    };

    fetchLoggedInUser();
  }, []);

  const handleLogout = async () => {
    try {
      await axios.post("/api/users/logout");
      localStorage.removeItem("token");
      setUser(null);
      navigate("/");
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <nav className="shadow gray h-14 pt-6 header">
      <div className="container mx-auto py-3 px-10 flex items-center justify-between">
        <div className="flex space-x-4">
          <a className="cursor-pointer" onClick={() => navigate("/")}>
            Home
          </a>
          <a className="cursor-pointer" onClick={() => navigate("/main")}>
            Password Manager
          </a>
        </div>
        <div className="flex items-center">
          {user ? (
            <>
              <span className="mr-4 cursor-default">{user.username}</span>
              <i
                className="ri-logout-box-r-line cursor-pointer"
                onClick={handleLogout}
              ></i>
            </>
          ) : (
            <a className="cursor-pointer" onClick={() => navigate("/login")}>
              Login
            </a>
          )}
        </div>
      </div>
    </nav>
  );
}

export default Navbar;

/**
 *
 * contain a link back to the home page
 *         a link to a place where a user can login or register a new account.
 * If the user is logged in, the navbar should still contain a link to the home page,
 *         a button to log out and a slightly stylized reference to their username.
 * Once a user is logged in, the navbar should provide a method for users to log out.
 */
