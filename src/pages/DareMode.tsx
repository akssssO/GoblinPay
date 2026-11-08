/*
import { useState } from 'react'
import { Trophy, Flame, Zap, CheckCircle, Crown, Target } from 'lucide-react'
import '../App.css'

const initialChallenges = [
  { id: 1, title: 'The Early Bird', description: 'Settle your pending share before the timer runs out.', xp: 20, emoji: '🐦' },
  { id: 2, title: 'Generous Goblin', description: 'Help a friend settle their share.', xp: 40, emoji: '💚' },
  { id: 3, title: 'Receipt Raider', description: 'Scan and split your next group receipt.', xp: 30, emoji: '🧾' },
  { id: 4, title: 'Goblin Legend', description: 'Complete three goblin challenges.', xp: 50, emoji: '👑' },
]

const players = [
  { name: 'You', xp: 720, emoji: '🧌' },
  { name: 'Rahul', xp: 650, emoji: '🦊' },
  { name: 'Priya', xp: 520, emoji: '🐸' },
  { name: 'Sam', xp: 390, emoji: '🐻' },
]

export default function DareMode() {
  const [completed, setCompleted] = useState<number[]>([])
  const [xp, setXp] = useState(720)

  function completeChallenge(id: number, reward: number) {
    if (completed.includes(id)) return
    setCompleted(prev => [...prev, id])
    setXp(prev => prev + reward)
  }

  return (
    <div className="dare-page">
      <div className="dare-hero">
        <div>
          <span className="eyebrow">🧌 THE GOBLIN CHALLENGES YOU</span>
          <h1>Welcome to <span>Dare Mode.</span></h1>
          <p>Complete challenges. Earn XP. Become a legend.</p>
        </div>
        <div className="dare-mascot">👹</div>
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-heading">YOUR XP <Zap size={18}/></div>
          <div className="stat-value">{xp} XP</div>
          <div className="stat-note">Keep feeding the Goblin!</div>
        </div>
        <div className="stat-card">
          <div className="stat-heading">COMPLETED <CheckCircle size={18}/></div>
          <div className="stat-value">{completed.length}/4</div>
          <div className="stat-note">Challenges conquered</div>
        </div>
        <div className="stat-card">
          <div className="stat-heading">CURRENT LEVEL <Flame size={18}/></div>
          <div className="stat-value">Level {Math.floor(xp / 200) + 1}</div>
          <div className="stat-note">Goblin rising!</div>
        </div>
      </div>

      <div className="panel dare-challenges">
        <div className="panel-heading">
          <div>
            <h2><Target size={20}/> Goblin Challenges</h2>
            <p>Complete quests and collect your XP.</p>
          </div>
          <span className="nav-new">DAILY QUESTS</span>
        </div>

        {initialChallenges.map(challenge => {
          const done = completed.includes(challenge.id)
          return (
            <div className="group-row" key={challenge.id}>
              <div className="group-emoji">{challenge.emoji}</div>
              <div className="group-info">
                <strong>{challenge.title}</strong>
                <small>{challenge.description}</small>
              </div>
              <div className="group-money">
                <strong>+{challenge.xp} XP</strong>
                <button
                  className="text-button"
                  disabled={done}
                  onClick={() => completeChallenge(challenge.id, challenge.xp)}
                >
                  {done ? 'Completed ✓' : 'Claim reward'}
                </button>
              </div>
            </div>
          )
        })}
      </div>

      <div className="panel leaderboard-panel">
        <div className="panel-heading">
          <div>
            <h2><Trophy size={20}/> Goblin leaderboard</h2>
            <p>Who's ruling the goblin kingdom?</p>
          </div>
          <Crown color="#b8ed70"/>
        </div>
        {[...players].map((player, index) => (
          <div className="activity-row" key={player.name}>
            <strong>#{index + 1}</strong>
            <div className="avatar">{player.emoji}</div>
            <div className="activity-info">
              <strong>{player.name}</strong>
              <small>{player.name === 'You' ? 'Your adventure' : 'Goblin challenger'}</small>
            </div>
            <strong>{player.name === 'You' ? xp : player.xp} XP</strong>
          </div>
        ))}
      </div>
    </div>
  )
}*/


//second

