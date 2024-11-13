import React, { useState } from "react";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Button,
  FormControlLabel,
  Checkbox,
} from "@mui/material";
import { useForm, Controller } from "react-hook-form";
import { useDropzone } from "react-dropzone";

interface NewRestaurant {
  id: string; // UUID for the restaurant
  name: string;
  about: string;
  thumbnail_photo?: File | null;
  contact_number: string;
  contact_person_name: string;
  contact_person_position: string;
  restaurant_category: string;
  location: string;
  country: string;
  owner: string; // UUID for the owner
  facility: object; // For JSON fields, assuming it's an object
  gallery: object; // For JSON fields
  avg_budget: string;
  place_id: string;
  subscription: string;
  avg_rating: number;
  icon: string;
  website: string;
  like: number;
  isActive: boolean;
}

interface AddRestaurantProps {
  open: boolean;
  onClose: () => void;
  onSave: (newRestaurant: NewRestaurant) => void;
}

const AddRestaurant: React.FC<AddRestaurantProps> = ({
  open,
  onClose,
  onSave,
}) => {
  const { handleSubmit, control, reset } = useForm<NewRestaurant>({
    defaultValues: {
      name: "",
      about: "",
      contact_number: "",
      contact_person_name: "",
      contact_person_position: "",
      restaurant_category: "",
      location: "",
      country: "",
      owner: "",
      facility: {},
      gallery: {},
      avg_budget: "",
      place_id: "",
      subscription: "",
      avg_rating: 0,
      icon: "",
      website: "",
      like: 0,
      isActive: true,
    },
  });

  const [uploadedImage, setUploadedImage] = useState<File | null>(null);

  const onDrop = (acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      setUploadedImage(acceptedFiles[0]);
    }
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { "image/*": [] },
    maxFiles: 1,
  });

  const onSubmit = (data: NewRestaurant) => {
    onSave({
      ...data,
      thumbnail_photo: uploadedImage,
    });
    reset();
    setUploadedImage(null);
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>Add New Restaurant</DialogTitle>
      <DialogContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* Name Field */}
          <Controller
            name="name"
            control={control}
            render={({ field }) => (
              <div>
                <label>Restaurant Name:</label>
                <input
                  {...field}
                  type="text"
                  required
                  style={{ width: "100%", padding: "8px", marginTop: "4px" }}
                />
              </div>
            )}
          />

          {/* About Field */}
          <Controller
            name="about"
            control={control}
            render={({ field }) => (
              <div>
                <label>About:</label>
                <textarea
                  {...field}
                  rows={3}
                  style={{ width: "100%", padding: "8px", marginTop: "4px" }}
                />
              </div>
            )}
          />

          {/* Contact Number Field */}
          <Controller
            name="contact_number"
            control={control}
            render={({ field }) => (
              <div>
                <label>Contact Number:</label>
                <input
                  {...field}
                  type="text"
                  required
                  style={{ width: "100%", padding: "8px", marginTop: "4px" }}
                />
              </div>
            )}
          />

          {/* Contact Person Name Field */}
          <Controller
            name="contact_person_name"
            control={control}
            render={({ field }) => (
              <div>
                <label>Contact Person Name:</label>
                <input
                  {...field}
                  type="text"
                  required
                  style={{ width: "100%", padding: "8px", marginTop: "4px" }}
                />
              </div>
            )}
          />

          {/* Contact Person Position Field */}
          <Controller
            name="contact_person_position"
            control={control}
            render={({ field }) => (
              <div>
                <label>Contact Person Position:</label>
                <input
                  {...field}
                  type="text"
                  required
                  style={{ width: "100%", padding: "8px", marginTop: "4px" }}
                />
              </div>
            )}
          />

          {/* Restaurant Category Field */}
          <Controller
            name="restaurant_category"
            control={control}
            render={({ field }) => (
              <div>
                <label>Restaurant Category:</label>
                <input
                  {...field}
                  type="text"
                  required
                  style={{ width: "100%", padding: "8px", marginTop: "4px" }}
                />
              </div>
            )}
          />

          {/* Location Field */}
          <Controller
            name="location"
            control={control}
            render={({ field }) => (
              <div>
                <label>Location:</label>
                <input
                  {...field}
                  type="text"
                  required
                  style={{ width: "100%", padding: "8px", marginTop: "4px" }}
                />
              </div>
            )}
          />

          {/* Country Field */}
          <Controller
            name="country"
            control={control}
            render={({ field }) => (
              <div>
                <label>Country:</label>
                <input
                  {...field}
                  type="text"
                  required
                  style={{ width: "100%", padding: "8px", marginTop: "4px" }}
                />
              </div>
            )}
          />

          {/* Avg Budget Field */}
          <Controller
            name="avg_budget"
            control={control}
            render={({ field }) => (
              <div>
                <label>Average Budget:</label>
                <input
                  {...field}
                  type="text"
                  required
                  style={{ width: "100%", padding: "8px", marginTop: "4px" }}
                />
              </div>
            )}
          />

          {/* Place ID Field */}
          <Controller
            name="place_id"
            control={control}
            render={({ field }) => (
              <div>
                <label>Place ID:</label>
                <input
                  {...field}
                  type="text"
                  required
                  style={{ width: "100%", padding: "8px", marginTop: "4px" }}
                />
              </div>
            )}
          />

          {/* Subscription Field */}
          <Controller
            name="subscription"
            control={control}
            render={({ field }) => (
              <div>
                <label>Subscription Type:</label>
                <input
                  {...field}
                  type="text"
                  required
                  style={{ width: "100%", padding: "8px", marginTop: "4px" }}
                />
              </div>
            )}
          />

          {/* Avg Rating Field */}
          <Controller
            name="avg_rating"
            control={control}
            render={({ field }) => (
              <div>
                <label>Average Rating:</label>
                <input
                  {...field}
                  type="number"
                  step="0.1"
                  required
                  style={{ width: "100%", padding: "8px", marginTop: "4px" }}
                />
              </div>
            )}
          />

          {/* Icon Field */}
          <Controller
            name="icon"
            control={control}
            render={({ field }) => (
              <div>
                <label>Icon:</label>
                <input
                  {...field}
                  type="text"
                  required
                  style={{ width: "100%", padding: "8px", marginTop: "4px" }}
                />
              </div>
            )}
          />

          {/* Website Field */}
          <Controller
            name="website"
            control={control}
            render={({ field }) => (
              <div>
                <label>Website:</label>
                <input
                  {...field}
                  type="text"
                  required
                  style={{ width: "100%", padding: "8px", marginTop: "4px" }}
                />
              </div>
            )}
          />

          {/* Like Field */}
          <Controller
            name="like"
            control={control}
            render={({ field }) => (
              <div>
                <label>Likes:</label>
                <input
                  {...field}
                  type="number"
                  required
                  style={{ width: "100%", padding: "8px", marginTop: "4px" }}
                />
              </div>
            )}
          />

          {/* Image Dropzone */}
          <div
            {...getRootProps()}
            style={{
              border: "2px dashed #ddd",
              borderRadius: "4px",
              padding: "16px",
              textAlign: "center",
              cursor: "pointer",
              marginTop: "8px",
            }}
          >
            <input {...getInputProps()} />
            {isDragActive ? (
              <p>Drop the image here...</p>
            ) : uploadedImage ? (
              <p>{uploadedImage.name}</p>
            ) : (
              <p>Drag and drop an image here, or click to select one</p>
            )}
          </div>

          {/* Active Status Checkbox */}
          <Controller
            name="isActive"
            control={control}
            render={({ field }) => (
              <FormControlLabel
                control={<Checkbox {...field} checked={field.value} />}
                label="Active"
              />
            )}
          />
        </form>
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose} color="primary">
          Cancel
        </Button>
        <Button onClick={handleSubmit(onSubmit)} color="primary">
          Save
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AddRestaurant;
