import {Home} from './pages/Home/Home'
import {Sessions} from './pages/Sessions/Sessions'
import { Routes, Route } from 'react-router-dom'
import {MovieDetailsPage} from './pages/MovieDetails/MovieDetails.jsx'
import AuthModal from './features/auth/AuthModal.jsx'
import ProtectedRoute from "./features/auth/ProtectedRoute.jsx";
import Profile from "./pages/User/Profile.jsx";

function App() {
    return (
        <>
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/sessions" element={<Sessions />} />
                <Route path="/movies/:slug" element={<MovieDetailsPage />} />
                <Route path="/profile" element={<ProtectedRoute> <Profile /></ProtectedRoute>}/>
            </Routes>
            <AuthModal/>
        </>
    )
}

export default App