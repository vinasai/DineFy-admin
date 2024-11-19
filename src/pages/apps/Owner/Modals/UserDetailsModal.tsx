import React, { useState } from "react";
import {
  Modal,
  Box,
  TextField,
  Button,
  CircularProgress,
  Typography,
} from "@mui/material";
import { supabase } from "@/api/client";

interface UserDetailsModalProps {
  open: boolean;
  onClose: () => void;
  userId: string | undefined;
}

const UserDetailsModal: React.FC<UserDetailsModalProps> = ({
  open,
  onClose,
  userId,
}) => {
  const [userData, setUserData] = useState({
    username: "",
    full_name: "",
    avatar_url: "",
    gender: "",
    dob: "",
    email: "",
    role: "",
  });
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUserData({
      ...userData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setLoading(true);
    setError(null); // Reset error state before submission

    try {
      // Ensure userId is available
      if (!userId) {
        throw new Error("User ID is required for creating user data.");
      }

      // Insert new user data into Supabase
      const { data, error } = await supabase
        .from("profiles")
        .insert([
          {
            id: userId, // Use userId directly (ensure it's a valid string)
            username: userData.username,
            full_name: userData.full_name,
            avatar_url: userData.avatar_url,
            gender: userData.gender,
            dob: userData.dob,
            email: userData.email,
            role: userData.role,
          },
        ])
        .select(); // Optionally return the inserted data

      if (error) {
        throw new Error(
          error.message || "An error occurred while inserting data."
        ); // Handle error from Supabase
      }

      // Optionally, you can do something with the inserted data
      console.log(data);
      onClose(); // Close the modal after successful submission
    } catch (err: any) {
      setError(err.message || "An unknown error occurred"); // Ensure error is a string
    } finally {
      setLoading(false); // End loading state
    }
  };

  return (
    <Modal open={open} onClose={onClose}>
      <Box
        sx={{
          padding: 3,
          width: "100%",
          maxWidth: 600,
          margin: "auto",
          backgroundColor: "white",
          borderRadius: 2,
          boxShadow: 24,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          position: "relative",
          top: "50%",
          transform: "translateY(-50%)",
        }}
      >
        <Typography variant="h5" sx={{ marginBottom: 2 }}>
          Create User Profile
        </Typography>

        {loading ? (
          <CircularProgress sx={{ marginBottom: 2 }} />
        ) : error ? (
          <Typography color="error" sx={{ marginBottom: 2 }}>
            Error: {error}
          </Typography>
        ) : (
          <form onSubmit={handleSubmit}>
            <TextField
              value={userData.username}
              onChange={handleChange}
              name="username"
              label="Username"
              fullWidth
              margin="normal"
              sx={{ marginBottom: 2 }}
            />
            <TextField
              value={userData.full_name}
              onChange={handleChange}
              name="full_name"
              label="Full Name"
              fullWidth
              margin="normal"
              sx={{ marginBottom: 2 }}
            />
            <TextField
              value={userData.avatar_url}
              onChange={handleChange}
              name="avatar_url"
              label="Avatar URL"
              fullWidth
              margin="normal"
              sx={{ marginBottom: 2 }}
            />
            <TextField
              value={userData.gender}
              onChange={handleChange}
              name="gender"
              label="Gender"
              fullWidth
              margin="normal"
              sx={{ marginBottom: 2 }}
            />
            <TextField
              value={userData.dob}
              onChange={handleChange}
              name="dob"
              label="Date of Birth"
              fullWidth
              margin="normal"
              sx={{ marginBottom: 2 }}
            />
            <TextField
              value={userData.email}
              onChange={handleChange}
              name="email"
              label="Email"
              fullWidth
              margin="normal"
              sx={{ marginBottom: 2 }}
            />
            <TextField
              value={userData.role}
              onChange={handleChange}
              name="role"
              label="Role"
              fullWidth
              margin="normal"
              sx={{ marginBottom: 2 }}
            />

            <Button
              type="submit"
              variant="contained"
              sx={{
                marginTop: 2,
                width: "100%",
                backgroundColor: "#1976d2",
                ":hover": {
                  backgroundColor: "#1565c0",
                },
              }}
            >
              Create User
            </Button>
          </form>
        )}

        <Button
          onClick={onClose}
          variant="outlined"
          sx={{
            marginTop: 2,
            width: "100%",
            borderColor: "#1976d2",
            color: "#1976d2",
            ":hover": {
              backgroundColor: "#1976d2",
              color: "white",
            },
          }}
        >
          Close
        </Button>
      </Box>
    </Modal>
  );
};

export default UserDetailsModal;
