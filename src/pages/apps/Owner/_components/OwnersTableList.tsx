import React, { useState, useMemo , useEffect } from "react";
import EditOwner from "./EditOwner";

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
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  TextField, 
  InputAdornment
  
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import {  ArrowOutwardRounded, Search } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { debounce } from "lodash";
import {
  useGetOwnerApiQuery,
  useDeleteOwnerApiMutation,
} from "@/redux/api/owner/ownerApi";
import AddNewOwners from "./AddNewOwners";
import Restaurant from "../../Restaurant/Restaurant";

export interface Owner {
  plan: "Free" | "VIP";
  id: string;
  name: string;
  country: string;
  contact_no: string;
  address: string;
  active: boolean;
  created_at: string;
  email: string;
  restaurants: Restaurant[]
  
}

const OwnersTableList: React.FC = () => {
  const history = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedOwner, setSelectedOwner] = useState<Owner | null>(null);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [deleteConfirmationOpen, setDeleteConfirmationOpen] = useState(false);
  const [ownerToDelete, setOwnerToDelete] = useState<string | null>(null);
  const [nameSearch, setNameSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState( nameSearch);

  // Fetch data using RTK Query
  const { data: owners, isLoading, error, refetch } = useGetOwnerApiQuery("");
  const [deleteOwner] = useDeleteOwnerApiMutation();

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

    // Debounce the search input
    const debouncedSearchHandler = useMemo(
      () => debounce((value) => setDebouncedSearch(value), 300),
      []
    );
  
    useEffect(() => {
      debouncedSearchHandler(nameSearch);
    }, [nameSearch, debouncedSearchHandler]);

  const filteredOwners = owners?.filter(owner => 
    debouncedSearch === "" ? true : owner.name.toLowerCase().includes( debouncedSearch.toLowerCase())
  );
  

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

  const handleEditSave = (_updatedOwner: Owner) => {
    refetch();
    handleEditClose();
  };

  function navigateToDetails(id: string): void {
    history(`/apps/owner/${id}`);
  }

  const handleDeleteClick = (id: string) => {
    setOwnerToDelete(id);
    setDeleteConfirmationOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (ownerToDelete) {
      try {
        await deleteOwner(ownerToDelete);
        refetch();
      } catch (error) {
        console.error("Failed to delete the owner:", error);
      }
    }
    setDeleteConfirmationOpen(false);
    setOwnerToDelete(null);
  };

  const handleDeleteCancel = () => {
    setDeleteConfirmationOpen(false);
    setOwnerToDelete(null);
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
        {/* Search Bar */}
      <Box sx={{ mb: 2, display: 'flex', justifyContent: 'flex-end' }}>
        <TextField
          placeholder="Search owners..."
          variant="outlined"
          size="small"
          value={nameSearch}
          onChange={(e) => setNameSearch(e.target.value)}
          sx={{ width: 300}}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start" >
                <Search />
              </InputAdornment>
            ),
          }}
        />
      </Box>

        <TableContainer component={Paper} className="mb-4 shadow">
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>ID</TableCell>
                <TableCell>Name</TableCell>
                <TableCell>Country</TableCell>
                <TableCell>Contact</TableCell>
                <TableCell>Address</TableCell>
                <TableCell>Account Type</TableCell>
                <TableCell>Created At</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
  {filteredOwners?.length ? (
    // Existing rows display
    filteredOwners
      .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
      .map((owner: Owner, index) => (
        <TableRow key={owner.id}>
          <TableCell>{page * rowsPerPage + index + 1}</TableCell>
          <TableCell>{owner.name}</TableCell>
          <TableCell>{owner.country}</TableCell>
          <TableCell>{owner.contact_no}</TableCell>
          <TableCell>{owner.address}</TableCell>
          <TableCell>
            {owner.plan === 'VIP' ? (
              <Chip label="VIP" color="error" />
            ) : (
              <Chip label="FREE" color="success" />
            )}
          </TableCell>
          <TableCell>{new Date(owner.created_at).toLocaleString()}</TableCell>
          <TableCell>
            <div className="flex gap-5">
              <IconButton id="root" aria-hidden="true" onClick={() => navigateToDetails(owner.id)}>
                <ArrowOutwardRounded color="primary" />
              </IconButton>
              <IconButton id="root" aria-hidden="true" onClick={() => handleEditClick(owner)}>
                <EditIcon className="text-blue-600" />
              </IconButton>
              <IconButton id="root" aria-hidden="true" onClick={() => handleDeleteClick(owner.id)}>
                <DeleteIcon className="text-red-500" />
              </IconButton>
            </div>
          </TableCell>
        </TableRow>
      ))
  ) : (
    <TableRow>
      <TableCell colSpan={8} align="center" sx={{ py: 3 }}>
        <Typography variant="body1" color="textSecondary">
          No results found
        </Typography>
      </TableCell>
    </TableRow>
  )}
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

      {isModalOpen && <AddNewOwners onClose={closeModal} refetch={refetch} />}
      
      {isEditModalOpen && selectedOwner && (
        <EditOwner
          ownerData={selectedOwner}
          onClose={handleEditClose}
          onSave={handleEditSave}
          refetch={refetch}
        />
      )}

      <Dialog
        open={deleteConfirmationOpen}
        onClose={handleDeleteCancel}
        aria-labelledby="delete-confirmation-title"
        aria-describedby="delete-confirmation-description"
      >
        <DialogTitle id="delete-confirmation-title">
          Confirm Deletion
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="delete-confirmation-description">
            Are you sure you want to delete this owner? This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDeleteCancel} color="primary">
            Cancel
          </Button>
          <Button onClick={handleDeleteConfirm} color="error" autoFocus>
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Card>
  );
};

export default OwnersTableList;