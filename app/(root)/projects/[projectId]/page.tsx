'use client'

import { useParams } from "next/navigation";

export default function ProjectPage() {
    const params = useParams();
    const projectId = params?.projectId as string;

    return(
        <>
            {projectId}
        </>
    )
}