"use client";

import React from "react";
import { Provider } from "react-redux";
import store from "../store";
import { ThemeProvider, CssBaseline, createTheme } from "@mui/material";
import { useEffect } from "react";
import { useAppDispatch } from "../hooks/useAppDispatch";
import { setCredentials } from "../store/authSlice";
import Toaster from "../components/Toaster";

type Props = {
  children: React.ReactNode;
};

const theme = createTheme();

export default function Providers({ children }: Props) {
  return (
    <Provider store={store}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Toaster />
        <AuthLoader>{children}</AuthLoader>
      </ThemeProvider>
    </Provider>
  );
}

function AuthLoader({ children }: Props) {
  const dispatch = useAppDispatch();

  useEffect(() => {
    try {
      const token = localStorage.getItem("auth.token");
      const userJson = localStorage.getItem("auth.user");
      console.log("AuthLoader: found token in localStorage?", !!token);
      if (token) {
        // setAuthToken(token);
        let user = null;
        if (userJson) {
          try {
            user = JSON.parse(userJson);
          } catch (e) {
            user = null;
          }
        }
        dispatch(setCredentials({ token, user }));
      }
    } catch (e) {}
  }, [dispatch]);

  return <>{children}</>;
}
