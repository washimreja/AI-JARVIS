from fastapi import FastAPI, WebSocket, Query, Response
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import httpx
from .gemini_live import handle_gemini_live_session
from .config import PORT, HOST, GEMINI_API_KEY, ELEVENLABS_API_KEY, ELEVENLABS_VOICE_MAP
from .agent_core import agent_core
from .skills.registry import skill_registry

app = FastAPI(title="JARVIS Backend AI Agent Engine", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class CommandRequest(BaseModel):
    command: str

class ChatRequest(BaseModel):
    prompt: str
    model: str = "gemini-3.1-flash-live-preview"

class TTSRequest(BaseModel):
    text: str
    gender: str = "male"

@app.get("/health")
async def health_check():
    return {
        "status": "online",
        "service": "JARVIS AI Voice Backend",
        "gemini_live_model": "gemini-3.1-flash-live-preview",
        "gemini_api_key": bool(GEMINI_API_KEY),
        "elevenlabs_api_key": bool(ELEVENLABS_API_KEY),
    }

@app.get("/api/skills")
async def get_skills():
    return {"skills": skill_registry.list_skills()}

@app.post("/api/agent/command")
async def execute_agent_command(req: CommandRequest):
    """
    Direct endpoint for Agent Core command execution with skill dispatch.
    """
    res = await agent_core.process_command(req.command)
    return res.dict()

@app.post("/api/chat")
async def chat_endpoint(req: ChatRequest):
    # First check if the prompt is an executable skill command
    agent_res = await agent_core.process_command(req.prompt)
    if agent_res.success:
        return {"response": agent_res.speech_response, "tool_executed": agent_res.tool_name}

    if not GEMINI_API_KEY:
        return {"response": "GEMINI_API_KEY is not configured on the backend server."}

    url = f"https://generativelanguage.googleapis.com/v1beta/models/{req.model}:generateContent?key={GEMINI_API_KEY}"
    system_prompt = (
        "You are JARVIS, a highly intelligent, concise, and elegant personal Windows AI voice assistant for Washim. "
        "Keep your response concise, clear, and helpful (under 2-3 sentences unless asked for code)."
    )

    async with httpx.AsyncClient(timeout=30.0) as client:
        try:
            resp = await client.post(
                url,
                json={
                    "contents": [
                        {
                            "role": "user",
                            "parts": [{"text": f"{system_prompt}\n\nUser Question: {req.prompt}"}]
                        }
                    ]
                }
            )
            if resp.status_code == 200:
                data = resp.json()
                text = data.get("candidates", [{}])[0].get("content", {}).get("parts", [{}])[0].get("text", "")
                return {"response": text or "I have processed your request, Washim."}
            else:
                fallback_url = f"https://generativelanguage.googleapis.com/v1beta/models/gemini-flash-latest:generateContent?key={GEMINI_API_KEY}"
                fb_resp = await client.post(
                    fallback_url,
                    json={
                        "contents": [
                            {
                                "parts": [{"text": f"{system_prompt}\n\nUser Question: {req.prompt}"}]
                            }
                        ]
                    }
                )
                if fb_resp.status_code == 200:
                    fb_data = fb_resp.json()
                    fb_text = fb_data.get("candidates", [{}])[0].get("content", {}).get("parts", [{}])[0].get("text", "")
                    return {"response": fb_text or "I am ready, Washim."}
                return {"response": f"API error: status {resp.status_code}"}
        except Exception as e:
            return {"response": f"Error connecting to backend: {str(e)}"}

@app.post("/api/tts/elevenlabs")
async def elevenlabs_tts_endpoint(req: TTSRequest):
    if not ELEVENLABS_API_KEY:
        return Response(content=b"", status_code=500)

    voice_id = ELEVENLABS_VOICE_MAP.get(req.gender.lower(), "JBFqnCBsd6RMkjVDRZzb")
    url = f"https://api.elevenlabs.io/v1/text-to-speech/{voice_id}"

    headers = {
        "xi-api-key": ELEVENLABS_API_KEY,
        "Content-Type": "application/json",
        "Accept": "audio/mpeg"
    }

    body = {
        "text": req.text,
        "model_id": "eleven_multilingual_v2",
        "voice_settings": {
            "stability": 0.5,
            "similarity_boost": 0.8
        }
    }

    async with httpx.AsyncClient(timeout=30.0) as client:
        try:
            resp = await client.post(url, headers=headers, json=body)
            if resp.status_code == 200:
                return Response(content=resp.content, media_type="audio/mpeg")
            else:
                return Response(content=resp.content, status_code=resp.status_code)
        except Exception as e:
            return Response(content=str(e).encode(), status_code=500)

@app.websocket("/ws/live")
async def websocket_gemini_live(
    websocket: WebSocket,
    voice: str = Query("male")
):
    await websocket.accept()
    await handle_gemini_live_session(websocket, voice_gender=voice)
