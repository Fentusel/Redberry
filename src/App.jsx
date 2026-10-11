import {Home} from './pages/Home/Home'
import {Sessions} from './pages/Sessions/Sessions'
import { Routes, Route } from 'react-router-dom'
import {MovieDetailsPage} from './pages/MovieDetails/MovieDetails.jsx'

function App() {
    return (
        <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/sessions" element={<Sessions />} />
            <Route path="/movies/:slug" element={<MovieDetailsPage />} />
        </Routes>
    )
}

export default App