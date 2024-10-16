import React from "react";
import { motion } from "framer-motion";
import { navItems } from "../NavItems/NavMenu";
import MenuItems from "./MenuItem";
const variants = {
  open: {
    transition: { staggerChildren: 0.07, delayChildren: 0.2 },
  },
  closed: {
    transition: { staggerChildren: 0.05, staggerDirection: -1 },
  },
};

const Navigation = ({ toggleOpen }) => {
  // Filter out the main navigation and social media links
  const mainNavItems = navItems.filter((item) => !item.isSocial);

  return (
    <motion.ul
      variants={variants}
      className="p-4 flex flex-col mt-[34px] h-full"
    >
      {/* Main Navigation Items */}
      {mainNavItems.map((item) => (
        <MenuItems
          key={item.name}
          name={item.name}
          href={item.path}
          icon={item.icon}
          onClick={toggleOpen}
        />
      ))}

      {/* Spacer to push icons to the bottom */}
      <div className="flex-grow"></div>

      {/* Social Media Icons at the bottom */}
      {/* <div className="flex items-center justify-center gap-12 mt-auto mb-8">
        {socialNavItems.map((item) => (
          <a
            key={item.name}
            href={item.path}
            target="_blank"
            rel="noopener noreferrer"
            className="text-gray-700 hover:text-gray-900"
            onClick={toggleOpen}
          >
            {item.icon && <item.icon className="w-6 h-6" />}
          </a>
        ))}
      </div> */}
    </motion.ul>
  );
};

export default Navigation;
