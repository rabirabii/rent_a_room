import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { navItems } from "./NavItems/NavMenu";
import { motion } from "framer-motion";
import { Input } from "../ui/input";
import { User } from "lucide-react";
import HamMenu from "./Hamburger/HamMenu";
import { useDispatch, useSelector } from "react-redux";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { Button } from "../ui/button";
import { logoutCustomer } from "../../Redux/Reducer/auth";
import EditProfile from "../EditProfile/EditProfile";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const { token, user, error } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
      if (window.innerWidth >= 768) {
        setIsOpen(false);
      }
    };

    window, addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);
  console.log(user);
  const toggleOpen = () => setIsOpen(!isOpen);

  const handleLogout = () => {
    dispatch(logoutCustomer());
  };
  return (
    <div className="shadow-md z-50 sticky top-0">
      <div className="max-w-frame mx-auto px-4 py-4">
        <div className="flex justify-between items-center">
          <Link to="/" className="text-2xl font-bold font-integral">
            RABI RENT
          </Link>

          {/* Desktop */}
          <div className="hidden md:flex items-center space-x-8">
            {navItems.map((item) => (
              <motion.div
                key={item.name}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <Link to={item.path} className="font-medium">
                  {item.name}
                </Link>
              </motion.div>
            ))}
          </div>

          {/* Right Menu */}
          <div className="flex items-center space-x-4">
            <EditProfile />

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <User className="w-6 h-6 cursor-pointer" />
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56">
                <DropdownMenuSeparator />
                {user ? (
                  <DropdownMenuLabel>
                    Hello, {user.name}
                    <DropdownMenuSeparator />
                    <DropdownMenuItem>
                      <Button onClick={handleLogout}>Log out</Button>
                    </DropdownMenuItem>
                  </DropdownMenuLabel>
                ) : (
                  <DropdownMenuLabel>
                    Please log in
                    <DropdownMenuSeparator />
                    <DropdownMenuItem>
                      <Link to="/login">
                        <Button>Log in</Button>
                      </Link>
                    </DropdownMenuItem>
                  </DropdownMenuLabel>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
            {/* Mobile Menu */}
            {isMobile && (
              <HamMenu isOpen={isOpen} toggleOpen={() => toggleOpen()} />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
