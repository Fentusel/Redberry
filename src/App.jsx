import {Home} from './pages/Home/Home'
import {Sessions} from './pages/Sessions/Sessions'
import { Routes, Route } from 'react-router-dom'

function App() {
    return (
        <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/sessions" element={<Sessions />} />
        </Routes>
    )
}

export default App