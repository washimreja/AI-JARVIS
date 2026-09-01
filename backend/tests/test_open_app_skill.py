import pytest
from unittest.mock import patch, MagicMock
from app.skills.base import PermissionLevel
from app.skills.security import SecurityGuardian
from app.skills.windows_control import OpenApplicationSkill
from app.skills.registry import SkillRegistry
from app.agent_core import AgentCore

@pytest.fixture
def skill():
    return OpenApplicationSkill()

@pytest.fixture
def security():
    return SecurityGuardian()

@pytest.fixture
def agent():
    return AgentCore()

@pytest.mark.asyncio
async def test_valid_application_launch(skill):
    """Test valid application launch with mocked subprocess."""
    with patch("subprocess.Popen") as mock_popen, \
         patch.object(skill, "_find_executable", return_value="C:\\Program Files\\VSCode\\Code.exe"):
        mock_popen.return_value = MagicMock()

        result = await skill.execute({"application": "vscode"})

        assert result.success is True
        assert result.data["application"] == "vscode"
        assert "Visual Studio Code" in result.message
        mock_popen.assert_called_once_with(["C:\\Program Files\\VSCode\\Code.exe"], shell=False)

@pytest.mark.asyncio
async def test_application_alias_resolution(skill):
    """Test alias variations for application name."""
    with patch("subprocess.Popen"), \
         patch.object(skill, "_find_executable", return_value="C:\\Windows\\notepad.exe"):
        
        result = await skill.execute({"application": "text editor"})
        assert result.success is True
        assert result.data["application"] == "notepad"

@pytest.mark.asyncio
async def test_invalid_application_not_allowed(skill):
    """Test unapproved application blocked by allowlist."""
    result = await skill.execute({"application": "malicious_script.exe"})

    assert result.success is False
    assert result.error == "APPLICATION_NOT_ALLOWED"
    assert "not in the approved application allowlist" in result.message

@pytest.mark.asyncio
async def test_missing_or_invalid_parameters(skill):
    """Test missing or invalid parameters."""
    res1 = await skill.execute({})
    assert res1.success is False
    assert res1.error == "INVALID_PARAMETERS"

    res2 = await skill.execute({"application": 12345})
    assert res2.success is False
    assert res2.error == "INVALID_PARAMETERS"

@pytest.mark.asyncio
async def test_missing_executable_failure(skill):
    """Test when executable cannot be located and fails launch."""
    with patch("subprocess.Popen", side_effect=FileNotFoundError("Executable not found")), \
         patch.object(skill, "_find_executable", return_value=None):

        result = await skill.execute({"application": "spotify"})
        assert result.success is False
        assert result.error == "APPLICATION_NOT_FOUND"

@pytest.mark.asyncio
async def test_execution_failure_handling(skill):
    """Test subprocess Popen raising an exception."""
    with patch("subprocess.Popen", side_effect=OSError("Access denied")), \
         patch.object(skill, "_find_executable", return_value="C:\\Windows\\System32\\calc.exe"):

        result = await skill.execute({"application": "calc"})
        assert result.success is False
        assert result.error == "EXECUTION_FAILED"

def test_security_guardian_validation(security, skill):
    """Test Security Guardian policy checks."""
    allowed, reason = security.validate_execution(skill, {"application": "vscode"})
    assert allowed is True
    assert reason == "ALLOWED"

    # Test blocked permission
    mock_blocked = MagicMock()
    mock_blocked.name = "format_disk"
    mock_blocked.permission = PermissionLevel.BLOCKED
    allowed, reason = security.validate_execution(mock_blocked, {})
    assert allowed is False
    assert reason == "PERMISSION_BLOCKED"

def test_skill_registry_registration():
    """Test registry stores and generates Gemini function declaration."""
    registry = SkillRegistry()
    skill_obj = registry.get_skill("open_application")
    assert skill_obj is not None
    assert skill_obj.name == "open_application"

    declarations = registry.get_gemini_tools_declaration()
    assert len(declarations) >= 1
    assert declarations[0]["name"] == "open_application"
    assert "application" in declarations[0]["parameters"]["properties"]

@pytest.mark.asyncio
async def test_agent_core_intent_routing(agent):
    """Test Agent Core parses intent and executes open_application."""
    with patch("subprocess.Popen"), \
         patch.object(agent.registry.get_skill("open_application"), "_find_executable", return_value="C:\\Windows\\System32\\cmd.exe"):

        # Match natural variations
        res1 = await agent.process_command("Jarvis, open VS Code")
        assert res1.success is True
        assert res1.tool_name == "open_application"
        assert "ready" in res1.speech_response

        res2 = await agent.process_command("launch Chrome for me")
        assert res2.success is True
        assert res2.tool_name == "open_application"

        res3 = await agent.process_command("Start Calculator")
        assert res3.success is True

        res4 = await agent.process_command("open unknown_app_xyz")
        assert res4.success is False
        assert res4.error == "APPLICATION_NOT_ALLOWED"
