import React, { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  IconButton,
  TextField,
  Autocomplete,
  Box,
  Typography,
  Card,
  CardContent,
  DialogContentText,
  Switch,
  FormControlLabel,
  Select,
  MenuItem,
  SelectChangeEvent
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import { useGetRestaurantApiQuery } from "@/redux/api/restaurant/restaurantApiSlice";
import {useUpdateOwnerApiMutation } from "@/redux/api/owner/ownerApi";

// Restaurant interface
interface Restaurant {
  id: string;
  name: string;
  location: string;
  isRemovedExisting?: boolean; // Flag to mark existing restaurants for removal
  isNewlyAdded?: boolean; // Flag to indicate newly added restaurants
}

// Owner data interface
interface EditOwnerProps {
  ownerData: {
    id: string;
    name: string;
    email: string;
    contact_no: string;
    country: string;
    address: string;
    restaurants: Restaurant[];
    plan: 'Free' | 'VIP';
  };
  onClose: () => void;
  onSave: (updatedOwner: any) => void;
  refetch: () => void;
}

const EditOwner: React.FC<EditOwnerProps> = ({
  ownerData,
  onClose,
  onSave,
  refetch,
}) => {
  // State for edited data
  const [editedData, setEditedData] = useState({
    ...ownerData,
    restaurants: ownerData.restaurants.map(restaurant => ({
      ...restaurant,
    }))
  });

  // State for confirmation modal
  const [isConfirmationOpen, setIsConfirmationOpen] = useState(false);
  const [plan, setPlan] = useState<'Free' | 'VIP'>(ownerData.plan);

  const [updateOwner] = useUpdateOwnerApiMutation();

  

  const { data: restaurantOptions,  isFetching } = useGetRestaurantApiQuery("", {
    refetchOnMountOrArgChange: true, // Ensures fresh data on every mount
  });

  // Handle changes to owner fields
const handleTextFieldChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
  const { name, value } = e.target;
  setEditedData({ ...editedData, [name]: value });
};

const handleSelectChange = (e: SelectChangeEvent<string>) => {
  const { name, value } = e.target;
  setEditedData({ ...editedData, [name]: value });
};

  // Handle changes to restaurant fields
  const handleRestaurantChange = (
    index: number,
    field: keyof Restaurant,
    value: string
  ) => {
    const updatedRestaurants = [...editedData.restaurants];
    const updatedRestaurant = { ...updatedRestaurants[index], [field]: value };
    updatedRestaurants[index] = updatedRestaurant;
    setEditedData({ ...editedData, restaurants: updatedRestaurants });
  };

  const handlePlanChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newPlan = event.target.checked ? 'VIP' : 'Free';
    setPlan(newPlan);
    setEditedData({ ...editedData, plan: newPlan });

  };

  // Handle restaurant removal
  const handleRemoveRestaurant = (index: number) => {
    const updatedRestaurants = [...editedData.restaurants];
    
    // For existing restaurants, mark them for removal
    if (updatedRestaurants[index].isNewlyAdded) {
      // Remove newly added restaurants completely
      updatedRestaurants.splice(index, 1);
    } else if (!updatedRestaurants[index].id) {
      // Remove restaurants without an ID
      updatedRestaurants.splice(index, 1);
    } else {
      // For existing restaurants, toggle removal status
      updatedRestaurants[index].isRemovedExisting = 
        !updatedRestaurants[index].isRemovedExisting;
    }

    setEditedData({ ...editedData, restaurants: updatedRestaurants });
  };

  // Add a new restaurant
  const handleAddRestaurant = () => {
    setEditedData({
      ...editedData,
      restaurants: [
        ...editedData.restaurants, 
        { 
          id: "", 
          name: "", 
          location: "", 
          isNewlyAdded: true // Mark as newly added
        }
      ],
    });
  };

  // Initial save handler
  const handleSave = () => {
    // Check if any existing restaurants are marked for removal
    const removedExistingRestaurants = editedData.restaurants.filter(
      restaurant => restaurant.isRemovedExisting && restaurant.id
    );

    if (removedExistingRestaurants.length > 0) {
      // Open confirmation modal
      setIsConfirmationOpen(true);
    } else {
      // Proceed with saving
      performSave();
    }
  };

  // Actual save logic
  const performSave = async () => {
    // Filter out restaurants marked for removal
    try{
    const restaurantsToSave = editedData.restaurants
      .filter(restaurant => !restaurant.isRemovedExisting)
      .map(({ isRemovedExisting, isNewlyAdded, ...rest }) => rest);

    onSave({ 
      ...editedData, 
      restaurants: restaurantsToSave 
    });
    const newData = {
      id: editedData?.id,
      name: editedData.name,
      email: editedData.email,
      country: editedData.country,
      address: editedData.address,
      contact_no: editedData.contact_no,
      plan: plan,
      restaurant_details: restaurantsToSave,
      active: true,
    };
    console.log(newData);
    await updateOwner(newData).unwrap();
    refetch();
  }
    catch (error: any) {
    console.error("Update Owner API Error:", error);
    alert(`Failed to update owner: ${error.data || error.statusText}`);
  }
  finally{
    onClose();}

  };

  // Confirm removal of existing restaurants
  const handleConfirmRemoval = () => {
    // Close confirmation modal and proceed with save
    setIsConfirmationOpen(false);
    performSave();
  };

  // Cancel removal of existing restaurants
  const handleCancelRemoval = () => {
    // Close confirmation modal
    setIsConfirmationOpen(false);
  };

  return (
    <>
      <Dialog open onClose={onClose} fullWidth maxWidth="sm">
        <DialogTitle>Edit Owner</DialogTitle>
        <DialogContent>
          {/* Owner Personal Information */}
          <div>
            <label htmlFor="name">Name:</label>
            <TextField
              id="name"
              name="name"
              value={editedData.name}
              onChange={handleTextFieldChange}
              fullWidth
              margin="dense"
            />
          </div>
          <div>
            <label htmlFor="email">Email:</label>
            <TextField
              id="email"
              name="email"
              value={editedData.email}
              onChange={handleTextFieldChange}
              fullWidth
              margin="dense"
            />
          </div>
          <div>
            <label htmlFor="contact_no">Contact:</label>
            <TextField
              id="contact_no"
              name="contact_no"
              value={editedData.contact_no}
              onChange={handleTextFieldChange}
              fullWidth
              margin="dense"
            />
          </div>
          <div>
            <label htmlFor="country">Country:</label>
          <Select
            id="country"
            name="country"
            value={editedData.country}
            onChange={handleSelectChange}
            fullWidth
            margin="dense"
          >
            <MenuItem value="Canada">Canada</MenuItem>
            <MenuItem value="Sri Lanka">Sri Lanka</MenuItem>
          </Select>
        </div>
          <div>
            <label htmlFor="address">Address:</label>
            <TextField
              id="address"
              name="address"
              value={editedData.address}
              onChange={handleTextFieldChange}
              fullWidth
              margin="dense"
            />
          </div>

          <Box sx={{  mb: 2 }}>
            <label htmlFor="address">Plan:</label>
            <br />
            <FormControlLabel
              control={
                <Switch
                  checked={plan === 'VIP'}
                  onChange={handlePlanChange}
                  color="primary"
                />
              }
              label={`${plan}`}
            />
          </Box>

          <Box sx={{ mt: 2 }}>
            <Typography variant="h6" gutterBottom>
              Restaurants
            </Typography>
            {(editedData.restaurants || []).map((restaurant, index) => (
              <Card
                key={index}
                variant="outlined"
                sx={{
                  mb: 2,
                  "&:last-child": { mb: 0 },
                  transition: "box-shadow 0.3s",
                  opacity: restaurant?.isRemovedExisting ? 0.5 : 1,
                  border: restaurant?.isRemovedExisting
                    ? "1px dashed red"
                    : "1px solid rgba(0, 0, 0, 0.23)",
                }}
              >
                <CardContent>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 2 }}>
                    {restaurant?.id && !restaurant?.isNewlyAdded ? (
                      <TextField
                        fullWidth
                        label="Restaurant"
                        value={restaurant.name}
                        disabled
                        variant="outlined"
                      />
                    ) : (
                      <Autocomplete
                        fullWidth
                        disabled={restaurant?.isRemovedExisting}
                        options={
                          restaurantOptions
                            ? restaurantOptions.filter(
                                (option) =>
                                  !editedData.restaurants.some(
                                    (r) => r.name === option.name
                                  )
                              )
                            : []
                        }
                        getOptionLabel={(option) => option.name || ""}
                        value={
                          restaurantOptions?.find(
                            (option) => option.name === restaurant.name
                          ) || null
                        }
                        onChange={(_, selectedRestaurant) => {
                          if (!restaurant.isRemovedExisting && selectedRestaurant) {
                            // Update all three fields at once
                            const updatedRestaurants = [...editedData.restaurants];
                            updatedRestaurants[index] = {
                              ...updatedRestaurants[index],
                              id: selectedRestaurant.id,
                              name: selectedRestaurant.name,
                              location: selectedRestaurant.location,
                              isNewlyAdded: true
                            };
                            setEditedData({
                              ...editedData,
                              restaurants: updatedRestaurants
                            });
                          }
                        }}
                        renderInput={(params) => (
                          <TextField
                            {...params}
                            label="Restaurant"
                            variant="outlined"
                            disabled={restaurant.isRemovedExisting}
                          />
                        )}
                      />
                    )}
                    <IconButton
                      color={restaurant.isRemovedExisting ? "default" : "error"}
                      onClick={() => handleRemoveRestaurant(index)}
                      sx={{
                        height: "50px",
                        width: "50px",
                        transition: "background-color 0.3s",
                      }}
                    >
                      {restaurant.isRemovedExisting ? <AddIcon /> : <RemoveIcon />}
                      
                    </IconButton>
                  </Box>
                  {(restaurant.isNewlyAdded || !restaurant.id) ? (
                    <TextField
                      fullWidth
                      label="Location"
                      variant="outlined"
                      value={restaurant.location}
                      disabled={restaurant.isRemovedExisting}
                      onChange={(e) =>
                        handleRestaurantChange(index,"location", e.target.value)
                      }
                    />
                  ) : (
                    <TextField
                      fullWidth
                      label="Location"
                      variant="outlined"
                      value={restaurant.location}
                      disabled
                    />
                  )}
                </CardContent>
              </Card>
            ))}

            <Button
              onClick={handleAddRestaurant}
              variant="contained"
              color="primary"
              fullWidth
              startIcon={<AddIcon />}
              sx={{
                mt: 2,
                py: 1.5,
                transition: "background-color 0.3s",
                "&:hover": {
                  backgroundColor: "primary.dark",
                },
              }}
            >
              Add Another Restaurant
            </Button>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose} color="secondary">
            Cancel
          </Button>
          <Button onClick={handleSave} color="primary">
            Save
          </Button>
        </DialogActions>
      </Dialog>

      {/* Confirmation Dialog */}
      <Dialog
        open={isConfirmationOpen}
        onClose={handleCancelRemoval}
      >
        <DialogTitle>Confirm Restaurant Removal</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to remove the selected restaurants and save? 
            This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCancelRemoval} color="primary">
            Cancel
          </Button>
          <Button onClick={handleConfirmRemoval} color="secondary">
            Confirm Remove
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default EditOwner;