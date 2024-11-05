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
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";
import EditRestaurantModal from "./_components/EditRestaurantModal";
import HotelSearch from "./_components/maps/HotelSearch";

interface Restaurant {
  id: number;
  name: string;
  description: string;
  address: string;
  country: string;
  imageUrl: string;
  isActive: boolean;
}

const sampleRestaurants: Restaurant[] = [
  {
    id: 1,
    name: "The Grand Hotel",
    description: "A luxurious hotel with stunning views and exquisite dining.",
    address: "123 Main St, Cityville",
    country: "USA",
    imageUrl:
      "https://images.pexels.com/photos/1058277/pexels-photo-1058277.jpeg?auto=compress&cs=tinysrgb&w=600",
    isActive: true,
  },
  {
    id: 2,
    name: "Ocean View Resort",
    description: "Relax by the beach and enjoy our world-class amenities.",
    address: "456 Beach Blvd, Coastal Town",
    country: "Canada",
    imageUrl:
      "https://images.pexels.com/photos/1581554/pexels-photo-1581554.jpeg?auto=compress&cs=tinysrgb&w=600",
    isActive: false,
  },
  {
    id: 3,
    name: "Mountain Retreat",
    description: "Escape to the mountains for a peaceful getaway.",
    address: "789 Mountain Rd, Hilltop",
    country: "USA",
    imageUrl:
      "https://images.pexels.com/photos/239975/pexels-photo-239975.jpeg?auto=compress&cs=tinysrgb&w=600",
    isActive: true,
  },
];

const Restaurant = () => {
  const [open, setOpen] = useState(false);
  const [newRestaurantOpen, setNewRestaurantOpen] = useState(false);
  const [currentRestaurant, setCurrentRestaurant] = useState<Restaurant | null>(
    null
  );
  const [newRestaurant, setNewRestaurant] = useState<any>({
    id: 0, // ID would be generated in a real application
    name: "",
    description: "",
    address: "",
    country: "",
    imageUrl: "",
    isActive: true,
  });

  const handleEditClick = (restaurant: Restaurant) => {
    setCurrentRestaurant(restaurant);
    setOpen(true);
  };

  const handleNewRestaurantOpen = () => {
    setNewRestaurantOpen(true);
  };

  const handleNewRestaurantClose = () => {
    setNewRestaurantOpen(false);
    setNewRestaurant({
      id: 0,
      name: "",
      description: "",
      address: "",
      country: "",
      imageUrl: "",
      isActive: true,
    });
  };

  const handleSaveNewRestaurant = () => {
    console.log("New Restaurant Data:", newRestaurant);
    handleNewRestaurantClose();
  };

  // This function will be called when a hotel is selected
  // const handleSelectHotel = (hotel: any) => {
  //   setNewRestaurant({
  //     ...newRestaurant,
  //     name: hotel.name,
  //     address: hotel.vicinity,
  //     // Optionally, set country based on the hotel or leave it as is
  //     country: "Canada", // Or derive it based on the hotel data
  //     imageUrl: hotel?.photos?.[0]?.getUrl() || "", // Assume the first photo URL (may need adjustment)
  //   });
  // };

  return (
    <div className="flex justify-center">
      <Card className="shadow-lg w-full max-w-5xl mt-4">
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
            {sampleRestaurants.map((restaurant) => (
              <Grid item xs={12} sm={6} md={4} key={restaurant.id}>
                <Card className="shadow-md h-[450px] hover:shadow-xl transition-shadow duration-200">
                  <CardMedia
                    component="img"
                    height="200"
                    image={restaurant.imageUrl}
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
                      {restaurant.description.slice(0, 75)}..
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      <strong>Address:</strong> {restaurant.address}
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
      <Dialog open={newRestaurantOpen} onClose={handleNewRestaurantClose}>
        <DialogTitle>Add New Restaurant</DialogTitle>
        <DialogContent>
          {/* Integrating Hotel Search */}
          <HotelSearch />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleNewRestaurantClose} color="secondary">
            Cancel
          </Button>
          <Button onClick={handleSaveNewRestaurant} color="primary">
            Save
          </Button>
        </DialogActions>
      </Dialog>

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
    </div>
  );
};

export default Restaurant;
