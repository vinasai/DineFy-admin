import React, { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  Typography,
  Box,
  IconButton,
  TextField,
  CircularProgress,
  Divider,
  CardMedia, 
} from "@mui/material";
import { DeleteOutline } from "@mui/icons-material";
import PhoneIcon from "@mui/icons-material/Phone";
import EmailIcon from "@mui/icons-material/Email";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import FlagIcon from "@mui/icons-material/Flag";
import EditRestaurantModal from "./_components/EditRestaurantModal";
import { useFetchOwnerDataByIdMutation, useFetchRestaurantDataByIdMutation } from "@/redux/api/owner/ownerApi";
import { useParams } from "react-router-dom";
import { Visibility, VisibilityOff } from "@mui/icons-material";

interface Restaurant {
  id: number;
  name: string;
  description: string;
  address: string;
  country: string;
  imageUrl: string;
  isActive: boolean;
  location: any;
  thumbnail_photo: string;
  about: string;
}

interface Owner {
  name: string;
  contact_no: string;
  country: string;
  address: string;
  email: string;
  password: string;
}

const Restaurants = () => {
  const { id } = useParams();
  const [ownerDetails, setOwnerDetails] = useState<Owner | null>(null);
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [fetchOwnerDataById] = useFetchOwnerDataByIdMutation();
  const [fetchRestaurantDataById] = useFetchRestaurantDataByIdMutation();
  const [open, setOpen] = useState(false);
  const [currentRestaurant, setCurrentRestaurant] = useState<Restaurant | null>(null);

  // Password visibility state
  const [passwordVisible, setPasswordVisible] = useState(false);

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

  const handleTogglePasswordVisibility = () => {
    setPasswordVisible(!passwordVisible);
  };

  const deleteRestaurant = (restaurant: Restaurant) => {
    console.log("Deleted Restaurant:", restaurant);
  };

  useEffect(() => {
    const fetchOwnerData = async () => {
      setIsLoading(true); // Assuming you have isLoading state to show a loading indicator
      try {
        const response = await fetchOwnerDataById({ id }).unwrap();
        if (response && response.length > 0) {
          setOwnerDetails(response[0]); // Set owner data
          console.log("Fetched Owner Data:", response[0]);

          // If the response contains multiple restaurants, fetch data for each restaurant
          const restaurantIds = response[0].restaurants.map((restaurant: any) => restaurant.id);
          const restaurantPromises = restaurantIds.map((restaurantId: string) =>
            fetchRestaurantDataById({ id: restaurantId }).unwrap()
          );

          // Wait for all restaurant fetch requests to complete
          const restaurantData = await Promise.all(restaurantPromises);
          console.log("Fetched Restaurant Data:", restaurantData);
          setRestaurants(restaurantData.flat());

          console.log("Combined Data:", { ownerDetails, restaurants });
        }

      } catch (error) {
        console.error("Error fetching owner or restaurant data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchOwnerData();
  }, [id]);

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

  return (
    <div className="flex justify-center">
      <Card className="shadow-lg w-full max-w-5xl mt-4 p-4 bg-gray-50">
        <CardContent>
          {/* Owner Details Section */}
          <Card className="shadow-xl w-full bg-gradient-to-r from-[#f3f4f6] via-[#e0e0e0] to-[#ffffff] rounded-lg mb-8">
            <CardContent>
              {/* Owner Header */}
              <Box className="flex flex-col items-center md:items-start mb-6">
                <Typography
                  variant="h5"
                  component="h2"
                  gutterBottom
                  className="text-gray-800 font-semibold text-xl"
                >
                  {ownerDetails?.name}
                </Typography>
                <Typography variant="body2" color="text.secondary" className="text-sm">
                  Restaurant Owner
                </Typography>
              </Box>

              {/* Owner Information */}
              <Box className="space-y-3">
                {/* Contact Information */}
                <Box className="flex items-center space-x-2">
                  <PhoneIcon fontSize="small" className="text-blue-500" />
                  <Typography variant="body2" color="text.secondary">
                    {ownerDetails?.contact_no}
                  </Typography>
                </Box>

                {/* Email */}
                <Box className="flex items-center space-x-2">
                  <EmailIcon fontSize="small" className="text-green-500" />
                  <Typography variant="body2" color="text.secondary">
                    {ownerDetails?.email}
                  </Typography>
                </Box>

               

                {/* Address */}
                <Box className="flex items-center space-x-2">
                  <LocationOnIcon fontSize="small" className="text-red-500" />
                  <Typography variant="body2" color="text.secondary">
                    {ownerDetails?.address}
                  </Typography>
                </Box>

                {/* Country */}
                <Box className="flex items-center space-x-2">
                  <FlagIcon fontSize="small" className="text-yellow-500" />
                  <Typography variant="body2" color="text.secondary">
                    {ownerDetails?.country}
                  </Typography>
                </Box>
              </Box>
              <Divider className="my-4" sx={{ borderColor: "#e0e0e0", marginTop:"35px"}} />

              <Typography variant="h6" color="text.secondary" sx={{ marginTop:"15px" }}>
                    Owner Login Credentials
                  </Typography>

              <Box className="mt-6 space-y-3">
              {/* Email (Login) */}
              <Box className="flex items-center space-x-2">
                
                <Typography variant="body2" color="text.secondary">
                  <strong>Email:</strong> {ownerDetails?.email}
                </Typography>
              </Box>

      
    
               {/* Password */}
               <Box className="flex items-center space-x-2">
                  <Typography variant="body2" color="text.secondary">
                    Password:
                  </Typography>
                  <TextField
                    type={passwordVisible ? "text" : "password"}
                    value={ownerDetails?.password || ""}
                    variant="outlined"
                    size="small"
                    InputProps={{
                      endAdornment: (
                        <IconButton onClick={handleTogglePasswordVisibility} edge="end">
                          {passwordVisible ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      ),
                    }}
                    fullWidth
                    disabled
                  />
                </Box>
                </Box>

            </CardContent>
          </Card>

          {/* Restaurant List Section */}
          {/* Restaurant List Section */}
<Typography
  variant="h5"
  component="h2"
  gutterBottom
  className="text-gray-700"
>
  Restaurant List
</Typography>
{restaurants?.length === 0 ? (
  <p>No restaurants found.</p>
) : (
  <Box display="flex" flexWrap="wrap" gap={4}>
    {restaurants.map((restaurant) => (
      <Box
        key={restaurant.id}
        sx={{
          width: { xs: "100%", sm: "48%", md: "30%" }, // Responsive width for different screen sizes
          marginBottom: 4,
        }}
      >
        <Card className="shadow-xl hover:shadow-2xl transition-shadow duration-300 transform hover:scale-101">
          <CardMedia
            component="img"
            height="250"
            image={restaurant?.thumbnail_photo}
            alt={restaurant?.name}
            style={{
              objectFit: "cover",
              borderTopLeftRadius: "10px",
              borderTopRightRadius: "10px",
            }}
          />
          <CardContent className="p-4">
            <Typography
              variant="h6"
              gutterBottom
              className="font-semibold text-xl text-gray-800 hover:text-red-500 transition-colors duration-200"
            >
              {restaurant.name}
            </Typography>
            <Typography
              variant="body2"
              color="text.secondary"
              paragraph
              style={{
                height: "50px",
                overflow: "hidden",
                color: "#555",
                fontSize: "0.9rem",
              }}
            >
              {restaurant.about?.length > 75
                ? restaurant.about.slice(0, 60) + "..."
                : restaurant.about}
            </Typography>
            <Typography variant="body2" color="text.secondary" className="mb-3 text-gray-600">
              <strong>Address:</strong> {restaurant.location}
            </Typography>
            {/*}
            <div className="flex justify-between items-center">
              <div className="flex items-center mt-4">
                <Typography variant="body2" color="black" className="font-semibold text-red-600 mr-6">
                  Remove
                </Typography>
                <IconButton
                  color="error"
                  size="small"
                  className="ml-auto"
                  onClick={() => deleteRestaurant(restaurant)}
                >
                  <DeleteOutline />
                </IconButton>
              </div>
            </div>
            */}
          </CardContent>
        </Card>
      </Box>
    ))}
  </Box>
)}

        </CardContent>
      </Card>

      {/* Edit Modal 
      <EditRestaurantModal
        open={open}
        restaurant={currentRestaurant}
        onClose={handleClose}
        onSave={handleSave}
      />
      */}
    </div>
  );
};

export default Restaurants;
