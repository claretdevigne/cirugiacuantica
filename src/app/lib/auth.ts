'use server'

export const useAuth = async (user: string, pass: string) => {

  const fakeUser = "ernestoalcudia@cirugiascuanticas.com"
  const fakePassword = "123456"

  const status = (status: number) => { status: status }
  
  if (fakeUser === user && fakePassword === pass) {
    // localStorage.setItem("authToken", "true")
    return { status: 200 }
  } else {
    return { status: 401 }
  }
}