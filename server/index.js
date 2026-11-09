
import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import { GoogleGenerativeAI } from '@google/generative-ai'

dotenv.config()

const app = express()
app.use(cors())
app.use(express.json({ limit: '12mb' }))

// Validate Gemini API key
const geminiKey = process.env.GEMINI_API_KEY?.trim()

if (!geminiKey) {
  throw new Error('GEMINI_API_KEY is missing from the server environment')
}

const genAI = new GoogleGenerativeAI(geminiKey)

// Delay helper for retry attempts
const sleep = (ms) =>
  new Promise(resolve => setTimeout(resolve, ms))

// Gemini model fallback system
async function generateWithFallback(contents) {
  const models = [
    'gemini-3.8-flash',
    'gemini-3.7-flash',
    'gemini-3.5-flash-lite'
  ]

  let lastError

  for (const modelName of models) {
    const model = genAI.getGenerativeModel({
      model: modelName
    })

    for (let attempt = 0; attempt < 2; attempt++) {
      try {
        console.log(`Trying receipt scanner: ${modelName}`)

        const result = await model.generateContent(contents)

        console.log(`Receipt scanned successfully using ${modelName}`)

        return result

      } catch (error) {
        lastError = error

        const status = Number(error?.status)
        const temporary = [429, 500, 502, 503, 504].includes(status)

        console.error(
          `${modelName} failed (attempt ${attempt + 1}):`,
          status,
          error.message
        )

        // Don't retry invalid keys, bad requests, etc.
        if (!temporary) {
          throw error
        }

        // Retry once before switching models
        if (attempt === 0) {
          await sleep(1500)
        }
      }
    }

    console.log(`Switching to next fallback model...`)
  }

  throw lastError
}

// Receipt scanning API
app.post('/api/scan-receipt', async (req, res) => {
  try {
    const { image, mimeType } = req.body

    if (!image || !mimeType?.startsWith('image/')) {
      return res.status(400).json({
        error: 'Valid receipt image required'
      })
    }

    const result = await generateWithFallback([
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

    res.json({
      success: true,
      receipt
    })

  } catch (error) {
    console.error('Receipt scanning error:', error)

    const status = Number(error?.status)
    const temporary = [429, 500, 502, 503, 504].includes(status)

    res.status(temporary ? 503 : 500).json({
      error: temporary
        ? 'Our AI scanner is temporarily busy. Please try again.'
        : 'Receipt scanning failed'
    })
  }
})

// Start server
const PORT = process.env.PORT || 5000

app.listen(PORT, () => {
  console.log(`GoblinPay AI server running on port ${PORT}`)
})
