import express from "express";
import mongoose, { set } from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import http from "http";
import { Keys } from "./model/keypress.js";
import { Users } from "./model/user.js";

const PORT = process.env.PORT || 5000;

dotenv.config();
set("strictQuery", false);

const app = express();
app.use(
  cors({
    origin: "*",
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
const server = http.createServer(app);


async function connectMongoDB() {
  let KEY = true;
  while (KEY) {
    try {
      let connect = await mongoose.connect(process.env.MONGODB_URL);
      if (connect.connections) {
        console.log(`MongoDB Success: Database connected successfully`);
        console.log(`Loop Ended`);
        KEY = false;
      }
    } catch (error) {
      // console.log(error)
      console.log(`Restarting MongoDB Connection ...`);
    }
  }
}
connectMongoDB();

app.get("/", (req, res) => {
  console.log(req.body);
  return res.status(200).send({ data: "KeyCount Server" });
});

app.post("/record-keypress", async (req, res) => {
  let { key, timeStamp, user, _workSpace, _fileType } = req.body;
  try {
    let keyCountUser = await Users.find({ user: user });
    if (!keyCountUser) {
      await Users.create({ user: user });
    }
    let keyPress = await Keys.create({
      key: key,
      timeStamp: timeStamp,
      user: user,
      _workSpace: _workSpace[0].name,
      _fileType: _fileType,
    });

    if (keyPress._id) {
      console.log("Keypress Recording Successful");
      return res.status(200).send({ data: "Keypress Recording Successful" });
    } else {
      console.log("Keypress Recording Failed");
      return res.status(201).send({ data: "Keypress Recording Failed" });
    }
  } catch (err) {
    if (err.code === 11000) {
      console.error("Duplicate field error:", err.message);
      return res.status(500).send({ data: "duplicate key error collection" });
    }
    console.log("Error Recording Keypress");
    return res.status(500).send({ data: "Error Recording Keypress" });
  }
});

app.post("/get-user-report", async (req, res) => {
  console.log(req.body);
  let { email } = req.body;
  try {
    let keypressReports = await Keys.find({ user: email });
    return res.status(200).send({ data: keypressReports });
  } catch (err) {
    return res.status(500).send({ data: "Couldn't carry out operation" });
  }
});

server.listen(PORT, (req, res) => {
  console.log(`Server,  is running on PORT ${PORT}`);
});
