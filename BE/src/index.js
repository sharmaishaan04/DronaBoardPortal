// import { PrismaClient } from "@prisma/client";

const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
module.exports = prisma;
const path = require("path");
const express = require("express");
const mainRouter = require("./routes/index.js");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const app = express();
const port = 3000;
const host = "0.0.0.0";

const FRONT_END_URL = "http://192.168.31.3:10300";
// const FRONT_END_URL = "http://localhost:5173";
const corsOptions = {
  origin: FRONT_END_URL,
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeader: ["Content-Type", "Authorization"],
  credentials: true, // Allow cookies to be sent
};
app.use(cors(corsOptions));
// app.use(cors());
app.use(cookieParser());

app.use("/uploads", express.static(path.join(__dirname, "uploads")));
app.use(express.json());
app.use("/api/v1", mainRouter);
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: "Something went wrong!" });
});
app.listen(port, host, () => {
  console.log("server running on port ", port, host);
});
