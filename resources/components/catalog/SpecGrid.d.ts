import * as React from 'react';

export interface SpecItem {
  label: string;
  value: React.ReactNode;
  /** Accent the value (e.g. a headline figure). */
  highlight?: boolean;
}

export interface SpecGroup {
  title?: string;
  items: SpecItem[];
}

/** Ficha-técnica spec list. Pass flat `items` or titled `groups`. */
export interface SpecGridProps {
  items?: SpecItem[];
  groups?: SpecGroup[];
  /** Columns per group. @default 2 */
  cols?: number;
  className?: string;
}

export function SpecGrid(props: SpecGridProps): JSX.Element;
