import React, { useState, useMemo, useEffect } from "react";
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
  Box,
  TextField, 
  InputAdornment
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";
import VisibilityIcon from "@mui/icons-material/Visibility";
import   Search  from "@mui/icons-material/Search";

import { supabase } from "@/api/client";
import RestaurantDetails from "./_components/RestaurantDetails";
import DeleteConfirmationModal from "./_components/DeleteConfirmationModal"; // Import the modal
import { useGetAllRestaurantApiQuery } from "@/redux/api/restaurant/restaurantApiSlice";
import AddRestaurant from "./_components/AddRestaurant";
import EditRestaurantModal from "./_components/EditRestaurantModal";
import { debounce } from "lodash";

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
  google_api_fetched: boolean;
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
  const [restaurantNameSearch, setRestaurantNameSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState(restaurantNameSearch);

  const {
    data: restaurants,
    isLoading,
    isError,
    refetch,
  } = useGetAllRestaurantApiQuery("",  {
    refetchOnMountOrArgChange: true, 
  });

    // Debounce the search input
    const debouncedSearchHandler = useMemo(
      () => debounce((value) => setDebouncedSearch(value), 300),
      []
    );

    useEffect(() => {
      debouncedSearchHandler(restaurantNameSearch);
    }, [restaurantNameSearch, debouncedSearchHandler]);

    
    interface FilteredRestaurant extends Restaurant {}

    const filteredRestaurants: FilteredRestaurant[] = restaurants?.filter((restaurant: Restaurant) =>
      debouncedSearch === ""
        ? true
        : restaurant.name.toLowerCase().includes(debouncedSearch.toLowerCase())
    ) || [];

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
      refetch();
      setDeleteModalOpen(false);
      setRestaurantToDelete(null);
      
    }
  };

  if (isLoading) {
    return (
      <Box
        className="flex flex-col items-center justify-center min-h-screen text-center bg-gray-100 p-10"
        sx={{ animation: "fadeIn 0.6s ease-in-out" }}
      >
        <CircularProgress
          size={80}
          thickness={5}
          className="text-blue-500 mb-6"
        />
        <Typography variant="h6" component="p" className="text-gray-700 mb-2">
          Please wait, loading data...
        </Typography>
        <Typography
          variant="body2"
          component="p"
          className="text-gray-500 animate-pulse"
        >
          This might take a few seconds.
        </Typography>
      </Box>
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
          {/* Search Bar */}
      <Box sx={{ mb: 2, display: 'flex', justifyContent: 'flex-end' }}>
        <TextField
          placeholder="Search restaurants..."
          variant="outlined"
          size="small"
          value={restaurantNameSearch}
          onChange={(e) => setRestaurantNameSearch(e.target.value)}
          sx={{ width: 300}}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start" >
                <Search />
              </InputAdornment>
            ),
          }}
        />
      </Box>
      {  filteredRestaurants.length > 0 ? (
        <Grid container spacing={4}>
        {filteredRestaurants.map((restaurant) => (
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
                <div className="flex items-center justify-between flex-row">
                <Typography variant="h6" gutterBottom>
                  {restaurant.name}
                </Typography>
                {restaurant.google_api_fetched && (
                  <Chip
                    label="Google Api Fetched"
                    color="success"
                  
                  />
                )}
                </div>
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
      ): (
        <div className="flex justify-center items-center mt-4">
          <Typography>No results found.</Typography>
        </div>
      )
      }
          
        </CardContent>
      </Card>

      {/* Add New Restaurant Modal */}
      <AddRestaurant
        open={newRestaurantOpen}
        onClose={handleNewRestaurantClose}
        onSave={(_newRestaurant) => {
          refetch();
        }}
      />

      {/* Edit Modal */}
      <EditRestaurantModal
        open={open}
        restaurant={currentRestaurant}
        onClose={() => setOpen(false)}
        //refetch={refetch}
        onSave={(_updatedRestaurant) => {
          refetch();    
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
