import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

// const COURSE_PROGRESS_API="http://localhost:4000/api/v1/progress";
const COURSE_PROGRESS_API="https://e-learningserver-r4a8.onrender.com/api/v1/progress";
export const courseProgressApi = createApi({
    reducerPath:"courseProgressApi",
    baseQuery: fetchBaseQuery({
        baseUrl:COURSE_PROGRESS_API,
        credentials:"include",
         prepareHeaders: (headers) => {
        const token = localStorage.getItem("token"); // Get token from localStorage
        if (token) {
            headers.set("Authorization", `Bearer ${token}`); // Set token in header
        }
        return headers;
    }
    }),
    endpoints:(builder)=>({
        getCourseProgress:builder.query({
            query:(courseId)=>({
                url:`/${courseId}`,
                method:"GET"
            })
        }),
        updateLectureProgress:builder.mutation({
            query:({courseId,lectureId})=>({
                url:`/${courseId}/lecture/${lectureId}/view`,
                method:"POST"
            })
        }),
        completeCourse:builder.mutation({
            query:(courseId)=>({
                url:`/${courseId}/complete`,
                method:"POST"
            })
        }),
        inCompleteCourse:builder.mutation({
            query:(courseId)=>({
                url:`/${courseId}/incomplete`,
                method:"POST"
            })
        }),
    })
});

export const{
useGetCourseProgressQuery,
useUpdateLectureProgressMutation,
useCompleteCourseMutation,
useInCompleteCourseMutation
}=courseProgressApi;