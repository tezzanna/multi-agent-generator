
from dataclasses import dataclass
from pathlib import Path
from abc import ABC, abstractmethod
import os, shutil

# ===== Контекст между агентами =====
@dataclass
class AgentContext:
    requirements: str
    plan: str | None = None
    domain: str | None = None
    tests: str | None = None
    code: str | None = None
    review: str | None = None

# ===== Базовый класс агента =====
class BaseAgent(ABC):
    def __init__(self, llm: 'LLMClient'):
        self.llm = llm

    @abstractmethod
    def run(self, ctx: AgentContext) -> AgentContext:
        ...

# ===== Планирование =====
class PlannerAgent(BaseAgent):
    def run(self, ctx: AgentContext) -> AgentContext:
        prompt = (
            "Разбей требования на этапы: DDD → Tests → Code → Review → Build.\n"
            f"Требования: {ctx.requirements}"
        )
        ctx.plan = self.llm.generate(prompt)
        return ctx

# ===== Анализ доменной модели =====
class DDDAnalystAgent(BaseAgent):
    def run(self, ctx: AgentContext) -> AgentContext:
        prompt = f"Опиши доменную модель по требованиям:\n{ctx.requirements}"
        ctx.domain = self.llm.generate(prompt)
        return ctx

# ===== Генерация тестов =====
class TestEngineerAgent(BaseAgent):
    def run(self, ctx: AgentContext) -> AgentContext:
        prompt = f"Сгенерируй pytest-тесты для доменной модели:\n{ctx.domain}"
        ctx.tests = self.llm.generate(prompt)
        return ctx

# ===== Разработчик (генерация файлов) =====
class DeveloperAgent(BaseAgent):
    def run(self, ctx: AgentContext) -> AgentContext:
        from pathlib import Path
        import shutil
        import os

        output_dir = Path(os.getenv("OUTPUT_DIR", "demo"))

        # Удаляем старую папку
        shutil.rmtree(output_dir, ignore_errors=True)
        output_dir.mkdir(parents=True, exist_ok=True)

        # Промпты
        html_prompt = f"""
        Generate clean modern HTML page.
        Only return pure HTML.
        Requirements:
        {ctx.requirements}
        """

        css_prompt = """
        Generate clean modern CSS.
        Only return pure CSS.
        """

        js_prompt = """
        Generate clean JavaScript.
        Only return pure JS.
        """

        # Генерация
        index_html = self.llm.generate(html_prompt)
        styles_css = self.llm.generate(css_prompt)
        script_js = self.llm.generate(js_prompt)

        # Добавляем UTF-8
        if not styles_css.strip().startswith("@charset"):
            styles_css = '@charset "UTF-8";\n\n' + styles_css

        # Сохраняем файлы
        (output_dir / "index.html").write_text(index_html, encoding="utf-8")
        (output_dir / "styles.css").write_text(styles_css, encoding="utf-8")
        (output_dir / "script.js").write_text(script_js, encoding="utf-8")

        return ctx

# ===== Code Review =====
class ReviewerAgent(BaseAgent):
    def run(self, ctx: AgentContext) -> AgentContext:
        prompt = (
            "Проведи code review сгенерированных файлов и верни список улучшений."
        )
        ctx.review = self.llm.generate(prompt)
        return ctx

# ===== Завершение =====
class BuilderAgent(BaseAgent):
    def run(self, ctx: AgentContext) -> AgentContext:
        # Можно добавить финальные действия, если нужно
        print("Генерация статических файлов завершена.")
        return ctx
