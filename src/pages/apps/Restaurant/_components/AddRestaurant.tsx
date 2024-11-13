import React from "react";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Button,
  TextField,
  FormControlLabel,
  Checkbox,
} from "@mui/material";
import { useForm, Controller } from "react-hook-form";

interface NewRestaurant {
  id: number;
  name: string;
  description: string;
  address: string;
  country: string;
  imageUrl: string; // Field kept for manual entry
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
      description: "",
      address: "",
      country: "",
      imageUrl: "",
      isActive: true,
    },
  });

  const onSubmit = (data: NewRestaurant) => {
    onSave(data);
    reset();
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
              <TextField
                {...field}
                label="Restaurant Name"
                fullWidth
                required
              />
            )}
          />

          {/* Description Field */}
          <Controller
            name="description"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                label="Description"
                fullWidth
                multiline
                rows={3}
              />
            )}
          />

          {/* Address Field */}
          <Controller
            name="address"
            control={control}
            render={({ field }) => (
              <TextField {...field} label="Address" fullWidth required />
            )}
          />

          {/* Country Field */}
          <Controller
            name="country"
            control={control}
            render={({ field }) => (
              <TextField {...field} label="Country" fullWidth required />
            )}
          />

          {/* Image URL Field */}
          <Controller
            name="imageUrl"
            control={control}
            render={({ field }) => (
              <TextField {...field} label="Image URL" fullWidth />
            )}
          />

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
