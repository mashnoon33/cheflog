"use client"
import { CreateRecipeForm } from '@/components/editor';
import { useParams } from 'next/navigation';

export default function CreatePage() {
    const params = useParams();
    const book = params.book as string;
    return <CreateRecipeForm bookId={book} />;
}
