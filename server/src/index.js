require("dotenv").config();
const express = require("express");
require("express-async-errors");
const cors = require("cors");
const corsOptions = require("./config/corsOptions");
const cookieParser = require("cookie-parser");
const { MONGO_URI } = require("./config");
const connectDB = require("./config/connectDB");
const { default: mongoose } = require("mongoose");
const errorHandler = require("./middleware/errorHandler");
const authRoute = require("./routes/auth");
const blogRoute = require("./routes/blog");
const userRoute = require("./routes/user");
const notificationRoute = require("./routes/notifications");

const app = express();
const port = process.env.PORT || 8080;

const userSockets = {};

const httpServer = require("http").createServer(app);
const io = require("socket.io")(httpServer, {
  cors: {
    // origin: `https://typique.onrender.com`,
    origin : 'http://localhost:5173'
  },
});

io.on("connection", (socket) => {
  socket.on("register", (user) => {
    userSockets[user.id] = socket.id;
  });

  socket.on("send-notification", (data) => {
    socket.broadcast.to(userSockets[data?.authorId]).emit("notify", data);
  });

  socket.on("disconnect", () => {
    for (const [userId, socketObj] of Object.entries(userSockets)) {
      if (socketObj.id === socket.id) {
        delete userSockets[userId];
        break;
      }
    }
  });
});

connectDB(MONGO_URI);

app.use(
  express.json({
    limit: "50mb",
  })
);
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(cors(corsOptions));
app.disable("x-powered-by");

app.get("/", (_, res) => {
  res.send("Welcome to Typique Server 🔥");
});

app.use("/api/auth", authRoute);
app.use("/api/blog", blogRoute);
app.use("/api/user", userRoute);

app.use("/api/notification", notificationRoute);

app.use(errorHandler);

mongoose.connection.once("open", () => {
  console.log(`Connected to db 🔥🔥`);
  httpServer.listen(port, () => {
    console.log(`⚡ Server running on http://localhost:${port}`);
  });
});

mongoose.connection.on("error", (error) => {
  console.log(error);
});
