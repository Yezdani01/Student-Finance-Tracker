import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useFinance } from '@/contexts/FinanceContext'
import { motion } from 'framer-motion'
import { Settings, Save } from 'lucide-react'
import { toast } from 'sonner'

const EXPENSE_CATEGORIES = ['Food', 'Transport', 'Books', 'Entertainment', 'Shopping', 'Utilities', 'Other']

export function BudgetManager() {
  const { budgets, updateBudget } = useFinance()
  const [budgetLimits, setBudgetLimits] = useState<Record<string, string>>(
    budgets.reduce((acc, budget) => ({ ...acc, [budget.category]: budget.limit.toString() }), {})
  )

  const handleSave = () => {
    EXPENSE_CATEGORIES.forEach(category => {
      const limit = parseFloat(budgetLimits[category] || '0')
      if (limit >= 0) {
        updateBudget(category, limit)
      }
    })
    toast.success('Budget limits updated! 💰')
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
    >
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5" />
            Budget Management
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <p className="text-sm text-muted-foreground">
            Set monthly spending limits for each category to help track your expenses.
          </p>
          
          <div className="grid gap-4 md:grid-cols-2">
            {EXPENSE_CATEGORIES.map((category) => {
              const budget = budgets.find(b => b.category === category)
              const spent = budget?.spent || 0
              
              return (
                <div key={category} className="space-y-3 p-4 border rounded-lg bg-muted/30">
                  <Label>{category}</Label>
                  <div className="space-y-2">
                    <Input
                      type="number"
                      min="0"
                      step="0.01"
                      placeholder="Monthly limit (₹)"
                      value={budgetLimits[category] || ''}
                      onChange={(e) => setBudgetLimits(prev => ({
                        ...prev,
                        [category]: e.target.value
                      }))}
                      className="w-full"
                    />
                    <div className="text-sm text-muted-foreground">
                      <span className="font-medium">Current spending:</span> ₹{spent.toFixed(2)}
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
          
          <Button onClick={handleSave} className="w-full">
            <Save className="h-4 w-4 mr-2" />
            Save Budget Limits
          </Button>
        </CardContent>
      </Card>
    </motion.div>
  )
}