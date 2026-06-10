import * as React from 'react';

/** Styled native select with custom chevron. */
export interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  /** Convenience: array of strings or {value,label} — alternative to children <option>s. */
  options?: Array<string | { value: string; label: string }>;
  /** Disabled first option shown when no value is selected. */
  placeholder?: string;
  /** @default "md" */
  size?: 'sm' | 'md';
}

export function Select(props: SelectProps): JSX.Element;
