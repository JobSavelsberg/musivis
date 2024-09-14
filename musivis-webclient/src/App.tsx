import { useState, useEffect } from 'react';
import './App.css'
import { ThemeProvider } from "@/components/theme-provider"
import { ModeToggle } from './components/ui/mode-toggle';

function App() {
  const [status, setStatus] = useState<string | null>(null);

  useEffect(() => {
    fetch('https://musivis-api.fly.dev/status')
      .then(response => response.text())
      .then(responseText => setStatus(responseText))
      .catch(error => console.error('Error fetching data:', error));
  }, []);

  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <h1 className="text-3xl font-bold underline">
        Musivis
      </h1>
      <p className="text-xl">
        {status ? status : 'Loading status...'}
      </p>
      <div className='p-2'>
        <ModeToggle></ModeToggle>
      </div>
    </ThemeProvider>
  )
}

export default App