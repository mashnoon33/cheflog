
"use client"
import { CreateBookDialog } from "@/components/modals/create-book-dialog";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useState } from "react";
export default function OnboardingPage() {
   const [open, setOpen] = useState(false);
   const handleOpen = () => {
    setOpen(true);
   }
  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center p-8">
      <div className="max-w-xl w-full space-y-8 flex flex-col items-center justify-center">
        <div className="text-center">
        <h1 className=" text-3xl font-bold text-gray-700  sm:text-4xl md:text-5xl">
              Create your first book
            </h1>
            <p className="mt-4  text-gray-400">
              Books are a grouping of recipes. You can create as many as you want. 
            </p>
        </div>

       <Button variant="outline" onClick={handleOpen} >
        <Plus className="w-4 h-4 mr-2" />
        Create Book
       </Button>

       
      </div>
      <CreateBookDialog open={open} onOpenChange={setOpen} />
    </div>
  );
}