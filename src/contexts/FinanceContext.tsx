import { createContext, useContext, useState, useEffect, ReactNode } from 'react'

export interface Transaction {
  id: string
  type: 'income' | 'expense'
  amount: number
  category: string
  description: string
  date: string
  splitWith?: string[]
}

export interface Budget {
  category: string
  limit: number
  spent: number
}

export interface SavingsGoal {
  id: string
  name: string
  target: number
  current: number
  deadline: string
}

export interface Bill {
  id: string
  name: string
  amount: number
  dueDate: string
  isPaid: boolean
}

export interface Achievement {
  id: string
  title: string
  description: string
  icon: string
  earned: boolean
  earnedAt?: string
}

interface FinanceContextType {
  transactions: Transaction[]
  budgets: Budget[]
  savingsGoals: SavingsGoal[]
  bills: Bill[]
  achievements: Achievement[]
  addTransaction: (transaction: Omit<Transaction, 'id'>) => void
  updateTransaction: (id: string, transaction: Partial<Transaction>) => void
  deleteTransaction: (id: string) => void
  updateBudget: (category: string, limit: number) => void
  addSavingsGoal: (goal: Omit<SavingsGoal, 'id'>) => void
  updateSavingsGoal: (id: string, amount: number) => void
  addBill: (bill: Omit<Bill, 'id'>) => void
  markBillPaid: (id: string) => void
  exportData: (format: 'csv' | 'json') => void
}

const FinanceContext = createContext<FinanceContextType | undefined>(undefined)

const EXPENSE_CATEGORIES = ['Food', 'Transport', 'Books', 'Entertainment', 'Shopping', 'Utilities', 'Other']
const INCOME_CATEGORIES = ['Job', 'Allowance', 'Scholarship', 'Other']

