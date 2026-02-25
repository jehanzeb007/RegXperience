"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import useAppSelector from "../hooks/useAppSelector";
import useAppDispatch from "../hooks/useAppDispatch";
import { setCredentials } from "../store/authSlice";
import LoadingSpinner from "./LoadingSpinner";

type Props = {
  children: React.ReactNode;
};

export default function ProtectedRoute({ children }: Props) {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const auth = useAppSelector((s) => s.auth);
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    // quick client-side restore if Redux doesn't have token yet
    const tryRestore = async () => {
      if (auth.token) {
        setChecking(false);
        return;
      }

      try {
        const token = localStorage.getItem("auth.token");
        const userJson = localStorage.getItem("auth.user");
        if (token) {
          let user = null;
          if (userJson) {
            try {
              user = JSON.parse(userJson);
            } catch (e) {
              user = null;
            }
          }
          dispatch(setCredentials({ token, user }));
          setChecking(false);
          return;
        }
      } catch (e) {
        // ignore
      }

      setChecking(false);
    };

    tryRestore();
  }, [auth.token, dispatch]);

  useEffect(() => {
    if (!checking && !auth.token) {
      router.replace("/login");
    }
  }, [checking, auth.token, router]);

  if (checking || !auth.token) return <LoadingSpinner />;

  return <>{children}</>;
}
