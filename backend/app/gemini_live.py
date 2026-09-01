import asyncio
import json
import logging
import websockets
from fastapi import WebSocket, WebSocketDisconnect
from .config import GEMINI_API_KEY, GEMINI_VOICE_MAP, GEMINI_LIVE_MODEL, GEMINI_FALLBACK_MODELS

logger = logging.getLogger("jarvis.gemini_live")
logging.basicConfig(level=logging.INFO)

GEMINI_LIVE_URL = (
    "wss://generativelanguage.googleapis.com/ws/google.ai.generativelanguage.v1alpha.GenerativeService.BidiGenerateContent"
)

SYSTEM_INSTRUCTION = """You are JARVIS, a highly intelligent, concise, and refined personal AI voice assistant for Washim on Windows.
- Always address Washim with respect and calm efficiency.
- Keep your responses spoken, natural, and concise (1-3 sentences per turn).
- You are directly integrated with Washim's Windows workstation.
- Acknowledge instructions clearly and promptly."""


async def connect_to_gemini_live_with_fallback(voice_name: str):
    """
    Connect to Gemini Live API, attempting gemini-3.1-flash-live-preview first, then fallback models.
    """
    gemini_url = f"{GEMINI_LIVE_URL}?key={GEMINI_API_KEY}"
    last_error = None

    for model_name in GEMINI_FALLBACK_MODELS:
        try:
            gemini_ws = await websockets.connect(gemini_url, open_timeout=8)
            setup_payload = {
                "setup": {
                    "model": model_name,
                    "generationConfig": {
                        "responseModalities": ["AUDIO"],
                        "speechConfig": {
                            "voiceConfig": {
                                "prebuiltVoiceConfig": {
                                    "voiceName": voice_name
                                }
                            }
                        }
                    },
                    "systemInstruction": {
                        "parts": [
                            {"text": SYSTEM_INSTRUCTION}
                        ]
                    }
                }
            }
            await gemini_ws.send(json.dumps(setup_payload))
            logger.info(f"Connected to Gemini Live with model {model_name} and voice {voice_name}")
            return gemini_ws, model_name
        except Exception as e:
            logger.warning(f"Failed to connect using model {model_name}: {e}")
            last_error = e

    raise last_error or Exception("Failed to connect to any Gemini Live model.")


async def handle_gemini_live_session(client_ws: WebSocket, voice_gender: str = "male"):
    """
    Bi-directional bridge between the React frontend WebSocket and Google Gemini Multimodal Live API.
    """
    if not GEMINI_API_KEY:
        await client_ws.send_json({
            "type": "error",
            "message": "GEMINI_API_KEY is not configured in backend/.env"
        })
        await client_ws.close()
        return

    voice_name = GEMINI_VOICE_MAP.get(voice_gender.lower(), "Puck")

    try:
        gemini_ws, active_model = await connect_to_gemini_live_with_fallback(voice_name)
        
        # Notify frontend
        await client_ws.send_json({
            "type": "status",
            "status": "connected",
            "voice": voice_name,
            "model": active_model
        })

        async def client_to_gemini():
            try:
                while True:
                    data = await client_ws.receive_json()
                    msg_type = data.get("type")

                    if msg_type == "audio_chunk":
                        pcm_b64 = data.get("data")
                        mime = data.get("mimeType", "audio/pcm;rate=16000")
                        if pcm_b64:
                            chunk_msg = {
                                "realtimeInput": {
                                    "mediaChunks": [
                                        {
                                            "mimeType": mime,
                                            "data": pcm_b64
                                        }
                                    ]
                                }
                            }
                            await gemini_ws.send(json.dumps(chunk_msg))

                    elif msg_type == "text_prompt":
                        text = data.get("text", "")
                        if text:
                            text_msg = {
                                "clientContent": {
                                    "turns": [
                                        {
                                            "role": "user",
                                            "parts": [{"text": text}]
                                        }
                                    ],
                                    "turnComplete": True
                                }
                            }
                            await gemini_ws.send(json.dumps(text_msg))

                    elif msg_type == "interrupt":
                        # Signal client interruption
                        pass

            except WebSocketDisconnect:
                logger.info("Client disconnected.")
            except Exception as e:
                logger.error(f"client_to_gemini error: {e}")

        async def gemini_to_client():
            try:
                async for raw_msg in gemini_ws:
                    msg = json.loads(raw_msg)

                    if "setupComplete" in msg:
                        await client_ws.send_json({
                            "type": "session_ready",
                            "voice": voice_name,
                            "model": active_model
                        })
                        continue

                    server_content = msg.get("serverContent")
                    if server_content:
                        model_turn = server_content.get("modelTurn")
                        if model_turn:
                            for part in model_turn.get("parts", []):
                                inline_data = part.get("inlineData")
                                if inline_data:
                                    audio_b64 = inline_data.get("data")
                                    mime = inline_data.get("mimeType", "audio/pcm;rate=24000")
                                    await client_ws.send_json({
                                        "type": "audio_chunk",
                                        "data": audio_b64,
                                        "mimeType": mime
                                    })

                                text_data = part.get("text")
                                if text_data:
                                    await client_ws.send_json({
                                        "type": "transcript",
                                        "text": text_data
                                    })

                        if server_content.get("turnComplete"):
                            await client_ws.send_json({
                                "type": "turn_complete"
                            })

                        if server_content.get("interrupted"):
                            await client_ws.send_json({
                                "type": "interrupted"
                            })

            except websockets.exceptions.ConnectionClosed:
                await client_ws.send_json({"type": "status", "status": "disconnected"})
            except Exception as e:
                logger.error(f"gemini_to_client error: {e}")

        await asyncio.gather(
            client_to_gemini(),
            gemini_to_client(),
            return_exceptions=True
        )

        try:
            await gemini_ws.close()
        except Exception:
            pass

    except Exception as e:
        logger.error(f"Failed to establish live session: {e}")
        await client_ws.send_json({
            "type": "error",
            "message": f"Connection to Gemini Live API failed: {str(e)}"
        })
