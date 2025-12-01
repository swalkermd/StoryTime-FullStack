import { useState, useEffect } from 'react'
import { AudioPlayer } from './components/AudioPlayer'
import { PlayerUI } from './components/PlayerUI'
import { Library } from './components/Library'

function App() {
  const [serverStatus, setServerStatus] = useState('checking...')

  useEffect(() => {
    fetch('/api/health')
      .then(res => res.json())
      .then(() => setServerStatus('online'))
      .catch(() => setServerStatus('offline'))
  }, [])

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <AudioPlayer />
      
      <header className="p-4 border-b border-slate-900 flex justify-between items-center">
         <span className="font-bold tracking-wider text-indigo-500">VIBECODE STORY</span>
         <div className="text-xs flex items-center gap-2">
            <div className={`w-2 h-2 rounded-full ${serverStatus === 'online' ? 'bg-emerald-500' : 'bg-red-500'}`} />
            <span className="text-slate-600">{serverStatus}</span>
         </div>
      </header>

      <main>
        <Library />
      </main>

      <PlayerUI />
    </div>
  )
}

export default App
