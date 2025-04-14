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
const testBatch = require('./routes/test_batch.route')
const course = require('./routes/course.route')
const courseData = require('./routes/courseData.route')
const payment = require('./routes/payment.route')
const slot = require('./routes/slot.route')

app.use(express.json());
app.use(cookieParser())
const allowedOrigins = [
  'http://localhost:3000',
  'http://127.0.0.1:3000',
  'https://mindmatrix-frontend-416303935037.asia-south1.run.app',
  'https://staging.mindmatrix.io/'
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

app.use(bodyParser.urlencoded({ extended: false }))

app.use("/api/v1", user)
app.use("/api/v1", college)
app.use("/api/v1", branch)
app.use("/api/v1", university)
app.use("/api/v1", batch)
app.use("/api/v1", course)
app.use("/api/v1", courseData)
app.use("/api/v1", payment)
app.use("/api/v1", testBatch)
app.use("/api/v1", slot)

app.use(customError)

module.exports = app;