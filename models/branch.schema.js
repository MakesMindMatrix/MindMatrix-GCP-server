// Some required information regarding this Schema file.

/*******************************

## This schema contains all branches which is available for selecting students.
   

********************************/

const mongoose = require("mongoose");

const branchSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "branch name should must be entered"],
    trim: true,
  }
},
{
  timestamps: true
});

module.exports = mongoose.model("Branch", branchSchema);
