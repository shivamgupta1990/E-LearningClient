
import { RichTextEditor } from '@/components/RichTextEditor';
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import React, { useEffect, useState } from 'react'
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Loader2 } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import { useDeleteCourseMutation, useEditCourseMutation, useGetCourseByIdQuery, usePublishCourseMutation } from '@/features/api/courseApi';
import { toast } from 'sonner';

export const CourseTab = () => {
    const params = useParams();
    const courseId = params.courseId;
    const navigate = useNavigate();
    const [input, setInput] = useState({
        courseTitle: "",
        subTitle: "",
        description: "",
        category: "",
        courseLevel: "",
        coursePrice: "",
        courseThumbnail: ""
    });
    const { data: courseByIdData, isLoading: courseByIdLoading, refetch } = useGetCourseByIdQuery(courseId);
    const [deleteCourse, { data: deleteCourseData, isLoading: deleteCourseIsLoading, isSuccess: deleteCourseIsSuccess }] = useDeleteCourseMutation();
    const [publishCourse, { }] = usePublishCourseMutation();
    useEffect(() => {
        if (courseByIdData?.course) {
            const course = courseByIdData?.course;
            setInput({
                courseTitle: course.courseTitle,
                subTitle: course.subTitle,
                description: course.description,
                category: course.category,
                courseLevel: course.courseLevel,
                coursePrice: course.coursePrice,
                courseThumbnail: course.courseThumbnail
            });
        }
    }, [courseByIdData])

    const [previewThumbnail, setPreviewThumbnail] = useState("");

    const [editCourse, { data, isLoading, isSuccess, isError }] = useEditCourseMutation();

    const changeEventHandler = (e) => {
        const { name, value } = e.target;
        setInput({ ...input, [name]: value });
    };
    const selectCategory = (value) => {
        setInput({ ...input, category: value });
    }
    const selectCourseLevel = (value) => {
        setInput({ ...input, courseLevel: value });
    }
    //get file
    const selectThumbnail = (e) => {
        const file = e.target.files?.[0];
        if (file) {
            setInput({ ...input, courseThumbnail: file });
            const fileReader = new FileReader();
            fileReader.onloadend = () => setPreviewThumbnail(fileReader.result);
            fileReader.readAsDataURL(file);
        }
    }
    const updateCourseHandler = async () => {
        console.log("input in courseTab->", input);

        const formData = new FormData();
        formData.append("courseTitle", input.courseTitle);
        formData.append("subTitle", input.subTitle);
        formData.append("description", input.description);
        formData.append("category", input.category);
        formData.append("courseLevel", input.courseLevel);
        formData.append("coursePrice", input.coursePrice);
        formData.append("courseThumbnail", input.courseThumbnail);
        await editCourse({ formData, courseId });


    }
    useEffect(() => {
        if (isSuccess) {
            toast.success(data?.message || "Course updated")
        }
        if (isError) {
            toast.error(isError?.data?.message || "Failde to update cousre")
        }
    }, [isSuccess, isError]);

    const publishStatusHandler = async (action) => {
        try {
            const response = await publishCourse({ courseId, query: action });
            if (response.data) {
                refetch();
                toast.success(response.data.message);
            }
        } catch (err) {
            toast.error("Failed to publish or unpublish course");
        }
    }
    useEffect(() => {
        if (deleteCourseIsSuccess) {
            toast.success(deleteCourseData?.message || "Course Deleted Successfully");
            navigate(-1);
        }
    }, [deleteCourseIsSuccess]);

    const handleDeleteCourse = () => {
        deleteCourse(courseId);
    }


    if (courseByIdLoading) return <Loader2 className='h-4 w-4 animate-spin' />
    return (
        <Card>
            <CardHeader className="flex flex-row justify-between">
                <div>
                    <CardTitle>Basic Course Information</CardTitle>
                    <CardDescription>
                        Make changes to your courses here. Click save when you're done.
                    </CardDescription>
                </div>
                <div className='space-x-2'>
                    <Button disabled={courseByIdData?.course.lectures.length === 0} variant="outline" onClick={(e) => publishStatusHandler(courseByIdData?.course.isPublished ? "false" : "true")}>
                        {
                            courseByIdData?.course.isPublished ? "UnPublished" : "Published"
                        }
                    </Button>
                    <Button disabled={deleteCourseIsLoading} variant="destructive" onClick={handleDeleteCourse}>
                        {
                            deleteCourseIsLoading ? <>
                                <Loader2 className='mr-2 h-4 w-4 animate-spin' />
                            </> : "Remove Course"

                        }
                    </Button>
                </div>
            </CardHeader>
            <CardContent>
                <div className='space-y-4 mt-5'>
                    <div>
                        <Label>Title</Label>
                        <Input type="text" name="courseTitle" value={input.courseTitle} onChange={changeEventHandler} placeholder="Ex. Fullstack developer" />
                    </div>
                    <div>
                        <Label>Sub Title</Label>
                        <Input type="text" name="subTitle" value={input.subTitle} onChange={changeEventHandler} placeholder="Ex. Fullstack developer from zero to hero in 3 months." />
                    </div>
                    <div>
                        <Label>Description</Label>
                        <RichTextEditor input={input} setInput={setInput} />
                    </div>
                    <div className="flex items-center gap-5">
                        <div>
                            <Label>Category</Label>
                            <Select onValueChange={selectCategory}>
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
                        </div>
                        <div>
                            <Label>Course Level</Label>
                            <Select onValueChange={selectCourseLevel}>
                                <SelectTrigger className="w-[180px]">
                                    <SelectValue placeholder="Select a course level" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectGroup>
                                        <SelectLabel>Category</SelectLabel>
                                        <SelectItem value="Beginner">Beginner</SelectItem>
                                        <SelectItem value="Medium">Medium</SelectItem>
                                        <SelectItem value="Advance">
                                            Advance
                                        </SelectItem>

                                    </SelectGroup>
                                </SelectContent>
                            </Select>
                        </div>
                        <div>
                            <Label>Price in (INR)</Label>
                            <Input type="number" name="coursePrice" value={input.coursePrice} onChange={changeEventHandler} placeholder="₹499" />
                        </div>

                    </div>
                    <div>
                        <Label>Course Thumbnail</Label>
                        <Input type="file" onChange={selectThumbnail} accept="image/*" className="w-fit" />
                        {
                            previewThumbnail && (
                                <img src={previewThumbnail} className="e-64 my-2" alt='Course Thumbnail'></img>
                            )
                        }
                    </div>
                    <div>
                        <Button onClick={() => navigate("/admin/course")} variant={"outline"}>Cancel</Button>
                        <Button disabled={isLoading} onClick={updateCourseHandler}>
                            {
                                isLoading ? (
                                    <>
                                        <Loader2 className='mr-2 h-4 w-4 animate-spin' />Please wait
                                    </>
                                ) : "Save"
                            }
                        </Button>
                    </div>
                </div>
            </CardContent>
        </Card>
    )
}