export function FinanceProvider({ children }: { children: ReactNode }) {
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [budgets, setBudgets] = useState<Budget[]>([])
  const [savingsGoals, setSavingsGoals] = useState<SavingsGoal[]>([])
  const [bills, setBills] = useState<Bill[]>([])
  const [achievements, setAchievements] = useState<Achievement[]>([])

  // Load data from localStorage
  useEffect(() => {
    const savedTransactions = localStorage.getItem('transactions')
    const savedBudgets = localStorage.getItem('budgets')
    const savedGoals = localStorage.getItem('savingsGoals')
    const savedBills = localStorage.getItem('bills')
    const savedAchievements = localStorage.getItem('achievements')

    if (savedTransactions) setTransactions(JSON.parse(savedTransactions))
    if (savedBudgets) setBudgets(JSON.parse(savedBudgets))
    if (savedGoals) setSavingsGoals(JSON.parse(savedGoals))
    if (savedBills) setBills(JSON.parse(savedBills))
    if (savedAchievements) {
      setAchievements(JSON.parse(savedAchievements))
    } else {
      // Initialize default achievements
      const defaultAchievements: Achievement[] = [
        { id: '1', title: 'First Transaction', description: 'Log your first transaction', icon: '🎯', earned: false },
        { id: '2', title: 'Budget Master', description: 'Stay within budget for a week', icon: '💪', earned: false },
        { id: '3', title: 'Savings Star', description: 'Reach your first savings goal', icon: '⭐', earned: false },
        { id: '4', title: 'Expense Tracker', description: 'Log 50 transactions', icon: '📊', earned: false },
        { id: '5', title: 'Bill Organizer', description: 'Pay all bills on time for a month', icon: '🏆', earned: false },
      ]
      setAchievements(defaultAchievements)
    }

    // Initialize default budgets
    if (!savedBudgets) {
      const defaultBudgets = EXPENSE_CATEGORIES.map(category => ({
        category,
        limit: 200,
        spent: 0
      }))
      setBudgets(defaultBudgets)
    }
  }, [])

  // Save data to localStorage
  useEffect(() => {
    localStorage.setItem('transactions', JSON.stringify(transactions))
  }, [transactions])

  useEffect(() => {
    localStorage.setItem('budgets', JSON.stringify(budgets))
  }, [budgets])

  useEffect(() => {
    localStorage.setItem('savingsGoals', JSON.stringify(savingsGoals))
  }, [savingsGoals])

  useEffect(() => {
    localStorage.setItem('bills', JSON.stringify(bills))
  }, [bills])

  useEffect(() => {
    localStorage.setItem('achievements', JSON.stringify(achievements))
  }, [achievements])

  // Update budget spending when transactions change
  useEffect(() => {
    const updatedBudgets = budgets.map(budget => ({
      ...budget,
      spent: transactions
        .filter(t => t.type === 'expense' && t.category === budget.category)
        .reduce((sum, t) => sum + t.amount, 0)
    }))
    setBudgets(updatedBudgets)
  }, [transactions])

  // Check achievements
  useEffect(() => {
    const updatedAchievements = achievements.map(achievement => {
      if (achievement.earned) return achievement

      switch (achievement.id) {
        case '1':
          if (transactions.length >= 1) {
            return { ...achievement, earned: true, earnedAt: new Date().toISOString() }
          }
          break
        case '4':
          if (transactions.length >= 50) {
            return { ...achievement, earned: true, earnedAt: new Date().toISOString() }
          }
          break
      }
      return achievement
    })

    setAchievements(updatedAchievements)
  }, [transactions])

  const addTransaction = (transaction: Omit<Transaction, 'id'>) => {
    const newTransaction = {
      ...transaction,
      id: Date.now().toString()
    }
    setTransactions(prev => [newTransaction, ...prev])
  }

  const updateTransaction = (id: string, updatedTransaction: Partial<Transaction>) => {
    setTransactions(prev => prev.map(t => t.id === id ? { ...t, ...updatedTransaction } : t))
  }

  const deleteTransaction = (id: string) => {
    setTransactions(prev => prev.filter(t => t.id !== id))
  }

  const updateBudget = (category: string, limit: number) => {
    setBudgets(prev => prev.map(b => b.category === category ? { ...b, limit } : b))
  }

  const addSavingsGoal = (goal: Omit<SavingsGoal, 'id'>) => {
    const newGoal = {
      ...goal,
      id: Date.now().toString()
    }
    setSavingsGoals(prev => [...prev, newGoal])
  }

  const updateSavingsGoal = (id: string, amount: number) => {
    setSavingsGoals(prev => prev.map(g => g.id === id ? { ...g, current: g.current + amount } : g))
  }

  const addBill = (bill: Omit<Bill, 'id'>) => {
    const newBill = {
      ...bill,
      id: Date.now().toString()
    }
    setBills(prev => [...prev, newBill])
  }

  const markBillPaid = (id: string) => {
    setBills(prev => prev.map(b => b.id === id ? { ...b, isPaid: true } : b))
  }

  const exportData = (format: 'csv' | 'json') => {
    const data = {
      transactions,
      budgets,
      savingsGoals,
      bills
    }

    if (format === 'json') {
      const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = 'finance-data.json'
      a.click()
    } else {
      const csvContent = transactions.map(t => 
        `${t.date},${t.type},${t.category},₹${t.amount},${t.description.replace(/,/g, ';')}`
      ).join('\n')
      const csv = `Date,Type,Category,Amount (₹),Description\n${csvContent}`
      const blob = new Blob([csv], { type: 'text/csv' })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = 'transactions.csv'
      a.click()
    }
  }

  return (
    <FinanceContext.Provider value={{
      transactions,
      budgets,
      savingsGoals,
      bills,
      achievements,
      addTransaction,
      updateTransaction,
      deleteTransaction,
      updateBudget,
      addSavingsGoal,
      updateSavingsGoal,
      addBill,
      markBillPaid,
      exportData
    }}>
      {children}
    </FinanceContext.Provider>
  )
}

export function useFinance() {
  const context = useContext(FinanceContext)
  if (!context) {
    throw new Error('useFinance must be used within FinanceProvider')
  }
  return context
}