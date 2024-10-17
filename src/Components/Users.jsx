import React, { useEffect, useState } from "react";
import { db } from "../Config/firebaseconfig"; // Adjust the path as necessary
import { collection, getDocs, updateDoc, doc, deleteDoc } from "firebase/firestore"; // Import deleteDoc
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
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

  // Function to block a user
  const blockUser = async (userId) => {
    const userDoc = doc(db, "users", userId); // Get document reference
    await updateDoc(userDoc, { isBlocked: true }); // Update the isBlocked field
    setUsers((prevUsers) =>
      prevUsers.map((user) => (user.id === userId ? { ...user, isBlocked: true } : user))
    ); // Update local state
  };

  // Function to unblock a user
  const unblockUser = async (userId) => {
    const userDoc = doc(db, "users", userId); // Get document reference
    await updateDoc(userDoc, { isBlocked: false }); // Update the isBlocked field
    setUsers((prevUsers) =>
      prevUsers.map((user) => (user.id === userId ? { ...user, isBlocked: false } : user))
    ); // Update local state
  };

  // Function to delete a user
  const deleteUser = async (userId) => {
    const userDoc = doc(db, 'users', userId); // Get document reference
    try {
      await deleteDoc(userDoc); // Delete the user document
      setUsers((prevUsers) => prevUsers.filter((user) => user.id !== userId)); // Update local state
      console.log("User deleted successfully");
    } catch (error) {
      console.error("Error deleting user: ", error);
    }
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" height="100vh">
        <CircularProgress />
      </Box>
    ); // Display a loading spinner
  }

  return (
    <TableContainer component={Paper} elevation={3} style={{ margin: "20px", borderRadius: "12px" }}>
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
            <TableCell>
              <TableSortLabel active>
                Phone Number
              </TableSortLabel>
            </TableCell>
            <TableCell>
              <TableSortLabel active>
                Actions
              </TableSortLabel>
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {users.map((user, index) => (
            <TableRow key={user.id} style={{ backgroundColor: index % 2 === 0 ? "#f9f9f9" : "#ffffff" }}>
              <TableCell>{user.id}</TableCell>
              <TableCell>{user.username}</TableCell> {/* Adjust based on your user data structure */}
              <TableCell>{user.email}</TableCell> {/* Adjust based on your user data structure */}
              <TableCell>{user.cellphone}</TableCell>
              <TableCell style={{ display: "flex", gap: 10 }}>
                {user.isBlocked ? (
                  <button onClick={() => unblockUser(user.id)}>Unblock</button>
                ) : (
                  <button onClick={() => blockUser(user.id)}>Block</button>
                )}
                <button onClick={() => deleteUser(user.id)}>Delete</button> {/* Add delete button */}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default Users;
