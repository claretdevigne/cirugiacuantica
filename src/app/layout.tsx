'use client';
import "@/css/satoshi.css";
import "@/css/style.css";
import React, { useEffect, useState } from "react";
import Loader from "@/components/common/Loader";
import { QueryClientProvider, QueryClient } from "@tanstack/react-query";
import { loadingStore, useStore, userStore } from "@/reducers/store";
import { useRouter } from "next/navigation";
import { getUserData, validateToken } from "./lib/dbActions";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [loading, setLoading] = useState(true)
  const queryClient = new QueryClient()
  const { authenticate: setAuth} = useStore()
  const route = useRouter()
  const { setEmail, setUser } = userStore()

  // const { loading } = loadingStore()
  const handleLoading = () => {
    setTimeout(() => {
      setLoading(false)
    }, 200)
  }

  const authenticate = () => {
    localStorage.setItem("authToken", "asdasdas")
    const token = localStorage.getItem("authToken")
    
    //TODO: DESCOMENTAR
    if (token) {
      validateToken(token)
        .then(res => {
          if (res?.status === 401){
            route.push("/auth/signin")
            handleLoading()
          } else if (res?.status === 200){
            getUserData(token, res.email)
              .then(userRes => {
                if (userRes?.status === 200) {
                  setUser(userRes.userData)
                }
              })
            route.push("/")
            handleLoading()
          }
        })
    } else {
      route.push("/auth/signin")
    }
  }

  useEffect(() => {
    authenticate()
    //TODO: BORRAR LOG
    console.log("PUNTO DE ENTRADA: Layout.tsx");
    
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
