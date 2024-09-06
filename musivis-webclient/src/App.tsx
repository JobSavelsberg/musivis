import { useState, useEffect } from 'react';
import './App.css'

function App() {
  const [status, setStatus] = useState<string | null>(null);

  useEffect(() => {
    fetch('https://musivis-api.fly.dev/status')
      .then(response => response.text())
      .then(responseText => setStatus(responseText))
      .catch(error => console.error('Error fetching data:', error));
  }, []);

  return (
    <>
      <h1 className="text-3xl font-bold underline">
        Musivis
      </h1>
      <p className="text-xl">
        {status ? status : 'Loading status...'}
      </p>
    </>
  )
}

export default App
