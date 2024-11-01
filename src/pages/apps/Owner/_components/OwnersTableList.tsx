// OwnersTableList.tsx
import React, { useEffect, useState } from "react";
import EditOwner from "./EditOwner"; // Import the EditOwner component
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
  Chip,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { ArrowCircleRightSharp } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/api/client";
import { useGetOwnerApiQuery } from "@/redux/api/owner/ownerApi";
//import { useGetOwnerApiQuery } from "@/redux/api/owner/ownerApi";

export interface Restaurant {
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
  const history = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedOwner, setSelectedOwner] = useState<Restaurant | null>(null);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [data, setData] = useState<any>([]);
  // useEffect(() => {
  //   // Function to fetch data from a specific Supabase table
  //   const fetchData = async () => {
  //     // Replace 'my_table' with your table name
  //     const { data: owner, error } = await supabase.from("owner").select("*");
  //     console.log(owner);
  //     setData(owner);
  //   };

  //   fetchData();
  // }, []); // Empty dependency array means this effect runs only once

  const { data: owners } =  useGetOwnerApiQuery("");
  console.log(owners);
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

  // Function to open EditOwner modal with selected owner data
  const handleEditClick = (owner: Restaurant) => {
    setSelectedOwner(owner);
    setIsEditModalOpen(true);
  };

  const handleEditClose = () => {
    setIsEditModalOpen(false);
    setSelectedOwner(null);
  };

  //console.log(owners);
  const handleEditSave = (updatedOwner: Restaurant) => {
    // Handle the save logic, e.g., updating state or calling API
    const updatedData = sampleData.map((owner) =>
      owner.id === updatedOwner.id ? updatedOwner : owner
    );
    console.log("Updated Data:", updatedData); // Replace this with your actual save/update logic
    handleEditClose();
  };

  function navigateToDetails(id: number): void {
    history(`/apps/owner/${id}`);
  }

  return (
    <Card className="shadow-lg p-4 mb-6">
      <CardContent>
        <div className="flex justify-between items-center mb-4">
          <Typography variant="h5" component="h1" className="font-bold">
            Restaurant Owner Details
          </Typography>
          <Button variant="contained" color="primary" onClick={openModal}>
            Add New Owner
          </Button>
        </div>

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
                      <div className="flex flex-wrap gap-2">
                        {restaurant.restaurant.map((res, index) => (
                          <Chip
                            key={index}
                            label={res}
                            variant="outlined"
                            color="primary"
                          />
                        ))}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-5">
                        <IconButton
                          onClick={() => navigateToDetails(restaurant.id)}
                        >
                          <ArrowCircleRightSharp color="primary" />
                        </IconButton>
                        <IconButton onClick={() => handleEditClick(restaurant)}>
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

      {isModalOpen && <AddNewRestaurant onClose={closeModal} />}
      {isEditModalOpen && selectedOwner && (
        <EditOwner
          ownerData={selectedOwner}
          onClose={handleEditClose}
          onSave={handleEditSave}
        />
      )}
    </Card>
  );
};

export default OwnersTableList;
