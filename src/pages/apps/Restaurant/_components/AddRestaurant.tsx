// AddRestaurant.tsx

import React, { useState } from "react";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Button,
} from "@mui/material";
import { useForm } from "react-hook-form";
import { useDropzone } from "react-dropzone";

interface NewRestaurant {
  name: string;
  description: string;
  address: string;
  country: string;
  imageUrl: string;
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
  const { handleSubmit, reset } = useForm<NewRestaurant>({
    defaultValues: {
      name: "",
      description: "",
      address: "",
      country: "",
      imageUrl: "",
      isActive: true,
    },
  });

  const [previewImage, setPreviewImage] = useState<string | ArrayBuffer | null>(
    null
  );

  const onDrop = (acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      const file = acceptedFiles[0];
      const reader = new FileReader();
      reader.onloadend = () => setPreviewImage(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { "image/*": [] },
  });

  const onSubmit = (data: NewRestaurant) => {
    onSave({ ...data, imageUrl: previewImage as string });
    reset();
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>Add New Restaurant</DialogTitle>
      <DialogContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* Dropzone for Image Upload */}
          <div
            {...getRootProps()}
            className={`flex flex-col items-center justify-center border-2 ${
              isDragActive ? "border-blue-400 bg-blue-100" : "border-gray-300"
            } rounded-lg p-4 mb-4 cursor-pointer`}
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
