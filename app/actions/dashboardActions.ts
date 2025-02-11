'use server'

import prisma from "@/lib/prisma";
import { BugStatus, Priority } from "@prisma/client";

export async function dashboardStats() {
    const [bugStatusCounts, priorityCounts, totalProjects, totalUsers] = await Promise.all([
        prisma.bug.groupBy({
            by: ["status"],
            _count: true
        }),
        prisma.bug.groupBy({
            by: ["priority"],
            _count: true
        }),
        prisma.project.count(),
        prisma.user.count(),
    ]);

    const statusStats = bugStatusCounts.reduce((stat, current) => {
        stat[current.status] = current._count;
        return stat
    }, {
        [BugStatus.OPEN]: 0,
        [BugStatus.IN_PROGRESS]: 0,
        [BugStatus.RESOLVED]: 0,
        [BugStatus.CLOSED]: 0
    });

    const priorityStats = priorityCounts.reduce((stat, current) => {
        stat[current.priority] = current._count;
        return stat
    }, {
        [Priority.CRITICAL]: 0,
        [Priority.HIGH]: 0,
        [Priority.MEDIUM]: 0,
        [Priority.LOW]: 0
    });

    return {
        bugs: {
            open: statusStats[BugStatus.OPEN],
            inProgress: statusStats[BugStatus.IN_PROGRESS],
            resolved: statusStats[BugStatus.RESOLVED],
            closed: statusStats[BugStatus.CLOSED]
        },
        priorities: {
            critical: priorityStats[Priority.CRITICAL],
            high: priorityStats[Priority.HIGH],
            medium: priorityStats[Priority.MEDIUM],
            low: priorityStats[Priority.LOW]
        },
        totalProjects,
        totalUsers
    }
}