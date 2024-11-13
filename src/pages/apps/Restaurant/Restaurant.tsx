import React, { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardMedia,
  Typography,
  Chip,
  Grid,
  IconButton,
  Button,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";
import VisibilityIcon from "@mui/icons-material/Visibility"; // For "View" button
import EditRestaurantModal from "./_components/EditRestaurantModal";
import AddRestaurant from "./_components/AddRestaurant";
import { supabase } from "@/api/client";
import RestaurantDetails from "./_components/RestaurantDetails";

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
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [open, setOpen] = useState(false);
  const [newRestaurantOpen, setNewRestaurantOpen] = useState(false);
  const [currentRestaurant, setCurrentRestaurant] = useState<Restaurant | null>(
    null
  );
  const [viewRestaurantOpen, setViewRestaurantOpen] = useState(false);

  // Fetch data from Supabase
  useEffect(() => {
    const fetchRestaurants = async () => {
      const { data: restaurant, error } = await supabase
        .from("restaurant")
        .select("*");

      if (error) {
        console.error("Failed to fetch restaurants:", error.message);
      } else if (restaurant) {
        setRestaurants(restaurant);
      }
    };
    fetchRestaurants();
  }, []);

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

  const handleSaveNewRestaurant = (newRestaurant: Restaurant) => {
    console.log("New Restaurant Data:", newRestaurant);
    setNewRestaurantOpen(false);
  };

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
                    height="200"
                    image={restaurant.thumbnail_photo}
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
                      {restaurant.about.slice(0, 75)}..
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
                        <IconButton color="secondary" size="small">
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
        onSave={handleSaveNewRestaurant}
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
    </div>
  );
};

export default Restaurant;
