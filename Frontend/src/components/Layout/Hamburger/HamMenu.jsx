import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X } from "lucide-react";
import Navigation from "./Navigation";
const HamMenu = ({ isOpen, toggleOpen }) => {
  const [isHovered, setIsHovered] = useState(false);
  const toggleVariants = {
    open: {
      clipPath: "circle(1000px at calc(100% - 40px) 40px)",
      transition: {
        type: "spring",
        stiffness: 20,
        restDelta: 2,
      },
    },
    closed: {
      clipPath: "circle(30px at calc(100% - 40px) 40px)",
      transition: {
        delay: 0.5,
        type: "spring",
        stiffness: 400,
        damping: 40,
      },
    },
  };

  const backgroundVariants = {
    glass: {
      backgroundColor: "rgba(255, 255, 255, 0.2)",
      backdropFilter: "blur(10px)",
    },
    solid: {
      backgroundColor: "rgba(255, 255, 255, 1)",
      backdropFilter: "blur(0px)",
    },
  };

  const handleBackgroundClick = (e) => {
    if (e.target === e.currentTarget) {
      toggleOpen();
    }
  };
  return (
    <div className="relative">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="fixed top-0 right-0 w-1/2 h-screen"
            initial="closed"
            animate="open"
            exit="closed"
            variants={toggleVariants}
            onClick={handleBackgroundClick}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            onTouchStart={() => setIsHovered(true)}
            onTouchEnd={() => setIsHovered(false)}
          >
            <motion.div
              className="w-full h-full items-center justify-center"
              initial="glass"
              animate={isHovered ? "solid" : "glass"}
              variants={backgroundVariants}
              transition={{ duration: 0.5, ease: "easeInOut" }}
            >
              <Navigation toggleOpen={toggleOpen} />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      <button
        onClick={toggleOpen}
        className="relative z-50 p-2 rounded-full bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200"
      >
        <motion.div
          initial={false}
          animate={isOpen ? "open" : "closed"}
          variants={{
            open: { rotate: 180 },
            closed: { rotate: 0 },
          }}
          transition={{ duration: 0.4 }}
        >
          {isOpen ? (
            <X className="w-6 h-6 text-gray-800" />
          ) : (
            <Menu className="w-6 h-6 text-gray-800" />
          )}
        </motion.div>
      </button>
    </div>
  );
};

export default HamMenu;
