const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const crypto = require("crypto");

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please enter your name']
    },
    email: {
        type: String,
        required: [true, 'Please enter the email']
    },
    password: {
        type: String,
        // required: [true, 'Please enter your password'],
        // minLength: [8, "Password should have more than 8 characters"],
        select: false
    },
    avatar: {
        public_id: {
            type: String,
            // required: true
        },
        url: {
            type: String,
            // required: true
        }
    },
    branch: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Branch",
    },
    university: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "University",
    },
    college: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "College",
    },
    role: {
        type: String,
        default: "User"
    },
    isverified: {
      type: Boolean,
      default: false,
    },
    isSubscribed: {
        type: Boolean,
        default: false
    },
    subscription: {
        transactionId: String,
        paymentMode: String,
        maskedAccountNumber: String,
        ifsc: String,
        accountType: String,
        paymentType: String,
    },
    roll_no: String,
    phone: Number,
    semester: Number,
    secret: Number,
    resetPasswordToken: String,
    resetPasswordExpire: Date,

    // Fields for college
    collegeName: String,
    collegePersonDesignation: String,
    personOfContactName: String,
    personOfContactNumber: Number,
    personOfContactDesignation: String,
},{
    timestamps: true,
})

userSchema.virtual("payments", {
    ref: "Payment",
    localField: "_id",
    foreignField: "user"
});

userSchema.set("toJSON",{virtuals: true})
userSchema.set("toObject",{virtuals: true})

// Password Hashing
userSchema.pre("save", async function (next) {
    if (!this.isModified("password")) {
        next()
    }
    this.password = await bcrypt.hash(this.password, 10)
})

// JWT Token
userSchema.methods.getJWTToken = function () {
    return jwt.sign({id: this._id}, process.env.JWT_SECRET, {
        expiresIn: '1d'
    })
}

// Compare password
userSchema.methods.comparePassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password)
}

// Generating Password Reset Token
userSchema.methods.getResetPasswordToken = function () {
    // Generating Token
    const resetToken = crypto.randomBytes(20).toString("hex");
  
    // Hashing and adding resetPasswordToken to userSchema
    this.resetPasswordToken = crypto
      .createHash("sha256")
      .update(resetToken)
      .digest("hex");
  
    this.resetPasswordExpire = Date.now() + 24 * 60 * 60 * 1000;
  
    return resetToken;
  };

const User = mongoose.model("User", userSchema)
module.exports = User


// Company DNA



// Industry name
// Roles - 
// Technical skills
// Culture traits



// Job Details


// Job Name
// 