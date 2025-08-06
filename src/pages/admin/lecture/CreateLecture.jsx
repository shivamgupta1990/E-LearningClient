import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useCreateLectureMutation, useGetCourseLectureQuery } from '@/features/api/courseApi'
import { Loader2 } from 'lucide-react'
import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { toast } from 'sonner'
import Lecture from './Lecture'

export default function CreateLecture() {
    const [lectureTitle, setLectureTitle] = useState("");
    const [createLecture, { data, isLoading, isSuccess, error }] = useCreateLectureMutation();
    const navigate = useNavigate();
    const params = useParams();
    const courseId = params.courseId;

    const { data: lectureData, isLoading: lectureLoading, isError: lectureError ,refetch} = useGetCourseLectureQuery(courseId);
    useEffect(() => {
        if (isSuccess) {
            refetch();
            toast.success(data?.message || "Lecture created successfully");
        }
        if (error) {
            toast.error(error.message || "Failed to create lecture");
        }
    }, [isSuccess, error]);

    const createLectureHandler = async () => {
        await createLecture({ lectureTitle, courseId });
    }
    console.log("lectureData->", lectureData);
    return (
        <div className='flex-1 mx-10'>
            <div className='mb-4'>
                <h1 className='font-bold text-xl'>Lets add lectures, add some basic details for your new lecture</h1>
                <p className='text-sm'>Lorem ipsum dolor sit amet consectetur adipisicing elit.</p>
            </div>
            <div className='space-y-4'>
                <div>
                    <Label>Title</Label>
                    <Input type="text" value={lectureTitle} onChange={(e) => setLectureTitle(e.target.value)} name="courseTitle" placeholder="Your Title Name" />
                </div>

                <div className='flex items-center gap-2'>
                    <Button variant="outline" onClick={() => navigate(`/admin/course/${courseId}`)}>Back to course</Button>
                    <Button disabled={isLoading} onClick={createLectureHandler} >
                        {
                            isLoading ? (
                                <>
                                    <Loader2 className='mr-2 h-4 w-4 animate-spin' />
                                    Please wait
                                </>
                            ) : "Create Lecture"
                        }
                    </Button>
                </div>
                <div className='mt-10'>
                    {
                        lectureLoading ? (
                            <p>Loading Lecture...</p>
                        ) : lectureError ? (<p>Failed to load lecture.</p>) : lectureData.lectures.length === 0 ? (<p>No lecture available</p>):(
                            lectureData?.lectures.map((lecture,index)=>(
                                <Lecture key={lecture._id} lecture={lecture} index={index} courseId={courseId}/>
                            ))
                            
                        )
                    }
                </div>
            </div>
        </div>
    )
}
