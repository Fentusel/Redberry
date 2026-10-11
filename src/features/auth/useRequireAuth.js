import { useDispatch, useSelector } from "react-redux";
import { openLogin } from "../../store/slices/authSlice.js";
import { addPending } from "./authQueue.js";

export default function useRequireAuth() {
    const dispatch = useDispatch();
    const token = useSelector((s) => s.auth.token);

    return (action) => {
        if (!token) {
            addPending({ run: action });
            dispatch(openLogin());
            return;
        }
        action();
    };
}