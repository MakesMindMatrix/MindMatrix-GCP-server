// const User = require('../models/user.model')
const asyncHandler = require('../middleware/asyncHandler')
const { interlibToken, interlibmyCourse, interlibReportData, interlibRecommendedCourse } = require('../helpers/apiFunction')

// Controller for my course, recommended course and leaderboard data
exports.courses_Interlib = asyncHandler(async (req, res, next) => {
    const respToken = await interlibToken()

    // API call for my course
    const email = req.params.email
    const myCourseResponse = await interlibmyCourse(email, respToken.data.token)

    // console.log(email, myCourseResponse)
    const report_data = await interlibReportData(email, myCourseResponse.data, respToken.data.token)

    const { branch, semester } = req.user
    const recCourse = await interlibRecommendedCourse(myCourseResponse, respToken.data.token, branch, semester)

    res.status(200).json({
        myCourseResponse,
        report_data,
        recCourse
    })
})
