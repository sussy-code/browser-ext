import './DisabledScreen.css';
import { Icon } from './Icon';

export function DisabledScreen() {
  return (
    <div className="disabled">
      <div className="icon">
        <Icon name="warningCircle" />
      </div>
      <p>
        The <strong>sudo-flix extension</strong> can not be used on this page
      </p>
    </div>
  );
}
