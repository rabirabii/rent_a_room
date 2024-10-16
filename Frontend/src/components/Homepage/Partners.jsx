import React from "react";
import { motion } from "framer-motion";
const brands = [
  {
    id: 1,
    src: "/icons/airbnb.svg",
  },
  {
    id: 2,
    src: "/icons/booking.svg",
  },
  {
    id: 3,
    src: "/icons/expedia.svg",
  },
  {
    id: 4,
    src: "/icons/hotels.svg",
  },
  {
    id: 5,
    src: "/icons/trip.svg",
  },
];

const Partners = () => {
  const scrollSpeed = 10;
  return (
    <div className=" overflow-hidden">
      <div className="max-w-frame mx-auto py-8">
        <motion.div
          className="flex justify-between items-center flex-wrap gap-4"
          animate={{
            x: ["0%", "-100%"],
          }}
          transition={{
            x: {
              repeat: Infinity,
              repeatType: "loop",
              duration: scrollSpeed,
              ease: "linear",
            },
          }}
        >
          {brands.map((partner) => (
            <motion.img
              key={partner.id}
              src={partner.src}
              height={104}
              width={104}
              className="max-w-[76px] max-h-[76px] lg:max-w-24 lg:max-h-max-w-24 xl:max-w-[104px] xl:max-h-[104px]"
              alt={`Brand logo ${partner.id}`}
              initial={{ opacity: 0, scale: 0.5, rotate: -180 }}
              animate={{ opacity: 1, scale: 1, rotate: 0 }}
              exit={{ opacity: 0, scale: 0.5, rotate: 180 }}
            />
          ))}
        </motion.div>
      </div>
    </div>
  );
};

export default Partners;
