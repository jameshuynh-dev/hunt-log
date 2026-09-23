import { useEffect, useRef, type ReactNode } from 'react'

interface ModalProps {
  title: string
  onClose: () => void
  children: ReactNode
}

// A popup built on the browser's native <dialog> element. showModal() gives us
// accessibility for free: focus stays inside the dialog, Escape closes it, and
// screen readers announce it as a dialog.
// The parent shows it by rendering it and hides it by not rendering it.
export function Modal({ title, onClose, children }: ModalProps) {
  const dialogRef = useRef<HTMLDialogElement>(null)

  // useRef gives direct access to the DOM element. showModal() must be
  // called after React has put the element on the page, hence useEffect.
  useEffect(() => {
    dialogRef.current?.showModal()
  }, [])

  return (
    <dialog
      ref={dialogRef}
      onClose={onClose} // fired by Escape
      onClick={(e) => {
        // A click on the backdrop has the <dialog> itself as its target.
        if (e.target === dialogRef.current) onClose()
      }}
      className="m-auto w-full max-w-2xl rounded-3xl bg-white p-0 shadow-xl backdrop:bg-primary/25 backdrop:backdrop-blur-[2px]"
    >
      <div className="p-6">
        <div className="mb-5 flex items-start justify-between gap-4">
          <h2 className="text-lg font-semibold text-primary">{title}</h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="rounded-full px-2 text-xl leading-none text-muted hover:bg-canvas"
          >
            ×
          </button>
        </div>
        {children}
      </div>
    </dialog>
  )
}
