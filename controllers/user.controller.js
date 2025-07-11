const User = require('../models/user.model')
const Batch = require('../models/batch.model')
const Payment = require('../models/payment.model')
const ErrorHandler = require('../utils/errorHandler')
const asyncHandler = require('../middleware/asyncHandler')
const sendToken = require('../utils/jwtToken')
const sendEmail = require("../utils/sendEmail");
const crypto = require("crypto");
const sendEmailHTML = require('../utils/sendEmailHTML');
const axios = require('axios')


// Register User
exports.registerUser = asyncHandler(async (req, res, next) => {
    // const { name, email, password } = req.body;
    const userDetail = req.body
    // console.log(userDetail)

    if (
        !(
            userDetail.name &&
            userDetail.email
        )
    ) {
        return next(new ErrorHandler("All fields are required", 400))
    }

    const email = userDetail.email
    // Check for existing user
    const existingUser = await User.findOne({ email });
    if (existingUser) {
        // return next(new ErrorHandler("You are already registered", 400))
        // return res.redirect('/login')
        return res.status(409).json({ success: false, redirect: true, message: "You are already registered please login" });
    }

    const code = Math.random().toString().substring(2, 8);
    userDetail.secret = code
    // console.log(userDetail)
    // const courseInfo = new CourseInfo(req.body);
    // const savedCourseInfo = await courseInfo.save();
    const userData = new User(userDetail)
    const user = await userData.save()
    // console.log("user-data", userData)
    // console.log("user", user)
    res.status(201).json({
        success: true,
        message: "User registered succesfully",
        user,
    });

})

// Register with google
exports.registerWithGoogle = asyncHandler(async (req, res, next) => {
    const redirectUri = `${process.env.BASE_URL}/api/v1/google/register/callback`;
    const scope = [
        'https://www.googleapis.com/auth/userinfo.email',
        'https://www.googleapis.com/auth/userinfo.profile',
    ].join(' ');

    const authUrl = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${process.env.GOOGLE_CLIENT_ID}&redirect_uri=${redirectUri}&response_type=code&scope=${scope}&access_type=offline&prompt=consent`;

    res.redirect(authUrl);
})

// Registration data collection with google
exports.registerWithGoogleData = asyncHandler(async (req, res, next) => {
    const { code, error } = req.query;

    if (error) {
        // User clicked cancel or something went wrong in OAuth
        console.log("Google OAuth register error:", error);
        return res.redirect(`${process.env.CLIENT_BASE_URL}/register?error=${error}`);
    }
    
    try {

        const tokenResponse = await axios.post('https://oauth2.googleapis.com/token', null, {
            params: {
                code,
                client_id: process.env.GOOGLE_CLIENT_ID,
                client_secret: process.env.GOOGLE_CLIENT_SECRET,
                redirect_uri: `${process.env.BASE_URL}/api/v1/google/register/callback`,
                grant_type: 'authorization_code',
            }
        })
        console.log("Register Called")

        const accessToken = tokenResponse.data.access_token

        const userInfo = await axios.get(
            `https://www.googleapis.com/oauth2/v1/userinfo?alt=json&access_token=${accessToken}`
        )

        const { id, email, name, picture } = userInfo.data
        console.log(id, email, name)
        let existingUser = await User.findOne({ email })

        if (existingUser) {
            return res.redirect(`${process.env.CLIENT_BASE_URL}/login?msg=user_exists`)
        }

        const user = await User.create({
            name,
            email,
            isverified: true,
            password: "12345678",
            avatar: {
                public_id: 'public_id',
                url: 'secure_url'
            }
        })


        const token = user.getJWTToken(user._id)

        const options = {
            expires: new Date(
                Date.now() + process.env.COOKIE_EXPIRE * 24 * 60 * 60 * 1000
            ),
            secure: true,
            httpOnly: true,
            sameSite: 'None'
        }

        res.cookie('token', token, options)

        res.redirect(`${process.env.CLIENT_BASE_URL}/login`)
    } catch (error) {
        console.log(error)
    }
})


