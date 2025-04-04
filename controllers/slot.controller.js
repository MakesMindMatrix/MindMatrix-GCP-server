const asyncHandler = require("../middleware/asyncHandler");
const Slot = require("../models/slot.model");
const ErrorHandler = require("../utils/errorHandler");
const College = require("../models/college.schema");
const sendEmailHTML = require("../utils/sendEmailHTML");
// const TestBatch = require("../models/test_batch.model")


// Create New slot
exports.createSlot = asyncHandler(async (req, res, next) => {
    const { startTiming, endTiming, attendees, joinLink } = req.body;

    const startTimeDate = new Date(startTiming)
    const endTimeDate = new Date(endTiming)
    const slot = await Slot.create({
        startTiming: startTimeDate,
        endTiming: endTimeDate,
        attendees,
        joinLink
    })

    res.status(201).json({
        success: true,
        message: "Slot created succesfully",
        slot,
    })
})
// 2016-05-18T16:00:00Z

// Get all slot
exports.getSlot = asyncHandler(async (req, res, next) => {
    const slot = await Slot.find()
    const { college } = req.user;
    let unSelectedSlots = [];
    const currentDate = new Date()
    const fiveDaysLater = new Date(currentDate.getTime() + (5 * 24 * 60 * 60 * 1000))
    
    for (let i = 0; i < slot.length; i++) {
        let hasCollege = false; // Flag to check if the slot contains the college

        for (let j = 0; j < slot[i].Colleges.length; j++) {
            if (slot[i].Colleges[j].college.toString() === college.toString()) {
                hasCollege = true;
                break;
            }
        }
        if (!hasCollege) {
            unSelectedSlots.push(slot[i]);
        }
    }

    const filterSlots = unSelectedSlots.filter((elm) => {
        return (elm.startTiming >= fiveDaysLater)
    })

    const selectedSlot = await Slot.find({ Colleges: { $elemMatch: { college } } })

    const mySlot = selectedSlot.map((elm) => {

        const data = {
            startTiming: elm.startTiming,
            endTiming: elm.endTiming,
        }
        elm.Colleges.map((element) => {
            if (element.college.toString() == college.toString()) {
                data.attendees = element.noOfAttendees
            }
        })
        return data
    })

    res.status(200).json({
        success: true,
        message: "All slots fetched successfully",
        slot,
        unSelectedSlots,
        mySlot,
        filterSlots
    })
})

// Update one slot
exports.updateSlot = asyncHandler(async (req, res, next) => {
    const {slotData, email} = req.body
    const collegeId = req.user.college;
    const collegeName = await College.findById({_id: collegeId})
    const schedule = []
    const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thrusday", "Friday", "Saturday"]

    for (const key in slotData) {
        const slot = await Slot.findById(key)

        if (!slot) {
            return res.status(404).json({ success: false, message: "Slot not found" });
        }

        schedule.push({
            day: days[new Date(slot.startTiming).getDay()],
            date: new Date(slot.startTiming).getDate(),
            time: `${new Date(slot.startTiming).toLocaleTimeString("en-US", { timeZone: "Asia/Kolkata" })} - ${new Date(slot.endTiming).toLocaleTimeString("en-US", { timeZone: "Asia/Kolkata" })}`,
            joinLink: slot.joinLink
        })
        // console.log("SLot", (new Date(slot.startTiming).getMinutes()))
        // console.log("scheduleData", scheduleData)

        const newEnrolledAttendees = Number(slot.enrolledAttendees) + Number(slotData[key].attendees);
        // console.log(slot.enrolledAttendees, slotData[key].attendees)
        await Slot.findByIdAndUpdate(
            key,
            {
                $push: {
                    Colleges: {
                        college: collegeId,
                        noOfAttendees: slotData[key].attendees,
                        Remarks: slotData[key].remarks
                    }
                },
                $set: { enrolledAttendees: newEnrolledAttendees }
            },
            { new: true, runValidators: true }
        )
    }

    const formatWorkshopSchedule = (slots) => {
        return slots.map((slot, index) => 
          `Slot ${index + 1}: ${slot.day}, ${slot.date} – ${slot.time} <a href=${slot.joinLink}> join Link </a> <br>`
        ).join("\n");
      };

    const workshopSchedule = formatWorkshopSchedule(schedule);

    const message = `<html>
        <body>
            <div style="font-family: Arial, sans-serif; padding: 20px;">
                <h2>Dear Sir/Madam,</h2>
                <p>Greetings from <strong>MindMatrix</strong>!</p>

                <p>We are pleased to confirm that the slot for <strong>${collegeName.name}</strong> for the Student Workshop on <strong>Google Gemini</strong> has been successfully booked. Please find the details below:</p>

                <div style="background-color: #e9ecef; padding: 10px; border-radius: 5px;">
                    <h3>Workshop Schedule:</h3>
                    ${workshopSchedule}
                </div>

                <p>To ensure a smooth and interactive session, please make sure that all students have individual laptops and stable internet connectivity.</p>

                <h3>For any queries or assistance, please contact:</h3>
                <p><strong>Sujit Kumar</strong> – Founder, MindMatrix<br>📞 +91 98451 90286 | ✉️ <a href="mailto:sujit@clinf.com">sujit@clinf.com</a></p>
                <p><strong>Pragati Pote</strong> – Academic Coordinator, MindMatrix<br>📞 +91 96115 46444 | ✉️ <a href="mailto:pragati@clinf.com">pragati@clinf.com</a></p>

                <p>Looking forward to an insightful and engaging session!</p>

                <p>Best regards,<br><strong>Team MindMatrix</strong></p>
            </div>
        </body>
        </html>`

    try {
        await sendEmailHTML({
            email: email,
            subject: `Confirmation: Student Workshop on Google Gemini – Slot Successfully Booked`,
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

// Get all slot - Admin
exports.getAllSlot = asyncHandler(async (req, res, next) => {
    const slot = await Slot.find().populate('Colleges.college')

    res.status(200).json({
        success: true,
        message: "All slots fetched successfully",
        slot,
    })
})