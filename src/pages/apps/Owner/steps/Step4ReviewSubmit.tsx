import React from "react";
import { Typography, Box } from "@mui/material";

interface Step4ReviewSubmitProps {
  ownerData: string[];
  restaurantData: any[];
}

const Step4ReviewSubmit: React.FC<Step4ReviewSubmitProps> = ({
  ownerData,
  restaurantData,
}) => {
  return (
    <div>
      <Typography variant="h6">Owner Information</Typography>
      <p>
        <strong>Name:</strong> {ownerData[0]}
      </p>
      <p>
        <strong>Email:</strong> {ownerData[1]}
      </p>
      <p>
        <strong>Country:</strong> {ownerData[2]}
      </p>
      <p>
        <strong>Address:</strong> {ownerData[3]}
      </p>

      <Typography variant="h6" style={{ marginTop: "1rem" }}>
        Restaurants
      </Typography>
      {restaurantData?.map((restaurant, index) => (
        <Box key={index} className="border p-2 rounded">
          <p>
            <strong>Restaurant {index + 1}:</strong>
          </p>
          <p>
            <strong>Name:</strong> {restaurant.name}
          </p>
          <p>
            <strong>Location:</strong> {restaurant.location}
          </p>
        </Box>
      ))}
    </div>
  );
};

export default Step4ReviewSubmit;
