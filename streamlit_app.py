from pathlib import Path
from datetime import date

import streamlit as st

from tripmate_ai.services.agent_service import MultiAgentTravelPlanner
from tripmate_ai.services.data_service import TravelDataService
from tripmate_ai.services.recommendation_service import PersonalizationEngine


st.set_page_config(page_title="TripMate AI Lab", layout="wide")

data_service = TravelDataService(Path(__file__).resolve().parent / "data")
engine = PersonalizationEngine(data_service)
planner = MultiAgentTravelPlanner(data_service, engine)
cities = [city["name"] for city in data_service.load_cities()]

st.title("TripMate AI Lab")
st.caption("Prototype workspace for brighter travel planning, city discovery, and multi-agent trip orchestration.")

destination = st.selectbox("Destination", cities)
budget = st.slider("Budget", 15000, 120000, 35000, step=5000)
travel_date = st.date_input("Travel date", value=date.today())
travel_time = st.time_input("Preferred departure time")
nights = st.selectbox("Nights", [2, 3, 4, 5, 6, 7], index=1)
guests = st.selectbox("Guests", [1, 2, 3, 4, 5, 6], index=1)
rooms = st.selectbox("Rooms", [1, 2, 3], index=0)
stay_type = st.selectbox("Stay type", ["Any", "Resort", "Hotel", "Luxury", "Heritage", "Mountain"])
food_preference = st.selectbox("Food preference", ["Any", "Veg", "Non Veg"])
travel_style = st.selectbox("Travel style", ["Balanced", "Relaxed", "Adventurous", "Luxury"])

if st.button("Generate AI Travel Plan"):
    payload = {
        "destination": destination,
        "budget": budget,
        "travel_date": str(travel_date) if travel_date else "",
        "travel_time": str(travel_time),
        "nights": nights,
        "guests": guests,
        "rooms": rooms,
        "stay_type": stay_type,
        "food_preference": food_preference,
        "travel_style": travel_style,
    }
    output = planner.build_trip_plan(payload)
    st.subheader("Hero Summary")
    st.write(output["hero_summary"])

    left, right = st.columns(2)
    with left:
        st.subheader("Recommended Stay")
        st.json(output["personalized_plan"]["hotel"])
        st.subheader("Restaurants")
        st.json(output["personalized_plan"]["restaurants"])
    with right:
        st.subheader("Attractions")
        st.json(output["personalized_plan"]["attractions"])
        st.subheader("Mobility")
        st.json(output["agents"]["mobility_agent"]["highlights"])

    st.subheader("Improvement Ideas")
    for suggestion in output["suggestions"]:
        st.write(f"- {suggestion}")
