"use client";

import { useParams } from "next/navigation";

export default function AdminBlogPage() {
  const params = useParams();
  return <div>Blog: {params.blog}</div>;
}
