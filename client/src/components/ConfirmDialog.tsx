import { useState } from 'react'
import { dangerButtonClass, secondaryButtonClass } from '../styles'
import { Modal } from './Modal'

interface ConfirmDialogProps {
  title: string
  message: string
  confirmLabel: string
  onConfirm: () => Promise<void>
  onCancel: () => void
}

// Ask "are you sure?" before destructive actions such as delete.
export function ConfirmDialog({ title, message, confirmLabel, onConfirm, onCancel }: ConfirmDialogProps) {
  const [working, setWorking] = useState(false)

  async function handleConfirm() {
    setWorking(true)
    try {
      await onConfirm()
    } finally {
      setWorking(false)
    }
  }

  return (
    <Modal title={title} onClose={onCancel}>
      <p className="text-sm text-slate-600">{message}</p>
      <div className="mt-6 flex justify-end gap-3">
        {/* autoFocus on Cancel: pressing Enter by accident shouldn't delete anything */}
        <button type="button" autoFocus onClick={onCancel} className={secondaryButtonClass}>
          Cancel
        </button>
        <button
          type="button"
          disabled={working}
          onClick={handleConfirm}
          className={dangerButtonClass}
        >
          {working ? 'Please wait…' : confirmLabel}
        </button>
      </div>
    </Modal>
  )
}
