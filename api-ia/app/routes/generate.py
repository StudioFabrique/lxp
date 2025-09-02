import asyncio
from typing import Annotated
from openai import AsyncOpenAI
from fastapi import APIRouter, Request, Body
from fastapi.responses import StreamingResponse

from app.schemas.chatbot import GenerateRequest
from app.utils.limiter import limiter
from app.utils.config import OPENAI_API_KEY, OPENAI_BASE_URL, OPENAI_MODEL


router = APIRouter(prefix="/generate", tags=["generate"])


_client = (
    AsyncOpenAI(api_key=OPENAI_API_KEY, base_url=OPENAI_BASE_URL)
    if OPENAI_API_KEY
    else None
)


@router.post("/")
@limiter.limit("10/minute")
async def stream_response(request: Request, data: Annotated[GenerateRequest, Body()]):
    prompt = data.prompt

    async def generate_stream():
        if not _client:
            for token in ("[DEMO] ", "Réponse ", "mock ", "pour ", prompt, "\n"):
                yield token
                await asyncio.sleep(0.02)
            return

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
            if token := event.choices[0].delta.content:
                yield token

    return StreamingResponse(generate_stream(), media_type="text/plain")
