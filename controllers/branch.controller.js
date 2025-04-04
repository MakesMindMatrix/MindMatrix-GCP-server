// Some required information regarding this Controller file.

/*******************************

## This controller contains crud operation for the branch.
   
## In this controller only we will define some methods all that is mentioned below.

    ** Create branch
    ** Read branch
    ** Update branch
    ** Delete branch

********************************/
const Branch = require("../models/branch.schema");

// Controller for creating branch collection in our database
exports.createBranch =
  ("/createBranch",
    async (req, res) => {
      try {
        // Collect the data branch data
        const { name } = req.body;

        // Check for data is available or not
        if (!name) {
          return res.status(400).send("Please enter the name of branch first");
        }

        // Check for existing branch
        const existingBranch = await Branch.findOne({ name });
        if (existingBranch) {
          return res
            .status(400)
            .send("branch is already registered in our database");
        }

        // Create new branch in database
        const branch = await Branch.create({
          name,
        });

        res.status(200).json({
          success: true,
          message: "branch added in database succesfully",
          branch,
        });
      } catch (error) {
        console.log(error);
      }
    });

//   Get the list of all brannch available in our database
exports.readBranch =
  ("/getBranch",
    async (req, res) => {
      try {
        const page = parseInt(req.query.page)
        const limit = parseInt(req.query.limit)

        const startIndex = (page - 1) * limit;
        const total = await Branch.countDocuments()

        const branchList = await Branch.find().skip(startIndex).limit(limit);

        res.status(200).json({
          success: true,
          message: "Branch list fetched succesfully",
          page,
          limit,
          total,
          pages: Math.ceil(total / limit),
          data: branchList
        });
      } catch (error) {
        console.log(error.message);
      }
    });

// Update the data of branch in database
exports.updateBranch = ("/updateBranch", async (req, res) => { });

// Delete the branch from database
exports.deleteBranch = ("/deleteBranch", async (req, res) => { });
