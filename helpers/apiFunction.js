const Batch = require('../models/batch.model')
// const Recommendation = require('../models/recommendation.model')
const CourseInfo = require('../models/courseInfo.model')
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

        // Return empty array if courses is undefined/null/empty
        if (!courses || !courses.length) {
            return [];
        }
        return await Promise.all(
            courses?.map(async (elm) => {
                try{
                    // Fetch analytics report
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
                    
                    // Early validation of API response
                    if (!response.data?.StudentProgress) {
                        return {
                        courseName: response.data?.CourseName || 'Unknown Course',
                        error: 'Invalid student progress data'
                        };
                    }

                    // Find the specific user data
                    const user = response.data.StudentProgress.find(
                        (item) => item.StudentProgress?.summary?.StudentEmailId === email
                    );

                    // Handle case where user not found in course
                    if (!user) {
                        return {
                        courseName: response.data.CourseName || 'Unknown Course',
                        error: 'User not enrolled in this course'
                        };
                    }

                    // Calculate task completion metrics
                    const topicDetails = user.StudentProgress.TopicDetails || [];
                    const { totalTasks, completedTasks } = topicDetails.reduce(
                        (acc, topic) => ({
                        totalTasks: acc.totalTasks + (topic.totalTasks || 0),
                        completedTasks: acc.completedTasks + (topic.tasksStatus?.completed || 0)
                        }),
                        { totalTasks: 0, completedTasks: 0 }
                    );
                    // let total = 0;
                    // let completed = 0;
                    // user?.length > 0 && user[0].StudentProgress.TopicDetails.map((elm) => {
                    //     total = total + elm.totalTasks
                    //     completed = completed + elm.tasksStatus.completed
                    // })
                    // const topic = user[0].StudentProgress.TopicDetails
                    
                    // Sort students by percentage to determine position
                    const allUsers = response.data.StudentProgress
                    .map(item => item.StudentProgress?.summary)
                    .filter(Boolean)
                    .sort((a, b) => b.TotalPercentage - a.TotalPercentage);
                    const position = allUsers.findIndex(item => item.StudentEmailId === email);                    
                    // const position = allUsers.findIndex(item => item.StudentEmailId === email);

                    // const all_user = response.data.StudentProgress.map((elm) => elm.StudentProgress.summary)
                    // const all_user_sorted = all_user.sort((a, b) => b.TotalPercentage - a.TotalPercentage)
                    // const position = all_user_sorted.findIndex(elm => elm.StudentEmailId === email)

                    // Construct and return final data object
                    return {
                        courseName: response.data.CourseName,
                        totalTopics: response.data.NumberOfTopics,
                        completedTopics: user.StudentProgress.summary.TopicsCompleted,
                        progressPercentage: user.StudentProgress.summary.TotalPercentage,
                        totalStudent: response.data.StudentProgress.length,
                        studentPosition: position !== -1 ? position + 1 : null,
                        totalTask: totalTasks,
                        completedTask: completedTasks,
                        topic: user.StudentProgress.TopicDetails
                    };
                }catch(err){
                    // Handle individual course errors without failing the entire batch
                    console.error(`Error processing course ${elm.external_batch_id}:`, err);
                    return {
                        courseName: elm.name || 'Unknown Course',
                        external_batch_id: elm.external_batch_id,
                        error: err.message || 'Failed to fetch course data'
                    };
                }
                })
        )
    } catch (error) {
        console.error('Failed to process report data:', error);
        throw error;
    }
}

// Function for recommended course acording to their branch and semester
const interlibRecommendedCourse = async (myCourseResponse, token, branch, semester,college) => {
    try {
        // const allCourseResponse = await fetch('https://mindmatrix.interleap.com/api/external/courses', {
        //     method: 'GET',
        //     headers: {
        //         'Accept': 'application/json',
        //         'Content-Type': 'application/json',
        //         'Authorization': `Bearer ${token}`
        //     }
        // })

        // const all_course = await allCourseResponse.json()
        // const course_branch = branch
        // const course_semester = semester
        // const course_college = college
        // const rec_courses = await CourseInfo.find({ course_college, course_branch, course_semester })
        // const allRecCourse = all_course?.data?.filter((item) => rec_courses?.some((recc) => item.external_batch_id === recc.batch_id))
        // const recCourse = allRecCourse?.filter((item) => !myCourseResponse?.data?.some((course) => item.external_batch_id === course.external_batch_id)).map((course) => {
        //     // Find the corresponding recommendation for the course
        //     const matchedRec = rec_courses.find(recc => recc.batch_id === course.external_batch_id);
        //     return {
        //         ...course,
        //         image: matchedRec?.course_card_image || null // attach the image if available
        //     };
        // });    
        // return recCourse

        //Optimised recommedation code
        
        // Start both fetch operations in parallel
        const [allCourseResponse, recommendedCourses] = await Promise.all([
            fetch('https://mindmatrix.interleap.com/api/external/courses', {
                method: 'GET',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            }).then(response => response.json()),
            // Use projection to fetch only needed fields
            CourseInfo.find(
                { course_branch: branch, course_semester: semester,
                  $or: [
                    { course_college: {$size: 0} },
                    { course_college: college }
                  ]
                 },
                { batch_id: 1, course_card_image: 1, _id: 0 })
        ]);

        // Early return if no data
        if (!allCourseResponse?.data || !recommendedCourses?.length) {
            return [];
        }

        // Create a Set of user's enrolled course IDs for O(1) lookup
        const enrolledCourseIds = new Set(
            myCourseResponse?.data?.map(course => course.external_batch_id) || []
        );

        // Create a map of recommended course IDs to their images for O(1) lookup
        const recommendedCoursesMap = new Map(
            recommendedCourses.map(course => [course.batch_id, course.course_card_image || null])
        );

        // Filter and map in a single pass
        const recCourses = allCourseResponse.data
            .filter(course => {
                const batchId = course.external_batch_id;
                return recommendedCoursesMap.has(batchId) && !enrolledCourseIds.has(batchId);
            })
            .map(course => ({
                ...course,
                image: recommendedCoursesMap.get(course.external_batch_id)
            }));

        return recCourses
    } catch (error) {
        console.error('Error fetching recommended courses:', error);
        throw error;
    }
}

// export default interlibToken

module.exports = { interlibToken, interlibmyCourse, interlibReportData, interlibRecommendedCourse }
