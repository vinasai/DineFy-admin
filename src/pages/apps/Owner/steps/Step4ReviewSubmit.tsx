import React, { useState } from "react";
import {
  Typography,
  Box,
  Card,
  CardContent,
  Grid,
  Divider,
  IconButton,
  Tooltip,
  TextField,
  InputAdornment,
} from "@mui/material";
import CopyAllIcon from "@mui/icons-material/CopyAll";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";

interface Step4ReviewSubmitProps {
  ownerData: string[];
  restaurantsData: any[];
  credentials: { email: string; password: string }[];
}

const Step4ReviewSubmit: React.FC<Step4ReviewSubmitProps> = ({
  ownerData,
  restaurantsData,
  credentials,
}) => {
  const [showPassword, setShowPassword] = useState(false);

  const handleCopyCredentials = () => {
    const credentialsText = `Login Credentials:\nEmail: ${credentials[0].email}\nPassword: ${credentials[0].password}`;
    navigator.clipboard.writeText(credentialsText);
    alert("Login credentials copied to clipboard!");
  };

  return (
    <Box sx={{ p: 3 }}>
      {/* Owner Information */}
      <Card variant="outlined" sx={{ mb: 4, boxShadow: 2 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Owner Information
          </Typography>
          <Divider sx={{ mb: 2 }} />
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <Typography variant="body1">
                <strong>Name:</strong> {ownerData[0]}
              </Typography>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Typography variant="body1">
                <strong>Email:</strong> {ownerData[1]}
              </Typography>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Typography variant="body1">
                <strong>Contact:</strong> {ownerData[3]}
              </Typography>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Typography variant="body1">
                <strong>Country:</strong> {ownerData[2]}
              </Typography>
            </Grid>
            <Grid item xs={12}>
              <Typography variant="body1">
                <strong>Address:</strong> {ownerData[4]}
              </Typography>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {/* Restaurants Information */}
      <Typography variant="h6" gutterBottom>
        Restaurants
      </Typography>
      <Divider sx={{ mb: 2 }} />
      <Grid container spacing={3}>
        {restaurantsData?.map((restaurant, index) => (
          <Grid item xs={12} md={6} key={index}>
            <Card variant="outlined" sx={{ boxShadow: 2 }}>
              <CardContent>
                <Typography variant="subtitle1" gutterBottom>
                  <strong>Restaurant {index + 1}</strong>
                </Typography>
                <Typography variant="body2" gutterBottom>
                  <strong>Name:</strong> {restaurant.name}
                </Typography>
                <Typography variant="body2" gutterBottom>
                  <strong>Location:</strong> {restaurant.location}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Login Credentials */}
      <Typography variant="h6" gutterBottom sx={{ mt: 4 }}>
        Owner Login Credentials
      </Typography>
      <Divider sx={{ mb: 2 }} />
      <Card variant="outlined" sx={{ boxShadow: 2, p: 2 }}>
        <CardContent>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Email"
                value={credentials[0].email}
                fullWidth
                margin="normal"
                InputProps={{
                  readOnly: true,
                }}
                
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Password"
                value={credentials[0].password}
                fullWidth
                margin="normal"
                type={showPassword ? "text" : "password"}
                InputProps={{
                  readOnly: true,
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={() => setShowPassword((prev) => !prev)}
                        edge="end"
                      >
                        {showPassword ? <Visibility /> : <VisibilityOff />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
                
              />
            </Grid>
          </Grid>
          <Box sx={{ mt: 2, display: "flex", justifyContent: "flex-end" }}>
            <Tooltip title="Copy Login Credentials">
              <IconButton onClick={handleCopyCredentials} color="primary">
                <CopyAllIcon />
              </IconButton>
            </Tooltip>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
};

export default Step4ReviewSubmit;