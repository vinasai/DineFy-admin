import React, { useState } from "react";
import AddNewRestaurant from "./AddNewOwners";
import {
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TablePagination,
  Card,
  CardContent,
  Typography,
  IconButton,
  Chip, // Import Chip component
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import VisibilityIcon from "@mui/icons-material/Visibility";
import { useNavigate } from "react-router-dom"; // Import useNavigate

interface Restaurant {
  id: number;
  name: string;
  email: string;
  country: string;
  address: string;
  restaurant: string[];
}

const sampleData: Restaurant[] = [
  {
    id: 1,
    name: "james",
    email: "james@gmail.com",
    country: "USA",
    address: "123 Main St",
    restaurant: ["bubble bee dines", "sweet mart"],
  },
  {
    id: 2,
    name: "jone",
    email: "jone@gmail.com",
    country: "Canada",
    address: "456 Elm St",
    restaurant: ["SixFlave Kitchen", "Khajiar Resort"],
  },
  // Add more sample data as needed
];

const OwnersTableList: React.FC = () => {
  const history = useNavigate(); // Initialize navigate
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [page, setPage] = useState<number>(0);
  const [rowsPerPage, setRowsPerPage] = useState<number>(5);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  const handleChangePage = (_event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  // Function to handle navigation to the details page
  const navigateToDetails = (id: number) => {
    history(`/apps/restaurant/${id}`); // Navigate to the route with the owner's ID
  };

  return (
    <Card className="shadow-lg p-4 mb-6">
      <CardContent>
        {/* Header Section */}
        <div className="flex justify-between items-center mb-4">
          <Typography variant="h5" component="h1" className="font-bold">
            Restaurant Owner Details
          </Typography>
          <Button variant="contained" color="primary" onClick={openModal}>
            Add New Owner
          </Button>
        </div>

        {/* Restaurant Table */}
        <TableContainer component={Paper} className="mb-4 shadow">
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>ID</TableCell>
                <TableCell>Name</TableCell>
                <TableCell>Email</TableCell>
                <TableCell>Country</TableCell>
                <TableCell>Address</TableCell>
                <TableCell>Restaurants</TableCell>
                <TableCell>Action</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {sampleData
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((restaurant) => (
                  <TableRow key={restaurant.id}>
                    <TableCell>{restaurant.id}</TableCell>
                    <TableCell>{restaurant.name}</TableCell>
                    <TableCell>{restaurant.email}</TableCell>
                    <TableCell>{restaurant.country}</TableCell>
                    <TableCell>{restaurant.address}</TableCell>
                    <TableCell>
                      {/* Map restaurant names to Chips */}
                      <div className="flex flex-wrap gap-2">
                        {restaurant.restaurant.map((res, index) => (
                          <Chip
                            key={index}
                            label={res}
                            variant="outlined"
                            color="primary" // Change color as needed
                          />
                        ))}
                      </div>
                    </TableCell>
                    <TableCell>
                      {/* Action Icons */}
                      <div className="flex gap-5">
                        <IconButton
                          onClick={() => navigateToDetails(restaurant.id)}
                        >
                          <VisibilityIcon color="primary" />
                        </IconButton>

                        <IconButton>
                          <EditIcon className=" text-blue-600" />
                        </IconButton>

                        <IconButton>
                          <DeleteIcon className=" text-red-500" />
                        </IconButton>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        </TableContainer>

        {/* Pagination */}
        <TablePagination
          component="div"
          count={sampleData.length}
          page={page}
          onPageChange={handleChangePage}
          rowsPerPage={rowsPerPage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          rowsPerPageOptions={[5, 10, 25]}
          className="mt-2"
        />
      </CardContent>

      {/* Modal for Adding New Restaurant */}
      {isModalOpen && <AddNewRestaurant onClose={closeModal} />}
    </Card>
  );
};

export default OwnersTableList;
