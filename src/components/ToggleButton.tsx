import { Icon } from './Icon';
import './ToggleButton.css';

export interface ToggleButtonProps {
  onClick?: () => void;
  active?: boolean;
  domain: string;
}

export function ToggleButton(props: ToggleButtonProps) {
  const opacityStyle = {
    opacity: props.active ? 1 : 0,
  };

  return (
    <div className="button-container">
      <div className={['button-wrapper', props.active ? 'active' : ''].join(' ')}>
        <button
          type="button"
          onClick={props.onClick}
          aria-label="Toggle extension on/off"
          className="toggle-button"
          style={{
            color: props.active ? '#9B93CC' : '#4B4765',
          }}
        >
          <div className="actual-button-style" />
          <div className="actual-button-style active" style={opacityStyle} />
          <Icon name="power" />
          <div
            className="inside-glow"
            style={{
              backgroundColor: props.active ? '#452D7C' : '#181724',
            }}
          />
        </button>
      </div>
      <p>
        Extension <strong>{props.active ? 'enabled' : 'disabled'}</strong> <br /> on <strong>{props.domain}</strong>
      </p>
    </div>
  );
}
