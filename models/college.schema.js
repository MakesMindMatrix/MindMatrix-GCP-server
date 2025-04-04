// Some required information regarding this Schema file.


/*******************************

## This schema contains list of all colleges which is available for our platform
   and along with that from which university the college is belongs to.
   

********************************/

const mongoose = require('mongoose')

const collegeSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "College name should must be entered"],
        trim: true
    },
    collegeCode: {
        type: String,
        required: [true, "College code should must be entered"],
        trim: true
    },
    universityId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'University',
        required: [true, "University name should must be entered"]
    }
    
},
{
    timestamps: true
})

module.exports = mongoose.model("College", collegeSchema);