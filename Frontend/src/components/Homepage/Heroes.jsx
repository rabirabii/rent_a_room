import React, { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { Label } from "../ui/label";
import axios from "axios";
import { createBooking } from "../../Redux/Slicer/Booking";
import { useSelector, useDispatch } from "react-redux";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Heroes = () => {
  const [rooms, setRooms] = useState([]);
  const { user, loading: authLoading } = useSelector((state) => state.auth);
  const { loading: bookingLoading, error: bookingError } = useSelector(
    (state) => state.booking
  );
  const dispatch = useDispatch();
  const [bookingData, setBookingData] = useState({
    roomId: "",
    checkIn: "",
    checkOut: "",
  });

  const getRooms = async () => {
    try {
      const response = await axios.get(
        "http://localhost:5001/api/room/get-all-rooms",
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          credentials: "include",
        }
      );
      const data = await response.data;
      if (data.success) {
        setRooms(data.data);
      }
    } catch (error) {
      console.error("Error fetching rooms:", error);
      toast.error("Failed to fetch rooms!");
    }
  };

  useEffect(() => {
    getRooms();
  }, []);

  // Handle booking submission
  const handleBooking = async () => {
    const { roomId, checkIn, checkOut } = bookingData;

    const checkInDate = new Date(checkIn);
    const checkOutDate = new Date(checkOut);
    if (checkInDate >= checkOutDate) {
      toast.error("Check-out date must be after check-in date");
      return;
    }

    if (checkInDate < new Date()) {
      toast.error("Check-in date cannot be in the past");
      return;
    }

    try {
      const result = await dispatch(
        createBooking({
          ...bookingData,
          userId: user.id,
        })
      ).unwrap();

      if (result) {
        toast.success("Booking created successfully!");
        setBookingData({
          roomId: "",
          checkIn: "",
          checkOut: "",
        });
      }
    } catch (error) {
      console.error(error || "Failed to create booking");
      toast.error("Failed to create booking");
    }
  };

  // Handle input changes
  const handleChange = (name, value) => {
    setBookingData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const getMinDate = () => {
    const today = new Date();
    return today.toISOString().split("T")[0];
  };

  const getMinCheckOutDate = () => {
    if (!bookingData.checkIn) return getMinDate();
    const checkInDate = new Date(bookingData.checkIn);
    const minCheckOut = new Date(checkInDate);
    minCheckOut.setDate(minCheckOut.getDate() + 1);
    return minCheckOut.toISOString().split("T")[0];
  };

  return (
    <header className="relative h-[600px] overflow-hidden">
      <motion.img
        src="./images/heroes.jpg"
        alt="hero"
        className="w-full h-full object-cover"
      />

      <div className="absolute top-0 left-0 w-full h-full bg-black/30 bg-opacity-50 flex flex-col items-center justify-center text-white p-4">
        <motion.h1
          initial={{ y: "100px", opacity: 0, rotate: 10 }}
          whileInView={{ y: "0", opacity: 1, rotate: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, ease: "easeInOut" }}
          whileHover={{ scale: 1.1 }}
          className="text-4xl md:text-5xl font-bold mb-4 text-center font-integral"
        >
          Welcome to Rabi.
        </motion.h1>
        <motion.p
          initial={{ y: "-100px", opacity: 0 }}
          whileInView={{ y: "0", opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 1, duration: 0.6 }}
          className="text-lg mb-8 text-center max-w-2xl"
        >
          Lorem ipsum dolor, sit amet consectetur adipisicing elit. Nostrum
          ipsum voluptatibus ab cumque nihil corporis veniam animi sapiente
          repellat ipsam quos ea, quas beatae iusto id doloribus. Ipsa,
          laudantium provident!
        </motion.p>
        <div className="max-w-frame bg-white/30 p-4 rounded-lg shadow-lg w-full gap-2">
          <div>
            <Select
              value={bookingData.roomId}
              onValueChange={(value) => handleChange("roomId", value)}
              disabled={bookingLoading || authLoading}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select Room" />
              </SelectTrigger>
              <SelectContent>
                {rooms.map((room) => (
                  <SelectItem key={room.id} value={room.id}>
                    {room.roomNumber} - {room.price}/Night
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Label htmlFor="checkin">Check In</Label>
            <Input
              type="date"
              id="checkin"
              min={getMinDate()}
              value={bookingData.checkIn}
              onChange={(e) => handleChange("checkIn", e.target.value)}
              className="w-full"
              disabled={bookingLoading || authLoading}
            />
            <Label htmlFor="checkout">Check Out</Label>
            <Input
              type="date"
              id="checkout"
              min={getMinCheckOutDate()}
              value={bookingData.checkOut}
              onChange={(e) => handleChange("checkOut", e.target.value)}
              className="w-full"
              disabled={bookingLoading || authLoading}
            />
            <Button
              className="w-full"
              onClick={handleBooking}
              disabled={bookingLoading || authLoading || !user}
            >
              Book
            </Button>
            {!user && (
              <p className="text-sm text-white text-center">
                Please login to make a booking
              </p>
            )}
          </div>
        </div>
      </div>

      <ToastContainer />
    </header>
  );
};

export default Heroes;
