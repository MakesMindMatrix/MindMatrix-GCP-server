const express = require('express');
const app = express();
const cors = require("cors")
const cookieParser = require('cookie-parser')
const bodyParser = require("body-parser")
const customError = require('./middleware/error')

const user = require('./routes/user.route');
const branch = require('./routes/branch.route')
const university = require('./routes/university.route')
const college = require('./routes/college.route')
const batch = require('./routes/batch.route')
const Recommendation = require('./routes/recommendation.route')
const course = require('./routes/course.route')
const courseInfo = require('./routes/courseInfo.route')
const noticeBoard = require('./routes/noticeBoard.route')
const payment = require('./routes/payment.route')
const slot = require('./routes/slot.route')
const userInterest = require('./routes/userInterest.route')
const collegeSubscription = require('./routes/collegeSubscription.route')
const buildProfileActivity = require('./routes/buildProfileActivity.route');
const careerShapingActivity = require('./routes/careerShapingActivity.route'); 
const connectMentorActivity = require('./routes/connectMentorActivity.route'); 
const chat = require('./routes/chat.route');


const allowedOrigins = [
  'http://localhost:3000',
  'http://127.0.0.1:3000',
  'https://staging.mindmatrix.io',
  'https://makes.mindmatrix.io'
];

app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true
}));

app.options('*', cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true
}));

app.use(express.json());
app.use(cookieParser())
app.use(bodyParser.urlencoded({ extended: false }))

app.use("/api/v1", user)
app.use("/api/v1", college)
app.use("/api/v1", branch)
app.use("/api/v1", university)
app.use("/api/v1", batch)
app.use("/api/v1", course)
app.use("/api/v1", courseInfo)
app.use("/api/v1", payment)
app.use("/api/v1", Recommendation)
app.use("/api/v1", slot)
app.use("/api/v1", userInterest)
app.use("/api/v1", collegeSubscription)
app.use("/api/v1", noticeBoard)
app.use("/api/v1", buildProfileActivity);
app.use("/api/v1", careerShapingActivity);
app.use("/api/v1", connectMentorActivity);
app.use("/api/v1", chat);

app.use(customError)

module.exports = app;