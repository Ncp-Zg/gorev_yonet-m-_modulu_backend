const connectDB = require("./Config/db");
const JobCreate = require("./Models/JobCreate");
const User = require("./Models/User");
const { serialize } = require("cookie");
const jwtGenerator = require("./Helpers/jwtGenerator");

require("dotenv").config();

connectDB();

const io = require("socket.io")(8900, {
  cookie: true,
  cors: {
    origin: "http://localhost:3000",
  },
});

//battery Info

let batteryInfo = {
  messageType: "BatteryInfo",
  batteryLevel: "98",
};

let jobsFromDB;
let singleJob;
let user;
let tokenJWT;

const getUser = async (data) => {
  const user = await User.findOne({ email: data.email });
  if (user && (await user.matchPassword(data.password))) {
    const token = jwtGenerator(await user.id);
    tokenJWT = token 
  }
};

const getJobsfromDB = async () => {
  const jobs = await JobCreate.find({});
  jobsFromDB = jobs;
};

const singleJobFromDB = async (data) => {
  const currentJob = await JobCreate.findById(data._id);
  currentJob.externalReferenceId = data.externalReferenceId;
  currentJob.externalReferenceId = data.externalReferenceId;
  currentJob.taskList = data.taskList;
  currentJob.jobStatus = data.jobStatus;

  await currentJob.save();
};

io.on("connection", (socket) => {
  console.log("connection is ready");

  socket.on("jobCreate", async (data) => {
    const newJob = await JobCreate.create({
      messageType: "JobCreate",
      externalReferenceId: data.externalReferenceId,
      taskList: data.taskList,
      jobStatus: data.jobStatus,
    });

    await newJob.save();

    await getJobsfromDB();

    io.emit("jobList", jobsFromDB);
  });

  socket.on("getJobs", async () => {
    await getJobsfromDB();
    io.emit("listJobs", jobsFromDB);
  });

  socket.on("JobUpdate", async (data) => {
    await singleJobFromDB(data);

    await getJobsfromDB();

    io.emit("updatedJobList", jobsFromDB);
  });

  socket.emit("batteryInfo", batteryInfo);

  socket.on("loginUser", async (data) => {
    await getUser(data);

    io.emit("setHeader",tokenJWT)
  });
});
