'use client'

import { useEffect, useState } from 'react'
import { CheckCircle, X } from 'lucide-react'

interface AdoptionSuccessNotificationProps {
  message: string
}

export default function AdoptionSuccessNotification({
  message,
}: AdoptionSuccessNotificationProps) {
  const [isVisible, setIsVisible] = useState(true)

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(false), 5000)
    return () => clearTimeout(timer)
  }, [])

  if (!isVisible) return null

  return (
    <div className="fixed bottom-4 right-4 z-40 max-w-sm animate-in fade-in slide-in-from-bottom-4 duration-300">
      <div className="bg-green-600 text-white rounded-lg shadow-lg p-4 flex items-start gap-3">
        <CheckCircle size={20} className="flex-shrink-0 mt-0.5" />
        <div className="flex-1">
          <p className="font-semibold">Sucesso!</p>
          <p className="text-sm mt-1 text-green-50">{message}</p>
        </div>
        <button
          onClick={() => setIsVisible(false)}
          className="text-green-100 hover:text-white ml-4 flex-shrink-0"
        >
          <X size={18} />
        </button>
      </div>
    </div>
  )
}
