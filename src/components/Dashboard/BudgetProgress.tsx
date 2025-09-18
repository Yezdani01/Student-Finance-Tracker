import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { useFinance } from '@/contexts/FinanceContext'
import { motion } from 'framer-motion'

export function BudgetProgress() {
  const { budgets } = useFinance()

  const budgetsWithSpending = budgets.filter(b => b.limit > 0)

  if (budgetsWithSpending.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Budget Overview</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-muted-foreground text-center py-8">
            Set budgets in your profile to track spending
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.5 }}
    >
      <Card>
        <CardHeader>
          <CardTitle>Budget Overview</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {budgetsWithSpending.map((budget, index) => {
            const percentage = (budget.spent / budget.limit) * 100
            const isOverBudget = percentage > 100
            
            return (
              <motion.div
                key={budget.category}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 * index }}
                className="space-y-2"
              >
                <div className="flex justify-between items-center">
                  <span className="font-medium">{budget.category}</span>
                  <span className={`text-sm ${isOverBudget ? 'text-red-600' : 'text-muted-foreground'}`}>
                    ₹{budget.spent} / ₹{budget.limit}
                  </span>
                </div>
                <Progress
                  value={Math.min(percentage, 100)}
                  className="h-2"
                />
                {isOverBudget && (
                  <p className="text-xs text-red-600">
                    Over budget by ₹{(budget.spent - budget.limit).toFixed(2)}
                  </p>
                )}
              </motion.div>
            )
          })}
        </CardContent>
      </Card>
    </motion.div>
  )
}