import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { API_BASE_URL } from "../config";

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        navigate("/", { replace: true });
        return;
      }

      try {
        const res = await axios.get(`${API_BASE_URL}/api/user`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (res.data.authenticated) {
          setIsAuthenticated(true);
          localStorage.setItem("userSub", res.data.user.userId);
          // Optionally save user info to localStorage or context
          // localStorage.setItem("userEmail", res.data.user.email);
        } else {
          navigate("/", { replace: true });
        }
      } catch (err) {
        console.error("Auth check failed:", err);
        navigate("/", { replace: true });
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, [navigate]);

  if (loading) return <div>Loading...</div>;

  return <>{isAuthenticated && children}</>;
};

export default ProtectedRoute;
