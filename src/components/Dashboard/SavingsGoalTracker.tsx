import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { useFinance } from '@/contexts/FinanceContext'
import { motion } from 'framer-motion'
import { Target, TrendingUp } from 'lucide-react'

export function SavingsGoalTracker() {
  const { savingsGoals } = useFinance()

  if (savingsGoals.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="h-5 w-5" />
            Savings Goals
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-muted-foreground text-center py-8">
            Create a savings goal to start tracking your progress
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.6 }}
    >
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="h-5 w-5" />
            Savings Goals
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {savingsGoals.map((goal, index) => {
            const percentage = (goal.current / goal.target) * 100
            const isCompleted = percentage >= 100
            
            return (
              <motion.div
                key={goal.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 * index }}
                className={`space-y-3 p-4 rounded-lg border ${isCompleted ? 'bg-green-50 border-green-200 dark:bg-green-950 dark:border-green-800' : 'bg-muted/50'}`}
              >
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="font-medium">{goal.name}</h4>
                    <p className="text-sm text-muted-foreground">
                      Due: {new Date(goal.deadline).toLocaleDateString()}
                    </p>
                  </div>
                  {isCompleted && (
                    <div className="text-green-600">
                      <TrendingUp className="h-5 w-5" />
                    </div>
                  )}
                </div>
                
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>₹{goal.current}</span>
                    <span>₹{goal.target}</span>
                  </div>
                  <Progress
                    value={Math.min(percentage, 100)}
                    className="h-2"
                  />
                  <div className="text-center text-sm text-muted-foreground">
                    {percentage.toFixed(1)}% complete
                  </div>
                </div>
                
                {isCompleted && (
                  <div className="text-center text-sm text-green-600 font-medium">
                    🎉 Goal achieved!
                  </div>
                )}
              </motion.div>
            )
          })}
        </CardContent>
      </Card>
    </motion.div>
  )
}