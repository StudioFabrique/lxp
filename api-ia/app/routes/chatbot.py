"""
chatbot.py

This module defines the FastAPI router for the chatbot endpoint, which streams responses from OpenAI's API or returns a mock response in demo mode.
"""

import asyncio
from typing import Annotated
from openai import AsyncOpenAI
from fastapi import APIRouter, Request, Body
from fastapi.responses import StreamingResponse

# Import request schema and utility modules
from app.schemas.chatbot import GenerateRequest
from app.utils.limiter import limiter
from app.utils.config import OPENAI_API_KEY, OPENAI_BASE_URL, OPENAI_MODEL

# Create a FastAPI router for chatbot endpoints
router = APIRouter(prefix="/chatbot", tags=["chatbot"])

# Initialize the OpenAI client if API key is provided, else None (demo mode)
_client = (
    AsyncOpenAI(api_key=OPENAI_API_KEY, base_url=OPENAI_BASE_URL)
    if OPENAI_API_KEY
    else None
)


@router.post("/")
@limiter.limit("10/minute")
async def chat_bot_stream_response(
    request: Request, data: Annotated[GenerateRequest, Body()]
):
    """
    Endpoint to stream chatbot responses.
    If OpenAI API key is set, streams response from OpenAI.
    Otherwise, returns a mock/demo response.
    """
    prompt = data.prompt

    async def generate_stream():
        """
        Async generator that yields chatbot response tokens.
        """
        if not _client:
            # Demo mode: yield mock tokens with a short delay
            for token in ("[DEMO] ", "Réponse ", "mock ", "pour ", prompt, "\n"):
                yield token
                await asyncio.sleep(0.02)
            return

        # Call OpenAI API and stream the response tokens
        stream = await _client.chat.completions.create(
            model=OPENAI_MODEL,
            messages=[
                {
                    "role": "system",
                    "content": "Tu es un tuteur pédagogique clair et sourcé.",
                },
                {"role": "user", "content": prompt},
            ],
            temperature=0.2,
            stream=True,
        )
        async for event in stream:
            # Yield each token as it arrives
            if token := event.choices[0].delta.content:
                yield token

    # Return a streaming response with markdown content type
    return StreamingResponse(generate_stream(), media_type="text/markdown")
