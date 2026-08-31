const budgetInput = document.querySelector('input[name="budget"]');
const budgetValue = document.getElementById("budgetValue");
const tripForm = document.getElementById("tripForm");
const generatePlanBtn = document.getElementById("generatePlanBtn");
const results = document.getElementById("results");
const tabs = document.querySelectorAll(".tab");
const panels = document.querySelectorAll(".tab-panel");

if (budgetInput && budgetValue) {
    budgetInput.addEventListener("input", () => {
        budgetValue.textContent = `Rs. ${budgetInput.value}`;
    });
}

if (tabs.length && panels.length) {
    tabs.forEach((tab) => {
        tab.addEventListener("click", () => {
            const target = tab.dataset.tab;
            tabs.forEach((item) => item.classList.remove("active"));
            panels.forEach((panel) => panel.classList.remove("active"));
            tab.classList.add("active");
            const activePanel = document.querySelector(`.tab-panel[data-panel="${target}"]`);
            if (activePanel) {
                activePanel.classList.add("active");
            }
        });
    });
}

if (generatePlanBtn && tripForm && results) {
    generatePlanBtn.addEventListener("click", async () => {
        const formData = new FormData(tripForm);
        const payload = Object.fromEntries(formData.entries());
        payload.budget = Number(payload.budget);
        payload.nights = Number(payload.nights);
        payload.guests = Number(payload.guests);
        payload.rooms = Number(payload.rooms);

        results.innerHTML = `
            <article class="result-placeholder bright-card">
                <h3>Building your itinerary...</h3>
                <p>TripMate AI is matching flights, trains, stays, room availability, food preferences, and local mobility.</p>
            </article>
        `;

        try {
            const response = await fetch("/api/plan", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(payload),
            });

            if (!response.ok) {
                throw new Error("The planner endpoint returned an error.");
            }

            const data = await response.json();
            renderResults(data);
        } catch (error) {
            results.innerHTML = `
                <article class="result-placeholder bright-card">
                    <h3>We could not build the plan just yet</h3>
                    <p>${error.message}</p>
                </article>
            `;
        }
    });
}

function renderResults(data) {
    const plan = data.personalized_plan;
    const flight = plan.transport.flight;
    const train = plan.transport.train;
    const hotel = plan.hotel[0];
    const restaurants = plan.restaurants;
    const attractions = plan.attractions;
    const cabs = data.agents.mobility_agent.highlights;
    const stayOptions = data.agents.stay_agent.highlights;
    const destinations = plan.destination_recommendations || [];
    const veg = restaurants.filter((item) => item.type === "Veg");
    const nonVeg = restaurants.filter((item) => item.type === "Non Veg");

    results.innerHTML = `
        <article class="result-card itinerary-card">
            <h3>Your Trip Itinerary</h3>
            <p>${data.hero_summary}</p>
            <ul>
                <li><span class="highlight">Trip dates:</span> ${plan.start_date || "Flexible start"} to ${plan.end_date || "Flexible end"}</li>
                <li><span class="highlight">Guests and rooms:</span> ${plan.guests} guest(s), ${plan.rooms} room(s), ${plan.nights} night(s)</li>
                <li><span class="highlight">Stay:</span> ${hotel ? `${hotel.name} • Rs. ${hotel.price_per_night}/night • match ${hotel.recommendation_score}` : "No matching stay found"}</li>
                <li><span class="highlight">Estimated total:</span> Rs. ${plan.estimated_total}</li>
            </ul>
        </article>
        <article class="result-card itinerary-card">
            <h3>Travel and Stay Details</h3>
            <ul>
                <li><span class="highlight">Flight:</span> ${flight ? `${flight.airline} from ${flight.origin} for Rs. ${flight.price}` : "Not available"}</li>
                <li><span class="highlight">Train:</span> ${train ? `${train.name} from ${train.origin} for Rs. ${train.price}` : "Not available"}</li>
                <li><span class="highlight">Stay preference:</span> ${plan.stay_type}</li>
                <li><span class="highlight">Best resort matches:</span> ${selectedHotelMatches(plan.hotel)}</li>
                <li><span class="highlight">Top destination suggestions:</span> ${destinations.slice(0, 3).map(item => `${item.city} (${item.score})`).join(", ") || "No destination suggestions"}</li>
            </ul>
        </article>
        <article class="result-card itinerary-card">
            <h3>Food, Places, and Mobility</h3>
            <ul>
                <li><span class="highlight">Places:</span> ${attractions.map(item => item.name).join(", ") || "No attractions found"}</li>
                <li><span class="highlight">Veg food:</span> ${veg.map(item => `${item.name} (Rs. ${item.avg_cost})`).join(", ") || "No veg matches"}</li>
                <li><span class="highlight">Non-veg food:</span> ${nonVeg.map(item => `${item.name} (Rs. ${item.avg_cost})`).join(", ") || "No non-veg matches"}</li>
                <li><span class="highlight">Airport and local cabs:</span> ${cabs.map(item => `${item.partner} - Rs. ${item.price_per_km}/km`).join(", ") || "No cab partners found"}</li>
                <li><span class="highlight">Why these destinations:</span> ${destinations.slice(0, 2).map(item => `${item.city}: ${item.reasons.join(" / ")}`).join(" | ") || "No model reasoning available"}</li>
                <li><span class="highlight">AI suggestions:</span> ${data.suggestions.join(" ")}</li>
            </ul>
        </article>
    `;
}

function selectedHotelMatches(hotels) {
    return hotels.map((item) => `${item.name} (${item.recommendation_score}, ${item.rooms_available} rooms left)`).join(", ") || "No resort matches";
}