exports.updateUser = asyncHandler(async (req, res, next) => {
    // Collect all the information from user
    const { email, phone, university, college, branch, roll_no, semester } =
        req.body;

    // Check for all details are avilable in form
    if (
        !(
            email &&
            phone &&
            university &&
            college &&
            branch &&
            roll_no &&
            semester
        )
    ) {
        return next(new ErrorHandler("All fields are reuired", 400))
    }

    let user = await User.findOne({ email });

    if (!user) {
        return next(new ErrorHandler("User not found", 404))
    }

    const updatedUser = await User.findByIdAndUpdate(
        { _id: user._id },
        {
            $set: {
                email,
                phone,
                university,
                college,
                branch,
                roll_no,
                semester,
            },
        },
        { new: true }
    );

    user = updatedUser;

    sendToken(user, 201, res)
})

exports.verifyUser = asyncHandler(async (req, res, next) => {
    const { secretCode, email } = req.body;
    // Check for user
    const user = await User.findOne({ email });

    if (user.secret === Number(secretCode)) {
        // console.log(user.secret, secretCode)
        const updatedUser = await User.findByIdAndUpdate(
            { _id: user._id },
            {
                $set: {
                    isverified: true,
                },
            },
            { new: true }
        );

        res.status(201).json({
            success: true,
            message: "User verified succesfully",
            user: updatedUser,
        });
    } else {
        res.status(200).json({
            success: false,
            message: "Secret does not match",
        });
    }

})

exports.deleteUser = asyncHandler(async (req, res, next) => {
    const user = await User.findById(req.user.id)

    if (!user) {
        return next(new ErrorHandler("User not found", 400))
    }
    const deletedUser = await User.findByIdAndDelete(req.user.id)
    res.status(200).json({
        success: true,
        message: "User deleted successfully",
        deletedUser
    })
})

exports.subscriptionVerifyCreate = asyncHandler(async (req, res, next) => {
    const url = "https://api.phonepe.com/apis/identity-manager/v1/oauth/token";

    const params = new URLSearchParams();
    params.append("client_id", 'SU2503231347450136164095');
    params.append("client_version", "1");
    params.append("client_secret", '9bb3ff9e-a677-4d48-8970-dc147d0950e4');
    params.append("grant_type", "client_credentials");

    const tokenResponse = await fetch(url, {
        method: "POST",
        headers: {
            "Content-Type": "application/x-www-form-urlencoded",
        },
        body: params.toString(),
    });

    const token = await tokenResponse.json();
    const merchantOrderId = crypto.randomBytes(16).toString('hex')

    const apiResponse = await fetch(`https://api.phonepe.com/apis/pg/checkout/v2/pay`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `O-Bearer ${token.access_token}`
        },
        body: JSON.stringify({
            merchantOrderId,
            "amount": 100,
            "expireAfter": 1200,
            "paymentFlow": {
                "type": "PG_CHECKOUT",
                "message": "Payment message used for collect requests",
                "merchantUrls": {
                    "redirectUrl": `https://makes.mindmatrix.io/api/v1/status/${merchantOrderId}`
                },
                "paymentModeConfig": {
                    "enabledPaymentModes": [
                        {
                            "type": "UPI_INTENT"
                        },
                        {
                            "type": "UPI_COLLECT"
                        },
                        {
                            "type": "UPI_QR"
                        },
                        {
                            "type": "NET_BANKING"
                        },
                        {
                            "type": "CARD",
                            "cardTypes": [
                                "DEBIT_CARD",
                                "CREDIT_CARD"
                            ]
                        }
                    ],
                }
            }
        })
    })
    const response = await apiResponse.json()
    console.log(response)
    res.status(200).json({
        success: true,
        message: "Payment Data for registration successfully",
        response,
        merchantOrderId
    })
})

exports.subscriptionVerifyStatus = asyncHandler(async (req, res, next) => {
    const params = new URLSearchParams();
    params.append("client_id", 'SU2503231347450136164095');
    params.append("client_version", "1");
    params.append("client_secret", '9bb3ff9e-a677-4d48-8970-dc147d0950e4');
    params.append("grant_type", "client_credentials");

    const Id = req.params.id;

    const url = "https://api.phonepe.com/apis/identity-manager/v1/oauth/token";

    const tokenResponse = await fetch(url, {
        method: "POST",
        headers: {
            "Content-Type": "application/x-www-form-urlencoded",
        },
        body: params.toString(),
    });

    const token = await tokenResponse.json();

    const apiResponse = await fetch(`https://api.phonepe.com/apis/pg/checkout/v2/order/${Id}/status
    `, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `O-Bearer ${token.access_token}`
        }
    })
    const response = await apiResponse.json()

    if (response.state === 'COMPLETED') {
        const user = await Payment.create({
            transactionId: response.paymentDetails[0].transactionId,
            paymentMode: response.paymentDetails[0].paymentMode,
            maskedAccountNumber: response.paymentDetails[0].instrument.maskedAccountNumber,
            ifsc: response.paymentDetails[0].instrument.ifsc,
            accountType: response.paymentDetails[0].instrument.accountType,
            paymentType: response.paymentDetails[0].rail.type,
        })

        res.status(200).json({
            success: true,
            message: "Payment Data status for registration",
            user
        })
    }
})

