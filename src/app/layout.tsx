'use client';
import "@/css/satoshi.css";
import "@/css/style.css";
import React, { useEffect, useState } from "react";
import Loader from "@/components/common/Loader";
import { QueryClientProvider, QueryClient } from "@tanstack/react-query";
import { userStore } from "@/reducers/store";
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
  const route = useRouter()
  const { setEmail, setUser, email, user} = userStore()

  const handleLoading = () => {
    setTimeout(() => {
      setLoading(false)
    }, 200)
  }

  const getData = async (token: string, email: string) => {
      return await getUserData(token, email)
        .then(res => {
          if (res?.status === 200) {
            localStorage.setItem("userData", JSON.stringify(res.userData))
            setUser(res.userData)
            return true
          } else {
            return false
          }
        })
  }

  const redirect = (status: boolean) => {
    if (status) {
      route.push("/")
    } else {
      route.push("/auth/signin")
    }
    handleLoading()
  }

  const authenticate = () => {  

    const token = localStorage.getItem("authToken")

    if (token) {
      try {
        
        validateToken(token)
          .then(res => {
            if (res?.status === 200) {
              setEmail(res.email)
              const userData = localStorage.getItem("userData")
              if (userData) {
                setUser(JSON.parse(userData))
                redirect(true)
              } else {
                getData(token, email)
                .then(res => {
                  if (res) {
                    redirect(true)
                  } else {
                    redirect(false)
                  }
                })
              }
              
            } else {
              redirect(false)
            }
          })

      } catch (error) {
        console.log(error);
      }
    }

    else {
      redirect(false)
    }
  }

  useEffect(() => {
    authenticate()
  }, [])

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
