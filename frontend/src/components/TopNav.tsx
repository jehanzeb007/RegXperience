"use client";

import React from "react";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import { useRouter } from "next/navigation";
import useAppDispatch from "../hooks/useAppDispatch";
import useAppSelector from "../hooks/useAppSelector";
import { logout } from "../store/authSlice";

export default function TopNav() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const auth = useAppSelector((s) => s.auth);

  const handleLogout = () => {
    dispatch(logout());
    router.push("/login");
  };

  if (!auth.token) return null;

  return (
    <AppBar position="static">
      <Toolbar>
        <Typography
          variant="h6"
          component="div"
          sx={{ mr: 2, cursor: "pointer" }}
          onClick={() => router.push("/")}
        >
          RegXperience
        </Typography>
        <Box sx={{ display: "flex", gap: 1 }}>
          <Button color="inherit" onClick={() => router.push("/")}>
            Home
          </Button>
          <Button color="inherit" onClick={() => router.push("/assessments")}>
            Assessments
          </Button>
        </Box>
        <Box sx={{ flexGrow: 1 }} />
        <Typography variant="body2" sx={{ mr: 2 }}>
          {auth.user?.name || auth.user?.email || "Guest"}
        </Typography>
        <Button color="inherit" onClick={handleLogout}>
          Logout
        </Button>
      </Toolbar>
    </AppBar>
  );
}
