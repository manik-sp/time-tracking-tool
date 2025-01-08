// components/DayContent.tsx
'use client'

import { CalendarDayProps } from 'react-day-picker'

interface DayContentProps extends CalendarDayProps {
  hours?: { [key: string]: number }
}

export default function DayContent({ date, hours, ...props }: DayContentProps) {
  const formattedDate = date.toISOString().split('T')[0]
  const hoursWorked = hours?.[formattedDate]

  return (
    <div className="flex flex-col items-center">
      <div {...props} />
      {hoursWorked && (
        <div className="text-xs mt-1 font-medium">
          {hoursWorked}h
        </div>
      )}
    </div>
  )
}