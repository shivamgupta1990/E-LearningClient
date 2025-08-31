import React from 'react'
import Course from './Course';
import { useLoadUserQuery } from '@/features/api/authApi';
import { Link, useNavigate } from 'react-router-dom';

export default function MyLearning() {
  const navigate=useNavigate();
    const {data,isLoading}=useLoadUserQuery();
    const myLearning= data?.user.enrolledCourses || [];
    
    const handleOnClick = (course)=>{
      navigate(`course-detail/${course._id}`);
    }
  return (
    <div className='max-w-4xl mx-auto my-10 px-4 md:px-0'>
        <h1 className='font-bold text-2xl'>My Learning</h1>
        <div className='my-5'>
            {
                isLoading ? (
                    <MyLearningSkeleton/>
                ):myLearning?.length===0 ? (<p>You are not enrolled in any course.</p>):
                (
                    <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 '>
                        {
                            myLearning?.map((course,index)=><Course key={index} course={course} onClick={()=>handleOnClick(course)}/>)
                        }
                        
                    </div>
                )
                
            }
        </div>
    </div>
  )
}

const MyLearningSkeleton = () => (
  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
    {[...Array(3)].map((_, index) => (
      <div
        key={index}
        className="bg-gray-300 dark:bg-gray-700 rounded-lg h-40 animate-pulse"
      ></div>
    ))}
  </div>
);