// Login User
exports.loginUser = asyncHandler(async (req, res, next) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return next(new ErrorHandler("Please enter email & password", 400))
    }

    const user = await User.findOne({ email }).select("+password").populate("branch").populate("college").populate("university")

    if (!user) {
        return next(new ErrorHandler("Invalid email or password", 401))
    }

    const isPasswordMatched = await user.comparePassword(password)

    if (!isPasswordMatched) {
        return next(new ErrorHandler("Invalid email or password", 401))
    }
    if (user?.isverified === true && user?.college !== undefined) {
        sendToken(user, 200, res)
    } else {
        res.status(200).json({
            success: true,
            message: "User registered succesfully",
            user,
        });
    }
    // console.log(user)
})

// Login with google
exports.loginWithGoogle = asyncHandler(async (req, res, next) => {
    const redirectUri = `${process.env.BASE_URL}/api/v1/google/login/callback`;

    const scope = [
        'https://www.googleapis.com/auth/userinfo.email',
        'https://www.googleapis.com/auth/userinfo.profile',
    ].join(' ');

    const authUrl = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${process.env.GOOGLE_CLIENT_ID}&redirect_uri=${redirectUri}&response_type=code&scope=${scope}&access_type=offline&prompt=consent`;

    res.redirect(authUrl);
})

// Login data verification with google
exports.loginWithGoogleData = asyncHandler(async (req, res, next) => {
    const { code, error } = req.query;

    if (error) {
        // Optional: Log error for debugging
        console.log("Google OAuth error:", error);

        // Redirect user back to frontend with error message
        return res.redirect(`${process.env.CLIENT_BASE_URL}/login?error=${error}`);
    }


    try {
        const tokenResponse = await axios.post('https://oauth2.googleapis.com/token', null, {
            params: {
                code,
                client_id: process.env.GOOGLE_CLIENT_ID,
                client_secret: process.env.GOOGLE_CLIENT_SECRET,
                redirect_uri: `${process.env.BASE_URL}/api/v1/google/login/callback`,
                grant_type: 'authorization_code',
            },
        });

        const accessToken = tokenResponse.data.access_token;

        const userInfo = await axios.get(
            `https://www.googleapis.com/oauth2/v1/userinfo?alt=json&access_token=${accessToken}`
        );

        const { email } = userInfo.data;
        const user = await User.findOne({ email });
        if (!user) {
            return res.redirect(`${process.env.CLIENT_BASE_URL}/register?msg=user_not_found`);
        }
        const token = user.getJWTToken(user._id)

        const options = {
            expires: new Date(
                Date.now() + process.env.COOKIE_EXPIRE * 24 * 60 * 60 * 1000
            ),
            secure: true,
            httpOnly: true,
            sameSite: 'None'
        }

        res.cookie('token', token, options)

        res.redirect(`${process.env.CLIENT_BASE_URL}/login`)
        // res.redirect("http://localhost:3000/login")
    } catch (error) {
        console.log(error)
    }
})

// Logout User
exports.logOut = asyncHandler(async (req, res, next) => {
    res.cookie("token", "", {
        expires: new Date(Date.now(0)),
        httpOnly: true,
        secure: true, // 🔥 required if used when setting
        sameSite: "None" // 🔥 required if used when setting
    })
    res.status(200).json({
        success: true,
        message: "Logged out successfully"
    })
})

// // Controller for get single user
exports.getUserDetails = asyncHandler(async (req, res, next) => {

    const user = await User.findById(req.user.id).populate("branch").populate("college").populate("university");

    if (!user) {
        return next(new ErrorHandler("User not found", 404))
    }

    res.status(200).json({
        success: true,
        message: "User details fetched successfully",
        user
    })
})

