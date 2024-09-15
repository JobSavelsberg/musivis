import './App.css'
import { ThemeProvider } from "@/components/theme-provider"
import { Route, Routes } from 'react-router-dom';
import Home from './routes/Home';
import Callback from './routes/Callback';

function App() {
 
  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <Routes>
        <Route path="/" element={<Home/>} />
        <Route path="/callback" element={<Callback />} />
      </Routes>
    </ThemeProvider>
  )
}

export default App