import * as React from 'react';

/**
 * Small status / metadata label. Soft tint by default; solid and outline
 * variants available across five tones.
 *
 * @startingPoint section="Core" subtitle="Badges, tags & powertrain chips" viewport="700x200"
 */
export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  /** Semantic color. @default "neutral" */
  tone?: 'neutral' | 'accent' | 'positive' | 'warning' | 'danger';
  /** Fill style. @default "soft" */
  variant?: 'soft' | 'solid' | 'outline';
  /** @default "md" */
  size?: 'sm' | 'md';
  /** Show a leading status dot. */
  dot?: boolean;
}

export function Badge(props: BadgeProps): JSX.Element;
