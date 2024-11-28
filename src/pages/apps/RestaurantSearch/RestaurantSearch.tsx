"use client";
import React, { useState } from "react";
import { useLoadScript } from "@react-google-maps/api";
import { API_KEY } from "@/config"; // Make sure to replace with your actual API_KEY
import { useCreateRestaurantApiMutation } from "@/redux/api/restaurant/restaurantApiSlice";

// Define the interface for restaurant data
export interface Restaurant {
  place_id: string;
  name: string;
  business_status: string;
  geometry: {
    location: {
      lat: () => number;
      lng: () => number;
    };
  };
  icon: string;
  price_level: number;
  rating: number;
  user_ratings_total: number;
  photos?: { photo_reference: string; width: number; height: number }[]; // Photos
  opening_hours?: { open_now: boolean; periods: any[] }; // Opening hours
  vicinity: string; // Full address or vicinity information
}

const LIBRARIES: any = ["places"];

const locations: { [key: string]: { lat: number; lng: number } } = {
  Canada: { lat: 43.6532, lng: -79.3832 },
  Dubai: { lat: 25.2048, lng: 55.2708 },
  USA: { lat: 37.7749, lng: -122.4194 },
  UK: { lat: 51.5074, lng: -0.1278 },
  Swiss: { lat: 46.8182, lng: 8.2275 },
  Germany: { lat: 51.1657, lng: 10.4515 },
};

