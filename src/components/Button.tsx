import type { ReactNode } from 'react';

import './Button.css';

export interface ButtonProps {
  type?: 'primary' | 'secondary';
  href?: string;
  children?: ReactNode;
  onClick?: () => void;
  full?: boolean;
  className?: string;
}

export function Button(props: ButtonProps) {
  const classes = `button button-${props.type ?? 'primary'} ${props.className ?? ''} ${props.full ? 'full' : ''}`;
  if (props.href)
    return (
      <a href={props.href} className={classes} target="_blank" rel="noreferrer">
        {props.children}
      </a>
    );
  return (
    <button className={classes} type="button" onClick={props.onClick}>
      {props.children}
    </button>
  );
}
