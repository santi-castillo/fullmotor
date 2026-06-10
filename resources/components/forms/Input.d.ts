import * as React from 'react';

/**
 * Text field with optional label, icons, hint and error state.
 *
 * @startingPoint section="Forms" subtitle="Inputs, selects & filter chips" viewport="700x260"
 */
export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  /** Label rendered above the field. */
  label?: React.ReactNode;
  /** Helper text below the field. */
  hint?: React.ReactNode;
  /** Error message; sets the field into error state. */
  error?: React.ReactNode;
  /** Mark the field required (adds *). */
  required?: boolean;
  /** @default "md" */
  size?: 'sm' | 'md' | 'lg';
  /** Icon node inside the field, left side (e.g. a search glyph). */
  iconLeft?: React.ReactNode;
  /** Icon node inside the field, right side. */
  iconRight?: React.ReactNode;
}

export function Input(props: InputProps): JSX.Element;
