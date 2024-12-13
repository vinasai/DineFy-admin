"use client";
import React, { useState, useEffect } from "react";
import { debounce } from 'lodash';
import { Tabs, Tab, Box, CircularProgress, Typography } from '@mui/material';
import { useLoadScript } from "@react-google-maps/api";
import { API_KEY } from "@/config"; // Make sure to replace with your actual API_KEY
import { useCreateRestaurantApiMutation } from "@/redux/api/restaurant/restaurantApiSlice";
import { useNavigate } from "react-router-dom";


interface Restaurant {
  place_id: string;
  name: string;
  vicinity: string;
  rating: number;
  user_ratings_total: number;
  business_status?: string;
  icon?: string;
  opening_hours?: {
    periods: {
      open: { day: number; time: string };
      close: { day: number; time: string };
    }[];
  };
}

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`restaurant-tabpanel-${index}`}
      aria-labelledby={`restaurant-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          {children}
        </Box>
      )}
    </div>
  );
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

const fetchPlaceDetails = async (placeId: string) => {
  try {
    const response = await fetch(`https://maps.googleapis.com/maps/api/place/details/json?` + 
      new URLSearchParams({
        place_id: placeId,
        fields: 'name,rating,formatted_phone_number,opening_hours,photos,reviews',
        key: String(API_KEY)
      })
    );

    if (!response.ok) {
      throw new Error('Failed to fetch place details');
    }

    const data = await response.json();
    return data.result;
  } catch (error) {
    console.error('Error fetching place details:', error);
    return null;
  }
};

