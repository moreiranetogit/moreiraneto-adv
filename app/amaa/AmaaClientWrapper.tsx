'use client'

import { useEffect, useState } from 'react'
import AdoptionInterestModal from './AdoptionInterestModal'
import AdoptionSuccessNotification from './AdoptionSuccessNotification'

interface AmaaClientWrapperProps {
  children: React.ReactNode
}

/**
 * Wrapper cliente para /amaa
 * Gerencia modal de interesse de adoção e notificações
 * Mantém a página como Server Component mas adiciona interatividade
 */
export default function AmaaClientWrapper({ children }: AmaaClientWrapperProps) {
  const [modalState, setModalState] = useState<{
    isOpen: boolean
    animalId: string
    animalName: string
  }>({
    isOpen: false,
    animalId: '',
    animalName: '',
  })

  const [showSuccess, setShowSuccess] = useState(false)
  const [successMessage, setSuccessMessage] = useState('')

  useEffect(() => {
    const handleOpenModal = (event: Event) => {
      const customEvent = event as CustomEvent<{
        animalId: string
        animalName: string
      }>
      setModalState({
        isOpen: true,
        animalId: customEvent.detail.animalId,
        animalName: customEvent.detail.animalName,
      })
    }

    window.addEventListener('openAdoptionModal', handleOpenModal)
    return () => {
      window.removeEventListener('openAdoptionModal', handleOpenModal)
    }
  }, [])

  const handleCloseModal = () => {
    setModalState(prev => ({ ...prev, isOpen: false }))
  }

  const handleAdoptionSuccess = () => {
    setSuccessMessage(
      `Ótimo! Seu interesse em adotar ${modalState.animalName} foi registrado.`
    )
    setShowSuccess(true)
    setTimeout(() => setShowSuccess(false), 5000)
  }

  return (
    <>
      {children}

      {/* Modal de interesse */}
      <AdoptionInterestModal
        animalId={modalState.animalId}
        animalName={modalState.animalName}
        isOpen={modalState.isOpen}
        onClose={handleCloseModal}
        onSuccess={handleAdoptionSuccess}
      />

      {/* Notificação de sucesso */}
      {showSuccess && <AdoptionSuccessNotification message={successMessage} />}
    </>
  )
}
