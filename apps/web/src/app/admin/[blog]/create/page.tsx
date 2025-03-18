"use client"
import { CreateRecipeForm } from '@/components/CreateRecipeForm';
import { useParams } from 'next/navigation';

export default function CreatePage() {
    const params = useParams();
    const blog = params.blog as string;
    return <CreateRecipeForm blogId={blog} />;
}
