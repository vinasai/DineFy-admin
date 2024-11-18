import React, { useState } from "react";
import {
  Card,
  CardContent,
  CardMedia,
  Typography,
  Chip,
  Grid,
  IconButton,
  Button,
  CircularProgress,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";
import VisibilityIcon from "@mui/icons-material/Visibility";

import { supabase } from "@/api/client";
import RestaurantDetails from "./_components/RestaurantDetails";
import DeleteConfirmationModal from "./_components/DeleteConfirmationModal"; // Import the modal
import { useGetRestaurantApiQuery } from "@/redux/api/restaurant/restaurantApiSlice";
import AddRestaurant from "./_components/AddRestaurant";
import EditRestaurantModal from "./_components/EditRestaurantModal";

interface Restaurant {
  id: string;
  name: string;
  about: string;
  location: string;
  country: string;
  thumbnail_photo: string;
  contact_number: string;
  contact_person_name: string;
  contact_person_position: string;
  restaurant_category: string;
  avg_budget: string;
  avg_rating: number;
  subscription: string;
  isActive: boolean;
}

const Restaurant = () => {
  const [open, setOpen] = useState(false);
  const [newRestaurantOpen, setNewRestaurantOpen] = useState(false);
  const [currentRestaurant, setCurrentRestaurant] = useState<any>(null);
  const [viewRestaurantOpen, setViewRestaurantOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false); // Delete modal state
  const [restaurantToDelete, setRestaurantToDelete] = useState<string | null>(
    null
  ); // Selected restaurant ID for deletion

  const {
    data: restaurants,
    isLoading,
    isError,
  } = useGetRestaurantApiQuery("");

  const handleEditClick = (restaurant: Restaurant) => {
    setCurrentRestaurant(restaurant);
    setOpen(true);
  };

  const handleViewClick = (restaurant: Restaurant) => {
    setCurrentRestaurant(restaurant);
    setViewRestaurantOpen(true);
  };

  const handleNewRestaurantOpen = () => {
    setNewRestaurantOpen(true);
  };

  const handleNewRestaurantClose = () => {
    setNewRestaurantOpen(false);
  };

  const handleDeleteClick = (id: string) => {
    setRestaurantToDelete(id); // Set the selected restaurant ID
    setDeleteModalOpen(true); // Open confirmation modal
  };

  const handleConfirmDelete = async () => {
    if (restaurantToDelete) {
      const { error } = await supabase
        .from("restaurant")
        .delete()
        .eq("id", restaurantToDelete); // Use 'id' as the column and 'restaurantToDelete' as the value

      if (error) {
        console.error("Failed to delete restaurant:", error.message);
      } else {
        // Remove the deleted restaurant from state to update the UI
        // Assuming the data comes from the API, you can handle the state update by refetching.
      }
      // Close the delete modal and reset the restaurantToDelete state
      setDeleteModalOpen(false);
      setRestaurantToDelete(null);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center mt-4">
        <CircularProgress />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex justify-center items-center mt-4">
        <Typography color="error">Failed to load data.</Typography>
      </div>
    );
  }

  if (!restaurants || restaurants.length === 0) {
    return (
      <div className="flex justify-center items-center mt-4">
        <Typography>No data available</Typography>
      </div>
    );
  }

  return (
    <div className="flex justify-center">
      <Card className="shadow-lg w-full mt-4">
        <CardContent>
          <div className="flex justify-between items-center mb-4">
            <Typography variant="h5" component="h2" gutterBottom>
              Restaurant List
            </Typography>
            <Button
              variant="contained"
              color="primary"
              startIcon={<AddIcon />}
              onClick={handleNewRestaurantOpen}
            >
              Add New Restaurant
            </Button>
          </div>
          <Grid container spacing={4}>
            {restaurants.map((restaurant) => (
              <Grid item xs={12} sm={6} md={4} key={restaurant.id}>
                <Card className="shadow-md hover:shadow-xl transition-shadow duration-200">
                  <CardMedia
                    component="img"
                    className="w-64 h-64"
                    image={
                      restaurant.thumbnail_photo ||
                      "https://t4.ftcdn.net/jpg/05/65/22/41/360_F_565224180_QNRiRQkf9Fw0dKRoZGwUknmmfk51SuSS.jpg"
                    }
                    alt={restaurant.name}
                    style={{ objectFit: "cover" }}
                  />
                  <CardContent>
                    <Typography variant="h6" gutterBottom>
                      {restaurant.name}
                    </Typography>
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      paragraph
                      style={{ height: "60px", overflow: "hidden" }}
                    >
                      {restaurant.about?.slice(0, 75) ||
                        "No descriptions available"}
                      ..
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      <strong>Address:</strong> {restaurant.location}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      <strong>Country:</strong> {restaurant.country}
                    </Typography>
                    <div className="flex items-center justify-between mt-4">
                      <Chip
                        label={restaurant.isActive ? "Active" : "Inactive"}
                        color={restaurant.isActive ? "success" : "error"}
                        variant="outlined"
                      />
                      <div>
                        <IconButton
                          color="primary"
                          size="small"
                          onClick={() => handleEditClick(restaurant)}
                        >
                          <EditIcon />
                        </IconButton>
                        <IconButton
                          color="primary"
                          size="small"
                          onClick={() => handleViewClick(restaurant)}
                        >
                          <VisibilityIcon />
                        </IconButton>
                        <IconButton
                          color="secondary"
                          size="small"
                          onClick={() => handleDeleteClick(restaurant.id)}
                        >
                          <DeleteIcon />
                        </IconButton>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </CardContent>
      </Card>

      {/* Add New Restaurant Modal */}
      <AddRestaurant
        open={newRestaurantOpen}
        onClose={handleNewRestaurantClose}
        onSave={(newRestaurant) => {
          console.log("New Restaurant Data:", newRestaurant);
          setNewRestaurantOpen(false);
        }}
      />

      {/* Edit Modal */}
      <EditRestaurantModal
        open={open}
        restaurant={currentRestaurant}
        onClose={() => setOpen(false)}
        onSave={(updatedRestaurant) => {
          console.log("Updated Restaurant:", updatedRestaurant);
          setOpen(false);
        }}
      />

      {/* Restaurant Details Modal */}
      <RestaurantDetails
        open={viewRestaurantOpen}
        restaurant={currentRestaurant}
        onClose={() => setViewRestaurantOpen(false)}
      />

      {/* Delete Confirmation Modal */}
      <DeleteConfirmationModal
        open={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        onConfirm={handleConfirmDelete}
      />
    </div>
  );
};

export default Restaurant;
