import { Link } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";

export default function Navbar() {
  const { user, logout } = useContext(AuthContext);

  return (
    <nav className="bg-gray-800 text-white p-4 shadow-md">
      <div className="container mx-auto flex items-center justify-between">
        {/* Logo / App Name */}
        <Link to="/" className="text-xl font-bold hover:text-blue-400">
          SlotSwapper
        </Link>

        {/* Nav Links */}
        <div className="space-x-4">
          {user ? (
            <>
              <Link
                to="/calendar"
                className="hover:text-blue-400 transition-colors"
              >
                My Calendar
              </Link>
              <Link
                to="/marketplace"
                className="hover:text-blue-400 transition-colors"
              >
                Marketplace
              </Link>
              <Link
                to="/notifications"
                className="hover:text-blue-400 transition-colors"
              >
                Notifications
              </Link>
              <button
                onClick={logout}
                className="bg-red-600 px-3 py-1 rounded hover:bg-red-700 transition"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link
                to="/login"
                className="hover:text-blue-400 transition-colors"
              >
                Login
              </Link>
              <Link
                to="/register"
                className="bg-blue-600 px-3 py-1 rounded hover:bg-blue-700 transition"
              >
                Sign Up
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
