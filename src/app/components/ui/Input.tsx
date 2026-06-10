import { useId } from 'react'

interface FieldProps {
  label?: string
  hint?: string
  error?: string
  required?: boolean
  className?: string
}

interface InputProps extends FieldProps, Omit<React.InputHTMLAttributes<HTMLInputElement>, 'className' | 'size'> {
  size?: 'sm' | 'md' | 'lg'
  iconLeft?: React.ReactNode
  iconRight?: React.ReactNode
}

export function Input({ label, hint, error, required = false, size = 'md', iconLeft, iconRight, id, className = '', ...rest }: InputProps) {
  const autoId = useId()
  const fid = id || autoId
  const inputCls = [
    'tm-input',
    `tm-input--${size}`,
    iconLeft ? 'tm-input--has-left' : '',
    iconRight ? 'tm-input--has-right' : '',
  ].filter(Boolean).join(' ')
  const fieldCls = ['tm-field', error ? 'tm-field--error' : '', className].filter(Boolean).join(' ')

  return (
    <div className={fieldCls}>
      {label && (
        <label className="tm-field__label" htmlFor={fid}>
          {label}{required && <span className="tm-field__req">*</span>}
        </label>
      )}
      <div className="tm-input-wrap">
        {iconLeft && <span className="tm-input__icon tm-input__icon--left">{iconLeft}</span>}
        <input id={fid} className={inputCls} aria-invalid={!!error || undefined} required={required} {...rest} />
        {iconRight && <span className="tm-input__icon tm-input__icon--right">{iconRight}</span>}
      </div>
      {(error || hint) && <span className="tm-field__hint">{error || hint}</span>}
    </div>
  )
}

interface TextareaProps extends FieldProps, Omit<React.TextareaHTMLAttributes<HTMLTextAreaElement>, 'className'> {}

export function Textarea({ label, hint, error, required = false, id, className = '', ...rest }: TextareaProps) {
  const autoId = useId()
  const fid = id || autoId
  const fieldCls = ['tm-field', error ? 'tm-field--error' : '', className].filter(Boolean).join(' ')
  return (
    <div className={fieldCls}>
      {label && (
        <label className="tm-field__label" htmlFor={fid}>
          {label}{required && <span className="tm-field__req">*</span>}
        </label>
      )}
      <textarea id={fid} className="tm-textarea" aria-invalid={!!error || undefined} required={required} {...rest} />
      {(error || hint) && <span className="tm-field__hint">{error || hint}</span>}
    </div>
  )
}