/*import { useEffect, useMemo, useState } from 'react'
import { CheckCircle, Clock3, Flame, ImagePlus, ShieldCheck, Sparkles, Trophy, XCircle, Zap } from 'lucide-react'
import '../goblin-upgrades.css'

type Challenge = { id: number; title: string; description: string; xp: number; emoji: string }
type Submission = { id: number; challengeId: number; challengeTitle: string; proof: string; fileName?: string; status: 'pending' | 'approved' | 'rejected'; createdAt: number }

const challenges: Challenge[] = [
  { id: 1, title: 'The Early Bird', description: 'Settle one pending share before the day ends.', xp: 20, emoji: '🐦' },
  { id: 2, title: 'Generous Goblin', description: 'Help a friend understand or settle their share.', xp: 40, emoji: '💚' },
  { id: 3, title: 'Receipt Raider', description: 'Scan a receipt and split it with your group.', xp: 30, emoji: '🧾' },
]
const punishments = ['Wear the Goblin profile frame for a day', 'Post a dramatic apology in the group', 'Become the group meme curator', 'Take one bonus silly dare', 'Send the group a goblin compliment']
const todayKey = () => new Date().toISOString().slice(0, 10)
const readSubmissions = (): Submission[] => {
  try { return JSON.parse(localStorage.getItem('goblin-dare-submissions') || '[]') as Submission[] } catch { return [] }
}

export default function DareMode() {
  const [submissions, setSubmissions] = useState<Submission[]>(readSubmissions)
  const [selected, setSelected] = useState<Challenge | null>(null)
  const [proof, setProof] = useState('')
  const [fileName, setFileName] = useState('')
  const [now, setNow] = useState(Date.now())
  const [showWheel, setShowWheel] = useState(false)
  const [punishment, setPunishment] = useState('')
  const [spinning, setSpinning] = useState(false)
  const [toast, setToast] = useState('')

  useEffect(() => {
    const timer = window.setInterval(() => setNow(Date.now()), 1000)
    return () => window.clearInterval(timer)
  }, [])
  useEffect(() => {
    localStorage.setItem('goblin-dare-submissions', JSON.stringify(submissions))
  }, [submissions])

  const deadline = useMemo(() => {
    const end = new Date()
    end.setHours(23, 59, 59, 999)
    return end.getTime()
  }, [now])
  const remaining = Math.max(0, deadline - now)
  const hours = Math.floor(remaining / 3600000)
  const minutes = Math.floor((remaining % 3600000) / 60000)
  const seconds = Math.floor((remaining % 60000) / 1000)
  const xp = 720 + submissions.filter(s => s.status === 'approved').reduce((sum, s) => sum + (challenges.find(c => c.id === s.challengeId)?.xp || 0), 0)
  const completedIds = submissions.filter(s => s.status === 'approved' && new Date(s.createdAt).toISOString().slice(0, 10) === todayKey()).map(s => s.challengeId)

  function submitProof() {
    if (!selected || (!proof.trim() && !fileName)) return
    setSubmissions(prev => [...prev, {
      id: Date.now(), challengeId: selected.id, challengeTitle: selected.title,
      proof: proof.trim(), fileName, status: 'pending', createdAt: Date.now()
    }])
    setSelected(null); setProof(''); setFileName('')
    setToast('Proof sent to the Goblin Review Board!')
    window.setTimeout(() => setToast(''), 2800)
  }
  function review(id: number, status: 'approved' | 'rejected') {
    setSubmissions(prev => prev.map(item => item.id === id ? { ...item, status } : item))
    setToast(status === 'approved' ? 'Proof approved! XP unlocked. ✨' : 'Proof rejected. You can submit again.')
    window.setTimeout(() => setToast(''), 2800)
  }
  function spinWheel() {
    if (spinning) return
    setSpinning(true); setPunishment('')
    window.setTimeout(() => {
      setPunishment(punishments[Math.floor(Math.random() * punishments.length)])
      setSpinning(false)
    }, 1800)
  }

  return (
    <div className="dare-page goblin-dare">
      <div className="dare-hero goblin-hero">
        <div>
          <span className="eyebrow">🧌 THE GOBLIN CHALLENGES YOU</span>
          <h1>Welcome to <span>Dare Mode.</span></h1>
          <p>Prove your chaos. Earn your XP. Feed the Goblin.</p>
          <div className="dare-countdown"><Clock3 size={16}/> DAILY RESET IN <strong>{String(hours).padStart(2, '0')}:{String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}</strong></div>
        </div>
        <div className="dare-mascot goblin-bounce" aria-label="Goblin mascot">👹</div>
        <span className="floating-coin coin-one">🪙</span><span className="floating-coin coin-two">✨</span>
      </div>

      <div className="stats-grid">
        <div className="stat-card"><div className="stat-heading">YOUR XP <Zap size={18}/></div><div className="stat-value">{xp} XP</div><div className="stat-note">Only approved proofs count</div></div>
        <div className="stat-card"><div className="stat-heading">APPROVED <CheckCircle size={18}/></div><div className="stat-value">{completedIds.length}/{challenges.length}</div><div className="stat-note">Today's quests conquered</div></div>
        <div className="stat-card"><div className="stat-heading">CURRENT LEVEL <Flame size={18}/></div><div className="stat-value">Level {Math.floor(xp / 200) + 1}</div><div className="stat-note">Goblin rising!</div></div>
      </div>

      <section className="panel dare-challenges">
        <div className="panel-heading"><div><h2><Trophy size={20}/> Today's shared-style dare board</h2><p>Demo mode: progress is saved in this browser only.</p></div><span className="nav-new">DAILY QUESTS</span></div>
        {challenges.map(challenge => {
          const latest = [...submissions].reverse().find(s => s.challengeId === challenge.id && new Date(s.createdAt).toISOString().slice(0, 10) === todayKey())
          const done = completedIds.includes(challenge.id)
          return <div className="group-row dare-quest" key={challenge.id}>
            <div className="group-emoji">{challenge.emoji}</div>
            <div className="group-info"><strong>{challenge.title}</strong><small>{challenge.description}</small><small className="dare-status">{done ? '✓ Approved' : latest?.status === 'pending' ? '◷ Awaiting review' : latest?.status === 'rejected' ? '↻ Needs another proof' : '○ Not submitted'}</small></div>
            <div className="group-money"><strong>+{challenge.xp} XP</strong><button className="text-button" disabled={done || latest?.status === 'pending'} onClick={() => setSelected(challenge)}>{done ? 'Completed ✓' : latest?.status === 'pending' ? 'In review' : 'Submit proof'}</button></div>
          </div>
        })}
      </section>

      <section className="panel review-panel">
        <div className="panel-heading"><div><h2><ShieldCheck size={19}/> Goblin Review Board</h2><p>Local demo review controls. Real group approval comes with a backend later.</p></div><Sparkles size={20}/></div>
        {submissions.length === 0 ? <p className="empty-review">No proofs yet. Pick a quest and show the Goblin what you've got.</p> : [...submissions].reverse().map(item => <div className="review-row" key={item.id}>
          <div><strong>{item.challengeTitle}</strong><small>{item.fileName || item.proof || 'Proof attached'} · {new Date(item.createdAt).toLocaleTimeString()}</small></div>
          <span className={`review-state ${item.status}`}>{item.status}</span>
          {item.status === 'pending' && <div className="review-actions"><button onClick={() => review(item.id, 'approved')}><CheckCircle size={14}/> Approve demo</button><button onClick={() => review(item.id, 'rejected')}><XCircle size={14}/> Reject</button></div>}
        </div>)}
      </section>

      <section className="punishment-banner">
        <div className="punishment-emoji">😈</div><div><strong>Missed the deadline?</strong><p>The Goblin Wheel picks a harmless, silly consequence. No money penalties. No real-world harm.</p></div>
        <button className="dare-button" onClick={() => { setShowWheel(true); setPunishment('') }}>Spin the wheel 🎡</button>
      </section>

      {selected && <div className="goblin-modal-backdrop" onClick={() => setSelected(null)}><div className="goblin-modal" onClick={e => e.stopPropagation()}>
        <button className="goblin-modal-close" onClick={() => setSelected(null)}>✕</button><div className="modal-emoji">{selected.emoji}</div><h2>Prove your quest</h2><p>{selected.title} · Reward: +{selected.xp} XP after approval</p>
        <label className="proof-upload"><ImagePlus size={19}/> {fileName || 'Attach a photo / screenshot / video'}<input type="file" accept="image/*,video/*" onChange={e => setFileName(e.target.files?.[0]?.name || '')}/></label>
        <textarea value={proof} onChange={e => setProof(e.target.value)} placeholder="Or describe what you did..." rows={3}/>
        <button className="primary-button modal-submit" disabled={!proof.trim() && !fileName} onClick={submitProof}>Send for approval <Sparkles size={16}/></button>
        <small className="demo-note">Demo note: file name and text are saved locally; the actual file is not uploaded.</small>
      </div></div>}

      {showWheel && <div className="devil-overlay"><div className="devil-glow">😈</div><button className="goblin-modal-close" onClick={() => setShowWheel(false)}>✕</button><p className="wheel-kicker">THE GOBLIN COURT</p><h2>YOUR FATE AWAITS</h2><div className={`punishment-wheel ${spinning ? 'is-spinning' : ''}`}>🧌<span>🎡</span></div>{punishment ? <div className="punishment-result"><small>THE GOBLIN HAS DECIDED</small><strong>{punishment}</strong></div> : <p className="wheel-hint">Spin for a harmless consequence.</p>}<button className="wheel-spin-button" disabled={spinning} onClick={spinWheel}>{spinning ? 'THE WHEEL SPINS…' : punishment ? 'SPIN AGAIN' : 'SPIN THE WHEEL'}</button></div>}
      {toast && <div className="goblin-toast">{toast}</div>}
    </div>
  )
}*/


