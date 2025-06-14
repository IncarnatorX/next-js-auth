"use client";

import Spinner from "@/components/Spinner";
import axios, { AxiosError } from "axios";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function VerifyEmail() {
  const [token, setToken] = useState<string>("");
  const [verifying, setVerifying] = useState<boolean>(false);
  const [verificationMessage, setVerificationMessage] = useState<string>("");
  const [error, setError] = useState<boolean>(false);

  async function verifyUserEmail() {
    try {
      setVerifying(true);
      const response = await axios.post("/api/users/verify-email", { token });

      if (response.status === 201) {
        setVerificationMessage(response.data.message);
      }
    } catch (error) {
      console.error("Error in VerifyEmail: ", error);
      if (error instanceof AxiosError) {
        setError(true);
        setVerificationMessage(error.response?.data.message);
        console.error("Error: ", error);
        console.error("Error message: ", error.message);
        console.error("Error Cause: ", error.cause);
        console.error("Error code: ", error.code);
        console.error("Error config: ", error.config);
      }
    } finally {
      setVerifying(false);
    }
  }

  useEffect(() => {
    const searchParams = new URLSearchParams(window.location.search);
    const urlToken = searchParams.get("token")!;
    setToken(urlToken || "");
  }, []);

  useEffect(() => {
    if (token.length > 0) verifyUserEmail();
  }, [token]);

  return verifying ? (
    <div className="px-4 py-20 text-xl text-center flex flex-col gap-4 w-full items-center justify-center">
      <Spinner />
      <p className="p-2 text-gray-400">
        Verifying email, please wait.... Please do not close the window or
        refresh the window.
      </p>
    </div>
  ) : error ? (
    <div className="px-4 py-6 text-center text-red-500">
      <p className="my-3">
        {verificationMessage || "Something went wrong during verification."}
      </p>
      <Link href="/" className="underline text-sm text-blue-500">
        Go Home
      </Link>
    </div>
  ) : (
    <div className="px-4 py-6 text-center">
      <p className="my-3">
        {verificationMessage || "Email verified successfully."}
      </p>
      <Link href="/" className="underline text-sm text-blue-500">
        Go Home
      </Link>
    </div>
  );
}
