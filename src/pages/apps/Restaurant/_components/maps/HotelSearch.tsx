"use client";
import React, { useState } from "react";
import { useLoadScript } from "@react-google-maps/api";
import { useForm, Controller } from "react-hook-form";
import {
  Box,
  Button,
  Card,
  CardContent,
  TextField,
  Typography,
  CircularProgress,
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

// Define the props for the RestaurantSearch component
interface RestaurantSearchProps {
  onSelectRestaurant: (restaurant: Restaurant) => void; // Function to handle selected restaurant
}

const LIBRARIES: any = ["places"];

const RestaurantSearch: React.FC<RestaurantSearchProps> = ({
  onSelectRestaurant,
}) => {
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  const { isLoaded } = useLoadScript({
    googleMapsApiKey: String(API_KEY),
    libraries: LIBRARIES,
  });

  const handleSearch = () => {
    if (!searchTerm) return;

    setLoading(true);
    const service = new window.google.maps.places.PlacesService(
      document.createElement("div")
    );

    const request = {
      location: { lat: 43.6532, lng: -79.3832 },
      radius: 5000,
      keyword: searchTerm,
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
    <Box className="p-4 bg-gray-100 rounded-md shadow-lg max-w-md mx-auto">
      <TextField
        fullWidth
        label="Search for restaurants"
        variant="outlined"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="mb-4"
      />
      <Button
        fullWidth
        variant="contained"
        color="primary"
        onClick={handleSearch}
        disabled={!isLoaded || loading}
      >
        {loading ? <CircularProgress size={24} color="inherit" /> : "Search"}
      </Button>

      <div className="mt-4 flex flex-wrap gap-2">
        {restaurants.map((restaurant) => (
          <Button
            key={restaurant.place_id}
            variant="outlined"
            onClick={() => onSelectRestaurant(restaurant)}
            className="rounded-lg"
          >
            {restaurant.name}
          </Button>
        ))}
      </div>
    </Box>
  );
};

const App: React.FC = () => {
  const [selectedRestaurant, setSelectedRestaurant] =
    useState<Restaurant | null>(null);

  const { control, handleSubmit, setValue } = useForm({
    defaultValues: {
      name: "",
      address: "",
      latitude: "",
      longitude: "",
      rating: "",
      contact: "",
      image: "",
    },
  });

  const handleSelectRestaurant = (restaurant: Restaurant) => {
    setSelectedRestaurant(restaurant);

    // Populate form fields with restaurant details
    setValue("name", restaurant.name);
    setValue("address", restaurant.vicinity);
    setValue("latitude", restaurant.geometry.location.lat().toFixed(6));
    setValue("longitude", restaurant.geometry.location.lng().toFixed(6));
    setValue(
      "rating",
      `${restaurant.rating} (${restaurant.user_ratings_total} reviews)`
    );
  };

  const onSubmit = (data: any) => {
    console.log("Updated Restaurant Details:", data);
  };

  return (
    <div className="flex flex-col items-center min-h-screen bg-gray-50 p-4">
      <RestaurantSearch onSelectRestaurant={handleSelectRestaurant} />

      {selectedRestaurant && (
        <Card className="w-full max-w-lg mt-6 shadow-lg">
          <CardContent>
            <Typography variant="h5" gutterBottom>
              Edit Restaurant Details
            </Typography>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <Controller
                name="name"
                control={control}
                render={({ field }) => (
                  <TextField
                    fullWidth
                    label="Name"
                    variant="outlined"
                    {...field}
                  />
                )}
              />

              <Controller
                name="address"
                control={control}
                render={({ field }) => (
                  <TextField
                    fullWidth
                    label="Address"
                    variant="outlined"
                    {...field}
                  />
                )}
              />

              <Controller
                name="latitude"
                control={control}
                render={({ field }) => (
                  <TextField
                    fullWidth
                    label="Latitude"
                    variant="outlined"
                    {...field}
                  />
                )}
              />

              <Controller
                name="longitude"
                control={control}
                render={({ field }) => (
                  <TextField
                    fullWidth
                    label="Longitude"
                    variant="outlined"
                    {...field}
                  />
                )}
              />

              <Controller
                name="rating"
                control={control}
                render={({ field }) => (
                  <TextField
                    fullWidth
                    label="Rating"
                    variant="outlined"
                    {...field}
                  />
                )}
              />

              <Controller
                name="contact"
                control={control}
                render={({ field }) => (
                  <TextField
                    fullWidth
                    label="Contact Number"
                    variant="outlined"
                    {...field}
                  />
                )}
              />

              <Controller
                name="image"
                control={control}
                render={({ field }) => (
                  <TextField
                    fullWidth
                    label="Image URL"
                    variant="outlined"
                    {...field}
                  />
                )}
              />

              <Button
                type="submit"
                fullWidth
                variant="contained"
                color="secondary"
                className="mt-4"
              >
                Save Details
              </Button>
            </form>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default App;
