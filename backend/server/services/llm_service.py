import os
import json
from typing import Dict, Optional, List
from groq import AsyncGroq
from dotenv import load_dotenv

load_dotenv()

class LLMService:
    def __init__(self):
        self.api_key = os.getenv("GROQ_API_KEY")
        self.client = None
        if self.api_key:
            self.client = AsyncGroq(api_key=self.api_key)
        else:
            print("WARNING: GROQ_API_KEY not found. LLM features will be limited.")

    async def analyze_content(self, text: str, source: str) -> Dict:
        """
        Analyzes content to extract a meme summary, cluster, and virality score.
        """
        if not self.client:
            return self._mock_analysis(text)

        prompt = f"""
        Analyze this {source} content for the "Noosphere": a map of human thought.
        
        Content: "{text[:2000]}"
        
        Return JSON only:
        {{
            "summary": "1 sentence distinct meme/idea summary",
            "cluster": "one of: spiritual, ai, cultural, political, tech, abstract",
            "virality": (0-100 integer score based on provocative nature),
            "concepts": ["3", "key", "concepts"]
        }}
        """

        try:
            completion = await self.client.chat.completions.create(
                messages=[
                    {"role": "system", "content": "You are a Memetic Analyst AI. You act as an impartial observer of the Noosphere. Output JSON only."},
                    {"role": "user", "content": prompt}
                ],
                model="llama-3.3-70b-versatile",
                temperature=0.5,
                response_format={"type": "json_object"}
            )
            
            result = json.loads(completion.choices[0].message.content)
            return result
        except Exception as e:
            print(f"LLM Error: {e}")
            return self._mock_analysis(text)

    def _mock_analysis(self, text: str) -> Dict:
        # Fallback if no API key or error
        return {
            "summary": text[:50] + "...",
            "cluster": "default",
            "virality": 10,
            "concepts": ["keyword"]
        }

llm_service = LLMService()
