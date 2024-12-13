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
  contact: string;
  address: string;
  restaurants: {
    id: string;
    name: string;
    location: string;
  }[];
}

interface Step2RestaurantInfoProps {
  restaurants: {
    id: string;
    name: string;
    location: string;
  }[];

  
  setRestaurants: React.Dispatch<
    React.SetStateAction<
      {
        id: string;
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
  const { data: restaurantOptions, refetch, isFetching } = useGetRestaurantApiQuery("", {
    refetchOnMountOrArgChange: true, // Ensures fresh data on every mount
  });

// Ensure fresh data is fetched whenever actions occur
const addRestaurantField = () => {
  setRestaurants((prev) => [...prev, { id: "", name: "", location: "" }]);
  
};

const removeRestaurantField = (index: number) => {
  if (index === 0) return;

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
  setValue("restaurants", updatedRestaurants);
  
};

  return (
    <div className="space-y-4">
      {restaurants.map((restaurant, index) => (
        <Box key={index} className="p-4 border border-gray-200 rounded-md mt-4">
          <div>
            <label>Restaurant Name</label>
            <Autocomplete
              options={
                restaurantOptions
                  ? restaurantOptions.filter(
                      (option) =>
                        !restaurants.some((r) => r.name === option.name)
                    )
                  : []
              } // Exclude already-selected restaurants
              getOptionLabel={(option) => option.name || ""}
              value={
                restaurantOptions?.find(
                  (option) => option.name === restaurant.name
                ) || null
              } // Ensure the Autocomplete is controlled
              onChange={(_, selectedRestaurant) => {
                if (selectedRestaurant) {
                  // Populate fields when a restaurant is selected
                  handleRestaurantChange(
                    index,
                    "id",
                    selectedRestaurant.id
                  );
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
                } else {
                  // Clear fields if selection is removed
                  handleRestaurantChange(index, "id", "");
                  handleRestaurantChange(index, "name", "");
                  handleRestaurantChange(index, "location", "");
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
              disabled
            />
          </div>

          {/* Show delete button only for restaurants after the first one */}
          {index > 0 && (
            <IconButton
              color="error"
              onClick={() => removeRestaurantField(index)}
            >
              <DeleteIcon />
            </IconButton>
          )}
        </Box>
      ))}

      <Button onClick={addRestaurantField} variant="outlined">
        Add Another Restaurant
      </Button>
    </div>
  );
};


export default Step2RestaurantInfo;