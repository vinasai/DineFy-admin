import React, { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  IconButton,
  Box,
  Typography,
} from "@mui/material";
import { useForm } from "react-hook-form";
import DeleteIcon from "@mui/icons-material/Delete";
import {
  useCreateOwnerApiMutation,
  useGetOwnerApiQuery,
} from "@/redux/api/owner/ownerApi";

interface AddNewOwnersProps {
  onClose: () => void;
}

interface FormData {
  name: string;
  email: string;
  country: string;
  address: string;
  restaurant: {
    name: string;
    address: string;
    email: string;
    contact: string;
  }[];
}

const AddNewOwners: React.FC<AddNewOwnersProps> = ({ onClose }) => {
  const {
    handleSubmit,
    formState: { errors },
    setValue,
    register,
    watch,
    trigger,
  } = useForm<FormData>();

  const [step, setStep] = useState(1);
  const [restaurants, setRestaurants] = useState([
    { name: "", address: "", email: "", contact: "" },
  ]);

  const { refetch } = useGetOwnerApiQuery("");
  const [createOwner] = useCreateOwnerApiMutation();

  const onSubmit = async (data: FormData) => {
    try {
      const response = await createOwner(data);
      refetch();
      if ("data" in response) {
        console.log("Owner created successfully:", response.data);
        onClose();
      } else if ("error" in response) {
        console.error("Failed to create owner:", response.error);
      }
    } catch (error) {
      console.error("An error occurred:", error);
    }
  };

  const addRestaurantField = () => {
    setRestaurants((prev) => [
      ...prev,
      { name: "", address: "", email: "", contact: "" },
    ]);
  };

  const removeRestaurantField = (index: number) => {
    setRestaurants((prev) => {
      const updatedRestaurants = prev.filter((_, i) => i !== index);
      setValue("restaurant", updatedRestaurants); // Update the form value
      return updatedRestaurants;
    });
  };

  const handleRestaurantChange = (
    index: number,
    field: keyof FormData["restaurant"][0],
    value: string
  ) => {
    const newRestaurants = [...restaurants];
    newRestaurants[index][field] = value;
    setRestaurants(newRestaurants);
    setValue("restaurant", newRestaurants); // Ensure form data is updated
  };

  const ownerData = watch(["name", "email", "country", "address"]);
  const restaurantData = watch("restaurant");

  const handleNextStep = async () => {
    const isValid = await trigger(
      step === 1 ? ["name", "email", "country", "address"] : "restaurant"
    );
    if (isValid) setStep((prev) => prev + 1);
  };

  return (
    <Dialog open={true} onClose={onClose} fullWidth maxWidth="md">
      <DialogTitle className="text-xl font-semibold pb-4 border-b border-gray-200">
        {step === 1
          ? "Add Owner Information"
          : step === 2
          ? "Add Restaurant Information"
          : "Review & Submit"}
      </DialogTitle>

      <DialogContent className="p-6 space-y-6 bg-gray-50">
        {step === 1 && (
          <div className="space-y-4">
            <div>
              <label className="block mb-1 font-semibold text-gray-700">
                Name
              </label>
              <input
                {...register("name", { required: "Name is required" })}
                className="w-full border border-gray-300 p-3 rounded focus:ring-2 focus:ring-blue-500"
                placeholder="Enter owner's name"
              />
              {errors.name && (
                <p className="text-red-500 text-sm">{errors.name.message}</p>
              )}
            </div>

            <div>
              <label className="block mb-1 font-semibold text-gray-700">
                Email
              </label>
              <input
                {...register("email", {
                  required: "Email is required",
                  pattern: {
                    value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                    message: "Enter a valid email",
                  },
                })}
                className="w-full border border-gray-300 p-3 rounded focus:ring-2 focus:ring-blue-500"
                placeholder="Enter owner's email"
              />
              {errors.email && (
                <p className="text-red-500 text-sm">{errors.email.message}</p>
              )}
            </div>

            <div>
              <label className="block mb-1 font-semibold text-gray-700">
                Country
              </label>
              <input
                {...register("country", { required: "Country is required" })}
                className="w-full border border-gray-300 p-3 rounded focus:ring-2 focus:ring-blue-500"
                placeholder="Enter owner's country"
              />
              {errors.country && (
                <p className="text-red-500 text-sm">{errors.country.message}</p>
              )}
            </div>

            <div>
              <label className="block mb-1 font-semibold text-gray-700">
                Address
              </label>
              <input
                {...register("address", { required: "Address is required" })}
                className="w-full border border-gray-300 p-3 rounded focus:ring-2 focus:ring-blue-500"
                placeholder="Enter owner's address"
              />
              {errors.address && (
                <p className="text-red-500 text-sm">{errors.address.message}</p>
              )}
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-800">Restaurants</h3>
            {restaurants.map((restaurant, index) => (
              <Box
                key={index}
                className="p-4 mb-4 border border-gray-200 rounded-md bg-white shadow-sm space-y-2"
              >
                <div>
                  <label className="block mb-1 font-semibold text-gray-700">
                    Restaurant Name
                  </label>
                  <input
                    value={restaurant.name}
                    onChange={(e) =>
                      handleRestaurantChange(index, "name", e.target.value)
                    }
                    className="w-full border border-gray-300 p-3 rounded focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter restaurant name"
                  />
                </div>
                <div>
                  <label className="block mb-1 font-semibold text-gray-700">
                    Restaurant Address
                  </label>
                  <input
                    value={restaurant.address}
                    onChange={(e) =>
                      handleRestaurantChange(index, "address", e.target.value)
                    }
                    className="w-full border border-gray-300 p-3 rounded focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter restaurant address"
                  />
                </div>
                <div>
                  <label className="block mb-1 font-semibold text-gray-700">
                    Restaurant Email
                  </label>
                  <input
                    value={restaurant.email}
                    onChange={(e) =>
                      handleRestaurantChange(index, "email", e.target.value)
                    }
                    className="w-full border border-gray-300 p-3 rounded focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter restaurant email"
                  />
                </div>
                <div>
                  <label className="block mb-1 font-semibold text-gray-700">
                    Contact Number
                  </label>
                  <input
                    value={restaurant.contact}
                    onChange={(e) =>
                      handleRestaurantChange(index, "contact", e.target.value)
                    }
                    className="w-full border border-gray-300 p-3 rounded focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter contact number"
                  />
                </div>
                <IconButton
                  color="error"
                  onClick={() => removeRestaurantField(index)}
                  className="self-end"
                >
                  <DeleteIcon />
                </IconButton>
              </Box>
            ))}
            <Button
              variant="outlined"
              color="primary"
              onClick={addRestaurantField}
              className="self-start"
            >
              Add Another Restaurant
            </Button>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-4">
            <Typography variant="h6" gutterBottom>
              Review Owner Information
            </Typography>
            <p>
              <strong>Name:</strong> {ownerData[0]}
            </p>
            <p>
              <strong>Email:</strong> {ownerData[1]}
            </p>
            <p>
              <strong>Country:</strong> {ownerData[2]}
            </p>
            <p>
              <strong>Address:</strong> {ownerData[3]}
            </p>

            <Typography variant="h6" gutterBottom style={{ marginTop: "1rem" }}>
              Review Restaurants Information
            </Typography>
            {restaurantData &&
              restaurantData.map((restaurant, index) => (
                <Box
                  key={index}
                  className="p-4 mb-2 border border-gray-200 rounded-md bg-gray-100"
                >
                  <p>
                    <strong>Restaurant {index + 1}:</strong>
                  </p>
                  <p>
                    <strong>Name:</strong> {restaurant.name}
                  </p>
                  <p>
                    <strong>Address:</strong> {restaurant.address}
                  </p>
                  <p>
                    <strong>Email:</strong> {restaurant.email}
                  </p>
                  <p>
                    <strong>Contact:</strong> {restaurant.contact}
                  </p>
                </Box>
              ))}
          </div>
        )}
      </DialogContent>

      <DialogActions className="px-6 py-4 bg-gray-100 border-t border-gray-200">
        <Button onClick={onClose} variant="outlined" color="secondary">
          Close
        </Button>
        {step > 1 && (
          <Button
            onClick={() => setStep((prev) => prev - 1)}
            variant="outlined"
            color="primary"
          >
            Back
          </Button>
        )}
        {step < 3 ? (
          <Button onClick={handleNextStep} variant="contained" color="primary">
            Next
          </Button>
        ) : (
          <Button
            variant="contained"
            color="primary"
            onClick={handleSubmit(onSubmit)}
          >
            Submit
          </Button>
        )}
      </DialogActions>
    </Dialog>
  );
};

export default AddNewOwners;
