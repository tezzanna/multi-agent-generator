import os

from fastapi import FastAPI
from fastapi.staticfiles import StaticFiles

app = FastAPI()
static_dir = "/app/static"
app.mount("/", StaticFiles(directory=static_dir, html=True), name="static")

if __name__ == "__main__":
    import uvicorn

    uvicorn.run(app, host="0.0.0.0", port=8000)
