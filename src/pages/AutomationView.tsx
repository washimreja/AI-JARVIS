import React, { useState } from 'react';
import {
  Sliders,
  Play,
  CheckCircle2,
  Plus,
  Code,
  Globe,
  Sparkles,
  Loader2,
} from 'lucide-react';
import { speakResponse, playUiChime } from '../utils/speech';

interface Recipe {
  id: string;
  name: string;
  description: string;
  trigger: string;
  steps: string[];
  icon: React.ComponentType<{ className?: string }>;
  enabled: boolean;
}

export const AutomationView: React.FC = () => {
  const [runningRecipeId, setRunningRecipeId] = useState<string | null>(null);
  const [activeStepIndex, setActiveStepIndex] = useState<number>(-1);

  const [recipes, setRecipes] = useState<Recipe[]>([
    {
      id: 'coding_workspace',
      name: 'Start Coding Workspace',
      description: 'Prepares full developer environment for Python & React programming.',
      trigger: '"Jarvis, start my coding workspace"',
      steps: [
        'Open Visual Studio Code in current project',
        'Open Google Chrome with localhost:5173 & GitHub',
        'Launch Windows Terminal in workspace directory',
        'Set system volume to 40% & open Spotify',
      ],
      icon: Code,
      enabled: true,
    },
    {
      id: 'morning_briefing',
      name: 'Morning Routine & Briefing',
      description: 'Delivers daily schedule, weather, and opens essential workstation apps.',
      trigger: '"Jarvis, good morning"',
      steps: [
        'Read weather and temperature telemetry',
        'Open Calendar and list active tasks',
        'Open email client and daily news digest',
      ],
      icon: Globe,
      enabled: true,
    },
    {
      id: 'focus_mode',
      name: 'Deep Focus Work Mode',
      description: 'Mutes notifications, closes distracting tabs, and turns on focus ambiance.',
      trigger: '"Jarvis, enter focus mode"',
      steps: [
        'Enable Windows Do Not Disturb',
        'Close background browser tabs',
        'Maximize primary code editor',
      ],
      icon: Sparkles,
      enabled: false,
    },
  ]);

  const handleRunRecipe = (recipe: Recipe) => {
    if (runningRecipeId) return;

    setRunningRecipeId(recipe.id);
    setActiveStepIndex(0);
    playUiChime('activate');
    speakResponse(`Executing recipe: ${recipe.name}`);

    // Step by step progression
    recipe.steps.forEach((_, idx) => {
      setTimeout(() => {
        setActiveStepIndex(idx);
        playUiChime('click');

        if (idx === recipe.steps.length - 1) {
          setTimeout(() => {
            setRunningRecipeId(null);
            setActiveStepIndex(-1);
            playUiChime('success');
            speakResponse(`${recipe.name} completed successfully, Washim.`);
          }, 1200);
        }
      }, (idx + 1) * 1200);
    });
  };

  const toggleRecipe = (id: string) => {
    setRecipes((prev) =>
      prev.map((r) => (r.id === id ? { ...r, enabled: !r.enabled } : r))
    );
  };

  return (
    <div className="flex-1 h-full flex flex-col justify-between overflow-y-auto bg-[#080B10] p-6 select-none space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between pb-4 border-b border-white/[0.05]">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
            <Sliders className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-sm font-bold text-white tracking-wide">Multi-Step Automation Engine</h2>
            <p className="text-[11px] text-slate-400">Chained Workflows, Desktop Routines & Voice Trigger Macros</p>
          </div>
        </div>

        <button
          onClick={() => alert('New Custom Recipe creation enabled.')}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-cyan-500/20 hover:bg-cyan-500/30 border border-cyan-500/40 text-cyan-300 text-xs font-medium transition-colors"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>New Recipe</span>
        </button>
      </div>

      {/* Recipes List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {recipes.map((recipe) => {
          const Icon = recipe.icon;
          const isRunning = runningRecipeId === recipe.id;

          return (
            <div
              key={recipe.id}
              className="p-5 rounded-2xl bg-slate-900/40 border border-white/[0.05] hover:border-cyan-500/25 transition-all flex flex-col justify-between space-y-4"
            >
              <div>
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2.5 rounded-xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400">
                      <Icon className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="text-sm font-semibold text-white">{recipe.name}</h3>
                      <span className="text-[10px] font-mono text-cyan-400">{recipe.trigger}</span>
                    </div>
                  </div>

                  {/* Toggle Switch */}
                  <button
                    onClick={() => toggleRecipe(recipe.id)}
                    className={`w-9 h-5 rounded-full transition-colors p-0.5 ${
                      recipe.enabled ? 'bg-cyan-500' : 'bg-slate-800'
                    }`}
                  >
                    <div
                      className={`w-4 h-4 rounded-full bg-white transition-transform ${
                        recipe.enabled ? 'translate-x-4' : 'translate-x-0'
                      }`}
                    />
                  </button>
                </div>

                <p className="text-xs text-slate-400 mt-2">{recipe.description}</p>

                {/* Steps List */}
                <div className="mt-4 space-y-1.5">
                  {recipe.steps.map((step, idx) => {
                    const isStepActive = isRunning && activeStepIndex === idx;
                    const isStepDone = isRunning && activeStepIndex > idx;

                    return (
                      <div
                        key={idx}
                        className={`flex items-center gap-2 text-xs p-2 rounded-xl border transition-colors ${
                          isStepActive
                            ? 'bg-cyan-500/15 border-cyan-500/40 text-cyan-300'
                            : isStepDone
                            ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-300'
                            : 'bg-slate-900/30 border-white/[0.02] text-slate-400'
                        }`}
                      >
                        {isStepActive ? (
                          <Loader2 className="w-3.5 h-3.5 text-cyan-400 animate-spin shrink-0" />
                        ) : isStepDone ? (
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                        ) : (
                          <span className="w-3.5 h-3.5 rounded-full bg-slate-800 text-[9px] font-mono flex items-center justify-center text-slate-400 shrink-0">
                            {idx + 1}
                          </span>
                        )}
                        <span className="truncate">{step}</span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Action Button */}
              <button
                onClick={() => handleRunRecipe(recipe)}
                disabled={isRunning || !recipe.enabled}
                className="w-full flex items-center justify-center gap-2 py-2 rounded-xl bg-slate-900/80 hover:bg-cyan-500/20 border border-white/[0.08] hover:border-cyan-500/40 text-xs font-semibold text-slate-200 hover:text-cyan-300 disabled:opacity-40 transition-colors"
              >
                {isRunning ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    <span>Running Sequence...</span>
                  </>
                ) : (
                  <>
                    <Play className="w-3.5 h-3.5 text-cyan-400" />
                    <span>Trigger Workflow</span>
                  </>
                )}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
};
