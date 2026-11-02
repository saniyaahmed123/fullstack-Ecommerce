import { useState } from 'react'
import type { FormEvent } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import axios from 'axios'
import api from '../api/api'
import { useAuth } from '../auth/AuthContext'
import './AccountPages.css'

export default function RegisterPage() {
  const navigate = useNavigate()
  const location = useLocation()
  const { refreshUser } = useAuth()
  const [username, setUsername] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setError('')
    setSubmitting(true)
    try {
      await api.post('/api/auth/register', { username, email, password })
      await refreshUser()
      const destination = typeof location.state?.from === 'string' ? location.state.from : '/'
      navigate(destination, { replace: true })
    } catch (requestError: unknown) {
      setError(
        axios.isAxiosError(requestError)
          ? requestError.response?.data?.message || 'Unable to create your account. Please try again.'
          : 'Unable to create your account. Please try again.'
      )
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <main className="account-page">
      <section className="account-card">
        <Link className="account-brand" to="/">Handy</Link>
        <h1>Create your account</h1>
        <p>Join Handy to save finds and keep your cart in sync.</p>
        <form className="account-form" onSubmit={submit}>
          <label>
            Name
            <input type="text" autoComplete="name" value={username} onChange={event => setUsername(event.target.value)} required />
          </label>
          <label>
            Email
            <input type="email" autoComplete="email" value={email} onChange={event => setEmail(event.target.value)} required />
          </label>
          <label>
            Password
            <input type="password" autoComplete="new-password" minLength={8} value={password} onChange={event => setPassword(event.target.value)} required />
            <small>Use at least 8 characters.</small>
          </label>
          {error && <p className="account-error" role="alert">{error}</p>}
          <button type="submit" disabled={submitting}>{submitting ? 'Creating account...' : 'Create account'}</button>
        </form>
        <p className="account-switch">Already have an account? <Link to="/login">Sign in</Link></p>
      </section>
    </main>
  )
}
