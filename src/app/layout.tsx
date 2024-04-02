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
            localStorage.setItem("userData", res.userData)
            const data = JSON.parse(res.userData)
            setUser(data)
            return {
              status: true,
              admin: data.admin
            }
          } else {
            return {
              status: false
            }
          }
        })
  }

  const redirect = (status: boolean, admin: boolean) => {
    if (status) {
      if (admin) {
        route.push("/admin/dashboard")    
      } else {
        route.push("/")
      }
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
                const data = JSON.parse(userData)
                setUser(data)
                redirect(true, data.admin)
              } else {
                getData(token, email)
                .then(res => {
                  if (res.status) {
                    redirect(true, res.admin)
                  } else {
                    redirect(false, false)
                  }
                })
              }
              
            } else {
              redirect(false, false)
            }
          })

      } catch (error) {
        console.log(error);
      }
    }

    else {
      redirect(false, false)
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
