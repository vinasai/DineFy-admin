import React from "react";
import {
  Box,
  Button,
  IconButton,
  TextField,
  Autocomplete,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import { UseFormSetValue } from "react-hook-form";
import { useGetRestaurantApiQuery } from "@/redux/api/restaurant/restaurantApiSlice";

interface FormData {
  name: string;
  email: string;
  country: string;
  
  contact:string;
  restaurants: {
    name: string;
    location: string;
  }[];
}

interface Step2RestaurantInfoProps {
  restaurants: {
    name: string;
    location: string;
  }[];
  setRestaurants: React.Dispatch<
    React.SetStateAction<
      {
        name: string;
        location: string;
      }[]
    >
  >;
  setValue: UseFormSetValue<FormData>;
}

const Step2RestaurantInfo: React.FC<Step2RestaurantInfoProps> = ({
  restaurants,
  setRestaurants,
  setValue,
}) => {
  const addRestaurantField = () => {
    setRestaurants((prev) => [...prev, { name: "", location: "" }]);
  };

  const removeRestaurantField = (index: number) => {
    const updatedRestaurants = restaurants.filter((_, i) => i !== index);
    setRestaurants(updatedRestaurants);
    setValue("restaurants", updatedRestaurants);
  };

  const handleRestaurantChange = (
    index: number,
    field: keyof FormData["restaurants"][number],
    value: string
  ) => {
    const updatedRestaurants = [...restaurants];
    updatedRestaurants[index][field] = value;
  
    setRestaurants(updatedRestaurants);
  
    // Set form value correctly
    setValue("restaurants", updatedRestaurants);
  };
  
  // Fetching restaurants from API
  const { data: restaurantOptions } = useGetRestaurantApiQuery("");

  return (
    <div className="space-y-4">
      {restaurants.map((restaurant, index) => (
        <Box key={index} className="p-4 border border-gray-200 rounded-md">
          <div>
            <label>Restaurant Name</label>
            <Autocomplete
              options={restaurantOptions || []} // API data as options
              getOptionLabel={(option) => option.name || ""}
              onChange={(_, selectedRestaurant) => {
                if (selectedRestaurant) {
                  // Populate fields when a restaurant is selected
                  handleRestaurantChange(
                    index,
                    "name",
                    selectedRestaurant.name
                  );
                  handleRestaurantChange(
                    index,
                    "location",
                    selectedRestaurant.location
                  );
                }
              }}
              renderInput={(params) => (
                <TextField
                  {...params}
                  placeholder="Select a restaurant"
                  className="w-full"
                />
              )}
            />
          </div>

          <div>
            <label>Location</label>
            <input
              value={restaurant.location}
              onChange={(e) =>
                handleRestaurantChange(index, "location", e.target.value)
              }
              placeholder="Restaurant location"
              className="w-full border border-gray-300 p-2 rounded"
            />
          </div>

          <IconButton
            color="error"
            onClick={() => removeRestaurantField(index)}
          >
            <DeleteIcon />
          </IconButton>
        </Box>
      ))}

      <Button onClick={addRestaurantField} variant="outlined">
        Add Another Restaurant
      </Button>
    </div>
  );
};

export default Step2RestaurantInfo;
