from pathlib import Path


class Config:
    BASE_DIR = Path(__file__).resolve().parent
    SECRET_KEY = "tripmate-ai-demo-secret"
    DATA_DIR = BASE_DIR / "data"
    INSTANCE_DIR = BASE_DIR / "instance"
    DATABASE = INSTANCE_DIR / "tripmate_ai.db"
