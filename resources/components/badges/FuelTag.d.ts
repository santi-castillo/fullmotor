import * as React from 'react';

/**
 * Powertrain chip for the catalog. Domain-colored pill for the four fuel
 * types TodoMotor lists: nafta, eléctrico, híbrido, diésel.
 */
export interface FuelTagProps extends React.HTMLAttributes<HTMLSpanElement> {
  /** Powertrain type. @default "nafta" */
  type?: 'nafta' | 'electrico' | 'hibrido' | 'diesel';
  /** Drop the tinted pill background — just colored dot + label. */
  plain?: boolean;
}

export function FuelTag(props: FuelTagProps): JSX.Element;
