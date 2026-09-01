import React, { useState } from 'react';
import {
  Sparkles,
  Shield,
  CheckCircle,
  Terminal,
  Folder,
  Globe,
  Activity,
  Play,
} from 'lucide-react';
import { speakResponse, playUiChime } from '../utils/speech';

interface Skill {
  id: string;
  name: string;
  category: string;
  description: string;
  permission: 'SAFE' | 'CONFIRMATION_REQUIRED';
  icon: React.ComponentType<{ className?: string }>;
  exampleCommand: string;
}

export const SkillsView: React.FC = () => {
  const [activeSkillId, setActiveSkillId] = useState<string | null>(null);
  const [testResult, setTestResult] = useState<string | null>(null);

  const skills: Skill[] = [
    {
      id: 'windows_ctrl',
      name: 'Windows Desktop Controller',
      category: 'Operating System',
      description: 'Launches native apps, captures screenshots, secures workstation, and adjusts volume levels.',
      permission: 'SAFE',
      icon: Terminal,
      exampleCommand: '"Jarvis, open VS Code"',
    },
    {
      id: 'file_mgmt',
      name: 'File & Folder Intelligence',
      category: 'Filesystem',
      description: 'Searches project trees, opens files, creates folders, and inspects filesystem paths.',
      permission: 'SAFE',
      icon: Folder,
      exampleCommand: '"Jarvis, open Downloads folder"',
    },
    {
      id: 'browser_ctrl',
      name: 'Web & YouTube Navigator',
      category: 'Browser',
      description: 'Executes web searches, opens direct YouTube videos, and queries developer documentation.',
      permission: 'SAFE',
      icon: Globe,
      exampleCommand: '"Jarvis, search YouTube for React tutorials"',
    },
    {
      id: 'sys_diagnostics',
      name: 'Hardware Telemetry Monitor',
      category: 'Diagnostics',
      description: 'Monitors CPU load, RAM utilization, GPU metrics, disk space, and battery power status.',
      permission: 'SAFE',
      icon: Activity,
      exampleCommand: '"Jarvis, what is my RAM usage?"',
    },
    {
      id: 'file_delete',
      name: 'File Deletion & Cleanup',
      category: 'Filesystem',
      description: 'Deletes unwanted temporary files and organizes disk space. Requires explicit confirmation.',
      permission: 'CONFIRMATION_REQUIRED',
      icon: Shield,
      exampleCommand: '"Jarvis, delete temp cache"',
    },
  ];

  const handleTestSkill = (skill: Skill) => {
    setActiveSkillId(skill.id);
    playUiChime('activate');

    setTimeout(() => {
      const res = `[Skill: ${skill.name}] Execution Successful: Sample output returned for ${skill.exampleCommand}`;
      setTestResult(res);
      playUiChime('success');
      speakResponse(`${skill.name} verified and ready.`);
    }, 600);
  };

  return (
    <div className="flex-1 h-full flex flex-col justify-between overflow-y-auto bg-[#080B10] p-6 select-none space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between pb-4 border-b border-white/[0.05]">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-sm font-bold text-white tracking-wide">Skill Registry & Agent Capabilities</h2>
            <p className="text-[11px] text-slate-400">Extensible Tool Registry with Deterministic Security Policies</p>
          </div>
        </div>

        <div className="flex items-center gap-2 text-xs text-slate-400 font-mono">
          <span className="w-2 h-2 rounded-full bg-cyan-400" />
          <span>5 Active Skills</span>
        </div>
      </div>

      {/* Skills Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {skills.map((skill) => {
          const Icon = skill.icon;
          const isSelected = activeSkillId === skill.id;

          return (
            <div
              key={skill.id}
              className={`p-5 rounded-2xl bg-slate-900/40 border transition-all flex flex-col justify-between space-y-4 ${
                isSelected
                  ? 'border-cyan-500/40 bg-cyan-500/[0.03] shadow-[0_0_20px_rgba(0,229,255,0.1)]'
                  : 'border-white/[0.05] hover:border-white/[0.1]'
              }`}
            >
              <div>
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2.5 rounded-xl bg-slate-900 border border-white/[0.06] text-cyan-400">
                      <Icon className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="text-sm font-semibold text-white">{skill.name}</h3>
                      <span className="text-[10px] font-mono text-slate-500">{skill.category}</span>
                    </div>
                  </div>

                  {/* Permission badge */}
                  <span
                    className={`text-[9px] font-mono px-2 py-0.5 rounded-full border ${
                      skill.permission === 'SAFE'
                        ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                        : 'bg-amber-500/10 text-amber-400 border-amber-500/20'
                    }`}
                  >
                    {skill.permission === 'SAFE' ? 'SAFE' : 'CONFIRM REQUIRED'}
                  </span>
                </div>

                <p className="text-xs text-slate-400 mt-3">{skill.description}</p>
                <div className="mt-2 text-[11px] font-mono text-cyan-400/80">
                  Try: {skill.exampleCommand}
                </div>
              </div>

              {/* Test Button */}
              <button
                onClick={() => handleTestSkill(skill)}
                className="flex items-center justify-center gap-2 py-2 rounded-xl bg-slate-900/80 hover:bg-cyan-500/20 border border-white/[0.08] hover:border-cyan-500/40 text-xs font-semibold text-slate-200 hover:text-cyan-300 transition-colors"
              >
                <Play className="w-3.5 h-3.5 text-cyan-400" />
                <span>Test Tool Protocol</span>
              </button>
            </div>
          );
        })}
      </div>

      {/* Output preview */}
      {testResult && (
        <div className="p-3.5 rounded-xl bg-slate-900/60 border border-cyan-500/30 text-xs font-mono text-cyan-300 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
            <span className="truncate">{testResult}</span>
          </div>
          <button
            onClick={() => setTestResult(null)}
            className="text-[10px] text-slate-500 hover:text-slate-300"
          >
            Clear
          </button>
        </div>
      )}
    </div>
  );
};
