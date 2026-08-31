from .recommendation_model import TravelRecommendationModel


class PersonalizationEngine:
    def __init__(self, data_service):
        self.data_service = data_service
        self.model = TravelRecommendationModel(data_service)

    def recommend(self, user_profile):
        city = user_profile.get("destination", "Goa")
        budget = int(user_profile.get("budget", 25000))
        food_pref = user_profile.get("food_preference", "Any")
        travel_style = user_profile.get("travel_style", "Balanced")
        nights = max(int(user_profile.get("nights", 3)), 1)
        guests = max(int(user_profile.get("guests", 2)), 1)
        rooms_needed = max(int(user_profile.get("rooms", 1)), 1)
        stay_type = user_profile.get("stay_type", "Any")
        start_date = user_profile.get("start_date", "")
        end_date = user_profile.get("end_date", "")

        hotels = [
            hotel
            for hotel in self.data_service.load_hotels()
            if hotel["city"].lower() == city.lower()
            and hotel["price_per_night"] * nights <= max(budget * 0.55, 5000)
            and hotel["rooms_available"] >= rooms_needed
            and hotel["max_guests_per_room"] * rooms_needed >= guests
            and (stay_type == "Any" or stay_type.lower() in hotel["type"].lower())
        ]
        flights = [
            flight
            for flight in self.data_service.load_flights()
            if flight["destination"].lower() == city.lower()
        ]
        trains = [
            train
            for train in self.data_service.load_trains()
            if train["destination"].lower() == city.lower()
        ]
        restaurants = [
            restaurant
            for restaurant in self.data_service.load_restaurants()
            if restaurant["city"].lower() == city.lower()
            and (food_pref == "Any" or restaurant["type"] == food_pref)
        ]
        attractions = [
            attraction
            for attraction in self.data_service.load_attractions()
            if attraction["city"].lower() == city.lower()
        ]
        cabs = [
            cab
            for cab in self.data_service.load_cabs()
            if cab["city"].lower() == city.lower()
        ]

        ranked_attractions = self._rank_attractions(attractions, travel_style)
        ranked_hotels = self.model.rank_hotels(hotels, user_profile, city)
        selected_hotel = ranked_hotels[:3]
        flight_pick = sorted(flights, key=lambda item: item["price"])[0] if flights else None
        train_pick = sorted(trains, key=lambda item: item["price"])[0] if trains else None
        destination_recommendations = self.model.rank_destinations(user_profile)

        hotel_total = selected_hotel[0]["price_per_night"] * nights * rooms_needed if selected_hotel else 0
        transport_total = flight_pick["price"] * guests if flight_pick else (train_pick["price"] * guests if train_pick else 0)

        return {
            "city": city,
            "budget": budget,
            "travel_style": travel_style,
            "guests": guests,
            "nights": nights,
            "rooms": rooms_needed,
            "stay_type": stay_type,
            "start_date": start_date,
            "end_date": end_date,
            "transport": {
                "flight": flight_pick,
                "train": train_pick,
            },
            "hotel": selected_hotel,
            "destination_recommendations": destination_recommendations,
            "restaurants": sorted(restaurants, key=lambda item: (-item["rating"], item["avg_cost"]))[:4],
            "attractions": ranked_attractions[:5],
            "local_mobility": sorted(cabs, key=lambda item: item["price_per_km"])[:3],
            "estimated_total": hotel_total + transport_total,
        }

    def _rank_attractions(self, attractions, travel_style):
        preference_map = {
            "Relaxed": {"Beach", "Nature", "Sunset"},
            "Adventurous": {"Adventure", "Water Sports", "Hiking"},
            "Luxury": {"Luxury", "Culture", "Fine Dining"},
            "Balanced": {"Must Visit", "Culture", "Nature"},
        }
        preferred_tags = preference_map.get(travel_style, preference_map["Balanced"])

        def score(item):
            return (
                1 if item["theme"] in preferred_tags else 0,
                item["rating"],
                item["popularity_index"],
            )

        return sorted(attractions, key=score, reverse=True)
