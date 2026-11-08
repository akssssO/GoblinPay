import { useEffect, useState } from 'react'
import { Moon, Sun } from 'lucide-react'

export default function ThemeToggle() {
  const [theme, setTheme] = useState<'cave' | 'forest'>(() => {
    const saved = localStorage.getItem('goblin-theme')
    return saved === 'forest' ? 'forest' : 'cave'
  })
  useEffect(() => {
    document.documentElement.dataset.goblinTheme = theme
    localStorage.setItem('goblin-theme', theme)
  }, [theme])
  return <button type="button" className="theme-toggle" onClick={() => setTheme(t => t === 'cave' ? 'forest' : 'cave')} aria-label="Toggle theme">
    {theme === 'cave' ? <Sun size={16}/> : <Moon size={16}/>}
    {theme === 'cave' ? 'Enchanted Forest' : 'Goblin Cave'}
  </button>
}