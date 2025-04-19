"use client";
import "../globals.css";
import { Toaster } from "react-hot-toast";
import { UserProvider, useUser } from "@/context/UserContext";
import SideNav from "./SideNav";
import { useEffect } from "react";
import axios from "axios";

const Component = ({ children }: { children: React.ReactNode }) => {
  const { setUser } = useUser();
  useEffect(() => {
    const fetchUser = async () => {
      const response = await axios.get("/api/auth/verifytoken");
      if (response.data) {
        setUser(response.data.data);
      }
    };
    fetchUser();
  }, []);
  return (
    <html lang="en">
      <head>
        <title>Image3Dify - Generate image from sketch</title>
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta
          name="description"
          content="Image3Dify is a Next.js-based web application that converts 2D images into 3D illustrations using AI and depth estimation techniques. Users can upload an image, and the system will generate a 3D model that can be viewed and interacted with."
        />
      </head>
      <body className={`antialiased`}>
        <Toaster />
        <SideNav>{children}</SideNav>
      </body>
    </html>
  );
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <UserProvider>
      <Component>{children}</Component>
    </UserProvider>
  );
}
