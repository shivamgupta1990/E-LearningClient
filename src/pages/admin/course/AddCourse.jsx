import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { useCreateCourseMutation } from '@/features/api/courseApi'
import { Loader2 } from 'lucide-react'
import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { toast } from 'sonner'

export default function AddCourse() {
    const [courseTitle,setCourseTitle]=useState("");
    const [category,setCategory]=useState("");

    const [createCourse,{data,isLoading,error,isSuccess}]=useCreateCourseMutation();

    const navigate = useNavigate();

    const getSelectedCategory=(value)=>{
        setCategory(value);
    }

    const createCourseHandler= async()=>{
        console.log("Course Created Data->",courseTitle,category);
        await createCourse({courseTitle,category});
        navigate("/admin/course");

    }
    //for display toast
    useEffect(()=>{
        if(isSuccess){
            toast.success(data?.message || "Course created.");
        }
    },[isSuccess,error])

    return (
        <div className='flex-1 mx-10'>
            <div className='mb-4'>
                <h1 className='font-bold text-xl'>Lets add course, add some basic course details for your new course</h1>
                <p className='text-sm'>Lorem ipsum dolor sit amet consectetur adipisicing elit.</p>
            </div>
            <div className='space-y-4'>
                <div>
                    <Label>Title</Label>
                    <Input type="text" value={courseTitle} onChange={(e)=>setCourseTitle(e.target.value)} name="courseTitle" placeholder="Your Course Name" />
                </div>
                <div>
                    <Label>Category</Label>
                    <Select onValueChange={getSelectedCategory}>
                        <SelectTrigger className="w-[180px]">
                            <SelectValue placeholder="Select a category" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectGroup>
                                <SelectLabel>Category</SelectLabel>
                                <SelectItem value="next js">Next JS</SelectItem>
                                <SelectItem value="data science">Data Science</SelectItem>
                                <SelectItem value="frontend development">
                                    Frontend Development
                                </SelectItem>
                                <SelectItem value="fullstack development">
                                    Fullstack Development
                                </SelectItem>
                                <SelectItem value="mern stack development">
                                    MERN Stack Development
                                </SelectItem>
                                <SelectItem value="javascript">Javascript</SelectItem>
                                <SelectItem value="python">Python</SelectItem>
                                <SelectItem value="docker">Docker</SelectItem>
                                <SelectItem value="mongoDB">MongoDB</SelectItem>
                                <SelectItem value="html">HTML</SelectItem>
                            </SelectGroup>
                        </SelectContent>
                    </Select>
                    <div className='flex items-center gap-2'>
                        <Button variant="outline" onClick={() => navigate("/admin/course")}>Back</Button>
                        <Button disabled={isLoading} onClick={createCourseHandler}>
                            {
                                isLoading? (
                                    <>
                                        <Loader2 className='mr-2 h-4 w-4 animate-spin'/>
                                        Please wait
                                    </>
                                ):"Create"
                            }
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    )
}


