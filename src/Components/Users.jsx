import React, { useEffect, useState } from "react";
import { db } from "../Config/firebaseconfig"; // Adjust the path as necessary
import { collection, getDocs } from "firebase/firestore";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
  Box,
  TableSortLabel,
  CircularProgress,
} from "@mui/material";

const Users = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const userCollectionRef = collection(db, "users"); // Adjust to your collection name
        const userSnapshot = await getDocs(userCollectionRef);
        const userList = userSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
        setUsers(userList);
      } catch (error) {
        console.error("Error fetching users: ", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" height="100vh">
        <CircularProgress />
      </Box>
    ); // Display a loading spinner
  }

  return (
    <TableContainer component={Paper} elevation={3} style={{ margin: "20px", borderRadius: "12px" }}>
      {/* <Typography variant="h4" align="center" gutterBottom>
        Users
      </Typography> */}
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>
              <TableSortLabel active>
                ID
              </TableSortLabel>
            </TableCell>
            <TableCell>
              <TableSortLabel active>
                Name
              </TableSortLabel>
            </TableCell>
            <TableCell>
              <TableSortLabel active>
                Email
              </TableSortLabel>
            </TableCell>
            {/* Add more headers as needed */}
          </TableRow>
        </TableHead>
        <TableBody>
          {users.map((user, index) => (
            <TableRow key={user.id} style={{ backgroundColor: index % 2 === 0 ? "#f9f9f9" : "#ffffff" }}>
              <TableCell>{user.id}</TableCell>
              <TableCell>{user.name}</TableCell> {/* Adjust based on your user data structure */}
              <TableCell>{user.email}</TableCell> {/* Adjust based on your user data structure */}
              {/* Add more cells as needed */}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default Users;
