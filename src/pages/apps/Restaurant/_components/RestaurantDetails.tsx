import React from "react";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Button,
  Typography,
  Grid,
  Divider,
} from "@mui/material";

interface Restaurant {
  name: string;
  about: string;
  location: string;
  country: string;
  contact_number: string;
  contact_person_name: string;
  contact_person_position: string;
  restaurant_category: string;
  avg_budget: string;
  avg_rating: number;
  subscription: string;
  isActive: boolean;
  thumbnail_photo: string;
}

interface RestaurantDetailsModalProps {
  open: boolean;
  restaurant: Restaurant | null;
  onClose: () => void;
}

const RestaurantDetailsModal: React.FC<RestaurantDetailsModalProps> = ({
  open,
  restaurant,
  onClose,
}) => {
  if (!restaurant) return null; // Don't render the modal if restaurant is not provided.

  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullWidth
      maxWidth="xl"
      PaperProps={{
        sx: {
          borderRadius: "12px", // Rounded corners
          boxShadow: "0 4px 20px rgba(0, 0, 0, 0.1)", // Soft shadow
        },
      }}
    >
      <DialogTitle className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white p-6 rounded-t-xl">
        <Typography variant="h5" className="font-semibold">
          {restaurant.name}
        </Typography>
      </DialogTitle>
      <DialogContent className="p-6 mt-11 space-y-6 bg-white rounded-b-xl overflow-y-auto">
        <Grid container spacing={4} alignItems="stretch">
          {/* Restaurant Image */}
          <Grid item xs={12} sm={4}>
            <div className="rounded-lg overflow-hidden shadow-lg h-full">
              <img
                src={restaurant.thumbnail_photo}
                alt={restaurant.name}
                className="w-full h-full object-cover transition-transform transform"
              />
            </div>
          </Grid>

          {/* Restaurant Details */}
          <Grid item xs={12} sm={8} className="flex flex-col justify-between">
            {/* About Section */}
            <div className="bg-gray-50 p-4 rounded-lg shadow-md mb-4 flex-1">
              <Typography
                variant="h6"
                className="font-semibold text-gray-800 mb-2"
              >
                About the Restaurant
              </Typography>
              <Typography variant="body2" className="text-gray-700">
                {restaurant.about}
              </Typography>
            </div>

            <Divider className="my-4" />

            {/* Contact Section */}
            <div className="bg-gray-50 p-4 rounded-lg shadow-md mb-4 flex-1">
              <Typography
                variant="h6"
                className="font-semibold text-gray-800 mb-2"
              >
                Contact Details
              </Typography>
              <div className="space-y-2">
                <Typography variant="body2" className="text-gray-700">
                  <strong>Phone:</strong> {restaurant.contact_number}
                </Typography>
                <Typography variant="body2" className="text-gray-700">
                  <strong>Contact Person:</strong>{" "}
                  {restaurant.contact_person_name} -{" "}
                  {restaurant.contact_person_position}
                </Typography>
              </div>
            </div>

            <Divider className="my-4" />

            {/* Additional Information Section */}
            <div className="bg-gray-50 p-4 rounded-lg shadow-md mb-4 flex-1">
              <Typography
                variant="h6"
                className="font-semibold text-gray-800 mb-2"
              >
                Additional Information
              </Typography>
              <div className="space-y-2">
                <Typography variant="body2" className="text-gray-700">
                  <strong>Category:</strong> {restaurant.restaurant_category}
                </Typography>
                <Typography variant="body2" className="text-gray-700">
                  <strong>Location:</strong> {restaurant.location}
                </Typography>
                <Typography variant="body2" className="text-gray-700">
                  <strong>Country:</strong> {restaurant.country}
                </Typography>
                <Typography variant="body2" className="text-gray-700">
                  <strong>Average Budget:</strong> {restaurant.avg_budget}
                </Typography>
                <Typography variant="body2" className="text-gray-700">
                  <strong>Average Rating:</strong> {restaurant.avg_rating}
                </Typography>
                <Typography variant="body2" className="text-gray-700">
                  <strong>Subscription:</strong> {restaurant.subscription}
                </Typography>
              </div>
            </div>

            <Divider className="my-4" />

            {/* Status Section */}
            <div className="bg-gray-50 p-4 rounded-lg shadow-md mb-4 flex-1">
              <Typography
                variant="h6"
                className="font-semibold text-gray-800 mb-2"
              >
                Status
              </Typography>
              <Typography
                variant="body2"
                className={`text-sm font-medium ${
                  restaurant.isActive ? "text-green-600" : "text-red-600"
                }`}
              >
                {restaurant.isActive ? "Active" : "Inactive"}
              </Typography>
            </div>
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button
          onClick={onClose}
          color="primary"
          variant="contained"
          className="bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg px-6 py-2"
        >
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default RestaurantDetailsModal;
