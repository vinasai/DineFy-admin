import React, { useState } from "react";
import {
  Card,
  CardContent,
  CardMedia,
  Typography,
  Chip,
  Grid,
  IconButton,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import EditRestaurantModal from "./_components/EditRestaurantModal"; // Import the modal component

interface Restaurant {
  id: number;
  name: string;
  description: string;
  address: string;
  country: string;
  imageUrl: string;
  isActive: boolean;
}

// Sample Data
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

const Restaurants = () => {
  const [open, setOpen] = useState(false);
  const [currentRestaurant, setCurrentRestaurant] = useState<Restaurant | null>(
    null
  );

  const handleEditClick = (restaurant: Restaurant) => {
    setCurrentRestaurant(restaurant);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setCurrentRestaurant(null);
  };

  const handleSave = (updatedRestaurant: Restaurant) => {
    // Update your state or make API call to save changes
    console.log("Updated Restaurant:", updatedRestaurant);
    handleClose();
  };

  return (
    <div className="flex justify-center">
      <Card className="shadow-lg w-full max-w-5xl mt-4">
        <CardContent>
          <Typography variant="h5" component="h2" gutterBottom>
            Restaurant List
          </Typography>
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
                      {restaurant.description.slice(0,75)}..
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

      {/* Edit Modal */}
      <EditRestaurantModal
        open={open}
        restaurant={currentRestaurant}
        onClose={handleClose}
        onSave={handleSave}
      />
    </div>
  );
};

export default Restaurants;
