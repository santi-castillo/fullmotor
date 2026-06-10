import * as React from 'react';

/**
 * Primary action control for TodoMotor. Cobalt by default; secondary, ghost,
 * soft and danger variants cover the rest of the hierarchy.
 *
 * @startingPoint section="Core" subtitle="Buttons — all variants & sizes" viewport="700x180"
 */
export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  /** Visual hierarchy. @default "primary" */
  variant?: 'primary' | 'secondary' | 'ghost' | 'soft' | 'danger';
  /** Control height. @default "md" */
  size?: 'sm' | 'md' | 'lg';
  /** Stretch to fill container width. */
  block?: boolean;
  /** Show a spinner and block interaction. */
  loading?: boolean;
  /** Icon node rendered before the label. */
  iconLeft?: React.ReactNode;
  /** Icon node rendered after the label. */
  iconRight?: React.ReactNode;
  /** Square icon-only button (pass a single icon as iconLeft). */
  iconOnly?: boolean;
  /** Render as another element, e.g. "a". @default "button" */
  as?: 'button' | 'a';
}

export function Button(props: ButtonProps): JSX.Element;