// Forgot Password
exports.forgotPassword = asyncHandler(async (req, res, next) => {

    const user = await User.findOne({ email: req.body.email });

    if (!user) {
        return next(new ErrorHandler("User not found", 404));
    }

    // Get ResetPassword Token
    const resetToken = user.getResetPasswordToken();

    await user.save({ validateBeforeSave: false });

    const resetPasswordUrl = `${process.env.CLIENT_BASE_URL}/password/reset/${resetToken}`;

    console.log(`${process.env.CLIENT_BASE_URL}/password/reset/${resetToken}`)

    const message = `Dear Student \n\n We received a request to reset your password for your MindMatrix account. \n\n To reset your password, please click the link below: \n\n ${resetPasswordUrl} \n\n If you did not request this reset, please ignore this email. \n\n Best regards, \n Team MindMatrix`;
    // const message = `Your password reset token is :- \n\n ${resetPasswordUrl} \n\nIf you have not requested this email then, please ignore it.`;

    try {
        await sendEmail({
            email: user.email,
            subject: `MindMatrix Password Recovery`,
            message,
        });

        res.status(200).json({
            success: true,
            message: `Email sent to ${user.email} successfully`,
        });
    } catch (error) {
        user.resetPasswordToken = undefined;
        user.resetPasswordExpire = undefined;

        await user.save({ validateBeforeSave: false });

        return next(new ErrorHandler(error.message, 500));
    }
});

// Update profile
exports.updateProfile = asyncHandler(async (req, res, next) => { })

// Send verification code 
exports.verifyCode = asyncHandler(async (req, res, next) => {
    const { email, secretCode, name } = req.body;

    const message = `Hello ${name},\n\nThank you for registering with MindMatrix. Please enter the following 6-digit code to verify your email address: ${secretCode}.\n\nHappy learning!\n\nTeam MindMatrix`;

    try {
        await sendEmail({
            email,
            subject: `MindMatrix Code Verification`,
            message,
        });

        res.status(200).json({
            success: true,
            message: `Email sent to ${email} successfully`,
        });
    } catch (error) {

        return next(new ErrorHandler(error.message, 500));
    }
})

// Reset Password
exports.resetPassword = asyncHandler(async (req, res, next) => {
    // creating token hash
    const resetPasswordToken = crypto
        .createHash("sha256")
        .update(req.params.token)
        .digest("hex");

    const user = await User.findOne({
        resetPasswordToken,
        resetPasswordExpire: { $gt: Date.now() },
    });

    if (!user) {
        return next(
            new ErrorHandler(
                "Reset Password Token is invalid or has been expired",
                400
            )
        );
    }

    if (req.body.password !== req.body.confirmPassword) {
        // console.log(req.body.password)
        return next(new ErrorHandler("Password does not ", 400));
    }

    user.password = req.body.password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;

    await user.save();

    sendToken(user, 200, res);
});

// Sending mails
exports.sendInvitationMail = asyncHandler(async (req, res, next) => {
    const { email } = req.body;

    const message = '<p style="color: black">Dear Student, <br/><br/> Discover how Generative AI transforms your engineering domain in just 2 weeks! Update your password <a href="http://makes.mindmatrix.io/password/forgot">here</a> to access the dashboard and start exploring. <br/><br/>Exciting courses are coming your way next semester—stay tuned for updates! Join our <a href="https://www.linkedin.com/groups/14555405/">LinkedIn community<a/> to connect and stay informed.<br/><br/> Best regards, <br/> Team MindMatrix</p>';

    try {
        await sendEmailHTML({
            email,
            subject: `Kickstart Your Generative AI Journey Today!`,
            message,
        });

        res.status(200).json({
            success: true,
            message: `Email sent to ${email} successfully`,
        });
    } catch (error) {
        console.log(error)
        return next(new ErrorHandler(error.message, 500));
    }
})




// ################## API(ADMIN) - calls for interlib Integration #################


