import logging
from typing import Dict, List, Any, Optional
from .base import BaseSkill, SkillResult
from .windows_control import OpenApplicationSkill

logger = logging.getLogger("jarvis.skills.registry")

class SkillRegistry:
    """
    Central registry for all executable JARVIS Skills.
    """
    def __init__(self):
        self._skills: Dict[str, BaseSkill] = {}
        self._register_default_skills()

    def _register_default_skills(self):
        self.register(OpenApplicationSkill())

    def register(self, skill: BaseSkill):
        self._skills[skill.name] = skill
        logger.info(f"Registered skill: {skill.name}")

    def get_skill(self, name: str) -> Optional[BaseSkill]:
        return self._skills.get(name)

    def list_skills(self) -> List[Dict[str, Any]]:
        return [
            {
                "name": skill.name,
                "description": skill.description,
                "permission": skill.permission.value,
                "parameters": skill.parameters_schema
            }
            for skill in self._skills.values()
        ]

    def get_gemini_tools_declaration(self) -> List[Dict[str, Any]]:
        """
        Formats all registered skills into the Gemini FunctionDeclarations schema.
        """
        return [skill.get_function_declaration() for skill in self._skills.values()]

    async def execute(self, skill_name: str, params: Dict[str, Any]) -> SkillResult:
        skill = self.get_skill(skill_name)
        if not skill:
            return SkillResult(
                success=False,
                error="SKILL_NOT_FOUND",
                message=f"No skill named '{skill_name}' is registered in the JARVIS registry."
            )
        return await skill.execute(params)

# Global registry instance
skill_registry = SkillRegistry()
