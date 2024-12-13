import Grid from "@mui/material/Grid";
import OwnersTableList from "./OwnersTableList";

const RestaurantList = () => {
  return (
    <Grid container spacing={6}>
      <Grid item xs={12}> {/* Use full width for the component */}
        <OwnersTableList />
      </Grid>
    </Grid>
  );
};

export default RestaurantList;
