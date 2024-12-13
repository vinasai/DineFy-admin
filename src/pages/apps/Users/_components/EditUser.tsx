import React, { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Switch,
  FormControlLabel,
  Select,
  MenuItem,
} from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import avatar from "@/assets/images/users/user.png";
import {useUpdateUserApiMutation} from "@/redux/api/user/userApi";

interface EditOwnerProps {
  userData: any;
  onClose: () => void;
  onSave: (updatedUser: any) => void;
  refetch: () => void;
}

const EditUsers: React.FC<EditOwnerProps> = ({
  userData,
  onClose,
  onSave,
  refetch,
}) => {
  const [editedData, setEditedData] = useState({
    ...userData,
    dob: userData.dob ? new Date(userData.dob) : null,
    isActive: userData.isActive === "active",
    avatar_url: userData.avatar_url || "",
  });
  
  const [accountStatus, setAccountStatus] = useState(userData.status);
  const [updateUserApi] = useUpdateUserApiMutation();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setEditedData({ ...editedData, [name]: value });
  };

  const handleGenderChange = (e: any) => {
    setEditedData({ ...editedData, gender: e.target.value });
  };

  const handleDateChange = (date: Date | null) => {
    setEditedData({ ...editedData, dob: date });
  };

  const handleAccountStatusChange = () => {
    const newStatus = !accountStatus; // Calculate the new value
    console.log(newStatus);
    setAccountStatus(newStatus); // Update accountStatus
    setEditedData({
      ...editedData,
      isActive: newStatus ? true : false, // Use the new value directly
    });
  };
  

  const handleProfilePictureChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const fileReader = new FileReader();
      fileReader.onload = (event) => {
        setEditedData({ ...editedData, avatar_url: event.target?.result });
      };
      fileReader.readAsDataURL(e.target.files[0]);
    }
  };

  const handleSave = async () => {
    const updatedUser = {
      ...editedData,
      dob: editedData.dob ? editedData.dob.toISOString().split("T")[0] : null, // Convert DOB to "YYYY-MM-DD"
    };
    console.log(updatedUser);
    onSave(updatedUser);
    await updateUserApi(updatedUser).unwrap();
    refetch();
    onClose();
  };




  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <Dialog open onClose={onClose} fullWidth maxWidth="sm">
        <DialogTitle>Edit User</DialogTitle>
        <DialogContent>
          <div>
            <label htmlFor="avatar_url">Profile Picture:</label>
            <div style={{ marginBottom: "10px", textAlign: "center" }}>
              <img
                src={editedData.avatar_url || avatar} // Default avatar if none is provided
                alt="Profile"
                style={{
                  width: "80px",
                  height: "80px",
                  borderRadius: "50%",
                  marginBottom: "10px",
                }}
              />
             
            </div>
          </div>
          <div>
            <label htmlFor="name">Name:</label>
            <input
              type="text"
              id="name"
              name="full_name"
              value={editedData.full_name || ""}
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
              value={editedData.email || ""}
              onChange={handleChange}
              required
              style={{ width: "100%", marginBottom: "10px" }}
            />
          </div>
          <div>
            <label htmlFor="phone">Phone:</label>
            <input
              type="tel"
              id="phone"
              name="phone"
              value={editedData.phone || ""}
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
              value={editedData.country || ""}
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
              value={editedData.address || ""}
              onChange={handleChange}
              required
              style={{ width: "100%", marginBottom: "10px" }}
            />
          </div>

          <div>
            <label htmlFor="gender">Gender:</label>
            <Select
              fullWidth
              value={editedData.gender || ""}
              onChange={handleGenderChange}
              style={{ width: "100%", marginBottom: "10px" }}
            >
              <MenuItem value="Male">Male</MenuItem>
              <MenuItem value="Female">Female</MenuItem>
              <MenuItem value="Other">Other</MenuItem>
            </Select>
          </div>

          <div>
            <label htmlFor="dob">Date of Birth:</label>
            <br />
            <DatePicker
              value={editedData.dob || null}
              onChange={handleDateChange}
              sx={{ width: "100%", marginBottom: "10px" }}
            />
          </div>

          <div className="mt-3">
            <label htmlFor="accountStatus">Account Status:</label>
            <br />
            <FormControlLabel
              control={
                <Switch
                  checked={accountStatus}
                  onChange={handleAccountStatusChange}
                  color="primary"
                />
              }
              label={accountStatus ? "Active" : "Suspended"}
            />
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
    </LocalizationProvider>
  );
};

export default EditUsers;
