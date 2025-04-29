const Batch = require('../models/batch.model')
const Recommendation = require('../models/recommendation.model')
// Function for generating interlib token
const interlibToken = async () => {
    try {
        const tokenResponse = await fetch('https://mindmatrix.interleap.com/api/external/generate-token', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ client_id: process.env.CLIENT_ID })
        })

        const data = await tokenResponse.json()

        if (!tokenResponse.ok) {
            throw new Error(data.message || "Failed to fetch token");
        }

        return data;
    } catch (error) {
        console.error("interlibToken error:", error.message);
        throw error; // throw to let the controller handle it
    }
}

// Fuction get course of a particular user on interlib
const interlibmyCourse = async (email, token) => {
    try {
        const myApiResponse = await fetch(`https://mindmatrix.interleap.com/api/external/student-courses?email=${email}`, {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        })
        const resp = myApiResponse.json()
        return await resp
    } catch (error) {
        res.status(400).json(error)
    }
}

// Function for get the report of every course on interlib
const interlibReportData = async (email, courses, token) => {
    try {
        return await Promise.all(
            courses?.map(async (elm) => {
                const dataResponse = await fetch('https://learn.interleap.com/api/analytics/reports', {
                    method: 'POST',
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    },
                    body: JSON.stringify({
                        client_id: process.env.CLIENT_ID,
                        batch_id: elm.external_batch_id
                    })
                })

                const response = await dataResponse.json()
                const user = response.data.StudentProgress.filter((elm) => elm.StudentProgress.summary.StudentEmailId === email)

                let total = 0;
                let completed = 0;
                user?.length > 0 && user[0].StudentProgress.TopicDetails.map((elm) => {
                    total = total + elm.totalTasks
                    completed = completed + elm.tasksStatus.completed
                })
                const topic = user[0].StudentProgress.TopicDetails
                const all_user = response.data.StudentProgress.map((elm) => elm.StudentProgress.summary)
                const all_user_sorted = all_user.sort((a, b) => b.TotalPercentage - a.TotalPercentage)
                const position = all_user_sorted.findIndex(elm => elm.StudentEmailId === email)

                const data = {
                    courseName: response.data.CourseName,
                    totalTopics: response.data.NumberOfTopics,
                    completedTopics: user[0].StudentProgress.summary.TopicsCompleted,
                    progressPercentage: user[0].StudentProgress.summary.TotalPercentage,
                    totalStudent: response.data.StudentProgress.length,
                    studentPosition: position + 1,
                    totalTask: total,
                    completedTask: completed,
                    topic
                }
                return data
            })
        )
    } catch (error) {
        console.log(error)
    }
}

// Function for recommended course acording to their branch and semester
const interlibRecommendedCourse = async (myCourseResponse, token, branch, semester,college) => {
    try {

        //Temp hard code for Workshop - 29th April, 2025
        const COLLEGE_BATCH_MAP = {
            "6802455e7ba88e506ba3e544": "GENAIWPCHALL2501", //Government Engineering College (GEC) – Challakere
            "680245897ba88e506ba3e54c": "GENAIWPGANGA2501", //Government Engineering College (GEC) – Gangavathi, Koppal
            "680246887ba88e506ba3e56c": "GENAIWPRAICH2501", // Government Engineering College (GEC) – Raichur
            "658d13f3f7a2a7912fde9369": "GENAIWPCHALL2501", // GOVT. ENGINEERING COLLEGE RAMNAGAR
            "680246ad7ba88e506ba3e574": "GENAIWPCHALL2501", // Government Engineering College (GEC) - Ramnagar
        };


        const allCourseResponse = await fetch('https://mindmatrix.interleap.com/api/external/courses', {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        })
        const all_course = await allCourseResponse.json();
        const batchId = COLLEGE_BATCH_MAP[college];

        if(batchId){
            const rec_course = all_course?.data?.filter((item) => item.external_batch_id === batchId)?.map((course) => ({
                ...course,
                image: "https://res.cloudinary.com/djsg8kbaz/image/upload/v1745032671/Multimodality_khbxkc.png" // Direct image URL
            }));
            return rec_course
        } 
        const user = await Recommendation.find({ branch, semester })
        const allRecCourse = all_course?.data?.filter((item) => user?.some((recc) => item.external_batch_id === recc.batch_id))
        const recCourse = allRecCourse?.filter((item) => !myCourseResponse?.data?.some((course) => item.external_batch_id === course.external_batch_id)).map((course) => {
            // Find the corresponding recommendation for the course
            const matchedRec = user.find(recc => recc.batch_id === course.external_batch_id);
            return {
                ...course,
                image: matchedRec?.course_image || null // attach the image if available
            };
        });
    
    
        return recCourse
    } catch (error) {
        console.log(error)
    }
}

// export default interlibToken

module.exports = { interlibToken, interlibmyCourse, interlibReportData, interlibRecommendedCourse }
