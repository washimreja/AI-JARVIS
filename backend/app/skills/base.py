from abc import ABC, abstractmethod
from enum import Enum
from typing import Any, Dict, Optional
from pydantic import BaseModel, Field

class PermissionLevel(str, Enum):
    SAFE = "SAFE"
    CONFIRM = "CONFIRM"
    BLOCKED = "BLOCKED"

class SkillResult(BaseModel):
    success: bool
    data: Optional[Dict[str, Any]] = None
    error: Optional[str] = None
    message: Optional[str] = None

class BaseSkill(ABC):
    """
    Abstract base class for all JARVIS Skills.
    """
    name: str
    description: str
    permission: PermissionLevel = PermissionLevel.SAFE
    parameters_schema: Dict[str, Any] = Field(default_factory=dict)

    @abstractmethod
    async def execute(self, params: Dict[str, Any]) -> SkillResult:
        """
        Execute the skill with validated parameters.
        """
        pass

    def get_function_declaration(self) -> Dict[str, Any]:
        """
        Returns the Gemini FunctionDeclaration schema.
        """
        return {
            "name": self.name,
            "description": self.description,
            "parameters": self.parameters_schema
        }
