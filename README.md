# TripMate_AI

TripMate_AI is a travel planning starter project built with Flask and Streamlit. It combines flights, trains, hotels, resorts, cabs, airport pickup, restaurants, attractions, authentication, and personalized recommendations in one interactive website.

## What this starter includes

- Flask web app with a brighter Agoda-inspired landing page, richer navigation, and interactive trip planner
- User registration, login, logout, and session-aware navigation backed by SQLite
- Multi-agent-inspired recommendation pipeline for deals, discovery, and mobility
- Sample travel datasets covering 20 Indian cities that can later be replaced with Kaggle or live API sources
- Streamlit companion app for prototyping and admin-style exploration
- Mobile-friendly layout with clearer text contrast, brighter colors, photos, and smoother browsing

## Suggested next upgrades

- Add real booking APIs for flights, trains, hotels, and cabs
- Add user accounts, saved itineraries, and booking history
- Integrate an LLM for conversational planning and itinerary editing
- Add price alerts, weather insights, and best-time-to-visit forecasts
- Add map integration, payment flow, and partner onboarding

## Run locally

1. Create a virtual environment.
2. Install dependencies with `pip install -r requirements.txt`.
3. Start the Flask site with `python app.py`.
4. Start the Streamlit companion app with `streamlit run streamlit_app.py`.

## Project structure

```text
TripMate_AI/
  app.py
  config.py
  streamlit_app.py
  data/
  tripmate_ai/
    services/
    static/
    templates/
```
