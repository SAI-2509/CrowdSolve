from functools import wraps

from flask import Blueprint, flash, g, redirect, render_template, request, session, url_for
from werkzeug.security import check_password_hash, generate_password_hash

from .db import get_db

auth_bp = Blueprint("auth", __name__, url_prefix="/auth")


@auth_bp.before_app_request
def load_logged_in_user():
    user_id = session.get("user_id")
    if user_id is None:
        g.user = None
        return

    g.user = get_db().execute(
        "SELECT id, full_name, email FROM users WHERE id = ?",
        (user_id,),
    ).fetchone()


def login_required(view):
    @wraps(view)
    def wrapped_view(**kwargs):
        if g.user is None:
            return redirect(url_for("auth.login", next=request.path))
        return view(**kwargs)

    return wrapped_view


@auth_bp.route("/register", methods=["GET", "POST"])
def register():
    if request.method == "POST":
        full_name = request.form.get("full_name", "").strip()
        email = request.form.get("email", "").strip().lower()
        password = request.form.get("password", "")

        if not full_name or not email or not password:
            flash("Please fill in all registration fields.", "error")
        elif len(password) < 6:
            flash("Password must be at least 6 characters long.", "error")
        else:
            db = get_db()
            existing_user = db.execute(
                "SELECT id FROM users WHERE email = ?",
                (email,),
            ).fetchone()
            if existing_user:
                flash("That email is already registered. Please log in instead.", "error")
            else:
                db.execute(
                    "INSERT INTO users (full_name, email, password_hash) VALUES (?, ?, ?)",
                    (full_name, email, generate_password_hash(password)),
                )
                db.commit()
                flash("Registration successful. You can now log in.", "success")
                return redirect(url_for("auth.login"))

    return render_template("auth.html", mode="register")


@auth_bp.route("/login", methods=["GET", "POST"])
def login():
    if request.method == "POST":
        email = request.form.get("email", "").strip().lower()
        password = request.form.get("password", "")
        next_page = request.form.get("next") or url_for("main.index")

        user = get_db().execute(
            "SELECT id, full_name, email, password_hash FROM users WHERE email = ?",
            (email,),
        ).fetchone()

        if user is None or not check_password_hash(user["password_hash"], password):
            flash("Invalid email or password.", "error")
        else:
            session.clear()
            session["user_id"] = user["id"]
            flash(f"Welcome back, {user['full_name']}!", "success")
            return redirect(next_page)

    return render_template("auth.html", mode="login", next=request.args.get("next", ""))


@auth_bp.route("/logout", methods=["POST"])
def logout():
    session.clear()
    flash("You have been logged out.", "success")
    return redirect(url_for("main.index"))
