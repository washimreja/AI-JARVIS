import logging
from typing import Dict, Any, Tuple
from .base import BaseSkill, PermissionLevel

logger = logging.getLogger("jarvis.security")

class SecurityGuardian:
    """
    Validates tool execution, checks safety permissions, and prevents malicious or unauthorized OS calls.
    """
    def __init__(self, require_confirmation_for_tier2: bool = False):
        self.require_confirmation_for_tier2 = require_confirmation_for_tier2

    def validate_execution(self, skill: BaseSkill, params: Dict[str, Any]) -> Tuple[bool, str]:
        """
        Returns (is_allowed, reason_or_error_code)
        """
        # Block any blocked permissions outright
        if skill.permission == PermissionLevel.BLOCKED:
            logger.warning(f"Execution BLOCKED for skill '{skill.name}'")
            return False, "PERMISSION_BLOCKED"

        # Check confirm permissions
        if skill.permission == PermissionLevel.CONFIRM and self.require_confirmation_for_tier2:
            logger.info(f"Execution requires user confirmation for skill '{skill.name}'")
            return False, "REQUIRES_CONFIRMATION"

        return True, "ALLOWED"
