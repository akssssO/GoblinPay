
export interface ReceiptItem {
  name: string
  price: number
}

export interface Receipt {
  merchant: string
  items: ReceiptItem[]
  tax: number
  total: number
}

export async function scanReceipt(file: File): Promise<Receipt> {
  const image = await new Promise<string>((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => {
      const result = String(reader.result)
      resolve(result.split(',')[1])
    }
    reader.onerror = reject
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
    body: JSON.stringify({
      image,
      mimeType: file.type
    })
  })

  if (!response.ok) {
    throw new Error('Could not scan receipt')
  }

  const data = await response.json()
  return data.receipt
}
