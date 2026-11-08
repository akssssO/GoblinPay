
import { useState } from 'react'
import {
  LayoutDashboard, ReceiptText, Users, Trophy, Settings,
  Plus, ArrowUpRight, ArrowDownLeft, ScanLine,
  Bell, ChevronRight, Flame, Zap, CircleDollarSign
} from 'lucide-react'

import './App.css'
import ScanReceipt from './pages/ScanReceipt'
import SplitBill from './pages/SplitBill'
import WalletConnect from './components/WalletConnect'
import SolanaPayment from './components/SolanaPayment'
import DareMode from './pages/DareMode'
import ThemeToggle from './components/ThemeToggle'
import goblinKing from './assets/goblin-king.png'

const groups = [
  { name: 'Friday Night Chaos', people: 5, amount: '₹2,500', pending: '₹1,400', color: '#b8ed70', emoji: '🍕' },
  { name: 'Roommate Mafia', people: 3, amount: '₹4,800', pending: '₹800', color: '#b9a0ff', emoji: '🏠' },
  { name: 'Goa Trip 2026', people: 6, amount: '₹12,400', pending: '₹3,200', color: '#ffbd81', emoji: '🏖️' },
]

const activities = [
  { name: 'Rahul paid you', detail: 'Friday Night Chaos', amount: '+₹500', time: '12 min ago', positive: true },
  { name: 'You paid Priya', detail: 'Dinner settlement', amount: '-₹600', time: '1 hour ago', positive: false },
  { name: 'New expense added', detail: 'Roommate Mafia', amount: '₹1,200', time: 'Yesterday', positive: null },
]

