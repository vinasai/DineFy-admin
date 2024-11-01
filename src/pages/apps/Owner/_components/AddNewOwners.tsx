import React, { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  IconButton,
  Box,
} from "@mui/material";
import { useForm, Controller } from "react-hook-form";
import DeleteIcon from "@mui/icons-material/Delete";

interface AddNewOwnersProps {
  onClose: () => void;
}

interface FormData {
  id: number;
  name: string;
  email: string;
  password: string;
  country: string;
  address: string;
  restaurant: string[];
}

const AddNewOwners: React.FC<AddNewOwnersProps> = ({ onClose }) => {
  const {
    control,
    handleSubmit,
    formState: { errors },
    setValue,
    register,
  } = useForm<FormData>();

  const [restaurants, setRestaurants] = useState<string[]>([""]);

  const onSubmit = (data: FormData) => {
    console.log(data);
    onClose();
  };

  const addRestaurantField = () => {
    setRestaurants((prev) => [...prev, ""]);
  };

  const removeRestaurantField = (index: number) => {
    setRestaurants((prev) => prev.filter((_, i) => i !== index));
  };

  const handleRestaurantChange = (index: number, value: string) => {
    const newRestaurants = [...restaurants];
    newRestaurants[index] = value;
    setRestaurants(newRestaurants);
    setValue("restaurant", newRestaurants);
  };

  return (
    <Dialog open={true} onClose={onClose} fullWidth maxWidth="md">
      <DialogTitle className="text-xl font-semibold pb-11 outline-none">
        Add New Owner
      </DialogTitle>

      <DialogContent className="space-y-4">
        {/* Name Field */}
        <div>
          <label className="block mb-1 font-semibold">Name</label>
          <input
            {...register("name", { required: "Name is required" })}
            className="w-full border border-gray-300 p-2 rounded"
          />
          {errors.name && (
            <p className="text-red-500 text-sm">{errors.name.message}</p>
          )}
        </div>

        {/* Email Field */}
        <div>
          <label className="block mb-1 font-semibold">Email</label>
          <input
            {...register("email", {
              required: "Email is required",
              pattern: {
                value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                message: "Enter a valid email",
              },
            })}
            className="w-full border border-gray-300 p-2 rounded"
          />
          {errors.email && (
            <p className="text-red-500 text-sm">{errors.email.message}</p>
          )}
        </div>

        {/* Country Field */}
        <div>
          <label className="block mb-1 font-semibold">Country</label>
          <input
            {...register("country", { required: "Country is required" })}
            className="w-full border border-gray-300 p-2 rounded"
          />
          {errors.country && (
            <p className="text-red-500 text-sm">{errors.country.message}</p>
          )}
        </div>

        {/* Address Field */}
        <div>
          <label className="block mb-1 font-semibold">Address</label>
          <input
            {...register("address", { required: "Address is required" })}
            className="w-full border border-gray-300 p-2 rounded"
          />
          {errors.address && (
            <p className="text-red-500 text-sm">{errors.address.message}</p>
          )}
        </div>

        {/* Restaurants Fields */}
        <div>
          <h3 className="text-lg font-semibold mb-2">Restaurants</h3>
          {restaurants.map((restaurant, index) => (
            <Box key={index} display="flex" alignItems="center" mb={2}>
              <input
                value={restaurant}
                onChange={(e) => handleRestaurantChange(index, e.target.value)}
                className="w-full border border-gray-300 p-2 rounded mr-2"
              />
              <IconButton
                color="error"
                onClick={() => removeRestaurantField(index)}
              >
                <DeleteIcon />
              </IconButton>
            </Box>
          ))}
          <Button
            variant="outlined"
            color="primary"
            onClick={addRestaurantField}
          >
            Add Restaurant
          </Button>
        </div>
      </DialogContent>

      <DialogActions className="px-6 py-4">
        <Button
          onClick={onClose}
          variant="outlined"
          color="error"
          className="border-red-500 text-red-500 hover:bg-red-100"
        >
          Close
        </Button>
        <Button
          variant="contained"
          color="primary"
          onClick={handleSubmit(onSubmit)}
        >
          Save
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AddNewOwners;
