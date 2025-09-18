import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useFinance } from '@/contexts/FinanceContext'
import { motion } from 'framer-motion'
import { Target, Plus, TrendingUp, Minus } from 'lucide-react'
import { toast } from 'sonner'
import { Progress } from '@/components/ui/progress'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'

export function SavingsGoalManager() {
  const { savingsGoals, addSavingsGoal, updateSavingsGoal } = useFinance()
  const [newGoal, setNewGoal] = useState({
    name: '',
    target: '',
    deadline: '',
  })
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  const handleAddGoal = (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!newGoal.name || !newGoal.target || !newGoal.deadline) {
      toast.error('Please fill in all fields')
      return
    }

    const target = parseFloat(newGoal.target)
    if (target <= 0) {
      toast.error('Target amount must be greater than zero')
      return
    }

    addSavingsGoal({
      name: newGoal.name,
      target,
      current: 0,
      deadline: newGoal.deadline,
    })

    toast.success('Savings goal created! 🎯')
    setNewGoal({ name: '', target: '', deadline: '' })
    setIsDialogOpen(false)
  }

  const handleUpdateGoal = (id: string, amount: number) => {
    if (amount === 0) return
    updateSavingsGoal(id, amount)
    toast.success(amount > 0 ? 'Progress added! 📈' : 'Progress adjusted 📊')
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
    >
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Target className="h-5 w-5" />
              Savings Goals
            </CardTitle>
            
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button size="sm">
                  <Plus className="h-4 w-4 mr-2" />
                  New Goal
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Create Savings Goal</DialogTitle>
                </DialogHeader>
                
                <form onSubmit={handleAddGoal} className="space-y-4">
                  <div>
                    <Label htmlFor="goalName">Goal Name</Label>
                    <Input
                      id="goalName"
                      value={newGoal.name}
                      onChange={(e) => setNewGoal(prev => ({ ...prev, name: e.target.value }))}
                      placeholder="e.g., New Laptop, Emergency Fund"
                      required
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="goalTarget">Target Amount (₹)</Label>
                    <Input
                      id="goalTarget"
                      type="number"
                      step="0.01"
                      min="0.01"
                      value={newGoal.target}
                      onChange={(e) => setNewGoal(prev => ({ ...prev, target: e.target.value }))}
                      placeholder="0.00"
                      required
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="goalDeadline">Target Date</Label>
                    <Input
                      id="goalDeadline"
                      type="date"
                      value={newGoal.deadline}
                      onChange={(e) => setNewGoal(prev => ({ ...prev, deadline: e.target.value }))}
                      required
                    />
                  </div>
                  
                  <div className="flex gap-2 pt-4">
                    <Button type="submit" className="flex-1">
                      Create Goal
                    </Button>
                    <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                      Cancel
                    </Button>
                  </div>
                </form>
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>
        
        <CardContent>
          {savingsGoals.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <Target className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <h3 className="font-semibold mb-2">No savings goals yet</h3>
              <p className="text-sm">Create your first goal to start tracking your progress!</p>
            </div>
          ) : (
            <div className="space-y-6">
              {savingsGoals.map((goal, index) => {
                const percentage = (goal.current / goal.target) * 100
                const isCompleted = percentage >= 100
                
                return (
                  <motion.div
                    key={goal.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 * index }}
                    className={`p-4 rounded-lg border ${
                      isCompleted ? 'bg-green-50 border-green-200 dark:bg-green-950 dark:border-green-800' : 'bg-muted/50'
                    }`}
                  >
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <h4 className="font-semibold">{goal.name}</h4>
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
                    
                    <div className="space-y-3">
                      <div className="flex justify-between text-sm">
                        <span>₹{goal.current.toFixed(2)}</span>
                        <span>₹{goal.target.toFixed(2)}</span>
                      </div>
                      <Progress value={Math.min(percentage, 100)} className="h-2" />
                      <div className="text-center text-sm text-muted-foreground">
                        {percentage.toFixed(1)}% complete
                      </div>
                    </div>
                    
                    {!isCompleted && (
                      <div className="flex gap-2 mt-4">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            const amount = prompt('Enter amount to add:')
                            if (amount) {
                              const num = parseFloat(amount)
                              if (num > 0) handleUpdateGoal(goal.id, num)
                            }
                          }}
                        >
                          <Plus className="h-4 w-4 mr-1" />
                          Add Progress
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            const amount = prompt('Enter amount to subtract:')
                            if (amount) {
                              const num = parseFloat(amount)
                              if (num > 0) handleUpdateGoal(goal.id, -num)
                            }
                          }}
                        >
                          <Minus className="h-4 w-4 mr-1" />
                          Adjust
                        </Button>
                      </div>
                    )}
                    
                    {isCompleted && (
                      <div className="text-center text-sm text-green-600 font-medium mt-3">
                        🎉 Goal achieved! Congratulations!
                      </div>
                    )}
                  </motion.div>
                )
              })}
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  )
}