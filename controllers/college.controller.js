// Some required information regarding this Controller file.

/*******************************

## This controller contains .crud operation for the college.
   
## In this controller only we will define some methods all that is mentioned below.

    ** Create college
    ** Read college
    ** Read college by university
    ** Update college
    ** Delete college

********************************/

const College = require("../models/college.schema");
const University = require("../models/university.schema");

// Controller for create college
exports.createCollege =
  ("/createCollege",
    async (req, res) => {
      try {
        // Collect the college data
        const { name, collegeCode, universityId } = req.body;

        // Check for all the inforation is available or not
        if (!(name && collegeCode && universityId)) {
          return res.status(400).send("All fields are required");
        }

        // Check for existing college in our database
        const existingCollege = await College.findOne({ collegeCode });
        if (existingCollege) {
          return res
            .status(400)
            .send("This college is already registered in our database");
        }

        // Get university details by id
        const universityDetails = await University.findById(universityId);

        // Create college in our database
        const college = await College.create({
          name,
          collegeCode,
          universityId: universityDetails,
        });

        res.status(200).json({
          success: true,
          message: "College added successfully",
          college,
        });
      } catch (error) {
        console.log(error.message);
      }
    });

// Controller for Getting list of all colleges
exports.readCollege = ("/getCollege", async (req, res) => {
  try {
    const page = parseInt(req.query.page)
    const limit = parseInt(req.query.limit)

    const startIndex = (page - 1) * limit;
    const total = await College.countDocuments()

    const collegeList = await College.find().skip(startIndex).limit(limit).populate('universityId')

    // console.log(finalCollegeList.length)
    res.status(200).json({
      success: true,
      message: "All college list fetched succesfully",
      page,
      limit,
      total,
      pages: Math.ceil(total / limit),
      data: collegeList
    })
  } catch (error) {
    console.log(error.message);
  }
});

// Controller for getting the list of college accorging to their university
exports.readCollegeByUniversityId = ("/getCollegeByUniversity/:id", async (req, res) => {
  try {
    const { id } = req.params
    const collegeList = await College.find({ universityId: id }).populate('universityId')
    res.status(200).json({
      success: true,
      message: "All college list fetched succesfully by their university",
      collegeList
    })
  } catch (error) {
    console.log(error.message);
  }
})

// Controller for updating college details
exports.updateCollege = ("updateCollege", async (req, res) => {
  try {
    const { collegeCode, } = req.body
  } catch (error) {
    console.log(error)
  }
});

// Controller for deleting college from database
exports.deleteCollege = ("/deleteCollege", async (req, res) => { });
