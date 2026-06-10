import * as React from 'react';

/**
 * The signature catalog card: vehicle photo (or gauge placeholder), condition,
 * powertrain chip, model name, trim and price. Composes FuelTag.
 *
 * @startingPoint section="Catalog" subtitle="Vehicle catalog card" viewport="700x380"
 */
export interface VehicleCardProps extends React.HTMLAttributes<HTMLElement> {
  /** Make / brand, e.g. "Volkswagen". */
  brand: string;
  /** Model name shown large, e.g. "Taos". */
  model: string;
  /** Trim / version line, e.g. "Highline 250 TSI 1.4 A/T". */
  trim?: string;
  /** Model year. */
  year?: number | string;
  /** Numeric price (formatted es-UY) or preformatted string. */
  price: number | string;
  /** Currency prefix. @default "USD" */
  currency?: string;
  /** Power in HP. */
  power?: number | string;
  /** Powertrain. @default "nafta" */
  fuel?: 'nafta' | 'electrico' | 'hibrido' | 'diesel';
  /** Condition label, e.g. "Nuevo" or "Usado 2021". @default "Nuevo" */
  condition?: string;
  /** Photo URL; falls back to a brand gauge placeholder. */
  image?: string;
  /** Saved (favourite) state — renders the heart toggle only if onToggleSave is set. */
  saved?: boolean;
  /** Save toggle handler; omit to hide the heart button. */
  onToggleSave?: (e: React.MouseEvent) => void;
  /** Root element. @default "a" */
  as?: 'a' | 'div' | 'article';
}

export function VehicleCard(props: VehicleCardProps): JSX.Element;