export default function App() {
  const [active, setActive] = useState('Dashboard')
  const [showCreate, setShowCreate] = useState(false)
  const [groupName, setGroupName] = useState('')
  const [showScanner, setShowScanner] = useState(false)
  const [showSplitter, setShowSplitter] = useState(false)

  if (showScanner || showSplitter) {
    return (
      <div className="app-shell">
        <main className="main-content">
          {showScanner ? (
            <ScanReceipt onBack={() => setShowScanner(false)} />
          ) : (
            <SplitBill onBack={() => setShowSplitter(false)} />
          )}
        </main>
      </div>
    )
  }

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <div className="brand">
          <img
          src={goblinKing}
          alt="GoblinPay Goblin King"
          className="brand-mascot"
          />
          <div>
            <div className="brand-name">goblin<span>pay</span></div>
            <div className="brand-caption">SPLIT. SETTLE. REPEAT.</div>
          </div>
        </div>

        <div className="nav-label">MENU</div>

        {[
          { name: 'Dashboard', icon: LayoutDashboard },
          { name: 'Expenses', icon: ReceiptText },
          { name: 'My Groups', icon: Users },
          { name: 'Dare Mode', icon: Trophy },
        ].map(item => (
          <button
            key={item.name}
            type="button"
            className={`nav-item ${active === item.name ? 'selected' : ''}`}
            onClick={() => setActive(item.name)}
          >
            <item.icon size={18} />
            {item.name}
            {item.name === 'Dare Mode' && <span className="nav-new">NEW</span>}
          </button>
        ))}

        <ThemeToggle />

        <div className="sidebar-bottom">
          <div className="xp-card">
            <div className="xp-top"><Flame size={17} /> GOBLIN LEVEL 4</div>
            <div className="xp-number">720 <span>XP</span></div>
            <div className="xp-track"><div /></div>
            <p>280 XP until Level 5!</p>
          </div>

          <button
            className="nav-item"
            type="button"
            onClick={() => alert('Settings coming soon!')}
          >
            <Settings size={18} /> Settings
          </button>

          <div className="profile">
            <div className="avatar">🧑‍🚀</div>
            <div><strong>Your Goblin</strong><small>Level 4 Explorer</small></div>
            <ChevronRight size={17} />
          </div>
        </div>
      </aside>

      <main className="main-content">

        {active === 'Dare Mode' ? (
          <DareMode />
        ) : active === 'Dashboard' ? (
          <>
            <SolanaPayment />

            <header className="topbar">
              <div className="breadcrumb">Workspace <span>/</span> Dashboard</div>
              <div className="top-actions">
                <div className="network-pill"><span /> SOLANA DEVNET</div>
                <button className="icon-button"><Bell size={19} /></button>
                <WalletConnect />
              </div>
            </header>

            <section className="welcome">
              <div>
                <div className="eyebrow"><span /> YOUR MONEY, YOUR MAYHEM</div>
                <h1>Let's get this bread, <span>Goblin.</span> 🧌</h1>
                <p>Keep your friends close and your pending payments closer.</p>
              </div>
              <button className="primary-button" onClick={() => setShowCreate(true)}>
                <Plus size={18} /> Create a group
              </button>
            </section>

            <section className="stats-grid">
              <div className="stat-card">
                <div className="stat-heading">TOTAL EXPENSES <CircleDollarSign size={19} /></div>
                <div className="stat-value">₹19,700</div>
                <div className="stat-note"><span className="green-text"><ArrowUpRight size={14} /> 12.5%</span> this month</div>
              </div>

              <div className="stat-card">
                <div className="stat-heading">YOU ARE OWED <ArrowDownLeft size={19} /></div>
                <div className="stat-value green-text">₹4,200</div>
                <div className="stat-note">Across 3 active groups</div>
              </div>

              <div className="stat-card">
                <div className="stat-heading">YOU OWE <ArrowUpRight size={19} /></div>
                <div className="stat-value orange-text">₹1,800</div>
                <div className="stat-note">2 pending settlements</div>
              </div>

              <div className="stat-card goblin-stat">
                <div className="stat-heading">GOBLIN XP <Zap size={19} /></div>
                <div className="stat-value">720 <span>XP</span></div>
                <div className="stat-note">🔥 You're on a 4-day streak!</div>
              </div>
            </section>

            <div className="content-grid">
              <section className="panel groups-panel">
                <div className="panel-heading">
                  <div><h2>Your groups</h2><p>Where the money adventures happen.</p></div>
                  <button className="text-button" onClick={() => setActive('My Groups')}>
                    View all <ChevronRight size={15} />
                  </button>
                </div>

                {groups.map(group => (
                  <div className="group-row" key={group.name}>
                    <div className="group-emoji" style={{ background: group.color + '20' }}>{group.emoji}</div>
                    <div className="group-info">
                      <strong>{group.name}</strong>
                      <small><Users size={13} /> {group.people} members</small>
                    </div>
                    <div className="group-money">
                      <strong>{group.amount}</strong>
                      <small>{group.pending} pending</small>
                    </div>
                    <ChevronRight className="group-arrow" size={17} />
                  </div>
                ))}

                <button className="create-group-button" onClick={() => setShowCreate(true)}>
                  <Plus size={17} /> Create another group
                </button>
              </section>

              <section className="panel activity-panel">
                <div className="panel-heading">
                  <div><h2>Recent activity</h2><p>The latest goblin gossip.</p></div>
                  <button className="icon-button"><ArrowUpRight size={17} /></button>
                </div>

                {activities.map((activity, i) => (
                  <div className="activity-row" key={i}>
                    <div className={`activity-icon ${activity.positive === true ? 'positive' : activity.positive === false ? 'negative' : ''}`}>
                      {activity.positive === true ? <ArrowDownLeft size={18} /> : activity.positive === false ? <ArrowUpRight size={18} /> : <ReceiptText size={18} />}
                    </div>
                    <div className="activity-info">
                      <strong>{activity.name}</strong>
                      <small>{activity.detail} · {activity.time}</small>
                    </div>
                    <strong className={activity.positive === true ? 'green-text' : ''}>{activity.amount}</strong>
                  </div>
                ))}
              </section>
            </div>

            <section className="bottom-grid">
              <div className="dare-banner">
                <div className="dare-art">🎲</div>
                <div className="dare-content">
                  <div className="eyebrow">THE GOBLIN CHALLENGES YOU</div>
                  <h2>Enter <span>Dare Mode.</span></h2>
                  <p>Complete challenges. Earn XP. Become the ultimate Goblin.</p>
                  <button className="dare-button" onClick={() => setActive('Dare Mode')}>
                    Explore challenges <ArrowUpRight size={16} />
                  </button>
                </div>
                <div className="dare-decoration">⚡</div>
              </div>

              <div className="scan-card">
                <div className="scan-icon"><ScanLine size={25} /></div>
                <h3>Got a receipt?</h3>
                <p>Let AI do the boring math. You just enjoy the food.</p>
                <button className="primary-button scan-button" onClick={() => setShowScanner(true)}>
                  Scan a receipt <ArrowUpRight size={16} />
                </button>
                <button className="primary-button scan-button" onClick={() => setShowSplitter(true)}>
                  Split saved receipt <Users size={16} />
                </button>
              </div>
            </section>

            <footer>Made with mischief 🧌 · Powered by <span>Solana</span></footer>
          </>
        ) : active === 'My Groups' ? (
          <section className="panel" style={{ padding: 28 }}>
            <div className="panel-heading">
              <div>
                <h2>Your goblin gangs 🧌</h2>
                <p>All your expense groups in one place.</p>
              </div>
              <button className="primary-button" onClick={() => setShowCreate(true)}>
                <Plus size={17} /> Create group
              </button>
            </div>
            {groups.map(group => (
              <div className="group-row" key={group.name}>
                <div className="group-emoji">{group.emoji}</div>
                <div className="group-info">
                  <strong>{group.name}</strong>
                  <small>{group.people} members</small>
                </div>
                <div className="group-money">
                  <strong>{group.amount}</strong>
                  <small>{group.pending} pending</small>
                </div>
              </div>
            ))}
          </section>
        ) : (
          <section className="panel" style={{ padding: 28 }}>
            <div className="panel-heading">
              <div>
                <h2>Expense activity 🧾</h2>
                <p>All the latest money movements.</p>
              </div>
              <button className="primary-button" onClick={() => setShowScanner(true)}>
                <Plus size={17} /> Add expense
              </button>
            </div>
            {activities.map((activity, i) => (
              <div className="activity-row" key={i}>
                <div className="activity-info">
                  <strong>{activity.name}</strong>
                  <small>{activity.detail} · {activity.time}</small>
                </div>
                <strong>{activity.amount}</strong>
              </div>
            ))}
          </section>
        )}

      </main>

      {showCreate && (
        <div className="modal-overlay" onClick={() => setShowCreate(false)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <button className="modal-close" onClick={() => setShowCreate(false)}>✕</button>
            <div className="modal-emoji">🧌</div>
            <h2>Create a goblin gang</h2>
            <p>Give your expense group a name.</p>
            <input
              value={groupName}
              onChange={e => setGroupName(e.target.value)}
              placeholder="e.g. Friday Night Chaos"
            />
            <button
              className="primary-button modal-submit"
              disabled={!groupName.trim()}
              onClick={() => {
                alert(`Group "${groupName}" created in this demo!`)
                setGroupName('')
                setShowCreate(false)
              }}
            >
              Create group <Plus size={17} />
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
