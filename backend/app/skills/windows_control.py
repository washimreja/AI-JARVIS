import os
import shutil
import subprocess
import logging
from typing import Dict, Any, Optional
from .base import BaseSkill, PermissionLevel, SkillResult

logger = logging.getLogger("jarvis.skills.windows")

# Strict Application Allowlist Mapping
APPLICATION_ALLOWLIST: Dict[str, Dict[str, Any]] = {
    "vscode": {
        "aliases": ["vs code", "vscode", "visual studio code", "code editor", "code"],
        "display_name": "Visual Studio Code",
        "commands": ["code.cmd", "code", "code.exe"],
    },
    "chrome": {
        "aliases": ["chrome", "google chrome", "browser", "web browser"],
        "display_name": "Google Chrome",
        "commands": ["chrome.exe", "chrome"],
    },
    "notepad": {
        "aliases": ["notepad", "text editor", "notes"],
        "display_name": "Notepad",
        "commands": ["notepad.exe", "notepad"],
    },
    "calculator": {
        "aliases": ["calculator", "calc"],
        "display_name": "Calculator",
        "commands": ["calc.exe", "calc"],
    },
    "explorer": {
        "aliases": ["file explorer", "explorer", "files", "my computer"],
        "display_name": "File Explorer",
        "commands": ["explorer.exe", "explorer"],
    },
    "terminal": {
        "aliases": ["windows terminal", "terminal", "wt", "powershell", "cmd"],
        "display_name": "Windows Terminal",
        "commands": ["wt.exe", "wt", "powershell.exe", "cmd.exe"],
    },
    "spotify": {
        "aliases": ["spotify", "music player"],
        "display_name": "Spotify",
        "commands": ["spotify.exe", "spotify"],
    },
}

class OpenApplicationSkill(BaseSkill):
    name = "open_application"
    description = (
        "Opens an approved application on the Windows desktop (VS Code, Chrome, Notepad, Calculator, File Explorer, Terminal, Spotify)."
    )
    permission = PermissionLevel.SAFE
    parameters_schema = {
        "type": "OBJECT",
        "properties": {
            "application": {
                "type": "STRING",
                "description": "The name or alias of the application to open (e.g. 'vscode', 'chrome', 'notepad', 'calc', 'explorer', 'terminal', 'spotify')."
            }
        },
        "required": ["application"]
    }

    def _resolve_app_key(self, app_input: str) -> Optional[str]:
        cleaned = app_input.strip().lower()
        for key, info in APPLICATION_ALLOWLIST.items():
            if cleaned == key or cleaned in info["aliases"]:
                return key
        return None

    def _find_executable(self, commands: list[str]) -> Optional[str]:
        for cmd in commands:
            # Check if command is on system PATH
            found = shutil.which(cmd)
            if found:
                return found

            # Windows-specific system paths check
            win_dir = os.environ.get("WINDIR", "C:\\Windows")
            candidate_paths = [
                os.path.join(win_dir, cmd),
                os.path.join(win_dir, "System32", cmd),
                os.path.join(os.environ.get("LOCALAPPDATA", ""), "Programs", "Microsoft VS Code", cmd),
                os.path.join(os.environ.get("ProgramFiles", "C:\\Program Files"), "Google\\Chrome\\Application", cmd),
                os.path.join(os.environ.get("ProgramFiles(x86)", "C:\\Program Files (x86)"), "Google\\Chrome\\Application", cmd),
            ]
            for path in candidate_paths:
                if os.path.exists(path):
                    return path

        return None

    async def execute(self, params: Dict[str, Any]) -> SkillResult:
        app_name = params.get("application")
        if not app_name or not isinstance(app_name, str):
            return SkillResult(
                success=False,
                error="INVALID_PARAMETERS",
                message="Application parameter is required and must be a string."
            )

        app_key = self._resolve_app_key(app_name)
        if not app_key:
            return SkillResult(
                success=False,
                error="APPLICATION_NOT_ALLOWED",
                message=f"Application '{app_name}' is not in the approved application allowlist."
            )

        app_info = APPLICATION_ALLOWLIST[app_key]
        display_name = app_info["display_name"]
        exe_path = self._find_executable(app_info["commands"])

        if not exe_path:
            # Fallback to direct Windows launch for built-in protocol commands
            try:
                cmd = app_info["commands"][0]
                subprocess.Popen([cmd], shell=False)
                return SkillResult(
                    success=True,
                    data={"application": app_key, "display_name": display_name},
                    message=f"{display_name} launched successfully."
                )
            except Exception:
                return SkillResult(
                    success=False,
                    error="APPLICATION_NOT_FOUND",
                    message=f"Could not locate executable for {display_name} on this workstation."
                )

        try:
            # Safe process launch
            subprocess.Popen([exe_path], shell=False)
            logger.info(f"Successfully launched {display_name} via {exe_path}")
            return SkillResult(
                success=True,
                data={
                    "application": app_key,
                    "display_name": display_name,
                    "executable": exe_path
                },
                message=f"{display_name} is ready, Washim."
            )
        except Exception as e:
            logger.error(f"Failed to launch {display_name}: {e}")
            return SkillResult(
                success=False,
                error="EXECUTION_FAILED",
                message=f"Failed to start {display_name}: {str(e)}"
            )
