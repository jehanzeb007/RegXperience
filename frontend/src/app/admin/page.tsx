"use client";

import React from "react";
import { Container, Typography } from "@mui/material";
import ProtectedRoute from "../../components/ProtectedRoute";

export default function AdminPage() {
  return (
    <ProtectedRoute>
      <Container sx={{ mt: 8 }}>
        <Typography variant="h4">Admin Dashboard</Typography>
        <Typography sx={{ mt: 2 }}>Welcome, admin user.</Typography>
      </Container>
    </ProtectedRoute>
  );
}
