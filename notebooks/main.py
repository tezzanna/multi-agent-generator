
import os
from fastapi import FastAPI
from fastapi.staticfiles import StaticFiles

from agents import (
    AgentContext,
    PlannerAgent,
    DDDAnalystAgent,
    TestEngineerAgent,
    DeveloperAgent,
    ReviewerAgent,
    BuilderAgent
)
from llm_client import LLMClient


# ==========================================
# 1. Запуск мультиагентной системы
# ==========================================

def run_multi_agent_pipeline(requirements: str):

    print("▶ Запуск мультиагентной системы...\n")

    ctx = AgentContext(requirements=requirements)
    llm = LLMClient()

    agents = [
        PlannerAgent(llm),
        DDDAnalystAgent(llm),
        TestEngineerAgent(llm),
        DeveloperAgent(llm),   # ← генерирует HTML/CSS/JS
        ReviewerAgent(llm),
        BuilderAgent(llm),
    ]
    

    for agent in agents:
        print(f"▶ {agent.__class__.__name__}")
        ctx = agent.run(ctx)

    print("\n Генерация завершена!\n")
    return ctx


# ==========================================
# 2. Генерация файлов при старте контейнера
# ==========================================

if os.getenv("RUN_AGENTS", "true") == "true":

    requirements = os.getenv(
        "APP_REQUIREMENTS",
        "Создай одностраничный сайт с заголовком и кнопкой."
    )

    run_multi_agent_pipeline(requirements)


# ==========================================
# 3. FastAPI сервер для отдачи demo/
# ==========================================

output_dir = os.getenv("OUTPUT_DIR", "demo")

app = FastAPI(title="Multi-Agent Generated Web App")

app.mount(
    "/",
    StaticFiles(directory=output_dir, html=True),
    name="static"
)


@app.get("/health")
def health():
    return {"status": "ok"}


print(" Приложение будет доступно по адресу:")
print(" http://localhost:8000")
