'use client';

import React from 'react';
import { ProjectContext } from '@/components/dashboard/ProjectContext';
import { Project } from '@/lib/projects';

interface DashboardHeaderProps {
  projects: Project[];
  activeProject: Project | null;
  onSelectProject?: (project: Project) => void;
}

export function DashboardHeader({
  projects,
  activeProject,
  onSelectProject,
}: DashboardHeaderProps) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-8 border-b border-white/[0.06]">
      <div>
        <span className="text-[11px] font-mono tracking-widest uppercase text-[#22c55e] block mb-1.5 font-medium">
          OVERVIEW
        </span>
        <h1 className="text-2xl sm:text-3xl lg:text-[32px] font-bold tracking-tight text-white">
          Agent control, at a glance.
        </h1>
        <p className="text-sm text-neutral-400 mt-1 max-w-xl">
          Monitor decisions, verification, and recovery across your agents.
        </p>
      </div>

      <div className="self-start sm:self-auto shrink-0">
        <ProjectContext
          projects={projects}
          activeProject={activeProject}
          onSelectProject={onSelectProject}
        />
      </div>
    </div>
  );
}
