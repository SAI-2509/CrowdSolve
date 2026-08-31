from flask import Blueprint, current_app, g, jsonify, render_template, request

from .services.agent_service import MultiAgentTravelPlanner
from .services.data_service import TravelDataService
from .services.recommendation_service import PersonalizationEngine

main_bp = Blueprint("main", __name__)


def _build_services():
    data_service = TravelDataService(current_app.config["DATA_DIR"])
    personalization_engine = PersonalizationEngine(data_service)
    planner = MultiAgentTravelPlanner(data_service, personalization_engine)
    return data_service, personalization_engine, planner


@main_bp.route("/", methods=["GET"])
def index():
    data_service, _, _ = _build_services()
    overview = data_service.build_overview()
    return render_template(
        "index.html",
        overview=overview,
        cities=data_service.load_cities(),
        featured_cities=data_service.load_cities()[:8],
        top_resorts=data_service.load_featured_resorts(),
        offer_bundles=data_service.load_offer_bundles(),
        user=g.user,
    )


@main_bp.route("/destinations", methods=["GET"])
def destinations():
    data_service, _, _ = _build_services()
    return render_template(
        "destinations.html",
        cities=data_service.load_cities(),
        user=g.user,
    )


@main_bp.route("/stays", methods=["GET"])
def stays():
    data_service, _, _ = _build_services()
    return render_template(
        "stays.html",
        resorts=data_service.load_hotels(),
        user=g.user,
    )


@main_bp.route("/api/plan", methods=["POST"])
def plan_trip():
    data_service, _, planner = _build_services()
    payload = request.get_json(silent=True) or {}
    plan = planner.build_trip_plan(payload)
    plan["search_meta"] = {
        "requested_city": payload.get("destination", "Goa"),
        "available_cities": len(data_service.load_cities()),
    }
    return jsonify(plan)
