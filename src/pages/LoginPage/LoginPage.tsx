import React from 'react'
import type { Credentials } from '../../types'
import { useLoginForm } from './useLoginForm'
import { t } from '../../hooks/useTranslation'
import styles from './LoginPage.module.css'

interface LoginPageProps {
  onLogin: (credentials: Credentials) => void
}

export const LoginPage: React.FC<LoginPageProps> = ({ onLogin }) => {
  const {
    idInstance,
    apiTokenInstance,
    isLoading,
    error,
    setIdInstance,
    setApiTokenInstance,
    handleSubmit,
  } = useLoginForm({ onLogin })

  return (
    <div className={styles.page}>
      <div className={styles.card}>
        <h2 className={styles.title}>{t.login.title}</h2>
        <p className={styles.subtitle}>{t.login.subtitle}</p>

        <form onSubmit={handleSubmit} className={styles.form}>
          {error && <div className={styles.errorMessage}>{error}</div>}

          <div className={styles.formGroup}>
            <label htmlFor="idInstance">{t.login.idInstanceLabel}</label>
            <input
              id="idInstance"
              type="text"
              placeholder={t.login.idInstancePlaceholder}
              value={idInstance}
              onChange={(e) => setIdInstance(e.target.value)}
              disabled={isLoading}
              required
            />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="apiTokenInstance">{t.login.apiTokenLabel}</label>
            <input
              id="apiTokenInstance"
              type="password"
              placeholder={t.login.apiTokenPlaceholder}
              value={apiTokenInstance}
              onChange={(e) => setApiTokenInstance(e.target.value)}
              disabled={isLoading}
              required
            />
          </div>

          <button type="submit" className={styles.btnPrimary} disabled={isLoading}>
            {isLoading ? t.login.checkingButton : t.login.submitButton}
          </button>
        </form>
      </div>
    </div>
  )
}
