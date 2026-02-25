"use client";

import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import useAppSelector from "../hooks/useAppSelector";
import { Container, Typography } from "@mui/material";

export default function Home() {
  const router = useRouter();
  const auth = useAppSelector((s) => s.auth);

  useEffect(() => {
    if (!auth.token && !auth.loading) {
      router.replace("/login");
    }
  }, [auth, router]);

  if (!auth.token) return null;

  return (
    <Container sx={{ mt: 8 }}>
      <Typography variant="h4">Welcome</Typography>
      <Typography sx={{ mt: 2 }}>
        Hello, {auth.user?.name || auth.user?.email || "user"} — you are logged
        in.
      </Typography>
    </Container>
  );
}
