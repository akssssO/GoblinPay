import type { CSSProperties } from 'react'

type MoneyCelebrationProps = {
  type: 'incoming' | 'outgoing'
  amount: string
  onClose: () => void
}

export default function MoneyCelebration({ type, amount, onClose }: MoneyCelebrationProps) {
  const incoming = type === 'incoming'
  return (
    <div className={`money-celebration ${incoming ? 'money-incoming' : 'money-outgoing'}`} role="dialog" aria-modal="true" aria-label={incoming ? 'Money received' : 'Payment sent'} onClick={onClose}>
      <div className="money-celebration-particles" aria-hidden="true">
        {Array.from({ length: 42 }, (_, i) => <span key={i} style={{ left: `${(i * 37 + 11) % 100}%`, fontSize: `${12 + (i % 4) * 7}px`, animationDelay: `${(i % 15) * 0.08}s`, animationDuration: `${2.4 + (i % 8) * 0.22}s` } as CSSProperties}>{i % 3 === 0 ? '🪙' : i % 3 === 1 ? '✦' : '●'}</span>)}
      </div>
      <div className="money-celebration-card" onClick={event => event.stopPropagation()}>
        <div className="money-mascot">{incoming ? '🧌' : '🧌'}</div>
        <div className="money-eyebrow">{incoming ? 'THE GOBLIN TREASURY GROWS' : 'THE GOBLIN HAS PAID'}</div>
        <div className="money-amount">{incoming ? '+' : '−'}{amount} <small>SOL</small></div>
        <h2>{incoming ? 'COINS FOR THE HOARD!' : 'FAREWELL, PRECIOUS COINS!'}</h2>
        <p>{incoming ? 'A fresh treasure just landed in your wallet.' : 'Your payment has been confirmed on Solana Devnet.'}</p>
        <button type="button" onClick={onClose}>{incoming ? 'HOARD IT! ✨' : 'ONWARD, GOBLIN! ✨'}</button>
      </div>
    </div>
  )
}
