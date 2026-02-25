"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { Box, Button, Container, TextField, Typography } from "@mui/material";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";
import { useAppDispatch } from "../../hooks/useAppDispatch";
import useToast from "../../hooks/useToast";
import { loginUser } from "../../store/authSlice";
import { getErrorMessage } from "../../utils/errorHandler";

const LoginSchema = Yup.object().shape({
  email: Yup.string().email("Invalid email").required("Required"),
  password: Yup.string().min(4, "Too short").required("Required"),
});

export default function LoginPage() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const toast = useToast();

  return (
    <Container maxWidth="xs" sx={{ mt: 8 }}>
      <Typography variant="h5" gutterBottom>
        Sign in
      </Typography>
      <Formik
        initialValues={{ email: "", password: "" }}
        validationSchema={LoginSchema}
        onSubmit={async (values, { setSubmitting, setStatus }) => {
          setSubmitting(true);
          try {
            const res = await dispatch(loginUser(values)).unwrap();
            const role = res?.user?.role;
            toast.success("Login successful!");
            if (role === "admin") router.push("/admin");
            else router.push("/");
          } catch (err: unknown) {
            const errorMessage = getErrorMessage(err);
            toast.error(errorMessage);
            setStatus(errorMessage);
          } finally {
            setSubmitting(false);
          }
        }}
      >
        {({ isSubmitting, status, errors, touched }) => (
          <Form>
            <Box display="flex" flexDirection="column" gap={2}>
              <Field
                as={TextField}
                name="email"
                label="Email"
                error={Boolean(touched.email && errors.email)}
                helperText={touched.email && errors.email}
                fullWidth
              />
              <Field
                as={TextField}
                name="password"
                type="password"
                label="Password"
                error={Boolean(touched.password && errors.password)}
                helperText={touched.password && errors.password}
                fullWidth
              />
              {status && (
                <Typography color="error" variant="body2">
                  {status}
                </Typography>
              )}
              <Button type="submit" variant="contained" disabled={isSubmitting}>
                Sign in
              </Button>
            </Box>
          </Form>
        )}
      </Formik>
    </Container>
  );
}
