import { useState } from 'react'
import type { FormEvent } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import axios from 'axios'
import api from '../api/api'
import { useAuth } from '../auth/AuthContext'
import GoogleAuthButton from '../components/GoogleAuthButton'
import './AccountPages.css'

export default function LoginPage() {
  const navigate = useNavigate()
  const location = useLocation()
  const { refreshUser } = useAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setError('')
    setSubmitting(true)
    try {
      await api.post('/api/auth/login', { email, password })
      await refreshUser()
      const destination = typeof location.state?.from === 'string' ? location.state.from : '/'
      navigate(destination, { replace: true })
    } catch (requestError: unknown) {
      setError(
        axios.isAxiosError(requestError)
          ? requestError.response?.data?.message || 'Unable to sign in. Please try again.'
          : 'Unable to sign in. Please try again.'
      )
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <main className="account-page">
      <section className="account-card">
        <Link className="account-brand" to="/">Handy</Link>
        <h1>Welcome back</h1>
        <p>Sign in to shop and manage your account.</p>
        <GoogleAuthButton />
        <div className="account-divider"><span>or continue with email</span></div>
        <form className="account-form" onSubmit={submit}>
          <label>
            Email
            <input type="email" autoComplete="email" value={email} onChange={event => setEmail(event.target.value)} required />
          </label>
          <label>
            Password
            <input type="password" autoComplete="current-password" value={password} onChange={event => setPassword(event.target.value)} required />
          </label>
          {error && <p className="account-error" role="alert">{error}</p>}
          <button type="submit" disabled={submitting}>{submitting ? 'Signing in...' : 'Sign in'}</button>
        </form>
        <p className="account-switch">New to Handy? <Link to="/register">Create an account</Link></p>
      </section>
    </main>
  )
}
