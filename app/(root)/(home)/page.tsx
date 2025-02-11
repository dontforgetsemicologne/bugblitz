"use client"

import { Activity } from "lucide-react"
import { useEffect, useState } from "react"
import { dashboardStats } from "@/app/actions/dashboardActions"

interface DashboardStats {
  bugs: {
    open: number
    inProgress: number
    resolved: number
    closed: number
  }
  priorities: {
    critical: number
    high: number
    medium: number
    low: number
  }
  totalProjects: number
  totalUsers: number
}

interface MetricProps {
  label: string
  value: number
  total: number
  color: string
}

function MetricCard({ label, value, total, color }: MetricProps) {
  const percentage = total > 0 ? Math.round((value / total) * 100) : 0

  return (
    <div className="relative flex flex-col items-center">
      <div className="relative w-24 h-24">
        <div className="absolute inset-0 rounded-full border-4 border-zinc-800/50" />
        <div
          className="absolute inset-0 rounded-full border-4 transition-all duration-500"
          style={{
            borderColor: color,
            clipPath: `polygon(0 0, 100% 0, 100% ${percentage}%, 0 ${percentage}%)`,
          }}
        />
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-xl font-bold text-white">{value}</span>
        </div>
      </div>
      <span className="mt-3 text-sm font-medium text-zinc-300">{label}</span>
      <span className="text-xs text-zinc-500">{percentage}%</span>
    </div>
  )
}

export default function DashboardPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null)

  useEffect(() => {
    const loadStats = async () => {
      const data = await dashboardStats()
      setStats(data)
    }
    loadStats()
  }, [])

  if (!stats) {
    return (
      <div className="p-8 flex justify-center items-center">
        <div className="max-w-4xl w-full animate-pulse">
          <div className="h-[600px] bg-zinc-800 rounded-3xl" />
        </div>
      </div>
    )
  }

  const totalBugs = stats.bugs.open + stats.bugs.inProgress + stats.bugs.resolved + stats.bugs.closed
  const totalPriorityBugs = stats.priorities.critical + stats.priorities.high + stats.priorities.medium + stats.priorities.low

  return (
    <div className="p-2">
      <div className="max-w-4xl mx-auto">
        <div className="rounded-3xl p-6 bg-black/5 border border-zinc-800">
          {/* Header */}
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 rounded-full bg-zinc-800/50">
              <Activity className="w-5 h-5 text-blue-500" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-white">Dashboard Overview</h3>
              <p className="text-sm text-zinc-400">Bug Tracking Statistics</p>
            </div>
          </div>

          {/* Bug Status Section */}
          <div className="mb-8">
            <h4 className="text-sm font-medium text-zinc-300 mb-4">Bug Status</h4>
            <div className="grid grid-cols-4 gap-4">
              <MetricCard 
                label="Open" 
                value={stats.bugs.open} 
                total={totalBugs}
                color="#FF2D55"
              />
              <MetricCard 
                label="In Progress" 
                value={stats.bugs.inProgress} 
                total={totalBugs}
                color="#007AFF"
              />
              <MetricCard 
                label="Resolved" 
                value={stats.bugs.resolved} 
                total={totalBugs}
                color="#2CD758"
              />
              <MetricCard 
                label="Closed" 
                value={stats.bugs.closed} 
                total={totalBugs}
                color="#5856D6"
              />
            </div>
          </div>

          {/* Bug Priority Section */}
          <div className="mb-8">
            <h4 className="text-sm font-medium text-zinc-300 mb-4">Bug Priority</h4>
            <div className="grid grid-cols-4 gap-4">
              <MetricCard 
                label="Critical" 
                value={stats.priorities.critical} 
                total={totalPriorityBugs}
                color="#FF3B30"
              />
              <MetricCard 
                label="High" 
                value={stats.priorities.high} 
                total={totalPriorityBugs}
                color="#FF9500"
              />
              <MetricCard 
                label="Medium" 
                value={stats.priorities.medium} 
                total={totalPriorityBugs}
                color="#FFCC00"
              />
              <MetricCard 
                label="Low" 
                value={stats.priorities.low} 
                total={totalPriorityBugs}
                color="#34C759"
              />
            </div>
          </div>

          {/* Project and User Stats */}
          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 rounded-xl bg-zinc-900/50 border border-zinc-800/50">
              <h4 className="text-sm font-medium text-zinc-300 mb-2">Total Projects</h4>
              <p className="text-2xl font-bold text-white">{stats.totalProjects}</p>
            </div>
            <div className="p-4 rounded-xl bg-zinc-900/50 border border-zinc-800/50">
              <h4 className="text-sm font-medium text-zinc-300 mb-2">Total Users</h4>
              <p className="text-2xl font-bold text-white">{stats.totalUsers}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}