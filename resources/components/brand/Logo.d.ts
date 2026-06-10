import * as React from 'react';

/**
 * TodoMotor logo lockup — gauge mark + "todomotor" wordmark + UY tag.
 *
 * @startingPoint section="Brand" subtitle="Logo lockup & mark" viewport="700x160"
 */
export interface LogoProps extends React.HTMLAttributes<HTMLElement> {
  /** Wordmark font-size in px; the mark scales with it. @default 30 */
  size?: number;
  /** Light text for dark backgrounds. */
  inverse?: boolean;
  /** Show the "UY" country tag. @default true */
  showUY?: boolean;
  /** Render only the gauge mark (app icon). */
  markOnly?: boolean;
  /** Root element. @default "a" */
  as?: 'a' | 'div' | 'span';
}

export function Logo(props: LogoProps): JSX.Element;

export interface MarkProps extends React.SVGAttributes<SVGElement> {
  size?: number;
}
/** Just the gauge mark as an SVG (uses --accent for its fill). */
export function Mark(props: MarkProps): JSX.Element;
