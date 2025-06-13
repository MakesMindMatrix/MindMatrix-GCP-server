const mongoose = require('mongoose')

const NoticeBoardSchema = new mongoose.Schema(
    {   
        //course_type
        course_type: {
            type: String,
            required: [true],
        },

        //course_name
        course_name: {
            type: String,
            required: [true],
        },

        //notices        
        notices: [{
            title: String,
            description: String
        }],

        //attachments
        attachments: [{
            title: String,
            url: String,
            button_text: {
                type: String,
                default: 'View'
            }
        }],

        //eligiblity
        eligiblity: [{
                title: String,
                description: String
        }]
    },
    {
        timestamps: true
    }
)

module.exports = mongoose.model("NoticeBoard", NoticeBoardSchema)