const Room = require("./Schema/Rooms");
const User = require("./Schema/Users");
const bcrypt = require("bcrypt");
const insertTestData = async () => {
  const saltRounds = 10;
  try {
    console.log("User Model:", User);
    console.log("Room Model:", Room);

    const users = [
      {
        name: "testuser1",
        email: "test1@example.com",
        password: "qwerty",
      },
      {
        name: "testuser2",
        email: "test2@example.com",
        password: "qwerty",
      },
      {
        name: "Test Admin",
        email: "testadmin@example.com",
        password: "qwerty",
        role: "admin",
      },
    ];

    const hashedUsers = await Promise.all(
      users.map(async (user) => {
        const hashedPassword = await bcrypt.hash(user.password, saltRounds);
        return { ...user, password: hashedPassword };
      })
    );

    await User.bulkCreate(hashedUsers);

    //   Bulk Create for Rooms
    const roomCount = await Room.count();
    if (roomCount === 0) {
      await Room.bulkCreate([
        {
          roomNumber: "101",
          description: "Single Bed",
          price: 50,
          facility: ["WiFi", "AC"],
          status: "available",
        },
        {
          roomNumber: "102",
          description: "Double Bed",
          price: 75,
          facility: ["WiFi", "AC", "TV"],
          status: "available",
        },
        {
          roomNumber: "201",
          description: "Deluxe",
          price: 100,
          facility: ["WiFi", "AC", "TV", "Mini Bar"],
          status: "available",
        },
      ]);
    }
  } catch (error) {
    console.error("Error inserting test data:", error);
  }
};

module.exports = { insertTestData };
