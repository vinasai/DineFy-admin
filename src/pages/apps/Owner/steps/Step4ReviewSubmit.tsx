import React from "react";
import { Typography, Box } from "@mui/material";

interface Step4ReviewSubmitProps {
  ownerData: string[];
  restaurantsData: any[];
}

const Step4ReviewSubmit: React.FC<Step4ReviewSubmitProps> = ({
  ownerData,
  restaurantsData,
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
        <strong>contact:</strong> {ownerData[3]}
      </p>

      <p>
        <strong>Country:</strong> {ownerData[2]}
      </p>
      <p>
        <strong>Address:</strong> {ownerData[4]}
      </p>

      <Typography variant="h6" style={{ marginTop: "1rem" }}>
        Restaurants
      </Typography>
      {restaurantsData?.map((restaurants, index) => (
        <Box key={index} className="border p-2 rounded">
          <p>
            <strong>Restaurant {index + 1}:</strong>
          </p>
          <p>
            <strong>Name:</strong> {restaurants.name}
          </p>
          <p>
            <strong>Location:</strong> {restaurants.location}
          </p>
        </Box>
      ))}
    </div>
  );
};

export default Step4ReviewSubmit;
