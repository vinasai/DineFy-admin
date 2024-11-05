import React from "react";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Button,
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
      setImageFile(acceptedFiles[0]);
    }
  };

  const { getRootProps, getInputProps, isDragActive, isDragReject } =
    useDropzone({
      onDrop,
      accept: { "image/*": [] },
    });

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>Edit Restaurant</DialogTitle>
      <DialogContent>
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

        <div className="space-y-4">
          {/* Name Field */}
          <div>
            <label className="block font-semibold mb-1">Restaurant Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full border border-gray-300 p-2 rounded"
            />
          </div>

          {/* Description Field */}
          <div>
            <label className="block font-semibold mb-1">Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full border border-gray-300 p-2 rounded"
              rows={3}
            />
          </div>

          {/* Address Field */}
          <div>
            <label className="block font-semibold mb-1">Address</label>
            <input
              type="text"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              className="w-full border border-gray-300 p-2 rounded"
            />
          </div>

          {/* Country Field */}
          <div>
            <label className="block font-semibold mb-1">Country</label>
            <input
              type="text"
              value={country}
              onChange={(e) => setCountry(e.target.value)}
              className="w-full border border-gray-300 p-2 rounded"
            />
          </div>

          {/* Active Checkbox */}
          <div className="flex items-center">
            <input
              type="checkbox"
              checked={isActive}
              onChange={(e) => setIsActive(e.target.checked)}
              className="mr-2"
            />
            <label className="font-semibold">Active</label>
          </div>
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
