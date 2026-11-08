import './SplitBill.css'
import { useEffect, useMemo, useState } from 'react'
import { ArrowLeft, Plus, Trash2, Users, Calculator, Save, Sparkles } from 'lucide-react'

interface ReceiptItem {
  name: string
  price: number
}

interface Receipt {
  merchant: string
  items: ReceiptItem[]
  tax: number
}

export default function SplitBill({ onBack }: { onBack?: () => void }) {
  const [receipt, setReceipt] = useState<Receipt | null>(null)
  const [members, setMembers] = useState(['You', 'Rahul', 'Priya', 'Sam'])
  const [assignments, setAssignments] = useState<Record<number, string[]>>({})
  const [newMember, setNewMember] = useState('')
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    const stored = localStorage.getItem('goblinpay-receipt')
    if (stored) {
      try {
        setReceipt(JSON.parse(stored))
      } catch {
        setReceipt(null)
      }
    }
  }, [])

  const results = useMemo(() => {
    if (!receipt) return []

    const totals: Record<string, number> = {}
    members.forEach(member => { totals[member] = 0 })

    receipt.items.forEach((item, index) => {
      const assigned = assignments[index] || []
      if (!assigned.length) return

      const price = Math.round(item.price * 100)
      const share = Math.floor(price / assigned.length)
      const remainder = price % assigned.length

      assigned.forEach((member, i) => {
        totals[member] += share + (i < remainder ? 1 : 0)
      })
    })

    const tax = Math.round(receipt.tax * 100)
    const taxShare = members.length ? Math.floor(tax / members.length) : 0
    const taxRemainder = members.length ? tax % members.length : 0

    members.forEach((member, i) => {
      totals[member] += taxShare + (i < taxRemainder ? 1 : 0)
    })

    return members.map(member => ({
      name: member,
      amount: totals[member]
    }))
  }, [receipt, members, assignments])

  const formatMoney = (paise: number) =>
    `₹${(paise / 100).toFixed(2)}`

  function toggleAssignment(index: number, member: string) {
    setAssignments(previous => {
      const current = previous[index] || []
      const updated = current.includes(member)
        ? current.filter(name => name !== member)
        : [...current, member]

      return { ...previous, [index]: updated }
    })
    setSaved(false)
  }

  function addMember() {
    const name = newMember.trim()
    if (!name || members.some(m => m.toLowerCase() === name.toLowerCase())) return
    setMembers([...members, name])
    setNewMember('')
    setSaved(false)
  }

  function removeMember(member: string) {
    if (member === 'You' || members.length <= 1) return

    setMembers(members.filter(m => m !== member))
    setAssignments(previous => {
      const updated = { ...previous }
      Object.keys(updated).forEach(key => {
        updated[Number(key)] = updated[Number(key)].filter(m => m !== member)
      })
      return updated
    })
    setSaved(false)
  }

  function saveSplit() {
    if (!receipt) return

    const data = {
      merchant: receipt.merchant,
      members: results,
      items: receipt.items.map((item, index) => ({
        ...item,
        assignedTo: assignments[index] || []
      })),
      tax: receipt.tax,
      savedAt: new Date().toISOString()
    }

    localStorage.setItem('goblinpay-split', JSON.stringify(data))
    setSaved(true)
  }

  if (!receipt) {
    return (
      <div className="split-page">
        <button className="scanner-back" onClick={onBack}>
          <ArrowLeft size={17}/> Back
        </button>
        <div className="panel">
          <h2>No receipt found! 🧌</h2>
          <p>Scan and save a receipt before splitting the bill.</p>
        </div>
      </div>
    )
  }

  const unassigned = receipt.items.some(
    (_, index) => !(assignments[index]?.length)
  )

  const receiptTotal = receipt.items.reduce(
    (sum, item) => sum + Math.round(item.price * 100), 0
  ) + Math.round(receipt.tax * 100)

  return (
    <div className="split-page">
      <button className="scanner-back" onClick={onBack}>
        <ArrowLeft size={17}/> Back to dashboard
      </button>

      <div className="split-heading">
        <div className="eyebrow">THE GOBLIN'S ACCOUNTING DEPARTMENT 🧌</div>
        <h1>Split the <span>loot.</span></h1>
        <p>Everyone pays their fair share. No awkward maths.</p>
      </div>

      <section className="panel split-panel">
        <div className="eyebrow">RECEIPT DETAILS</div>
        <h2>{receipt.merchant}</h2>
        <div className="split-total">
          <span>Total bill including tax</span>
          <strong>{formatMoney(receiptTotal)}</strong>
        </div>
      </section>

      <section className="panel split-panel">
        <div className="panel-heading">
          <div>
            <h2><Users size={19}/> Your goblin gang</h2>
            <p>Add everyone sharing this bill.</p>
          </div>
        </div>

        <div className="member-list">
          {members.map(member => (
            <div className="member-chip" key={member}>
              <span>👤 {member}</span>
              {member !== 'You' && (
                <button onClick={() => removeMember(member)}>
                  <Trash2 size={13}/>
                </button>
              )}
            </div>
          ))}
        </div>

        <div className="add-member">
          <input
            value={newMember}
            onChange={e => setNewMember(e.target.value)}
            placeholder="Friend's name..."
            onKeyDown={e => e.key === 'Enter' && addMember()}
          />
          <button onClick={addMember}><Plus size={16}/> Add</button>
        </div>
      </section>

      <section className="panel split-panel">
        <div className="panel-heading">
          <div>
            <h2><Calculator size={19}/> Assign the food</h2>
            <p>Select everyone who shared each item.</p>
          </div>
        </div>

        {receipt.items.map((item, index) => (
          <div className="assign-item" key={index}>
            <div className="assign-item-top">
              <strong>{item.name}</strong>
              <strong>{formatMoney(Math.round(item.price * 100))}</strong>
            </div>

            <div className="assign-members">
              {members.map(member => (
                <label key={member} className="assign-member">
                  <input
                    type="checkbox"
                    checked={(assignments[index] || []).includes(member)}
                    onChange={() => toggleAssignment(index, member)}
                  />
                  {member}
                </label>
              ))}
            </div>

            {!(assignments[index]?.length) && (
              <small className="orange-text">Nobody assigned yet!</small>
            )}
          </div>
        ))}
      </section>

      <section className="panel split-panel">
        <div className="eyebrow">FINAL SETTLEMENT</div>
        <h2>Who owes what? 💰</h2>
        <p>Tax is distributed equally among all members.</p>

        {results.map(result => (
          <div className="settlement-row" key={result.name}>
            <span>🧌 {result.name}</span>
            <strong>{formatMoney(result.amount)}</strong>
          </div>
        ))}

        <div className="split-total">
          <span>Combined total</span>
          <strong>{formatMoney(results.reduce((s, r) => s + r.amount, 0))}</strong>
        </div>

        {unassigned && (
          <p className="orange-text">
            Assign every item before saving the split.
          </p>
        )}

        <button
          className="primary-button split-save"
          disabled={unassigned || !members.length}
          onClick={saveSplit}
        >
          <Save size={17}/> Save bill split
        </button>

        {saved && (
          <p className="split-success">
            <Sparkles size={16}/> Bill split saved successfully! The Goblin approves.
          </p>
        )}
      </section>
    </div>
  )
}
