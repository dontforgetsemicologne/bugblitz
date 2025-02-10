'use client'

import { useParams } from "next/navigation";

export default function ProjectPage() {
    const params = useParams();
    const issueId = params?.issueId as string;

    return(
        <>
            {issueId}
        </>
    )
}