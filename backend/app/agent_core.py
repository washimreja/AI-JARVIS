import re
import logging
from typing import Dict, Any, Optional
from pydantic import BaseModel

from .skills.registry import skill_registry
from .skills.security import SecurityGuardian
from .skills.base import SkillResult

logger = logging.getLogger("jarvis.agent_core")

class AgentExecutionResponse(BaseModel):
    success: bool
    state: str
    tool_name: Optional[str] = None
    speech_response: str
    result_data: Optional[Dict[str, Any]] = None
    error: Optional[str] = None

class AgentCore:
    """
    JARVIS Agent Core: Orchestrates intent understanding, tool selection,
    security policy verification, and voice response synthesis.
    """
    def __init__(self):
        self.registry = skill_registry
        self.security = SecurityGuardian()

    def _parse_open_app_intent(self, command: str) -> Optional[str]:
        """
        Deterministic fast intent parser for open application commands.
        """
        cleaned = command.strip().lower()

        # Match patterns like "open X", "launch X", "start X"
        patterns = [
            r"^(?:jarvis\s*,?\s*)?(?:please\s*)?(?:open|launch|start|run)\s+(?:the\s+)?(.+?)(?:\s+for\s+me|\s+please)?$",
            r"^(?:jarvis\s*,?\s*)?(?:can\s+you\s+)?(?:open|launch|start)\s+(.+)$"
        ]

        for p in patterns:
            match = re.match(p, cleaned)
            if match:
                app_target = match.group(1).strip()
                return app_target

        return None

    async def process_command(self, user_command: str) -> AgentExecutionResponse:
        """
        Process a user command through the Agent Brain.
        """
        logger.info(f"AgentCore processing command: '{user_command}'")

        # 1. Check for open_application intent
        app_target = self._parse_open_app_intent(user_command)
        if app_target:
            return await self.execute_tool("open_application", {"application": app_target})

        # 2. If no direct local skill match, return fallback
        return AgentExecutionResponse(
            success=False,
            state="idle",
            speech_response=f"I didn't recognize a specific skill command for '{user_command}', Washim.",
            error="UNKNOWN_INTENT"
        )

    async def execute_tool(self, tool_name: str, params: Dict[str, Any]) -> AgentExecutionResponse:
        """
        Directly executes a tool with Security Guardian validation.
        """
        skill = self.registry.get_skill(tool_name)
        if not skill:
            return AgentExecutionResponse(
                success=False,
                state="error",
                tool_name=tool_name,
                speech_response=f"Skill '{tool_name}' is not recognized.",
                error="SKILL_NOT_FOUND"
            )

        # Security check
        is_allowed, reason = self.security.validate_execution(skill, params)
        if not is_allowed:
            return AgentExecutionResponse(
                success=False,
                state="error",
                tool_name=tool_name,
                speech_response=f"Action blocked by Security Guardian: {reason}.",
                error=reason
            )

        # Execute
        result: SkillResult = await skill.execute(params)

        if result.success:
            app_display = result.data.get("display_name", "Application") if result.data else "Application"
            return AgentExecutionResponse(
                success=True,
                state="success",
                tool_name=tool_name,
                speech_response=f"{app_display} is ready, Washim.",
                result_data=result.data
            )
        else:
            if result.error == "APPLICATION_NOT_ALLOWED":
                app_name = params.get("application", "that application")
                return AgentExecutionResponse(
                    success=False,
                    state="error",
                    tool_name=tool_name,
                    speech_response=f"Sorry Washim, '{app_name}' is not in the approved application allowlist.",
                    error=result.error
                )
            elif result.error == "APPLICATION_NOT_FOUND":
                app_name = params.get("application", "that application")
                return AgentExecutionResponse(
                    success=False,
                    state="error",
                    tool_name=tool_name,
                    speech_response=f"Sorry Washim, I couldn't locate the executable for '{app_name}' on this workstation.",
                    error=result.error
                )
            else:
                return AgentExecutionResponse(
                    success=False,
                    state="error",
                    tool_name=tool_name,
                    speech_response=f"Failed to execute command: {result.message}",
                    error=result.error
                )

# Global Agent Core instance
agent_core = AgentCore()
