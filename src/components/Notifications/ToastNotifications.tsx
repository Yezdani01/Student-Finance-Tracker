import { useEffect } from 'react'
import { useFinance } from '@/contexts/FinanceContext'
import { toast } from 'sonner'

export function ToastNotifications() {
  const { achievements } = useFinance()

  useEffect(() => {
    const recentAchievement = achievements.find(
      a => a.earned && a.earnedAt && 
      new Date(a.earnedAt).getTime() > Date.now() - 1000
    )

    if (recentAchievement) {
      toast.success(
        `${recentAchievement.icon} Achievement Unlocked!`,
        {
          description: `${recentAchievement.title}: ${recentAchievement.description}`,
          duration: 5000,
        }
      )
    }
  }, [achievements])

  return null
}