// get all user - (Admin)
exports.getAllUser = asyncHandler(async (req, res, next) => {
    const page = parseInt(req.query.page)
    const limit = parseInt(req.query.limit)
    const { college, branch, semester } = req.query
    // console.log(college, branch, semester)

    const query = {}
    if (college) { query.college = college }
    if (branch) { query.branch = branch }
    if (semester) { query.semester = semester }

    const startIndex = (page - 1) * limit;

    const users = await User.find({
        createdAt: {
            $gte: new Date('2025-06-03T00:00:00.000Z'),
            $lt: new Date('2025-06-23T00:00:00.000Z')
        }
    }).populate("branch").populate("college").populate("university").populate("payments");

    // let payment;

    // for(let i = 0; i<=users.length; i++){
    //  let payment = await User.find(query).populate("payments")
    //  console.log(await Payment.find())
    // }
    const filterData = users?.map((elm) => {
        const date = new Date(elm.createdAt)
        const readable = date.toLocaleString("en-IN", {
            timeZone: "Asia/Kolkata", // Convert to IST
            year: "numeric",
            month: "long",
            day: "numeric",
            hour: "numeric",
            minute: "2-digit",
            second: "2-digit",
            hour12: true,
        });
        const data = {
            'Name': elm?.name,
            'Email': elm?.email,
            'Branch': elm?.branch?.name,
            'Semester': elm?.semester,
            'Mobile': elm?.phone,
            'Date': readable,
            'College': elm?.college?.name,
            'Payment': elm.payment
        }

        return data
    })

    const total = await User.find(query).length
    // console.log(payment)

    // console.log(usersdata)


    // if (users.data && users.data.length > 0) {
    //     console.log("called")
    //     const filterStudent = users.data.map((elm) => {
    //         console.log(elm)
    //         return payment.data.filter((pay) => {
    //             // console.log(pay.user.email)
    //             return pay.user.email === elm.email
    //         })
    //     })
    //     console.log(filterStudent)
    // }
    // 658d24a8d490bba532a14655
    // console.log(filterStudent)
    // console.log(query, users.length)

    res.status(200).json({
        success: true,
        message: "All users fetched successfully",
        lenght: users?.length,
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
        data: filterData
    })
})

// get single user - (Admin)
exports.getSingleUser = asyncHandler(async (req, res, next) => {
    const user = await User.findById(req.params.id).populate("branch").populate("college").populate("university");

    if (!user) {
        return next(new ErrorHandler("USer does not exist", 400))
    }

    res.status(200).json({
        success: true,
        message: "User fetched successfully",
        user
    })
})

// update user role - (Admin)
exports.updtaeUserRole = asyncHandler(async (req, res, next) => {
    const userData = {
        role: req.body.role
    }

    const user = await User.findByIdAndUpdate(req.params.id, userData, {
        new: true,
        runValidators: true
    })

    res.status(200).json({
        success: true,
        message: "Role updated successfully",
        user
    })
})

// delete user - (Admin)
exports.deleteUser = asyncHandler(async (req, res, next) => {
    const user = await User.findById(req.params.id)

    if (!user) {
        return next(new ErrorHandler("User not found", 400))
    }
    const deletedUser = await User.findByIdAndDelete(req.params.id)
    res.status(200).json({
        success: true,
        message: "User deleted successfully",
        deletedUser
    })
})



// ################## API - calls for interlib Integration #################




// Generate token for interlib API
// exports.generateInterlibToken = asyncHandler(async (_req, res, next) => {

//     const apiResponse = await fetch('https://mindmatrix.interleap.com/api/external/generate-token', {
//         method: 'POST',
//         headers: {
//             'Accept': 'application/json',
//             'Content-Type': 'application/json'
//         },
//         body: JSON.stringify({ client_id: process.env.client_id })
//     })

//     const response = await apiResponse.json()

//     res.status(200).json(response)
// })

// SSO Login for student - get
exports.interlibSSOLogin = asyncHandler(async (req, res, next) => {
    const { email } = req.params

    const Endpoint = 'https://mindmatrix.interleap.com/api/authorize'
    const Client_Id = process.env.CLIENT_ID
    const Redirect_URI = 'https://mindmatrix.interleap.com/sso-login'
    const Student_Email_Id = email

    const url = `${Endpoint}?client_id=${Client_Id}&redirect_uri=${Redirect_URI}&email=${Student_Email_Id}`
    // &external_batch_id=GAIBME2401
    const test = `${Endpoint}?client_id=${Client_Id}&redirect_uri=${Redirect_URI}&email=${Student_Email_Id}`

    res.status(200).json(url)
})

