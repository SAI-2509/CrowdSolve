from flask import Flask

from config import Config
from .db import close_db, init_db


def create_app() -> Flask:
    app = Flask(__name__)
    app.config.from_object(Config)
    app.instance_path = str(app.config["INSTANCE_DIR"])
    app.config["INSTANCE_DIR"].mkdir(parents=True, exist_ok=True)

    from .routes import main_bp
    from .auth import auth_bp

    app.register_blueprint(main_bp)
    app.register_blueprint(auth_bp)
    app.teardown_appcontext(close_db)

    with app.app_context():
        init_db()

    return app
