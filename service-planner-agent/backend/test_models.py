import os
import asyncio
from dotenv import load_dotenv
from langchain_google_genai import ChatGoogleGenerativeAI

load_dotenv()

models = [
    "gemini-1.5-flash-latest",
    "gemini-1.5-flash-001",
    "gemini-1.5-flash-002",
    "gemini-1.5-pro-latest",
    "gemini-pro"
]

async def test():
    key = os.getenv("GOOGLE_API_KEY")
    for m in models:
        try:
            llm = ChatGoogleGenerativeAI(model=m, google_api_key=key)
            res = await llm.ainvoke("hi")
            print(f"SUCCESS: {m}")
            break
        except Exception as e:
            print(f"FAILED {m}: {str(e)[:100]}")

asyncio.run(test())
