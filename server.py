from fastapi import FastAPI
from fastapi.staticfiles import StaticFiles
import os

app = FastAPI()
static_dir = os.getenv('OUTPUT_DIR', './demo')
app.mount("/", StaticFiles(directory=static_dir, html=True), name="static")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
