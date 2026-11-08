
import { useState } from 'react'
import {
  Connection,
  PublicKey,
  SystemProgram,
  Transaction,
  LAMPORTS_PER_SOL,
  clusterApiUrl
} from '@solana/web3.js'

declare global {
  interface Window {
    phantom?: {
      solana?: {
        isPhantom?: boolean
        publicKey?: PublicKey
        signAndSendTransaction: (
          transaction: Transaction
        ) => Promise<{ signature: string }>
      }
    }
  }
}

export default function SolanaPayment() {
  const [recipient, setRecipient] = useState('')
  const [amount, setAmount] = useState('0.01')
  const [status, setStatus] = useState('')

  async function pay() {
    try {
      const wallet = window.phantom?.solana

      if (!wallet?.isPhantom || !wallet.publicKey) {
        setStatus('Connect Phantom first.')
        return
      }

      const connection = new Connection(
        clusterApiUrl('devnet'),
        'confirmed'
      )

      const destination = new PublicKey(recipient)
      const lamports = Math.round(
        Number(amount) * LAMPORTS_PER_SOL
      )

      if (!Number.isSafeInteger(lamports) || lamports <= 0) {
        throw new Error('Enter a valid SOL amount.')
      }

      const balance = await connection.getBalance(wallet.publicKey)

      if (balance < lamports + 10000) {
        throw new Error('Insufficient Devnet SOL for amount and fees.')
      }

      const transaction = new Transaction().add(
        SystemProgram.transfer({
          fromPubkey: wallet.publicKey,
          toPubkey: destination,
          lamports
        })
      )

      transaction.feePayer = wallet.publicKey
      transaction.recentBlockhash =
        (await connection.getLatestBlockhash()).blockhash

      setStatus('Waiting for Phantom approval...')

      const result = await wallet.signAndSendTransaction(transaction)

      setStatus('Verifying transaction...')

      const confirmation = await connection.confirmTransaction(
        result.signature,
        'confirmed'
      )

      if (confirmation.value.err) {
        throw new Error('Transaction failed on Solana.')
      }

      setStatus('Payment confirmed! Signature: ' + result.signature)

    } catch (error) {
      setStatus(
        error instanceof Error ? error.message : 'Payment failed.'
      )
    }
  }

  return (
    <div className="payment-card">
      <h2>🧌 Goblin Settlement</h2>

      <input
        placeholder="Recipient wallet address"
        value={recipient}
        onChange={e => setRecipient(e.target.value)}
      />

      <input
        type="number"
        min="0.000000001"
        step="any"
        value={amount}
        onChange={e => setAmount(e.target.value)}
      />

      <button onClick={pay}>Pay with Solana</button>

      <p>{status}</p>
    </div>
  )
}
