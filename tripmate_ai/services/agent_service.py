class MultiAgentTravelPlanner:
    def __init__(self, data_service, personalization_engine):
        self.data_service = data_service
        self.personalization_engine = personalization_engine

    def build_trip_plan(self, user_profile):
        personalized = self.personalization_engine.recommend(user_profile)
        city = personalized["city"]

        deal_agent = self._deal_agent(city)
        discovery_agent = self._discovery_agent(city)
        mobility_agent = self._mobility_agent(city)
        stay_agent = self._stay_agent(city, personalized["rooms"], personalized["guests"])

        return {
            "hero_summary": self._compose_summary(personalized, deal_agent, discovery_agent),
            "personalized_plan": personalized,
            "agents": {
                "deal_agent": deal_agent,
                "discovery_agent": discovery_agent,
                "mobility_agent": mobility_agent,
                "stay_agent": stay_agent,
            },
            "suggestions": [
                "Shortlist 2 resorts and lock refundable rooms before prices move up.",
                "Use airport pickup for a smoother arrival, especially for late check-ins.",
                "Save this plan to your profile once we add booking and itinerary history.",
            ],
        }

    def _deal_agent(self, city):
        deals = [
            flight for flight in self.data_service.load_flights()
            if flight["destination"].lower() == city.lower() and flight["discount_percent"] >= 15
        ]
        top_deals = sorted(deals, key=lambda item: (-item["discount_percent"], item["price"]))[:3]
        return {
            "agent_name": "Deal Scout",
            "focus": "Best travel offers across flights, stays, and bundles",
            "highlights": top_deals,
        }

    def _discovery_agent(self, city):
        spots = [
            attraction for attraction in self.data_service.load_attractions()
            if attraction["city"].lower() == city.lower()
        ]
        return {
            "agent_name": "City Explorer",
            "focus": "Must-visit places and experiences",
            "highlights": sorted(spots, key=lambda item: (-item["rating"], -item["popularity_index"]))[:4],
        }

    def _mobility_agent(self, city):
        cab_options = [
            cab for cab in self.data_service.load_cabs()
            if cab["city"].lower() == city.lower()
        ]
        return {
            "agent_name": "Roam Easy",
            "focus": "Airport transfers, cabs, and local transport partners",
            "highlights": sorted(cab_options, key=lambda item: (not item["airport_service"], item["price_per_km"]))[:4],
        }

    def _stay_agent(self, city, rooms, guests):
        stay_options = [
            hotel for hotel in self.data_service.load_hotels()
            if hotel["city"].lower() == city.lower()
            and hotel["rooms_available"] >= rooms
            and hotel["max_guests_per_room"] * rooms >= guests
        ]
        return {
            "agent_name": "Stay Matcher",
            "focus": "Room availability, resort fit, and family-friendly capacity",
            "highlights": sorted(stay_options, key=lambda item: (-item["rating"], item["price_per_night"]))[:4],
        }

    def _compose_summary(self, personalized, deal_agent, discovery_agent):
        flight = personalized["transport"]["flight"]
        hotel = personalized["hotel"][0] if personalized["hotel"] else None
        attraction = discovery_agent["highlights"][0] if discovery_agent["highlights"] else None

        parts = [
            f"{personalized['city']} is trending for a {personalized['travel_style'].lower()} getaway.",
            f"Trip window: {personalized['start_date'] or 'Flexible start'} to {personalized['end_date'] or 'Flexible end'}.",
            f"{personalized['guests']} guest(s), {personalized['nights']} night(s), {personalized['rooms']} room(s).",
            f"Top deal: {flight['airline']} from {flight['origin']} at Rs. {flight['price']}" if flight else "No flight deal found yet.",
            f"Stay pick: {hotel['name']} rated {hotel['rating']}/5 with match score {hotel['recommendation_score']}" if hotel else "Hotel options are being expanded.",
            f"Do not miss {attraction['name']}" if attraction else "Fresh attractions will appear here.",
            f"Estimated core spend is around Rs. {personalized['estimated_total']}.",
            f"Deal Scout found {len(deal_agent['highlights'])} strong offers.",
        ]
        return " ".join(parts)
