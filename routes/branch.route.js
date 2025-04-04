const express = require('express')
const router = express.Router()
const { createBranch, readBranch, updateBranch, deleteBranch } = require('../controllers/branch.controller')

// app.post("/createBranch", createBranch)
// app.get("/getBranch", readBranch)
// app.post("/updateBranch", updateBranch)
// app.post("/deleteBranch", deleteBranch)

router.route("/createBranch").post(createBranch);
router.route("/getBranch").get(readBranch);
router.route("/updateBranch").post(updateBranch);
router.route("/deleteBranch").post(deleteBranch);

module.exports = router;