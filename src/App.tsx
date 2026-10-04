import { useAuth } from './hooks/useAuth'
import { LoginPage } from './pages/LoginPage'
import { ChatPage } from './pages/ChatPage'

export function App() {
  const { credentials, isAuthenticated, login, logout } = useAuth()

  if (!isAuthenticated || !credentials) {
    return <LoginPage onLogin={login} />
  }

  return <ChatPage credentials={credentials} onLogout={logout} />
}

export default App
