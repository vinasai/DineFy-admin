"use client";
import React, { useState } from "react";
import { useLoadScript } from "@react-google-maps/api";
import {
  Autocomplete,
  TextField,
  Button,
  CircularProgress,
  Box,
  Typography,
} from "@mui/material";
import { API_KEY } from "@/config";

// Define the interface for restaurant data
export interface Restaurant {
  place_id: string;
  name: string;
  geometry: {
    location: {
      lat: () => number;
      lng: () => number;
    };
  };
  vicinity: string; // Address or vicinity information
  rating: number;
  user_ratings_total: number;
}

const LIBRARIES: any = ["places"];

const RestaurantSearch: React.FC<{
  onSelectRestaurant: (restaurant: Restaurant | null) => void;
}> = ({ onSelectRestaurant }) => {
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  const { isLoaded } = useLoadScript({
    googleMapsApiKey: String(API_KEY),
    libraries: LIBRARIES,
  });

  const handleSearch = (event: any, value: string) => {
    setSearchTerm(value);

    if (!value) return;

    setLoading(true);
    const service = new window.google.maps.places.PlacesService(
      document.createElement("div")
    );

    const request = {
      location: { lat: 43.6532, lng: -79.3832 },
      radius: 5000,
      keyword: value,
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

  return (
    <Box className="w-full max-w-2xl mx-auto p-6">
      <Autocomplete
        freeSolo
        fullWidth
        options={restaurants}
        getOptionLabel={(option: any) => `${option.name} - ${option.vicinity}`}
        onInputChange={handleSearch}
        onChange={(_, value) => {
          // Ensure value is a Restaurant object, or null
          if (value && typeof value !== "string") {
            onSelectRestaurant(value);
          } else {
            onSelectRestaurant(null);
          }
        }}
        renderInput={(params) => (
          <TextField
            {...params}
            label="Search for restaurants"
            variant="outlined"
            fullWidth
            InputProps={{
              ...params.InputProps,
              endAdornment: (
                <>
                  {loading && <CircularProgress color="inherit" size={24} />}
                  {params.InputProps.endAdornment}
                </>
              ),
            }}
            className="w-full"
          />
        )}
      />
    </Box>
  );
};

const Search: React.FC = () => {
  const [selectedRestaurant, setSelectedRestaurant] =
    useState<Restaurant | null>(null);

  const handleSelectRestaurant = (restaurant: Restaurant | null) => {
    setSelectedRestaurant(restaurant);
  };

  const handleAddToDatabase = () => {
    if (!selectedRestaurant) return;
    console.log("Adding restaurant to database:", selectedRestaurant);
    // Add the logic for saving restaurant to the database here
  };

  return (
    <>
      <RestaurantSearch onSelectRestaurant={handleSelectRestaurant} />
      <div className="flex flex-col items-center  min-h-screen bg-gray-50 px-4 py-8">
        {/* Search Input Box */}

        {/* Modal for Selected Restaurant */}
        {selectedRestaurant && (
          <Box
            className=" max-w-2xl w-full bg-white p-6 rounded-lg shadow-lg transform transition-all duration-300 ease-in-out "
            boxShadow={3}
          >
            <Typography
              variant="h5"
              className="mb-4 font-semibold text-gray-800"
            >
              Selected Restaurant
            </Typography>
            <Typography variant="h6" className="font-semibold text-indigo-600">
              {selectedRestaurant.name}
            </Typography>
            <Typography variant="body1" className="mb-4 text-gray-600">
              Address: {selectedRestaurant.vicinity}
            </Typography>
            <Typography variant="body2" className="mb-4 text-gray-500">
              Rating: {selectedRestaurant.rating} (
              {selectedRestaurant.user_ratings_total} reviews)
            </Typography>

            <Button
              variant="contained"
              color="primary"
              onClick={handleAddToDatabase}
              fullWidth
              className="mt-6 py-3 text-lg font-semibold rounded-md transition duration-200 ease-in-out transform hover:scale-105"
            >
              Add to Database
            </Button>
          </Box>
        )}
      </div>
    </>
  );
};

export default Search;