// third


import { useEffect, useMemo, useState } from 'react'
import { CheckCircle, Clock3, Flame, ImagePlus, ShieldCheck, Sparkles, Trophy, XCircle, Zap } from 'lucide-react'
import '../goblin-upgrades.css'

type Challenge = { id: number; title: string; description: string; xp: number; emoji: string }
type Submission = { id: number; challengeId: number; challengeTitle: string; proof: string; fileName?: string; status: 'pending' | 'approved' | 'rejected'; createdAt: number }

const challenges: Challenge[] = [
  { id: 1, title: 'The Early Bird', description: 'Settle one pending share before the day ends.', xp: 20, emoji: '🐦' },
  { id: 2, title: 'Generous Goblin', description: 'Help a friend understand or settle their share.', xp: 40, emoji: '💚' },
  { id: 3, title: 'Receipt Raider', description: 'Scan a receipt and split it with your group.', xp: 30, emoji: '🧾' },
]
const punishments = ['Wear the Goblin profile frame for a day', 'Post a dramatic apology in the group', 'Become the group meme curator', 'Take one bonus silly dare', 'Send the group a goblin compliment']
const todayKey = () => new Date().toISOString().slice(0, 10)
const readSubmissions = (): Submission[] => {
  try { return JSON.parse(localStorage.getItem('goblin-dare-submissions') || '[]') as Submission[] } catch { return [] }
}

