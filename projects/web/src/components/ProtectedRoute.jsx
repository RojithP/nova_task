import { useEffect, useContext, createContext, useState } from "react";
import { Navigate, Outlet, useNavigate } from "react-router-dom";
import axiosHttp from "../helper/axios";

const AuthContext = createContext(null);

export default function AuthProtectedRoute() {
    const [auth, setAuth] = useState(null);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    const checkAuthentication = async function () {
        let checkAuth = await axiosHttp.get("/validatetoken");
        setLoading(false);
        if (
            checkAuth.status == 200 &&
            Object.keys(checkAuth.data?.data).length > 0
        ) {
            setAuth(checkAuth.data?.data);
        } else {
            localStorage.removeItem("token");
            navigate("/login");
        }
    };

    useEffect(() => {
        checkAuthentication();
    }, []);

    const logout = function () {
        localStorage.removeItem("token");
        setTimeout(() => {
            navigate("/login", { replace: true })
        }, 0)
    }

    if (loading) {
        return (
            <div className="text-center">
                <div className="space-y-4 p-4 w-full max-w-md mx-auto">
                    <div className="h-32 bg-gray-300 rounded-lg animate-pulse"></div>
                    <div className="h-6 bg-gray-300 rounded w-3/4 animate-pulse"></div>
                    <div className="space-y-2">
                        <div className="h-4 bg-gray-300 rounded w-full animate-pulse"></div>
                        <div className="h-4 bg-gray-300 rounded w-5/6 animate-pulse"></div>
                    </div>
                    <div className="h-10 bg-gray-300 rounded w-1/2 animate-pulse"></div>
                </div>
            </div>
        );
    }
    return !auth ? (
        <Navigate to={"/login"} replace />
    ) : (
        <AuthContext.Provider value={{ auth, setAuth, logout }}>
            <Outlet />
        </AuthContext.Provider>
    );
}

export const useAuth = () => useContext(AuthContext)