// Add and Enrol Student - post
exports.enrollStudentOn_InterlibCourse = asyncHandler(async (req, res, next) => {
    const tokenResponse = await fetch('https://mindmatrix.interleap.com/api/external/generate-token', {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ client_id: process.env.CLIENT_ID })
    })

    const respToken = await tokenResponse.json()

    const { name, email, batch_id } = req.body

    const apiResponse = await fetch('https://mindmatrix.interleap.com/api/external/add-and-enroll-student', {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${respToken.data.token}`
        },
        body: JSON.stringify({
            "studentInfo": {
                email,
                name
            },
            "external_batch_id": batch_id

        })
    })

    const response = await apiResponse.json()

    res.status(200).json(response)
})

// Get Student Courses - get
exports.getStudentCourses_Interlib = asyncHandler(async (req, res, next) => {

    const tokenResponse = await fetch('https://mindmatrix.interleap.com/api/external/generate-token', {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ client_id: process.env.CLIENT_ID })
    })

    const respToken = await tokenResponse.json()

    const email = req.params.email

    const apiResponse = await fetch(`https://mindmatrix.interleap.com/api/external/student-courses?email=${email}`, {
        method: 'GET',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${respToken.data.token}`
        }
    })
    const response = await apiResponse.json()

    res.status(200).json(response)
})

// Get Courses -get
exports.getAllCourses_Interlib = asyncHandler(async (req, res, next) => {
    const tokenResponse = await fetch('https://mindmatrix.interleap.com/api/external/generate-token', {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ client_id: process.env.CLIENT_ID })
    })

    const respToken = await tokenResponse.json()

    const apiResponse = await fetch('https://mindmatrix.interleap.com/api/external/courses', {
        method: 'GET',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${respToken.data.token}`
        }
    })
    const response = await apiResponse.json()

    res.status(200).json(response)
})

// Get Leaderboard data
exports.leaderBoardData = asyncHandler(async (req, res, next) => {

    const tokenResponse = await fetch('https://mindmatrix.interleap.com/api/external/generate-token', {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ client_id: process.env.CLIENT_ID })
    })

    const respToken = await tokenResponse.json()

    const { batch_id } = req.body
    const email = req.user.email
    // console.log(await Batch.find({"branch": "6477df575e21f533c359a02c", semester: "1"}).populate('branch'))

    const apiResponse = await fetch('https://learn.interleap.com/api/analytics/reports', {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${respToken.data.token}`
        },
        body: JSON.stringify({
            client_id: process.env.CLIENT_ID,
            batch_id
        })
    })

    const response = await apiResponse.json()
    // console.log(email)
    const user = response.data.StudentProgress.filter((elm) => elm.StudentProgress.summary.StudentEmailId === email)
    let total = 0;
    let completed = 0;
    user[0].StudentProgress.TopicDetails.map((elm) => {
        total = total + elm.totalTasks
        completed = completed + elm.tasksStatus.completed
    })
    const topic = user[0].StudentProgress.TopicDetails
    const all_user = response.data.StudentProgress.map((elm) => elm.StudentProgress.summary)
    const all_user_sorted = all_user.sort((a, b) => b.TotalPercentage - a.TotalPercentage)
    const position = all_user_sorted.findIndex(elm => elm.StudentEmailId === email)

    const data = {
        courseName: response.data.CourseName,
        totalTopics: response.data.NumberOfTopics,
        completedTopics: user[0].StudentProgress.summary.TopicsCompleted,
        progressPercentage: user[0].StudentProgress.summary.TotalPercentage,
        totalStudent: response.data.StudentProgress.length,
        studentPosition: position + 1,
        totalTask: total,
        completedTask: completed,
        topic
    }

    res.status(200).json(data)
})

// Get Enrolled student list by batch id on interlib
exports.enrolledList_Interlib = asyncHandler(async (req, res, next) => {
    const tokenResponse = await fetch('https://mindmatrix.interleap.com/api/external/generate-token', {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ client_id: process.env.CLIENT_ID })
    })

    const respToken = await tokenResponse.json()

    const { batch_id } = req.body
    // const email = req.user.email
    // console.log(await Batch.find({"branch": "6477df575e21f533c359a02c", semester: "1"}).populate('branch'))

    const apiResponse = await fetch('https://learn.interleap.com/api/analytics/reports', {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${respToken.data.token}`
        },
        body: JSON.stringify({
            client_id: process.env.CLIENT_ID,
            batch_id
        })
    })

    const response = await apiResponse.json()

    const data = response.data.StudentProgress.map((elm) => {
        const studentDetail = {
            StudentName: elm.StudentProgress.summary.StudentName,
            StudentEmailId: elm.StudentProgress.summary.StudentEmailId
        }
        return studentDetail
    })
    res.status(200).json({
        success: true,
        message: "All student fetched successfully",
        data,
        response
    })
})

// Unenroll student from interlib
exports.unenroll_Interlib = asyncHandler(async (req, res, next) => {

})