const RestaurantSearch: React.FC<{
  onSelectRestaurant: (restaurant: Restaurant | null) => void;
}> = ({ onSelectRestaurant }) => {
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [selectedLocation, setSelectedLocation] = useState<string>("Canada");
  const [radius, setRadius] = useState<number>(5000);
  const [showDropdown, setShowDropdown] = useState<boolean>(false);

  useLoadScript({
    googleMapsApiKey: String(API_KEY),
    libraries: LIBRARIES,
  });

  const handleSearch = (value: string) => {
    setSearchTerm(value);
    if (!value) return;
    setShowDropdown(true);
    fetchRestaurants(locations[selectedLocation], value);
  };

  const fetchRestaurants = (
    location: { lat: number; lng: number },
    keyword: string
  ) => {
    setLoading(true);
    const service = new window.google.maps.places.PlacesService(
      document.createElement("div")
    );
    const request = {
      location,
      radius: radius,
      keyword,
      type: "restaurant",
    };
    service.nearbySearch(request, (results: any, status: string) => {
      setLoading(false);
      if (
        status === window.google.maps.places.PlacesServiceStatus.OK &&
        results
      ) {
        setRestaurants(results);
      } else {
        console.error("Error fetching restaurants:", status);
        setRestaurants([]);
      }
    });
  };

  const handleLocationClick = () => {
    handleSearch("restaurant");
  };

  const handleDetectCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const userLocation = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          };
          fetchRestaurants(userLocation, "restaurant");
        },
        (error) => {
          console.error("Error detecting location:", error);
        }
      );
    } else {
      alert("Geolocation is not supported by your browser.");
    }
  };

  const handleRestaurantClick = (restaurant: Restaurant) => {
    onSelectRestaurant(restaurant);
    setShowDropdown(false);
  };

  const handleCloseSearch = () => {
    setSearchTerm("");
    setRadius(5000);
    setSelectedLocation("Canada");
    setShowDropdown(false);
    setRestaurants([]);
  };

  return (
    <div className="w-full max-w-6xl mx-auto p-6 bg-white rounded-lg shadow-lg">
      <div className="flex flex-wrap items-center space-x-4 mb-4">
        <div className="flex flex-col mb-2 md:mb-0">
          <label className="text-gray-700 font-semibold mb-1">
            Select Location
          </label>
          <select
            value={selectedLocation}
            onChange={(e) => setSelectedLocation(e.target.value)}
            className="p-3 border border-gray-300 rounded-md"
          >
            {Object.keys(locations).map((location) => (
              <option key={location} value={location}>
                {location}
              </option>
            ))}
          </select>
        </div>

        <div className="flex flex-col mb-2 md:mb-0">
          <label className="text-gray-700 font-semibold mb-1">
            Radius (meters)
          </label>
          <input
            type="number"
            value={radius}
            onChange={(e) => setRadius(Number(e.target.value))}
            className="p-3 border border-gray-300 rounded-md"
            placeholder="Radius in meters"
          />
        </div>

        <div className="relative w-full flex-1">
          <label className="text-gray-700 font-semibold mb-1">
            Search for Restaurants
          </label>
          <div className="flex items-center relative">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => handleSearch(e.target.value)}
              className="w-full p-3 pl-12 border border-gray-300 rounded-md"
              placeholder="Search restaurants"
              onFocus={() => setShowDropdown(true)}
            />
            <button
              onClick={handleLocationClick}
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-blue-500 transition"
            >
              📍
            </button>
            <button
              onClick={handleDetectCurrentLocation}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-blue-500 transition"
            >
              🧭
            </button>
          </div>
          {loading && (
            <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
              <div className="loader border-t-transparent border-blue-500 border-4 rounded-full w-6 h-6 animate-spin"></div>
            </div>
          )}
        </div>
      </div>

      <div className="flex justify-between items-center mt-2">
        <button
          onClick={handleCloseSearch}
          className="text-red-500 hover:text-red-700 font-semibold"
        >
          Close Search
        </button>
      </div>

      {showDropdown && restaurants.length > 0 && (
        <div className="bg-gray-100 p-4 rounded-md shadow-md mt-4">
          <p className="font-semibold text-gray-700 mb-2">Results:</p>
          <ul className="space-y-2">
            {restaurants.map((restaurant) => (
              <li
                key={restaurant.place_id}
                onClick={() => handleRestaurantClick(restaurant)}
                className="p-2 cursor-pointer hover:bg-gray-200 rounded-md transition"
              >
                <span className="font-semibold text-blue-600">
                  {restaurant.name}
                </span>
                <p className="text-gray-600 text-sm">{restaurant.vicinity}</p>
                <p className="text-gray-500 text-xs">
                  Rating: {restaurant.rating} ({restaurant.user_ratings_total}{" "}
                  reviews)
                </p>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

const Search: React.FC = () => {
  const [selectedRestaurant, setSelectedRestaurant] =
    useState<Restaurant | null>(null);
  const [createRestaurantApi] = useCreateRestaurantApiMutation();

  const handleSelectRestaurant = (restaurant: Restaurant | null) => {
    setSelectedRestaurant(restaurant);
  };

  const handleAddToDatabase = async () => {
    if (!selectedRestaurant) return;
    console.log("Adding restaurant to database:", selectedRestaurant);

    const { name, price_level, vicinity, place_id } = selectedRestaurant;
    try {
      // Add restaurant to database here
      await createRestaurantApi({
        name,
        avg_budget: price_level,
        place_id,
        location: vicinity,
      }).unwrap();
      console.log("restuarant added succesfully");
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center bg-gray-50 py-8 px-4">
      <RestaurantSearch onSelectRestaurant={handleSelectRestaurant} />

      {selectedRestaurant && (
        <div className="mt-8 w-full max-w-2xl bg-white p-6 rounded-lg shadow-lg">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">
            Selected Restaurant Details
          </h2>

          <div className="flex items-center space-x-4">
            <img
              src={selectedRestaurant.icon}
              alt="restaurant icon"
              className="w-12 h-12"
            />
            <div>
              <h3 className="text-xl font-semibold text-indigo-600">
                {selectedRestaurant.name}
              </h3>
              <p className="text-sm text-gray-600">
                Status: {selectedRestaurant.business_status}
              </p>
              <p className="text-sm text-gray-600">
                Price Level: {selectedRestaurant.price_level}
              </p>
            </div>
          </div>

          <p className="text-gray-600 mb-2 mt-2">
            <strong>Address:</strong> {selectedRestaurant.vicinity}
          </p>

          <p className="text-gray-500 mb-4">
            <strong>Rating:</strong> {selectedRestaurant.rating} (
            {selectedRestaurant.user_ratings_total} reviews)
          </p>

          {selectedRestaurant.photos &&
            selectedRestaurant.photos.length > 0 && (
              <div className="mb-4">
                <strong>Photos:</strong>
                <div className="flex space-x-2">
                  {selectedRestaurant.photos.map((photo, index) => (
                    <img
                      key={index}
                      src={`https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photo_reference=${photo.photo_reference}&key=${API_KEY}`}
                      alt={`Restaurant ${selectedRestaurant.name} Photo ${
                        index + 1
                      }`}
                      className="w-32 h-32 object-cover rounded-md"
                    />
                  ))}
                </div>
              </div>
            )}

          {selectedRestaurant.opening_hours &&
            selectedRestaurant.opening_hours.periods && (
              <div className="mb-4">
                <strong>Opening Hours:</strong>
                <ul className="space-y-1">
                  {selectedRestaurant.opening_hours.periods.map(
                    (period, index) => (
                      <li key={index} className="text-gray-500 text-sm">
                        {`Day: ${period.open.day}, Open: ${period.open.time}, Close: ${period.close.time}`}
                      </li>
                    )
                  )}
                </ul>
              </div>
            )}

          <button
            onClick={handleAddToDatabase}
            className="w-full py-3 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700 transition"
          >
            Add to Database
          </button>
        </div>
      )}
    </div>
  );
};

export default Search;
