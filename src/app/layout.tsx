'use client';
import "@/css/satoshi.css";
import "@/css/style.css";
import React, { useEffect, useState } from "react";
import Loader from "@/components/common/Loader";
import { QueryClientProvider, QueryClient } from "@tanstack/react-query";
import { useStore } from "@/reducers/store";
import { useRouter } from "next/navigation";
import { validateToken } from "./lib/dbActions";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [loading, setLoading] = useState<boolean>(true);
  const queryClient = new QueryClient()
  const { authenticate: setAuth} = useStore()
  const route = useRouter()
  
  const authenticate = () => {
    const authToken = localStorage.getItem("authToken")

    if (authToken) {
      validateToken(authToken)
        .then(res => {
          if (res?.status !== 200) {
            console.log(29, res?.status);
            route.push("/auth/signin")
            setLoading(false)
          }}) 
    } else {
      route.push("/auth/signin")
    }
  }

  useEffect(() => {
    setTimeout(() => setLoading(false), 1000);
  }, []);

  useEffect(() => {
    authenticate()
  }, [])

  // TODO: CORREGIR CARGA DE PÄGINA

  return (
    <html lang="en">
      <body suppressHydrationWarning={true}>
        <QueryClientProvider client={ queryClient }>
          <div className="dark:bg-boxdark-2 dark:text-bodydark">
            {loading ? <Loader /> : children}
          </div>
        </QueryClientProvider>
      </body>
    </html>
  );
}
