import './ScanReceipt.css'
import { useState } from 'react'
import { Upload, Sparkles, Plus, Trash2, ArrowLeft, LoaderCircle } from 'lucide-react'

interface Item {
  name: string
  price: number
}

interface Receipt {
  merchant: string
  items: Item[]
  tax: number
  total: number
}

export default function ScanReceipt({ onBack }: { onBack?: () => void }) {
  const [receipt, setReceipt] = useState<Receipt | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [fileName, setFileName] = useState('')

  const total = receipt
    ? receipt.items.reduce((sum, item) => sum + Math.round(item.price * 100), 0)
      + Math.round(receipt.tax * 100)
    : 0

  async function handleUpload(file?: File) {
    if (!file) return

    if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type)) {
      setError('Please upload a JPG, PNG or WebP image.')
      return
    }

    if (file.size > 8 * 1024 * 1024) {
      setError('Image must be smaller than 8 MB.')
      return
    }

    setLoading(true)
    setError('')
    setReceipt(null)
    setFileName(file.name)

    try {
      const image = await new Promise<string>((resolve, reject) => {
        const reader = new FileReader()
        reader.onload = () => resolve(String(reader.result).split(',')[1])
        reader.onerror = () => reject(new Error('Could not read image'))
        reader.readAsDataURL(file)
      })

      const API_URL = (
  import.meta.env.VITE_API_URL?.trim() ||
  (import.meta.env.DEV
    ? 'http://localhost:5000'
    : 'https://goblinpay-api.onrender.com')
).replace(/\/+$/, '')

const response = await fetch(`${API_URL}/api/scan-receipt`, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ image, mimeType: file.type })
})

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Receipt scanning failed')
      }

      const result = data.receipt

      if (!Array.isArray(result.items)) {
        throw new Error('AI returned an invalid receipt')
      }

      setReceipt({
        merchant: result.merchant || 'Unknown restaurant',
        items: result.items.map((item: Item) => ({
          name: String(item.name || 'Unknown item'),
          price: Math.max(0, Number(item.price) || 0)
        })),
        tax: Math.max(0, Number(result.tax) || 0),
        total: 0
      })
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong')
    } finally {
      setLoading(false)
    }
  }

  function updateItem(index: number, field: 'name' | 'price', value: string) {
    if (!receipt) return

    setReceipt({
      ...receipt,
      items: receipt.items.map((item, i) =>
        i === index
          ? { ...item, [field]: field === 'price' ? Math.max(0, Number(value) || 0) : value }
          : item
      )
    })
  }

  function saveReceipt() {
    if (!receipt || receipt.items.length === 0) return

    const saved = {
      ...receipt,
      total: total / 100,
      totalPaise: total,
      savedAt: new Date().toISOString()
    }

    localStorage.setItem('goblinpay-receipt', JSON.stringify(saved))
    alert('Receipt saved! Your Goblin is ready for bill splitting.')
  }

  return (
    <div className="scanner-page">
      <button className="scanner-back" onClick={onBack}>
        <ArrowLeft size={17}/> Back to dashboard
      </button>

      <div className="scanner-heading">
        <div className="scanner-mascot">🧌</div>
        <div className="eyebrow">THE GOBLIN'S EYES</div>
        <h1>Scan your <span>loot.</span></h1>
        <p>Feed the Goblin a receipt. Let AI handle the boring math.</p>
      </div>

      <label className="upload-area">
        {loading
          ? <LoaderCircle className="spin" size={38}/>
          : <Upload size={38}/>}
        <h3>{loading ? 'Goblin is reading your receipt...' : 'Drop your receipt here'}</h3>
        <p>{loading ? 'This may take a few seconds.' : 'JPG, PNG or WebP · Maximum 8 MB'}</p>
        <input
          type="file"
          accept="image/jpeg,image/png,image/webp"
          hidden
          disabled={loading}
          onChange={e => handleUpload(e.target.files?.[0])}
        />
      </label>

      {fileName && <p className="scanner-filename">Selected: {fileName}</p>}
      {error && <p className="scanner-error">{error}</p>}

      {receipt && (
        <section className="panel receipt-editor">
          <div className="receipt-title">
            <div>
              <div className="eyebrow">AI EXTRACTION COMPLETE ✨</div>
              <h2>{receipt.merchant}</h2>
              <p>Review everything before splitting.</p>
            </div>
            <Sparkles color="#b8ed70"/>
          </div>

          <label className="receipt-label">Restaurant name</label>
          <input
            className="receipt-input"
            value={receipt.merchant}
            onChange={e => setReceipt({...receipt, merchant: e.target.value})}
          />

          {receipt.items.map((item, i) => (
            <div className="receipt-item" key={i}>
              <input
                aria-label="Item name"
                value={item.name}
                onChange={e => updateItem(i, 'name', e.target.value)}
              />
              <input
                aria-label="Item price in rupees"
                type="number"
                min="0"
                step="0.01"
                value={item.price}
                onChange={e => updateItem(i, 'price', e.target.value)}
              />
              <button onClick={() => setReceipt({
                ...receipt,
                items: receipt.items.filter((_, index) => index !== i)
              })}><Trash2 size={16}/></button>
            </div>
          ))}

          <button className="scanner-add" onClick={() => setReceipt({
            ...receipt,
            items: [...receipt.items, {name: 'New item', price: 0}]
          })}>
            <Plus size={16}/> Add item
          </button>

          <div className="receipt-tax">
            <label>Tax (₹)</label>
            <input
              type="number"
              min="0"
              step="0.01"
              value={receipt.tax}
              onChange={e => setReceipt({
                ...receipt,
                tax: Math.max(0, Number(e.target.value) || 0)
              })}
            />
          </div>

          <div className="receipt-total">
            <span>Calculated total</span>
            <strong>₹{(total / 100).toFixed(2)}</strong>
          </div>

          <button
            className="primary-button scanner-save"
            disabled={!receipt.items.length}
            onClick={saveReceipt}
          >
            <Sparkles size={17}/> Save receipt & continue
          </button>
        </section>
      )}
    </div>
  )
}
