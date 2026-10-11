import { useEffect } from "react";
import { Navigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { openLogin } from "../../store/slices/authSlice.js";

export default function ProtectedRoute({ children }) {
    const dispatch = useDispatch();
    const token = useSelector((s) => s.auth.token);

    useEffect(() => {
        if (!token) dispatch(openLogin());
    }, [token, dispatch]);

    if (!token) return <Navigate to="/" replace />;
    return children;
}