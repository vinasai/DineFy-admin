import React, { useState } from "react";
import EditOwner from "./EditOwner";
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
  CircularProgress,
  Box,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { ArrowCircleRightSharp } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import {
  useGetOwnerApiQuery,
  useDeleteOwnerApiMutation,
} from "@/redux/api/owner/ownerApi";

// Updated interface to match the new owner data structure
export interface Owner {
  id: string; // UUID as string from the database
  name: string;
  country: string;
  contact_no: string;
  address: string;
  active: boolean;
  created_at: string; // Store timestamp as string for display purposes
}

const OwnersTableList: React.FC = () => {
  const history = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedOwner, setSelectedOwner] = useState<Owner | null>(null);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  // Fetch data using RTK Query
  const { data: owners, isLoading, error, refetch } = useGetOwnerApiQuery("");
  const [deleteOwner] = useDeleteOwnerApiMutation();

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

  const handleEditClick = (owner: Owner) => {
    setSelectedOwner(owner);
    setIsEditModalOpen(true);
  };

  const handleEditClose = () => {
    setIsEditModalOpen(false);
    setSelectedOwner(null);
  };

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const handleEditSave = (_updatedOwner: Owner) => {
    // Implement logic to save changes, such as calling an update API
    handleEditClose();
  };

  function navigateToDetails(id: string): void {
    history(`/apps/owner/${id}`);
  }

  const handleDeleteClick = async (id: string) => {
    try {
      await deleteOwner(id);
      refetch(); // Refresh the data after deletion
    } catch (error) {
      console.error("Failed to delete the owner:", error);
    }
  };

  if (isLoading) {
    return (
      <Box
        className="flex flex-col items-center justify-center min-h-screen text-center bg-gray-100 p-10"
        sx={{ animation: "fadeIn 0.6s ease-in-out" }}
      >
        <CircularProgress
          size={80}
          thickness={5}
          className="text-blue-500 mb-6"
        />
        <Typography variant="h6" component="p" className="text-gray-700 mb-2">
          Please wait, loading data...
        </Typography>
        <Typography
          variant="body2"
          component="p"
          className="text-gray-500 animate-pulse"
        >
          This might take a few seconds.
        </Typography>
      </Box>
    );
  }

  if (error) {
    return <div>Error loading data.</div>;
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
                <TableCell>ID</TableCell> {/* Display order index */}
                <TableCell>Name</TableCell>
                <TableCell>Country</TableCell>
                <TableCell>Contact No</TableCell>
                <TableCell>Address</TableCell>
                <TableCell>Active</TableCell>
                <TableCell>Created At</TableCell>
                <TableCell>Action</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {owners
                ?.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((owner: Owner, index) => (
                  <TableRow key={owner.id}>
                    <TableCell>
                      {page * rowsPerPage + index + 1}{" "}
                      {/* Calculated order index */}
                    </TableCell>
                    <TableCell>{owner.name}</TableCell>
                    <TableCell>{owner.country}</TableCell>
                    <TableCell>{owner.contact_no}</TableCell>
                    <TableCell>{owner.address}</TableCell>
                    <TableCell>
                      {owner.active ? (
                        <Chip label="Active" color="success" />
                      ) : (
                        <Chip label="Inactive" color="error" />
                      )}
                    </TableCell>
                    <TableCell>
                      {new Date(owner.created_at).toLocaleString()}
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-5">
                        <IconButton onClick={() => navigateToDetails(owner.id)}>
                          <ArrowCircleRightSharp color="primary" />
                        </IconButton>
                        <IconButton onClick={() => handleEditClick(owner)}>
                          <EditIcon className=" text-blue-600" />
                        </IconButton>
                        <IconButton onClick={() => handleDeleteClick(owner.id)}>
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
          count={owners ? owners.length : 0}
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
