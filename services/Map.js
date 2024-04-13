import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";
import cors from "cors";

const app = express();
app.use(cors());

const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*", // Adjust according to frontend's origin
    methods: ["GET", "POST"],
  },
});

const drivers = {
  driver1: { lat: 39.1653, lng: -86.5264, status: "available" },
  driver2: { lat: 39.1713, lng: -86.5164, status: "on delivery" },
};

const packages = [
  {
    id: "package1",
    origin: { lat: 39.1653, lng: -86.5264 },
    destination: { lat: 39.1683, lng: -86.508 },
    status: "In Transit",
    assignedDriver: "driver1",
  },
];

io.on("connection", (socket) => {
  console.log("A user connected");

  socket.on("register", ({ role, id }) => {
    if (role === "driver") {
      socket.emit("driverLocation", drivers[id] || {});
    } else if (role === "manager") {
      socket.join("managers");
      socket.emit("allDriversLocations", drivers);
      socket.emit("allPackages", packages);
    }
  });

  socket.on("updateLocation", ({ id, lat, lng }) => {
    if (drivers[id]) {
      drivers[id].lat = lat;
      drivers[id].lng = lng;
      io.to("managers").emit("driverLocationUpdate", { id, lat, lng });

      packages.forEach((pkg) => {
        if (pkg.assignedDriver === id) {
          pkg.origin.lat = lat;
          pkg.origin.lng = lng;
          io.emit("packagePositionUpdate", { lat, lng });
        }
      });
    }
  });

  socket.on("disconnect", () => {
    console.log("A user disconnected");
  });
});

const PORT = process.env.PORT || 8180;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
