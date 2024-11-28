// EditOwner.tsx
import React, { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  IconButton,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";

interface EditOwnerProps {
  ownerData: any;
  onClose: () => void;
  onSave: (updatedOwner: any) => void;
}

const EditUsers: React.FC<EditOwnerProps> = ({
  ownerData,
  onClose,
  onSave,
}) => {
  const [editedData, setEditedData] = useState(ownerData);
  const [newRestaurant, setNewRestaurant] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setEditedData({ ...editedData, [name]: value });
  };

  const handleAddRestaurant = () => {
    if (newRestaurant.trim()) {
      setEditedData({
        ...editedData,
        restaurant: [...editedData.restaurant, newRestaurant],
      });
      setNewRestaurant("");
    }
  };

  const handleRemoveRestaurant = (index: number) => {
    const updatedRestaurants = editedData.restaurant.filter(
      (_res: any, i: any) => i !== index
    );
    setEditedData({ ...editedData, restaurant: updatedRestaurants });
  };

  const handleSave = () => {
    onSave(editedData);
    onClose();
  };

  return (
    <Dialog open onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>Edit Owner</DialogTitle>
      <DialogContent>
        <div>
          <label htmlFor="name">Name:</label>
          <input
            type="text"
            id="name"
            name="name"
            value={editedData.name}
            onChange={handleChange}
            required
            style={{ width: "100%", marginBottom: "10px" }}
          />
        </div>
        <div>
          <label htmlFor="email">Email:</label>
          <input
            type="email"
            id="email"
            name="email"
            value={editedData.email}
            onChange={handleChange}
            required
            style={{ width: "100%", marginBottom: "10px" }}
          />
        </div>
        <div>
          <label htmlFor="country">Country:</label>
          <input
            type="text"
            id="country"
            name="country"
            value={editedData.country}
            onChange={handleChange}
            required
            style={{ width: "100%", marginBottom: "10px" }}
          />
        </div>
        <div>
          <label htmlFor="address">Address:</label>
          <input
            type="text"
            id="address"
            name="address"
            value={editedData.address}
            onChange={handleChange}
            required
            style={{ width: "100%", marginBottom: "10px" }}
          />
        </div>

        {/* Restaurant Array Editing */}
        <div>
          <label htmlFor="newRestaurant">Add Restaurant:</label>
          <input
            type="text"
            id="newRestaurant"
            value={newRestaurant}
            onChange={(e) => setNewRestaurant(e.target.value)}
            style={{ width: "calc(100% - 50px)", marginRight: "10px" }} // Adjusting for button width
          />
          <IconButton onClick={handleAddRestaurant} color="primary">
            <AddIcon />
          </IconButton>

          <div>
            {editedData?.restaurant?.map((res: any, index: number) => (
              <div
                key={index}
                style={{
                  display: "flex",
                  alignItems: "center",
                  marginTop: "5px",
                }}
              >
                <input
                  value={res}
                  style={{
                    width: "100%",
                    marginRight: "10px",
                    padding: "5px",
                  }}
                />
                <IconButton onClick={() => handleRemoveRestaurant(index)}>
                  <RemoveIcon color="secondary" />
                </IconButton>
              </div>
            ))}
          </div>
        </div>
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
  );
};

export default EditUsers;
