// EditRestaurantModal.tsx
import React from "react";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  Button,
  FormControlLabel,
  Checkbox,
} from "@mui/material";
import { useDropzone } from "react-dropzone";

interface Restaurant {
  id: number;
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
  // Initialize states
  const [name, setName] = React.useState<string>(restaurant?.name || "");
  const [description, setDescription] = React.useState<string>(
    restaurant?.description || ""
  );
  const [address, setAddress] = React.useState<string>(
    restaurant?.address || ""
  );
  const [country, setCountry] = React.useState<string>(
    restaurant?.country || ""
  );
  const [isActive, setIsActive] = React.useState<boolean>(
    restaurant?.isActive || true
  );
  const [imageFile, setImageFile] = React.useState<File | null>(null);
  const [previewImage, setPreviewImage] = React.useState<
    string | ArrayBuffer | null
  >("");

  React.useEffect(() => {
    if (restaurant) {
      setName(restaurant.name);
      setDescription(restaurant.description);
      setAddress(restaurant.address);
      setCountry(restaurant.country);
      setIsActive(restaurant.isActive);
    }
  }, [restaurant]);

  React.useEffect(() => {
    if (imageFile) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result);
      };
      reader.readAsDataURL(imageFile);
    } else {
      setPreviewImage(null);
    }
  }, [imageFile]);

  const handleSave = () => {
    if (restaurant) {
      onSave({
        ...restaurant,
        name,
        description,
        address,
        country,
        imageUrl: previewImage ? (previewImage as string) : restaurant.imageUrl,
        isActive,
      });
    }
    onClose();
  };

  const onDrop = (acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      const file = acceptedFiles[0];
      setImageFile(file);
    }
  };

  const { getRootProps, getInputProps, isDragActive, isDragReject } =
    useDropzone({
      onDrop,
      accept: { "image/*": [] },
    });

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Edit Restaurant</DialogTitle>
      <DialogContent>
        <div
          {...getRootProps()}
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            border: "2px dashed #3e60d5",
            borderRadius: "8px",
            padding: "16px",
            width: 200, // Reduced width
            height: 200, // Reduced height
            textAlign: "center",
            cursor: "pointer",
            marginBottom: "16px",
            backgroundColor: isDragActive
              ? "#e1f5fe"
              : isDragReject
              ? "#ffebee"
              : "#fff",
          }}
        >
          <input {...getInputProps()} />
          {previewImage ? (
            <img
              src={previewImage as string}
              alt="Preview"
              style={{
                width: "150px", // Fixed width for image
                height: "150px", // Fixed height for image
                borderRadius: "8px",
              }}
            />
          ) : (
            <p>
              Please upload an image by dragging and dropping it here or
              clicking to select.
            </p>
          )}
        </div>
        <TextField
          autoFocus
          margin="dense"
          label="Restaurant Name"
          fullWidth
          variant="outlined"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <TextField
          margin="dense"
          label="Description"
          fullWidth
          variant="outlined"
          multiline
          rows={3}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
        <TextField
          margin="dense"
          label="Address"
          fullWidth
          variant="outlined"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
        />
        <TextField
          margin="dense"
          label="Country"
          fullWidth
          variant="outlined"
          value={country}
          onChange={(e) => setCountry(e.target.value)}
        />
        <FormControlLabel
          control={
            <Checkbox
              checked={isActive}
              onChange={(e) => setIsActive(e.target.checked)}
              color="primary"
            />
          }
          label="Active"
        />
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
