
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
}
