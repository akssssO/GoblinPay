import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import { GoogleGenerativeAI } from '@google/generative-ai'

dotenv.config()

const app = express()
app.use(cors())
app.use(express.json({ limit: '12mb' }))

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY)

app.post('/api/scan-receipt', async (req, res) => {
  try {
    const { image, mimeType } = req.body

    if (!image || !mimeType?.startsWith('image/')) {
      return res.status(400).json({ error: 'Valid receipt image required' })
    }

    const model = genAI.getGenerativeModel({
      model: 'gemini-2.5-flash'
    })

    const result = await model.generateContent([
      `Extract the receipt information.
      Return ONLY valid JSON in this format:
      {
        "merchant": "Restaurant name",
        "items": [
          {"name": "Pizza", "price": 800}
        ],
        "tax": 200,
        "total": 1000
      }
      Prices must be numeric amounts in INR.
      Do not invent missing items or prices.
      If information is unreadable, return null for that field.`,
      {
        inlineData: {
          data: image,
          mimeType
        }
      }
    ])

    const text = result.response.text()
      .replace(/```json|```/g, '')
      .trim()

    const receipt = JSON.parse(text)

    if (!Array.isArray(receipt.items)) {
      throw new Error('Invalid receipt response')
    }

    res.json({ success: true, receipt })
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: 'Receipt scanning failed' })
  }
})

app.listen(process.env.PORT || 5000, () => {
  console.log('GoblinPay AI server running on port 5000')
})