const RestaurantSearch: React.FC<{
  onSelectRestaurant: (restaurant: Restaurant | null) => void;
}> = ({ onSelectRestaurant }) => {
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [selectedLocation, setSelectedLocation] = useState<string>("Canada");
  const [radius, setRadius] = useState<number>(5);
  const [showDropdown, setShowDropdown] = useState<boolean>(false);
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [activeTab, setActiveTab] = useState(0);
  const [hasSearched, setHasSearched] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [isRestaurantOnCreating, setIsRestaurantOnCreating] = useState(false);


  useLoadScript({
    googleMapsApiKey: String(API_KEY),
    libraries: LIBRARIES,
  });

  const getCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          });
        },
        (error) => {
          console.error("Error detecting location:", error);
        }
      );
    }
  };

  const fetchRestaurants = (
    location: { lat: number; lng: number },
    keyword: string,
    _searchRadius: number
  ) => {
    setLoading(true);
    const service = new window.google.maps.places.PlacesService(
      document.createElement("div")
    );
    const request = {
      location,
      radius: radius * 1000,
      keyword,
      type: "restaurant",
    };
    service.nearbySearch(request, (results: any, status: string) => {
      setLoading(false);
      setHasSearched(true);
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

    // Cleanup on unmount
   

  const debouncedSearch = debounce((value: string, location: { lat: number; lng: number }) => {
    fetchRestaurants(location, value, radius);
  }, 300);

    // Update debounced function to include radius
    const debouncedSearchWithCurrentLocation = debounce((value: string, location: { lat: number; lng: number }, searchRadius: number) => {
      fetchRestaurants(location, value, searchRadius);
    }, 300);


  useEffect(() => {
    return () => {
      debouncedSearch.cancel();
      debouncedSearchWithCurrentLocation.cancel();
    };
  }, []);

  const handleSearch = (value: string) => {
    setSearchTerm(value);
    if (!value) {
      debouncedSearch.cancel();
      setRestaurants([]);
      setHasSearched(false);
      setShowDropdown(false);
      setIsSearching(false);
      return;
    }
    setShowDropdown(true);
    setIsSearching(true);
    debouncedSearch(value, locations[selectedLocation]);
  };

  const handleSearchWithLocation = (value: string, location: { lat: number; lng: number }, searchRadius: number) => {
    setSearchTerm(value);
    if (!value) {
      debouncedSearchWithCurrentLocation.cancel();
      setRestaurants([]);
      setHasSearched(false);
      setShowDropdown(false);
      setIsSearching(false);
      return;
    }
    setShowDropdown(true);
    setIsSearching(true);
    debouncedSearchWithCurrentLocation(value, location, searchRadius);
  };
  


  const handleRestaurantClick = (restaurant: Restaurant) => {
    onSelectRestaurant(restaurant);
    setShowDropdown(false);
  };

  const handleCloseSearch = () => {
    setSearchTerm("");
    setRadius(5);
    setSelectedLocation("Canada");
    setShowDropdown(false);
    setRestaurants([]);
    setHasSearched(false);
    onSelectRestaurant(null);
  };

  const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
    // Close dropdown when switching tabs
    setShowDropdown(false);
    setSearchTerm("");
    setRestaurants([]);
    setHasSearched(false);
  };

  return (
    <div className="w-full max-w-6xl mx-auto p-6 bg-white rounded-lg shadow-lg">
      

      <Tabs value={activeTab} onChange={handleTabChange} 
      sx={{
        "& .MuiTabs-flexContainer": {
          justifyContent: "space-around",
        },
        "& .MuiTab-root": {
          flex: 1,
          textAlign: "center",
        },
      }}>
      <Tab label="Search by variable location" />
      <Tab label="Search by current location" />
    </Tabs>

    <TabPanel value={activeTab} index={0}>
    <div className="flex flex-wrap items-center space-x-4 mb-4">
        <div className="flex flex-col mb-2 md:mb-0">
          <label className="text-gray-700 font-semibold mb-1">
            Country
          </label>
          <select
            value={selectedLocation}
            onChange={(e) => setSelectedLocation(e.target.value)}
            className="p-3 px-6 border border-gray-300 rounded-md"
            disabled = {isSearching}
          >
            {Object.keys(locations).map((location) => (
              <option key={location} value={location} >
                {location}
              </option>
            ))}
          </select>
        </div>

        <div className="flex flex-col mb-2 md:mb-0">
          <label className="text-gray-700 font-semibold mb-1">
            Radius (Km)
          </label>
          <input
            type="number"
            value={radius}
            onChange={(e) => setRadius(Number(e.target.value))}
            className="p-3 border border-gray-300 rounded-md"
            placeholder="Radius in meters"
            disabled = {isSearching}
          />
        </div>

        <div className="relative w-full flex-1">
          <label className="text-gray-700 font-semibold mb-1">
            Enter a Restaurant Name
          </label>
          <div className="flex items-center relative">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => handleSearch(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-md"
            placeholder="Search . . ."
          />
          {loading && (
            <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
              <div className="loader border-t-transparent border-blue-500 border-4 rounded-full w-6 h-6 animate-spin"></div>
            </div>
          )}
        </div>
        </div>
      </div>

      <div className="flex justify-between items-center mt-2">
        <button
          onClick={handleCloseSearch}
          className="text-red-500 hover:text-red-700 font-semibold"
        >
          Reset Search
        </button>
      </div>

      {showDropdown && hasSearched && (
        <div className="bg-gray-100 p-4 rounded-md shadow-md mt-4">
          <p className="font-semibold text-gray-700 mb-2">Results:</p>
          <ul className="space-y-2">
            {restaurants.length > 0 ? (
              restaurants.map((restaurant) => (
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
              ))
            ) : (
              <li className="p-2 text-gray-500">No search found</li>
            )}
          </ul>
        </div>
      )}
  </TabPanel>

  <TabPanel value={activeTab} index={1}>
  <div className="flex flex-wrap items-center space-x-4 mb-4">
  <div className="flex flex-col mb-2 md:mb-0">
          <label className="text-gray-700 font-semibold mb-1">
            Radius (Km)
          </label>
          <input
            type="number"
            value={radius}
            onChange={(e) => setRadius(Number(e.target.value))}
            className="p-3 border border-gray-300 rounded-md"
            placeholder="Radius in meters"
            disabled = {isSearching}
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
          onChange={(e) => {
            setSearchTerm(e.target.value);
            if (!e.target.value) {
              debouncedSearchWithCurrentLocation.cancel(); // Cancel pending searches
              setRestaurants([]);
              setHasSearched(false);
              setShowDropdown(false); // Hide dropdown
              setIsSearching(false); // Reset searching state
              return;
            }
            if (!userLocation) {
              getCurrentLocation();
            } else {
              setShowDropdown(true);
              setIsSearching(true);
              handleSearchWithLocation(e.target.value, userLocation, radius);
            }
          }}
          className="w-full p-3 border border-gray-300 rounded-md"
          placeholder="Search restaurants"
        />
          {loading && (
            <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
              <div className="loader border-t-transparent border-blue-500 border-4 rounded-full w-6 h-6 animate-spin"></div>
            </div>
          )}
        </div>
      </div>
    </div>

    <div className="flex justify-between items-center mt-2">
      <button
        onClick={handleCloseSearch}
        className="text-red-500 hover:text-red-700 font-semibold"
      >
        Reset Search
      </button>
    </div>

    {showDropdown && hasSearched && (
      <div className="bg-gray-100 p-4 rounded-md shadow-md mt-4">
        <p className="font-semibold text-gray-700 mb-2">Results:</p>
        <ul className="space-y-2">
          {restaurants.length > 0 ? (
            restaurants.map((restaurant) => (
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
            ))
          ) : (
            <li className="p-2 text-gray-500">No search found</li>
          )}
        </ul>
      </div>
    )}
  </TabPanel>
      
    </div>
  );
};

const Search: React.FC = () => {
  const [selectedRestaurant, setSelectedRestaurant] =
    useState<Restaurant | null>(null);
  const [createRestaurantApi] = useCreateRestaurantApiMutation();
  const [isRestaurantOnCreating, setIsRestaurantOnCreating] = useState(false);
  const history = useNavigate();

  const handleSelectRestaurant = (restaurant: Restaurant | null) => {
    setSelectedRestaurant(restaurant);
    console.log("Selected restaurant:", restaurant);
  };

  const handleAddToDatabase = async () => {
    if (!selectedRestaurant) return;
  
    try {
      setIsRestaurantOnCreating(true);
      // Fetch detailed data
      //const details = await fetchPlaceDetails(selectedRestaurant.place_id);

      
      // Combine with existing data
      const restaurantData = {
        name: selectedRestaurant.name || '',
        place_id: selectedRestaurant.place_id || '',
        location: selectedRestaurant.vicinity || '',
        //phone: details?.formatted_phone_number,
        //rating: details?.rating || selectedRestaurant.rating,
      };
  
      // Add to database
      await createRestaurantApi(restaurantData).unwrap();
      console.log("Restaurant added successfully");
      setIsRestaurantOnCreating(false);
      history("/apps/restaurant");
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center bg-gray-50 py-8 px-4">
      {isRestaurantOnCreating && (
      <Box
          sx={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            bgcolor: "rgba(0, 0, 0, 0.5)", // Semi-transparent background
            zIndex: 1300, // Ensure it appears above other content
          }}
        >
          <Box sx={{ textAlign: "center", padding: "16px", bgcolor: "#fff", borderRadius: "8px" }}>
            <Typography variant="body1">Fetching restaurant from google API...</Typography>
            <CircularProgress />
          </Box>
        </Box>)
    }
      <RestaurantSearch onSelectRestaurant={handleSelectRestaurant} />

      {selectedRestaurant && (
        
            <div className="mt-8 w-full max-w-2xl bg-white p-6 rounded-lg shadow-lg">
              <h2 className="text-2xl font-semibold text-indigo-600 mb-6">
                {selectedRestaurant.name}
              </h2>

              <div className="flex items-start space-x-6 mb-6">
                {/* Image Column */}
                <div className="flex-shrink-0">
                  <div className="p-1 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300 bg-white border border-gray-100">
                    <img
                      src={selectedRestaurant.icon}
                      alt="restaurant icon"
                      className="w-full h-full rounded-lg object-cover"
                    />
                  </div>
                </div>

                {/* Info Column */}
                <div className="flex-grow">
                  <table className="w-full">
                    <tbody>
                      <tr className="border-b border-gray-100">
                        <td className="py-2 text-gray-600 font-medium w-1/3">Status:</td>
                        <td className="py-2 text-gray-800">{selectedRestaurant.business_status}</td>
                      </tr>
                      <tr className="border-b border-gray-100">
                        <td className="py-2 text-gray-600 font-medium">Address:</td>
                        <td className="py-2 text-gray-800">{selectedRestaurant.vicinity}</td>
                      </tr>
                      <tr>
                        <td className="py-2 text-gray-600 font-medium">Rating:</td>
                        <td className="py-2 text-gray-800">
                          {selectedRestaurant.rating} ({selectedRestaurant.user_ratings_total} reviews)
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              {selectedRestaurant.opening_hours && selectedRestaurant.opening_hours.periods && (
                <div className="mb-6 bg-gray-50 p-4 rounded-lg">
                  <h3 className="font-semibold text-gray-700 mb-3">Opening Hours</h3>
                  <ul className="space-y-2">
                    {selectedRestaurant.opening_hours.periods.map((period, index) => (
                      <li key={index} className="flex justify-between text-sm">
                        <span className="text-gray-600">Day {period.open.day}:</span>
                        <span className="text-gray-800">
                          {period.open.time} - {period.close.time}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
)}

<button
  onClick={handleAddToDatabase}
  className="w-full py-3 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700 transition-colors duration-200 shadow-md hover:shadow-lg"
>
  Add to Database
</button>
</div>
      )}
    </div>
  );
};

export default Search;