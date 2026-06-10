import * as React from 'react';

/** Toggleable pill for catalog filters (category, brand, fuel…). */
export interface FilterChipProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  /** Selected state. */
  active?: boolean;
  /** Optional trailing count, e.g. number of matching vehicles. */
  count?: number;
  /** Leading icon node. */
  icon?: React.ReactNode;
}

export function FilterChip(props: FilterChipProps): JSX.Element;
