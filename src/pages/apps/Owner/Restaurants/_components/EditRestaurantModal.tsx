import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Button,
  Checkbox,
  TextField,
} from "@mui/material";
import { useDropzone } from "react-dropzone";
import { useCreateRestaurantApiMutation, useUpdateRestaurantApiMutation } from "@/redux/api/restaurant/restaurantApiSlice";

interface Restaurant {
  id?: number; // Made optional for creation scenarios
  name: string;
  description: string;
  address: string;
  country: string;
  imageUrl: string;
  isActive: boolean;
}

interface EditRestaurantModalProps {
  open: boolean;
  restaurant: Restaurant | null;
  onClose: () => void;
  onSave: (updatedRestaurant: Restaurant) => void;
}

const EditRestaurantModal: React.FC<EditRestaurantModalProps> = ({
  open,
  restaurant,
  onClose,
  onSave,
}) => {
  const [name, setName] = useState<string>(restaurant?.name || "");
  const [description, setDescription] = useState<string>(
    restaurant?.description || ""
  );
  const [address, setAddress] = useState<string>(restaurant?.address || "");
  const [country, setCountry] = useState<string>(restaurant?.country || "");
  const [isActive, setIsActive] = useState<boolean>(restaurant?.isActive || true);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [previewImage, setPreviewImage] = useState<string | ArrayBuffer | null>("");

  const [createRestaurantApi] = useCreateRestaurantApiMutation();
  const [updateRestaurantApi] = useUpdateRestaurantApiMutation();

  useEffect(() => {
    if (restaurant) {
      setName(restaurant.name);
      setDescription(restaurant.description);
      setAddress(restaurant.address);
      setCountry(restaurant.country);
      setIsActive(restaurant.isActive);
      setPreviewImage(restaurant.imageUrl);
    }
  }, [restaurant]);

  useEffect(() => {
    if (imageFile) {
      const reader = new FileReader();
      reader.onloadend = () => setPreviewImage(reader.result);
      reader.readAsDataURL(imageFile);
    } else {
      setPreviewImage(null);
    }
  }, [imageFile]);

  const handleSave = async () => {
    if (!name || !description || !address || !country) {
      alert("All fields are required.");
      return;
    }
  
    const newRestaurant: Restaurant = {
      id: restaurant?.id,
      name,
      description,
      address,
      country,
      imageUrl: previewImage as string, // Ensure correct type
      isActive,
    };
  
    console.log("Payload being sent to API:", newRestaurant);
  
    try {
      let result;
      if (restaurant?.id) {
        // Update existing restaurant
        result = await updateRestaurantApi(newRestaurant).unwrap();
        console.log("Update API Response:", result);
      } else {
        // Create new restaurant
        result = await createRestaurantApi(newRestaurant).unwrap();
        console.log("Create API Response:", result);
        
      }
      onSave(result); // Send data back to parent component
      
      onClose(); // Close the modal
    } catch (error) {
      console.error("API Error:", error);
      alert("Failed to save restaurant. Please check your inputs or try again.");
    }
  };
  

  const onDrop = (acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      setImageFile(acceptedFiles[0]);
    }
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { "image/*": [] },
  });

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>Edit Restaurant</DialogTitle>
      <DialogContent>
        {/* Image Drop Zone */}
        <div
          {...getRootProps()}
          className={`flex justify-center items-center border-2 ${
            isDragActive ? "border-blue-400 bg-blue-100" : "border-gray-300"
          } rounded-lg p-4 mb-4 cursor-pointer`}
          style={{ width: 200, height: 200 }}
        >
          <input {...getInputProps()} />
          {previewImage ? (
            <img
              src={previewImage as string}
              alt="Preview"
              className="w-36 h-36 rounded"
            />
          ) : (
            <p className="text-center text-gray-500">
              Drag & drop or click to upload an image
            </p>
          )}
        </div>

        {/* Name Field */}
        <TextField
          label="Restaurant Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          fullWidth
          margin="normal"
        />

        {/* Description Field */}
        <TextField
          label="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          fullWidth
          margin="normal"
          multiline
          rows={3}
        />

        {/* Address Field */}
        <TextField
          label="Address"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          fullWidth
          margin="normal"
        />

        {/* Country Field */}
        <TextField
          label="Country"
          value={country}
          onChange={(e) => setCountry(e.target.value)}
          fullWidth
          margin="normal"
        />

        {/* Active Checkbox */}
        <div className="flex items-center">
          <Checkbox
            checked={isActive}
            onChange={(e) => setIsActive(e.target.checked)}
            color="primary"
          />
          <label className="font-semibold">Active</label>
        </div>
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose} color="primary">
          Cancel
        </Button>
        <Button onClick={handleSave} color="primary">
          Save
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default EditRestaurantModal;
