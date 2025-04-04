// Some required information regarding this Controller file.

/*******************************

## This controller contains crud operation for the university.
   
## In this controller only we will define some methods all that is mentioned below.

    ** Create university
    ** Read university
    ** Update university
    ** Delete university

********************************/

const University = require("../models/university.schema");

// Controller for creating university collection in our database
exports.createUniversity =
  ("/createUniversity",
    async (req, res) => {
      try {
        // Collect the data university data
        const { name } = req.body;

        // Check for data is available or not
        if (!name) {
          return res
            .status(400)
            .send("Please enter the name of university first");
        }

        // Check for existing university
        const existingUniversity = await University.findOne({ name });
        if (existingUniversity) {
          return res
            .status(400)
            .send("University is already registered in our database");
        }

        // Create new university in database
        const university = await University.create({
          name,
        });

        res.status(200).json({
          success: true,
          message: "University added in database succesfully",
          university,
        });
      } catch (error) {
        console.log(error);
      }
    });

//   Get the list of all university available in our database
exports.readUniversity =
  ("/getUniversity",
    async (req, res) => {
      try {
        const page = parseInt(req.query.page)
        const limit = parseInt(req.query.limit)

        const startIndex = (page - 1) * limit;
        const total = await University.countDocuments()

        const universityList = await University.find().skip(startIndex).limit(limit);

        res.status(200).json({
          success: true,
          message: "University list fetched succesfully",
          page,
          limit,
          total,
          pages: Math.ceil(total / limit),
          data: universityList
        })
      } catch (error) {
        console.log(error.message);
      }
    });

// Update the data of university in database
exports.updateUniversity = ("/updateUniversity", async (req, res) => { });

// Delete the university from database
exports.deleteUniversity = ("deleteUniversity", async (req, res) => { });
