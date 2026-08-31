class TravelRecommendationModel:
    def __init__(self, data_service):
        self.data_service = data_service

    def rank_destinations(self, user_profile, limit=5):
        cities = self.data_service.load_cities()
        hotels = self.data_service.load_hotels()
        restaurants = self.data_service.load_restaurants()
        attractions = self.data_service.load_attractions()
        cabs = self.data_service.load_cabs()
        flights = self.data_service.load_flights()

        ranked = []
        for city in cities:
            city_name = city["name"]
            city_hotels = [hotel for hotel in hotels if hotel["city"] == city_name]
            city_restaurants = [item for item in restaurants if item["city"] == city_name]
            city_attractions = [item for item in attractions if item["city"] == city_name]
            city_cabs = [item for item in cabs if item["city"] == city_name]
            city_flights = [item for item in flights if item["destination"] == city_name]

            if not city_hotels:
                continue

            score_breakdown = self._destination_score(
                city,
                city_hotels,
                city_restaurants,
                city_attractions,
                city_cabs,
                city_flights,
                user_profile,
            )
            ranked.append(
                {
                    "city": city_name,
                    "region": city["region"],
                    "tagline": city["tagline"],
                    "image": city["image"],
                    "score": round(score_breakdown["total_score"], 1),
                    "reasons": score_breakdown["reasons"],
                }
            )

        return sorted(ranked, key=lambda item: item["score"], reverse=True)[:limit]

    def rank_hotels(self, hotels, user_profile, city):
        ranked = []
        for hotel in hotels:
            score_breakdown = self._hotel_score(hotel, user_profile, city)
            ranked.append(
                {
                    **hotel,
                    "recommendation_score": round(score_breakdown["total_score"], 1),
                    "match_reasons": score_breakdown["reasons"],
                }
            )

        return sorted(
            ranked,
            key=lambda item: (-item["recommendation_score"], item["price_per_night"]),
        )

    def _destination_score(self, city, hotels, restaurants, attractions, cabs, flights, user_profile):
        budget = int(user_profile.get("budget", 25000))
        travel_style = user_profile.get("travel_style", "Balanced")
        stay_type = user_profile.get("stay_type", "Any")
        guests = max(int(user_profile.get("guests", 2)), 1)
        rooms = max(int(user_profile.get("rooms", 1)), 1)
        food_pref = user_profile.get("food_preference", "Any")

        avg_hotel_rating = sum(item["rating"] for item in hotels) / len(hotels)
        avg_price = sum(item["price_per_night"] for item in hotels) / len(hotels)
        available_rooms = sum(item["rooms_available"] for item in hotels)
        attraction_popularity = sum(item["popularity_index"] for item in attractions) / max(len(attractions), 1)
        restaurant_fit = len(
            [item for item in restaurants if food_pref == "Any" or item["type"] == food_pref]
        ) / max(len(restaurants), 1)
        airport_fit = 1 if any(item["airport_service"] for item in cabs) else 0
        flight_fit = 1 if flights else 0
        stay_fit = (
            len([item for item in hotels if stay_type == "Any" or stay_type.lower() in item["type"].lower()])
            / len(hotels)
        )
        capacity_fit = len(
            [item for item in hotels if item["max_guests_per_room"] * rooms >= guests]
        ) / len(hotels)
        style_fit = self._style_match_score(travel_style, city["best_for"], attractions)

        budget_fit = max(0, 1 - abs(avg_price - budget / 4) / max(budget / 4, 1))
        room_fit = min(1, available_rooms / 20)
        rating_fit = avg_hotel_rating / 5
        attraction_fit = attraction_popularity / 100

        total_score = (
            budget_fit * 0.18
            + rating_fit * 0.18
            + attraction_fit * 0.18
            + style_fit * 0.16
            + restaurant_fit * 0.1
            + airport_fit * 0.08
            + flight_fit * 0.04
            + stay_fit * 0.04
            + capacity_fit * 0.02
            + room_fit * 0.02
        ) * 100

        reasons = [
            f"avg stay rating {avg_hotel_rating:.1f}/5",
            f"strong {city['best_for'].lower()} fit",
            f"{len(attractions)} attraction picks",
        ]
        return {"total_score": total_score, "reasons": reasons}

    def _hotel_score(self, hotel, user_profile, city):
        budget = int(user_profile.get("budget", 25000))
        nights = max(int(user_profile.get("nights", 3)), 1)
        rooms = max(int(user_profile.get("rooms", 1)), 1)
        guests = max(int(user_profile.get("guests", 2)), 1)
        stay_type = user_profile.get("stay_type", "Any")
        travel_style = user_profile.get("travel_style", "Balanced")

        trip_stay_budget = max(budget * 0.55, 5000)
        hotel_total = hotel["price_per_night"] * nights * rooms
        price_fit = max(0, 1 - abs(hotel_total - trip_stay_budget) / max(trip_stay_budget, 1))
        rating_fit = hotel["rating"] / 5
        room_fit = min(1, hotel["rooms_available"] / 12)
        capacity_fit = 1 if hotel["max_guests_per_room"] * rooms >= guests else 0
        type_fit = 1 if stay_type == "Any" or stay_type.lower() in hotel["type"].lower() else 0.35
        style_fit = self._stay_style_score(travel_style, hotel["type"], city)

        total_score = (
            price_fit * 0.28
            + rating_fit * 0.26
            + room_fit * 0.16
            + capacity_fit * 0.14
            + type_fit * 0.1
            + style_fit * 0.06
        ) * 100

        reasons = [
            f"rating {hotel['rating']}/5",
            f"{hotel['rooms_available']} rooms available",
            f"fits {travel_style.lower()} travel",
        ]
        return {"total_score": total_score, "reasons": reasons}

    def _style_match_score(self, travel_style, city_best_for, attractions):
        style_map = {
            "Relaxed": {"beach", "relaxed", "nature", "romance"},
            "Adventurous": {"adventure", "hills", "road trip"},
            "Luxury": {"luxury scenery", "romance", "coastal culture"},
            "Balanced": {"culture", "beach escape", "nature", "family"},
        }
        style_terms = style_map.get(travel_style, style_map["Balanced"])
        city_text = f"{city_best_for} {' '.join(item['theme'] for item in attractions)}".lower()
        matches = sum(1 for term in style_terms if term in city_text)
        return min(1, matches / 2)

    def _stay_style_score(self, travel_style, stay_type, city):
        stay_text = f"{stay_type} {city}".lower()
        style_terms = {
            "Relaxed": ("resort", "beach", "retreat"),
            "Adventurous": ("mountain", "camp", "lodge"),
            "Luxury": ("luxury", "heritage", "palace"),
            "Balanced": ("hotel", "resort", "stay"),
        }
        matches = sum(1 for term in style_terms.get(travel_style, style_terms["Balanced"]) if term in stay_text)
        return min(1, matches / 2)
