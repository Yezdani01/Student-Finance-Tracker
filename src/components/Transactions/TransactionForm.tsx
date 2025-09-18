import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { Checkbox } from '@/components/ui/checkbox'
import { useFinance } from '@/contexts/FinanceContext'
import { toast } from 'sonner'
import { Plus, Users } from 'lucide-react'
import { motion } from 'framer-motion'

const EXPENSE_CATEGORIES = ['Food', 'Transport', 'Books', 'Entertainment', 'Shopping', 'Utilities', 'Other']
const INCOME_CATEGORIES = ['Job', 'Allowance', 'Scholarship', 'Other']

interface TransactionFormProps {
  onClose?: () => void
}

export function TransactionForm({ onClose }: TransactionFormProps) {
  const { addTransaction } = useFinance()
  const [formData, setFormData] = useState({
    type: 'expense' as 'income' | 'expense',
    amount: '',
    category: '',
    description: '',
    date: new Date().toISOString().split('T')[0],
    splitWith: [] as string[],
    isSplit: false
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!formData.amount || !formData.category || !formData.description) {
      toast.error('Please fill in all required fields')
      return
    }

    if (parseFloat(formData.amount) <= 0) {
      toast.error('Amount must be greater than zero')
      return
    }

    const amount = parseFloat(formData.amount)
    const finalAmount = formData.isSplit ? amount / (formData.splitWith.length + 1) : amount

    addTransaction({
      type: formData.type,
      amount: finalAmount,
      category: formData.category,
      description: formData.description,
      date: formData.date,
      splitWith: formData.isSplit ? formData.splitWith : undefined
    })

    toast.success('Transaction added successfully! 🎉')
    
    // Reset form
    setFormData({
      type: 'expense',
      amount: '',
      category: '',
      description: '',
      date: new Date().toISOString().split('T')[0],
      splitWith: [],
      isSplit: false
    })
    
    onClose?.()
  }

  const categories = formData.type === 'expense' ? EXPENSE_CATEGORIES : INCOME_CATEGORIES

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Plus className="h-5 w-5" />
            Add Transaction
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="type">Type</Label>
                <Select
                  value={formData.type}
                  onValueChange={(value: 'income' | 'expense') => 
                    setFormData(prev => ({ ...prev, type: value, category: '' }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="expense">Expense</SelectItem>
                    <SelectItem value="income">Income</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="amount">Amount (₹)</Label>
                <Input
                  id="amount"
                  type="number"
                  step="0.01"
                  min="0.01"
                  value={formData.amount}
                  onChange={(e) => setFormData(prev => ({ ...prev, amount: e.target.value }))}
                  placeholder="0.00"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="category">Category</Label>
                <Select
                  value={formData.category}
                  onValueChange={(value) => setFormData(prev => ({ ...prev, category: value }))}
                  required
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map(category => (
                      <SelectItem key={category} value={category}>{category}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="date">Date</Label>
                <Input
                  id="date"
                  type="date"
                  value={formData.date}
                  onChange={(e) => setFormData(prev => ({ ...prev, date: e.target.value }))}
                  required
                />
              </div>
            </div>

            <div>
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                placeholder="What was this for?"
                required
              />
            </div>

            {formData.type === 'expense' && (
              <div className="space-y-3">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="split"
                    checked={formData.isSplit}
                    onCheckedChange={(checked) => 
                      setFormData(prev => ({ ...prev, isSplit: checked as boolean, splitWith: [] }))
                    }
                  />
                  <Label htmlFor="split" className="flex items-center gap-2">
                    <Users className="h-4 w-4" />
                    Split this expense
                  </Label>
                </div>

                {formData.isSplit && (
                  <div>
                    <Label>Split with (roommates/friends)</Label>
                    <Input
                      placeholder="Enter names separated by commas"
                      value={formData.splitWith.join(', ')}
                      onChange={(e) => 
                        setFormData(prev => ({
                          ...prev,
                          splitWith: e.target.value.split(',').map(name => name.trim()).filter(Boolean)
                        }))
                      }
                    />
                    {formData.splitWith.length > 0 && (
                      <p className="text-sm text-muted-foreground mt-1">
                        Your share: ₹{formData.amount ? (parseFloat(formData.amount) / (formData.splitWith.length + 1)).toFixed(2) : '0.00'}
                      </p>
                    )}
                  </div>
                )}
              </div>
            )}

            <div className="flex gap-2">
              <Button type="submit" className="flex-1">
                Add Transaction
              </Button>
              {onClose && (
                <Button type="button" variant="outline" onClick={onClose}>
                  Cancel
                </Button>
              )}
            </div>
          </form>
        </CardContent>
      </Card>
    </motion.div>
  )
}