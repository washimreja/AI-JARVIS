import os
from pathlib import Path
from dotenv import load_dotenv

env_path = Path(__file__).resolve().parent.parent / '.env'
load_dotenv(dotenv_path=env_path)

GEMINI_API_KEY = os.getenv('GEMINI_API_KEY', '')
ELEVENLABS_API_KEY = os.getenv('ELEVENLABS_API_KEY', '')
PORT = int(os.getenv('PORT', '8000'))
HOST = os.getenv('HOST', '127.0.0.1')

# Primary Gemini Live Multimodal Model
GEMINI_LIVE_MODEL = "models/gemini-3.1-flash-live-preview"
GEMINI_FALLBACK_MODELS = [
    "models/gemini-3.1-flash-live-preview",
    "models/gemini-2.0-flash-exp",
    "models/gemini-2.0-flash-realtime-exp"
]

# Gemini Live Voice Names
GEMINI_VOICE_MAP = {
    'male': 'Puck',       # Deep, refined, authoritative
    'female': 'Aoede',    # Calm, articulate, warm
    'puck': 'Puck',
    'aoede': 'Aoede',
    'kore': 'Kore',
    'fenrir': 'Fenrir',
}
VOICE_MAP = GEMINI_VOICE_MAP

# ElevenLabs Voice IDs
ELEVENLABS_VOICE_MAP = {
    'male': 'JBFqnCBsd6RMkjVDRZzb',    # George (British Male Assistant)
    'female': '21m00Tcm4TlvDq8ikWAM',  # Rachel (Warm Female)
}
