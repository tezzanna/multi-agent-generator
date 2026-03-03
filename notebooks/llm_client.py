
import os
from dotenv import load_dotenv

load_dotenv()

OPENAI_API_HOST = os.getenv('OPENAI_API_HOST')
OPENAI_API_KEY = os.getenv('OPENAI_API_KEY')
MODEL_NAME = "openai/gpt-oss-120b"

from dataclasses import dataclass
from langchain_openai import ChatOpenAI

@dataclass
class LLMClient:
    model_name: str = MODEL_NAME
    base_url: str = OPENAI_API_HOST
    api_key: str = OPENAI_API_KEY

    def __post_init__(self):
        self._client = ChatOpenAI(
            base_url=self.base_url,
            api_key=self.api_key,
            model=self.model_name,
            timeout=None,
        )

    def generate(self, prompt: str) -> str:
        response = self._client.invoke(prompt)
        return response.content
