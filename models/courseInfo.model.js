// Course name, course image, batch id

// Hero section - Course name, background image, description, free or price

// About section - About, 5points desc

// Course instructor - Instructor image, Designation, name, description

// Course curriculum - Module details, course image

const mongoose = require('mongoose')

// Define a sub-schema for a module
const moduleSchema = new mongoose.Schema({
    title: {
      type: String,
    //   required: true
    },
    description: String
  });

const courseInfoSchema = new mongoose.Schema(
    {   
        //Unique course id
        batch_id: String,

        //For Course cards
        course_name: String,
        course_banner_image: String,
        course_card_image: String,
        
        //For recommendation of courses
        course_university: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: "University",
        }],
        course_college: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: "College",
        }],
        course_branch: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: "Branch"
        }],
        course_semester: [Number],

        //For course landing Page
        hero_section: {
            hero_title: String,
            hero_image: String,
            hero_description: String,
            hero_button_content: String,
            hero_button_type: {
                type: String,
                enum: ['free', 'paid'],
                default: 'free'
            }
        },

        // about_section: {
        //     title:String,
        //     description: String,
        //     about_details: [String]
        // },
        what_you_get_section: {
            points: [String]
        },
    

        prerequisite_section:{
            points: [String]
        },

        outcome_section: {
            points: [String]   
        },

        elective_course_section: {
            cards: [String]
        },

        instructor_section: {
            instructor_name:String,
            instructor_image:String,
            instructor_designation: String,
            instructor_description: String
        },

        curriculum_section: {
            modules: [moduleSchema],
            curriculum_image: String
        },

        motivation_section: {
            quote: String,
            button_content: String,
            button_type: {
                type: String,
                enum: ['free', 'paid'],
                default: 'free'
            }
        }
    },
    {
        timestamps: true
    }
)

module.exports = mongoose.model("CourseInfo", courseInfoSchema)