export default function DareMode() {
  const [submissions, setSubmissions] = useState<Submission[]>(readSubmissions)
  const [selected, setSelected] = useState<Challenge | null>(null)
  const [proof, setProof] = useState('')
  const [fileName, setFileName] = useState('')
  const [now, setNow] = useState(Date.now())
  const [showWheel, setShowWheel] = useState(false)
  const [punishment, setPunishment] = useState('')
  const [spinning, setSpinning] = useState(false)
  const [wheelStage, setWheelStage] = useState<'intro' | 'countdown' | 'spinning' | 'result'>('intro')
  const [countdown, setCountdown] = useState(3)
  const [toast, setToast] = useState('')

  useEffect(() => {
    const timer = window.setInterval(() => setNow(Date.now()), 1000)
    return () => window.clearInterval(timer)
  }, [])
  useEffect(() => {
    localStorage.setItem('goblin-dare-submissions', JSON.stringify(submissions))
  }, [submissions])

  const deadline = useMemo(() => {
    const end = new Date()
    end.setHours(23, 59, 59, 999)
    return end.getTime()
  }, [now])
  const remaining = Math.max(0, deadline - now)
  const hours = Math.floor(remaining / 3600000)
  const minutes = Math.floor((remaining % 3600000) / 60000)
  const seconds = Math.floor((remaining % 60000) / 1000)
  const xp = 720 + submissions.filter(s => s.status === 'approved').reduce((sum, s) => sum + (challenges.find(c => c.id === s.challengeId)?.xp || 0), 0)
  const completedIds = submissions.filter(s => s.status === 'approved' && new Date(s.createdAt).toISOString().slice(0, 10) === todayKey()).map(s => s.challengeId)

  function submitProof() {
    if (!selected || (!proof.trim() && !fileName)) return
    setSubmissions(prev => [...prev, {
      id: Date.now(), challengeId: selected.id, challengeTitle: selected.title,
      proof: proof.trim(), fileName, status: 'pending', createdAt: Date.now()
    }])
    setSelected(null); setProof(''); setFileName('')
    setToast('Proof sent to the Goblin Review Board!')
    window.setTimeout(() => setToast(''), 2800)
  }
  function review(id: number, status: 'approved' | 'rejected') {
    setSubmissions(prev => prev.map(item => item.id === id ? { ...item, status } : item))
    setToast(status === 'approved' ? 'Proof approved! XP unlocked. ✨' : 'Proof rejected. You can submit again.')
    window.setTimeout(() => setToast(''), 2800)
  }
  useEffect(() => {
    if (!showWheel) return
    if (wheelStage === 'countdown' && countdown > 0) {
      const timer = window.setTimeout(() => setCountdown(value => value - 1), 850)
      return () => window.clearTimeout(timer)
    }
    if (wheelStage === 'countdown' && countdown === 0) {
      setWheelStage('spinning')
      setSpinning(true)
      return
    }
    if (wheelStage === 'spinning') {
      const timer = window.setTimeout(() => {
        setPunishment(punishments[Math.floor(Math.random() * punishments.length)])
        setSpinning(false)
        setWheelStage('result')
      }, 3200)
      return () => window.clearTimeout(timer)
    }
  }, [showWheel, wheelStage, countdown])

  function spinWheel() {
    if (spinning) return
    setPunishment('')
    setCountdown(3)
    setWheelStage('countdown')
  }

  return (
    <div className="dare-page goblin-dare">
      <div className="dare-hero goblin-hero">
        <div>
          <span className="eyebrow">🧌 THE GOBLIN CHALLENGES YOU</span>
          <h1>Welcome to <span>Dare Mode.</span></h1>
          <p>Prove your chaos. Earn your XP. Feed the Goblin.</p>
          <div className="dare-countdown"><Clock3 size={16}/> DAILY RESET IN <strong>{String(hours).padStart(2, '0')}:{String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}</strong></div>
        </div>
        <div className="dare-mascot goblin-bounce" aria-label="Goblin mascot">👹</div>
        <span className="floating-coin coin-one">🪙</span><span className="floating-coin coin-two">✨</span>
      </div>

      <div className="stats-grid">
        <div className="stat-card"><div className="stat-heading">YOUR XP <Zap size={18}/></div><div className="stat-value">{xp} XP</div><div className="stat-note">Only approved proofs count</div></div>
        <div className="stat-card"><div className="stat-heading">APPROVED <CheckCircle size={18}/></div><div className="stat-value">{completedIds.length}/{challenges.length}</div><div className="stat-note">Today's quests conquered</div></div>
        <div className="stat-card"><div className="stat-heading">CURRENT LEVEL <Flame size={18}/></div><div className="stat-value">Level {Math.floor(xp / 200) + 1}</div><div className="stat-note">Goblin rising!</div></div>
      </div>

      <section className="panel dare-challenges">
        <div className="panel-heading"><div><h2><Trophy size={20}/> Today's shared-style dare board</h2><p>Demo mode: progress is saved in this browser only.</p></div><span className="nav-new">DAILY QUESTS</span></div>
        {challenges.map(challenge => {
          const latest = [...submissions].reverse().find(s => s.challengeId === challenge.id && new Date(s.createdAt).toISOString().slice(0, 10) === todayKey())
          const done = completedIds.includes(challenge.id)
          return <div className="group-row dare-quest" key={challenge.id}>
            <div className="group-emoji">{challenge.emoji}</div>
            <div className="group-info"><strong>{challenge.title}</strong><small>{challenge.description}</small><small className="dare-status">{done ? '✓ Approved' : latest?.status === 'pending' ? '◷ Awaiting review' : latest?.status === 'rejected' ? '↻ Needs another proof' : '○ Not submitted'}</small></div>
            <div className="group-money"><strong>+{challenge.xp} XP</strong><button className="text-button" disabled={done || latest?.status === 'pending'} onClick={() => setSelected(challenge)}>{done ? 'Completed ✓' : latest?.status === 'pending' ? 'In review' : 'Submit proof'}</button></div>
          </div>
        })}
      </section>

      <section className="panel review-panel">
        <div className="panel-heading"><div><h2><ShieldCheck size={19}/> Goblin Review Board</h2><p>Local demo review controls. Real group approval comes with a backend later.</p></div><Sparkles size={20}/></div>
        {submissions.length === 0 ? <p className="empty-review">No proofs yet. Pick a quest and show the Goblin what you've got.</p> : [...submissions].reverse().map(item => <div className="review-row" key={item.id}>
          <div><strong>{item.challengeTitle}</strong><small>{item.fileName || item.proof || 'Proof attached'} · {new Date(item.createdAt).toLocaleTimeString()}</small></div>
          <span className={`review-state ${item.status}`}>{item.status}</span>
          {item.status === 'pending' && <div className="review-actions"><button onClick={() => review(item.id, 'approved')}><CheckCircle size={14}/> Approve demo</button><button onClick={() => review(item.id, 'rejected')}><XCircle size={14}/> Reject</button></div>}
        </div>)}
      </section>

      <section className="punishment-banner">
        <div className="punishment-emoji">😈</div><div><strong>Missed the deadline?</strong><p>The Goblin Wheel picks a harmless, silly consequence. No money penalties. No real-world harm.</p></div>
        <button className="dare-button" onClick={() => { setShowWheel(true); setPunishment(''); setWheelStage('intro'); setCountdown(3) }}>Spin the wheel 🎡</button>
      </section>

      {selected && <div className="goblin-modal-backdrop" onClick={() => setSelected(null)}><div className="goblin-modal" onClick={e => e.stopPropagation()}>
        <button className="goblin-modal-close" onClick={() => setSelected(null)}>✕</button><div className="modal-emoji">{selected.emoji}</div><h2>Prove your quest</h2><p>{selected.title} · Reward: +{selected.xp} XP after approval</p>
        <label className="proof-upload"><ImagePlus size={19}/> {fileName || 'Attach a photo / screenshot / video'}<input type="file" accept="image/*,video/*" onChange={e => setFileName(e.target.files?.[0]?.name || '')}/></label>
        <textarea value={proof} onChange={e => setProof(e.target.value)} placeholder="Or describe what you did..." rows={3}/>
        <button className="primary-button modal-submit" disabled={!proof.trim() && !fileName} onClick={submitProof}>Send for approval <Sparkles size={16}/></button>
        <small className="demo-note">Demo note: file name and text are saved locally; the actual file is not uploaded.</small>
      </div></div>}

      {showWheel && <div className="devil-overlay" role="dialog" aria-modal="true" aria-label="Goblin punishment wheel">
        <button className="goblin-modal-close" onClick={() => setShowWheel(false)} aria-label="Close">✕</button>
        <div className="wheel-goblin-art"><span className="wheel-goblin-crown">♛</span><span className="wheel-goblin-face">🧌</span><span className="wheel-goblin-spark">✦</span></div>
        <p className="wheel-kicker">THE GOBLIN COURT</p>
        {wheelStage === 'intro' && <><h2>THE COUNCIL HAS SUMMONED YOU.</h2><p className="wheel-hint">A deadline was missed. Your fate is silly, harmless, and entirely non-monetary.</p><div className="wheel-teaser">THE WHEEL OF QUESTIONABLE DECISIONS</div><button className="wheel-spin-button" onClick={spinWheel}>I ACCEPT MY FATE <span>→</span></button></>}
        {wheelStage === 'countdown' && <><h2>THE GOBLIN IS CHOOSING...</h2><div className="wheel-countdown-number" key={countdown}>{countdown || 'GO!'}</div><p className="wheel-hint">Brace yourself, brave little goblin.</p></>}
        {(wheelStage === 'spinning' || wheelStage === 'result') && <><h2>{wheelStage === 'spinning' ? 'NO TAKE-BACKSIES!' : 'THE GOBLIN HAS SPOKEN!'}</h2><div className={`wheel-disc ${spinning ? 'is-spinning' : ''}`}><span>🪙</span><span>🎭</span><span>✨</span><span>🧌</span><span>🎲</span><span>👑</span></div>{punishment ? <div className="wheel-result-reveal"><small>YOUR HARMLESS CONSEQUENCE</small><strong>{punishment}</strong><p>The Goblin expects excellent theatrical commitment.</p></div> : <p className="wheel-hint">The wheel is consulting ancient goblin law...</p>}{wheelStage === 'result' && <button className="wheel-spin-button" onClick={() => setShowWheel(false)}>I SHALL ACCEPT THIS QUEST ✨</button>}</>}
        <p className="wheel-safety-note">No money penalties. No humiliation without consent. Just goblin mischief.</p>
      </div>}
      {toast && <div className="goblin-toast">{toast}</div>}
    </div>
  )
}
