import json
from pathlib import Path


class TravelDataService:
    def __init__(self, data_dir: Path):
        self.data_dir = Path(data_dir)

    def _load_json(self, file_name: str):
        with (self.data_dir / file_name).open("r", encoding="utf-8") as file:
            return json.load(file)

    def load_flights(self):
        return self._load_json("flights.json")

    def load_hotels(self):
        return self._load_json("hotels.json")

    def load_cities(self):
        return self._load_json("cities.json")

    def load_trains(self):
        return self._load_json("trains.json")

    def load_cabs(self):
        return self._load_json("cabs.json")

    def load_restaurants(self):
        return self._load_json("restaurants.json")

    def load_attractions(self):
        return self._load_json("attractions.json")

    def build_overview(self):
        flights = self.load_flights()
        hotels = self.load_hotels()
        attractions = self.load_attractions()
        cabs = self.load_cabs()
        cities = self.load_cities()

        return {
            "destinations": len(cities),
            "flight_deals": len([item for item in flights if item["discount_percent"] >= 15]),
            "airport_transfers": len([item for item in cabs if item["airport_service"]]),
            "experience_picks": len([item for item in attractions if item["category"] == "Must Visit"]),
            "resorts_available": len([item for item in hotels if "Resort" in item["type"]]),
            "rooms_live": sum(item["rooms_available"] for item in hotels),
        }

    def load_featured_resorts(self):
        return sorted(
            self.load_hotels(),
            key=lambda item: (-item["rating"], item["price_per_night"]),
        )[:6]

    def load_offer_bundles(self):
        flights = {item["destination"]: item for item in self.load_flights()}
        bundles = []
        for city in self.load_cities()[:8]:
            cheapest_stay = min(
                [hotel for hotel in self.load_hotels() if hotel["city"] == city["name"]],
                key=lambda item: item["price_per_night"],
            )
            flight = flights.get(city["name"])
            bundles.append(
                {
                    "city": city["name"],
                    "tagline": city["tagline"],
                    "image": city["image"],
                    "starting_price": cheapest_stay["price_per_night"],
                    "flight_price": flight["price"] if flight else None,
                }
            )
        return bundles
