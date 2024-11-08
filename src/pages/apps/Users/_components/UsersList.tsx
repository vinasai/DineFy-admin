import Grid from "@mui/material/Grid";
import UsersTableList from "./UsersTableList";

const UsersList = () => {
  return (
    <Grid container spacing={6}>
      <Grid item xs={12}>
        <UsersTableList />
      </Grid>
    </Grid>
  );
};

export default UsersList;
