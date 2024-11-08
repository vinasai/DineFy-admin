import React, { useState } from "react";
import {
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
import DeleteIcon from "@mui/icons-material/Delete";
import { useNavigate } from "react-router-dom";
import {
  useGetOwnerApiQuery,
  useDeleteOwnerApiMutation,
} from "@/redux/api/owner/ownerApi";
import {
  useDeleteUserApiMutation,
  useGetUserApiQuery,
} from "@/redux/api/user/userApi";

// Define new type matching the database columns
export interface User {
  id: string;
  uuid: string;
  updated_at: string;
  username: string;
  full_name: string;
  avatar_url: string;
  gender: string;
  dob: string;
  last_accessed: string;
  email: string;
}

const UsersTableList: React.FC = () => {
  const history = useNavigate();

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  const { data: users, isLoading, error, refetch } = useGetUserApiQuery("");
  const [deleteUser] = useDeleteUserApiMutation();

  const handleChangePage = (_event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleDeleteClick = async (id: string) => {
    try {
      await deleteUser(id);
      refetch();
    } catch (error) {
      console.error("Failed to delete the user:", error);
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
            Users Management
          </Typography>
        </div>

        <TableContainer component={Paper} className="mb-4 shadow">
          <Table sx={{ minWidth: 750 }}>
            <TableHead>
              <TableRow>
                {[
                  "ID",

                  "Username",
                  "Full Name",
                  "Avatar",
                  "Gender",
                  "Date of Birth",
                  "Last Accessed",
                  "Email",
                  "Updated At",
                  "Action",
                ].map((header) => (
                  <TableCell
                    key={header}
                    sx={{
                      padding: "8px",
                      whiteSpace: "nowrap",
                      fontWeight: "bold",
                      fontSize: "0.875rem",
                      color: "#555",
                      borderBottom: "1px solid #ddd",
                    }}
                  >
                    {header}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {users
                ?.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((user: User, index) => (
                  <TableRow key={user.id}>
                    <TableCell sx={{ padding: "8px" }}>
                      {page * rowsPerPage + index + 1}
                    </TableCell>
                    <TableCell sx={{ padding: "8px" }}>
                      {user.username}
                    </TableCell>
                    <TableCell sx={{ padding: "8px" }}>
                      {user.full_name}
                    </TableCell>
                    <TableCell sx={{ padding: "8px" }}>
                      <img
                        src={user.avatar_url}
                        alt="avatar"
                        width={40}
                        height={40}
                        style={{ borderRadius: "50%" }}
                      />
                    </TableCell>
                    <TableCell sx={{ padding: "8px" }}>{user.gender}</TableCell>
                    <TableCell sx={{ padding: "8px" }}>{user.dob}</TableCell>
                    <TableCell sx={{ padding: "8px" }}>
                      {new Date(user.last_accessed).toLocaleString()}
                    </TableCell>
                    <TableCell sx={{ padding: "8px" }}>{user.email}</TableCell>
                    <TableCell sx={{ padding: "8px" }}>
                      {new Date(user.updated_at).toLocaleString()}
                    </TableCell>
                    <TableCell sx={{ padding: "8px", textAlign: "center" }}>
                      <IconButton onClick={() => handleDeleteClick(user.id)}>
                        <DeleteIcon className="text-red-500" />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        </TableContainer>

        <TablePagination
          component="div"
          count={users ? users.length : 0}
          page={page}
          onPageChange={handleChangePage}
          rowsPerPage={rowsPerPage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          rowsPerPageOptions={[5, 10, 25]}
          className="mt-2"
        />
      </CardContent>
    </Card>
  );
};

export default UsersTableList;
