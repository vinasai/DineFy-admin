import React, { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  //InputAdornment,
  IconButton,
  Box,
} from "@mui/material";
import { useForm, Controller } from "react-hook-form";
// import Visibility from "@mui/icons-material/Visibility"; // Icon to show password
// import VisibilityOff from "@mui/icons-material/VisibilityOff"; // Icon to hide password
// import VpnKeyIcon from "@mui/icons-material/VpnKey"; // Icon for generating password
import DeleteIcon from "@mui/icons-material/Delete"; // Icon for deleting restaurant

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
  restaurant: string[]; // Array of restaurant names
}

const AddNewOwners: React.FC<AddNewOwnersProps> = ({ onClose }) => {
  const {
    control,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm<FormData>();

  // const [password, setPassword] = useState<string>("");
  // const [showPassword, setShowPassword] = useState<boolean>(false);
  const [restaurants, setRestaurants] = useState<string[]>([""]); // Initialize with one empty restaurant input

  const onSubmit = (data: FormData) => {
    console.log(data); // Handle the submitted data
    onClose(); // Close the modal after submission
  };

  // Function to generate a strong password
  // const generateStrongPassword = () => {
  //   const randomChars =
  //     "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()_+";
  //   const passwordLength = 12; // Desired length of the password
  //   let generatedPassword = "";

  //   for (let i = 0; i < passwordLength; i++) {
  //     const randomIndex = Math.floor(Math.random() * randomChars.length);
  //     generatedPassword += randomChars.charAt(randomIndex);
  //   }
  //   setPassword(generatedPassword);
  // };

  // Function to add a new restaurant input field
  const addRestaurantField = () => {
    setRestaurants((prev) => [...prev, ""]); // Add a new empty string to the array
  };

  // Function to remove a restaurant input field by index
  const removeRestaurantField = (index: number) => {
    setRestaurants((prev) => prev.filter((_, i) => i !== index)); // Remove the restaurant at the specified index
  };

  // Handle change for restaurant inputs
  const handleRestaurantChange = (index: number, value: string) => {
    const newRestaurants = [...restaurants];
    newRestaurants[index] = value; // Update the specific restaurant input
    setRestaurants(newRestaurants);
    setValue("restaurant", newRestaurants); // Update the form value in react-hook-form
  };

  return (
    <Dialog open={true} onClose={onClose} fullWidth maxWidth="md">
      <DialogTitle className="text-xl font-semibold pb-11">
        Add New Owner
      </DialogTitle>

      <DialogContent className="space-y-4">
        {/* Name Field */}
        <Controller
          name="name"
          control={control}
          defaultValue=""
          rules={{ required: "Name is required" }}
          render={({ field }) => (
            <TextField
              {...field}
              label="Name"
              fullWidth
              error={!!errors.name}
              helperText={errors.name ? errors.name.message : ""}
              className="mb-4"
              InputProps={{
                disableUnderline: true, 
                style: { border: "1px solid #ccc", borderRadius: "4px" }, 
              }}
            />
          )}
        />

        {/* Email Field */}
        <Controller
          name="email"
          control={control}
          defaultValue=""
          rules={{
            required: "Email is required",
            pattern: {
              value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
              message: "Enter a valid email",
            },
          }}
          render={({ field }) => (
            <TextField
              {...field}
              label="Email"
              fullWidth
              error={!!errors.email}
              helperText={errors.email ? errors.email.message : ""}
              className="mb-4"
              InputProps={{
                disableUnderline: true, 
                style: { border: "1px solid #ccc", borderRadius: "4px" }, 
              }}
            />
          )}
        />

        {/* Country Field */}
        <Controller
          name="country"
          control={control}
          defaultValue=""
          rules={{ required: "Country is required" }}
          render={({ field }) => (
            <TextField
              {...field}
              label="Country"
              fullWidth
              error={!!errors.country}
              helperText={errors.country ? errors.country.message : ""}
              className="mb-4"
              InputProps={{
                disableUnderline: true, 
                style: { border: "1px solid #ccc", borderRadius: "4px" }, 
              }}
            />
          )}
        />

        {/* Address Field */}
        <Controller
          name="address"
          control={control}
          defaultValue=""
          rules={{ required: "Address is required" }}
          render={({ field }) => (
            <TextField
              {...field}
              label="Address"
              fullWidth
              error={!!errors.address}
              helperText={errors.address ? errors.address.message : ""}
              className="mb-4"
              InputProps={{
                disableUnderline: true, 
                style: { border: "1px solid #ccc", borderRadius: "4px" }, 
              }}
            />
          )}
        />

        {/* Restaurants Fields */}
        <div>
          <h3 className="text-lg font-semibold mb-2">Restaurants</h3>
          {restaurants.map((restaurant, index) => (
            <Box key={index} display="flex" alignItems="center" mb={2}>
              <TextField
                label={`Restaurant ${index + 1}`}
                fullWidth
                value={restaurant}
                onChange={(e) => handleRestaurantChange(index, e.target.value)}
                className="mr-2"
                InputProps={{
                  disableUnderline: true, 
                  style: { border: "1px solid #ccc", borderRadius: "4px" }, 
                }}
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
