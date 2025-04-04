// Some required information regarding this Schema file.


/*******************************

## This schema contains all the list of our university which is available for our platform.
   

********************************/


const mongoose = require('mongoose')

const universitySchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "University name should must be entered"],
        trim: true
    }
},
{
    timestamps: true
})

module.exports = mongoose.model("University", universitySchema);