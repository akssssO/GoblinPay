
import { useState } from 'react'
import { Wallet, LogOut, Copy, CheckCircle } from 'lucide-react'

declare global {
  interface Window {
    solana?: {
      isPhantom?: boolean
      publicKey?: { toString(): string }
      connect(): Promise<{ publicKey: { toString(): string } }>
      disconnect(): Promise<void>
    }
  }
}

export default function WalletConnect() {
  const [address, setAddress] = useState('')
  const [error, setError] = useState('')

  async function connectWallet() {
    setError('')

    try {
      if (!window.solana?.isPhantom) {
        setError('Please install the Phantom browser extension.')
        return
      }

      const response = await window.solana.connect()
      setAddress(response.publicKey.toString())
    } catch {
      setError('Wallet connection was cancelled or failed.')
    }
  }

  async function disconnectWallet() {
    await window.solana?.disconnect()
    setAddress('')
  }

  async function copyAddress() {
    await navigator.clipboard.writeText(address)
  }

  return (
    <div>
      {!address ? (
        <button className="wallet-button" onClick={connectWallet}>
          <Wallet size={17} /> Connect Phantom
        </button>
      ) : (
        <div className="wallet-connected">
          <CheckCircle size={16} color="#b8ed70" />
          <span>{address.slice(0, 5)}...{address.slice(-5)}</span>
          <button onClick={copyAddress}><Copy size={14}/></button>
          <button onClick={disconnectWallet}><LogOut size={14}/></button>
        </div>
      )}

      {error && <p className="wallet-error">{error}</p>}
    </div>
  )
}
