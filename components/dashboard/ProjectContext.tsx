'use client';

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { ChevronDown, Plus, FolderGit2, Check } from 'lucide-react';
import { Project } from '@/lib/projects';

interface ProjectContextProps {
  projects: Project[];
  activeProject: Project | null;
  onSelectProject?: (project: Project) => void;
}

export function ProjectContext({
  projects,
  activeProject,
  onSelectProject,
}: ProjectContextProps) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    }
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape' && isOpen) {
        setIsOpen(false);
      }
    }
    function handleCloseEvent() {
      setIsOpen(false);
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      window.addEventListener('keydown', handleKeyDown);
    }
    window.addEventListener('nexent-close-dropdowns', handleCloseEvent);
    window.addEventListener('resize', handleCloseEvent);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('nexent-close-dropdowns', handleCloseEvent);
      window.removeEventListener('resize', handleCloseEvent);
    };
  }, [isOpen]);

  const currentName = activeProject?.name || 'My first project';

  return (
    <div className="relative" ref={containerRef}>
      <div className="flex flex-col items-start">
        <span className="text-[10px] font-mono uppercase tracking-wider text-neutral-400 mb-1">
          PROJECT
        </span>

        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className="inline-flex items-center gap-2.5 px-3 py-1.5 rounded-xl bg-[#0d1015] hover:bg-[#121620] border border-white/10 hover:border-white/20 transition-colors focus:outline-none focus-visible:ring-1 focus-visible:ring-[#22c55e]"
          id="project-selector-btn"
          aria-expanded={isOpen}
          aria-haspopup="true"
        >
          <span className="w-1.5 h-1.5 rounded-full bg-[#22c55e] shadow-[0_0_6px_rgba(34,197,94,0.6)]" />
          <span className="text-xs font-medium text-white max-w-[140px] sm:max-w-[200px] truncate">
            {currentName}
          </span>
          <ChevronDown
            className={`w-3.5 h-3.5 text-neutral-400 transition-transform duration-150 ${
              isOpen ? 'rotate-180 text-white' : ''
            }`}
          />
        </button>
      </div>

      {/* Viewport-aware Dropdown for project switching & creation */}
      {isOpen && (
        <div
          className="absolute left-0 sm:left-auto sm:right-0 top-full mt-2 w-[min(280px,calc(100vw-40px))] max-w-[calc(100vw-40px)] rounded-xl bg-[#0d1015] border border-white/10 shadow-2xl py-1.5 z-40 animate-in fade-in zoom-in-95 duration-100"
          role="menu"
        >
          <div className="px-3 py-2 border-b border-white/[0.06]">
            <p className="text-[11px] font-mono text-neutral-400 uppercase tracking-wider font-medium">
              ACTIVE PROJECTS
            </p>
          </div>

          <div className="max-h-48 overflow-y-auto py-1">
            {projects.length > 0 ? (
              projects.map((proj) => {
                const isSelected = activeProject?.id === proj.id;
                return (
                  <button
                    key={proj.id}
                    type="button"
                    onClick={() => {
                      if (onSelectProject) onSelectProject(proj);
                      setIsOpen(false);
                    }}
                    className={`w-full flex items-center justify-between px-3 py-2 text-xs text-left transition-colors ${
                      isSelected
                        ? 'bg-white/[0.08] text-white font-medium'
                        : 'text-neutral-300 hover:text-white hover:bg-white/[0.04]'
                    }`}
                    role="menuitem"
                  >
                    <div className="flex items-center gap-2 truncate">
                      <FolderGit2 className="w-3.5 h-3.5 text-neutral-400 shrink-0" />
                      <span className="truncate">{proj.name}</span>
                    </div>
                    {isSelected && (
                      <Check className="w-3.5 h-3.5 text-[#22c55e] shrink-0" />
                    )}
                  </button>
                );
              })
            ) : (
              <div className="px-3 py-2 text-xs text-neutral-400">
                {currentName} (Active)
              </div>
            )}
          </div>

          <div className="border-t border-white/[0.06] mt-1 pt-1">
            <Link
              href="/onboarding?step=2"
              onClick={() => setIsOpen(false)}
              className="flex items-center gap-2 px-3 py-2 text-xs text-[#22c55e] hover:bg-[#22c55e]/10 transition-colors"
              role="menuitem"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Create new project</span>
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
