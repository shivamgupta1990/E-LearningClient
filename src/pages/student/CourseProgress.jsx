import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardTitle } from '@/components/ui/card'
import { useCompleteCourseMutation, useGetCourseProgressQuery, useInCompleteCourseMutation, useUpdateLectureProgressMutation } from '@/features/api/courseProgress';
import { CheckCircle, CheckCircle2, CirclePlay } from 'lucide-react';
import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom';
import { toast } from 'sonner';

export default function CourseProgress() {
  const params=useParams();
  const {courseId}= params;
  const {data,isLoading,isError,refetch}=useGetCourseProgressQuery(courseId);
  
  const [updateLectureProgress]=useUpdateLectureProgressMutation();
  const [completeCourse,{data:markCompleteData,isSuccess:completedSuccess}]=useCompleteCourseMutation();
  console.log("courseId123->",courseId);
  const [inCompleteCourse,{data:markInCompleteData,isSuccess:inCompleteSuccess}]=useInCompleteCourseMutation();

  useEffect(()=>{
    if(completedSuccess){
      refetch();
      toast.success(markCompleteData.message);
    }
    if(inCompleteSuccess){
      refetch();
      toast.success(markInCompleteData.message);
    }
  },[completedSuccess,inCompleteSuccess])
  const [currentLecture,setCurrentLecture]=useState(null);
  
   const handleLectureProgress = async(lectureId)=>{
    await updateLectureProgress({courseId,lectureId});
    refetch(); 
  }
  
  if(isLoading) return <p>Loading...</p>
  if(isError) return <p>Failed to load course details</p>

  
  const {courseDetails,progress,complete}=data.data;
  const {courseTitle}=courseDetails;
  console.log("data in course progress->",data);
  //initialize the first lectue if not exist  
  const initialLecture = currentLecture || courseDetails.lectures && courseDetails.lectures[0];

  const isLectureCompleted = (lectureId)=>{
    return progress.some((prog)=>prog.lectureId===lectureId && prog.viewed)
  }
  
  //handle select a specific lecture to watch
  const handleSelectLecture = (lecture)=>{
    setCurrentLecture(lecture);
    handleLectureProgress(lecture?._id)
  }

 

  const handleCompleteCourse =async()=>{
    await completeCourse(courseId);
  }
  const handleInCompleteCourse =async()=>{
    await inCompleteCourse(courseId);
  }

  return (
    <div className='mx-w-7xl mx-auto p-4'>
      <div className='flex justify-between mb-4'>
        <h1 className='text-2xl font-bold'>{courseTitle}</h1>
        <Button onClick={complete ? handleInCompleteCourse : handleCompleteCourse} variant={complete ? "outline":"default"}>
          {
            complete ? (
              <div className='flex items-center '>
                <CheckCircle className='h-4 w-4 mr-2'/><span>Completed</span>
              </div>
            
            ):"Mark as completed"
          }
        </Button>
      </div>
      <div className='flex flex-col md:flex-row gap-6'>
        {/* video section */}
        <div className='flex-1 md:w-3/5 h-fit rounded-lg shadow-lg p-4'>
          <div>
            {/* video */}

            <video 
            src={currentLecture?.videoUrl || initialLecture?.videoUrl}
            controls
            className='w-full h-auto md:rounded-lg'
            onPlay={()=>handleLectureProgress(currentLecture ?._id || initialLecture?._id)}
            />
          </div>


          {/* Display current watching lecture title */}
          <div className='mt-2'>
            <h3 className='font-medium text-lg'>
              {
                `Lecture ${courseDetails.lectures.findIndex((lec)=>lec._id=== (currentLecture?._id || initialLecture._id))+1} : ${currentLecture?.lectureTitle || initialLecture.lectureTitle}`
              }
            </h3>
          </div>
        </div>
        {/* Lecture sidebar */}
        <div className='flex flex-col w-full md:w-2/5 border-t md:border-t-0 md:border-l border-gray-200 md:pl-4 pt-4 md:pt-0'>
          <h2 className='font-semibold text-xl mb-4'>Course Lecture</h2>
          <div className='flex-1 overflow-y-auto'>
            {
              courseDetails?.lectures.map((lecture) => (
                <Card key={lecture._id} className={`mb-3 hover:cursor-pointer transition transform ${lecture._id === currentLecture?._id ? "bg-gray-200 dark:bg-gray-800":""}`} onClick={()=>handleSelectLecture(lecture)}>
                  <CardContent className="flex items-center justify-between p-4">
                    <div className='flex items-center'>
                      {
                        isLectureCompleted(lecture._id) ? (
                          <CheckCircle2 size={24} className='text-green-500 mr-2' />
                        ) : (
                          <CirclePlay size={24} className='text-gray-500 mr-2' />
                        )
                      }
                      <div>
                      <CardTitle className="text-lg font-medium">
                        {lecture.lectureTitle}
                      </CardTitle>
                    </div>
                    </div>
                    {
                      isLectureCompleted(lecture._id) && (
                          <Badge variant="outline" className="bg-green-200 text-green-600">Completed</Badge>
                      )
                    }
                    
                  </CardContent>
                </Card>
              ))
            }
          </div>
        </div>
      </div>
    </div>
  )
}
