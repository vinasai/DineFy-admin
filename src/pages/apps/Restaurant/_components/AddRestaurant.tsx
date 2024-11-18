import React, { useState } from "react";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Button,
  FormControlLabel,
  Checkbox,
  Grid,
  Box,
} from "@mui/material";
import { useForm, Controller } from "react-hook-form";
import { useDropzone } from "react-dropzone";

interface NewRestaurant {
  id: string;
  name: string;
  about: string;
  thumbnail_photo?: File | null;
  contact_number: string;
  contact_person_name: string;
  contact_person_position: string;
  restaurant_category: string;
  location: string;
  country: string;
  owner: string;
  foodAndDining: { [key: string]: boolean }; // Use boolean to store checkbox state
  family: { [key: string]: boolean };
  entertainment: { [key: string]: boolean };
  gallery: object;
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
      foodAndDining: {},
      family: {},
      entertainment: {},
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

  // Options for checkboxes grouped in sections
  const foodAndDiningOptions = [
    "Patio",
    "Halal foods",
    "Gluten-free foods",
    "Birthday celebration",
    "Buffet",
    "Reservations",
    "Birthday Discounts",
  ];

  const familyOptions = [
    "Family rooms",
    "Diaper change room",
    "Kids play area",
    "Highchair for kids",
  ];

  const entertainmentOptions = [
    "DJ",
    "Music",
    "TV",
    "Pool table",
    "Live band",
    "Free parking",
    "Conference room",
  ];

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="lg">
      {" "}
      {/* Increased width to 'lg' */}
      <DialogTitle>Add New Restaurant</DialogTitle>
      <DialogContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* Restaurant Name */}
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <Controller
                name="name"
                control={control}
                render={({ field }) => (
                  <Box>
                    <label>Restaurant Name:</label>
                    <input
                      {...field}
                      type="text"
                      required
                      style={{
                        width: "100%",
                        padding: "8px",
                        marginTop: "4px",
                        borderRadius: "4px",
                        border: "1px solid #ddd",
                      }}
                    />
                  </Box>
                )}
              />
            </Grid>

            {/* About */}
            <Grid item xs={12}>
              <Controller
                name="about"
                control={control}
                render={({ field }) => (
                  <Box>
                    <label>About:</label>
                    <textarea
                      {...field}
                      rows={3}
                      style={{
                        width: "100%",
                        padding: "8px",
                        marginTop: "4px",
                        borderRadius: "4px",
                        border: "1px solid #ddd",
                      }}
                    />
                  </Box>
                )}
              />
            </Grid>

            {/* Other Fields */}
            <Grid item xs={12} md={6}>
              <Controller
                name="contact_number"
                control={control}
                render={({ field }) => (
                  <Box>
                    <label>Contact Number:</label>
                    <input
                      {...field}
                      type="text"
                      required
                      style={{
                        width: "100%",
                        padding: "8px",
                        marginTop: "4px",
                        borderRadius: "4px",
                        border: "1px solid #ddd",
                      }}
                    />
                  </Box>
                )}
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <Controller
                name="contact_person_name"
                control={control}
                render={({ field }) => (
                  <Box>
                    <label>Contact Person Name:</label>
                    <input
                      {...field}
                      type="text"
                      required
                      style={{
                        width: "100%",
                        padding: "8px",
                        marginTop: "4px",
                        borderRadius: "4px",
                        border: "1px solid #ddd",
                      }}
                    />
                  </Box>
                )}
              />
            </Grid>

            {/* Checkbox Sections */}
            {/* Food and Dining Section */}
            <Grid item xs={12}>
              <h3>Food and Dining</h3>
              {foodAndDiningOptions.map((option) => (
                <Controller
                  key={option}
                  name={`foodAndDining.${option}`}
                  control={control}
                  render={({ field }) => (
                    <FormControlLabel
                      control={
                        <Checkbox
                          {...field}
                          checked={Boolean(field.value) || false}
                          onChange={(e) => field.onChange(e.target.checked)}
                        />
                      }
                      label={option}
                    />
                  )}
                />
              ))}
            </Grid>

            {/* Family Section */}
            <Grid item xs={12}>
              <h3>Family</h3>
              {familyOptions.map((option) => (
                <Controller
                  key={option}
                  name={`family.${option}`}
                  control={control}
                  render={({ field }) => (
                    <FormControlLabel
                      control={
                        <Checkbox
                          {...field}
                          checked={field.value || false}
                          onChange={(e) => field.onChange(e.target.checked)}
                        />
                      }
                      label={option}
                    />
                  )}
                />
              ))}
            </Grid>

            {/* Entertainment Section */}
            <Grid item xs={12}>
              <h3>Entertainment</h3>
              {entertainmentOptions.map((option) => (
                <Controller
                  key={option}
                  name={`entertainment.${option}`}
                  control={control}
                  render={({ field }) => (
                    <FormControlLabel
                      control={
                        <Checkbox
                          {...field}
                          checked={field.value || false}
                          onChange={(e) => field.onChange(e.target.checked)}
                        />
                      }
                      label={option}
                    />
                  )}
                />
              ))}
            </Grid>

            {/* Image Dropzone */}
            <Grid item xs={12}>
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
            </Grid>

            {/* Active Status */}
            <Grid item xs={12}>
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
            </Grid>
          </Grid>
        </form>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button onClick={handleSubmit(onSubmit)} color="primary">
          Save
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AddRestaurant;
