import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { ThemeProvider } from '@/contexts/ThemeContext'
import { FinanceProvider } from '@/contexts/FinanceContext'
import { Header } from '@/components/Layout/Header'
import { ToastNotifications } from '@/components/Notifications/ToastNotifications'
import { Toaster } from '@/components/ui/sonner'
import { Dashboard } from '@/pages/Dashboard'
import { Transactions } from '@/pages/Transactions'
import { Profile } from '@/pages/Profile'

function App() {
  return (
    <ThemeProvider>
      <FinanceProvider>
        <Router>
          <div className="min-h-screen bg-background text-foreground">
            <Header />
            <main className="container mx-auto px-4 py-6">
              <Routes>
                <Route path="/" element={<Dashboard />} />
                <Route path="/transactions" element={<Transactions />} />
                <Route path="/profile" element={<Profile />} />
              </Routes>
            </main>
            <ToastNotifications />
            <Toaster position="top-right" />
          </div>
        </Router>
      </FinanceProvider>
    </ThemeProvider>
  )
}

export default App