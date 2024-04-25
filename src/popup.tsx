import { BottomLabel, TopRightLabel } from '~components/BottomLabel';
import { DisabledScreen } from '~components/DisabledScreen';
import { Frame } from '~components/Frame';
import { SetupScreen } from '~components/SetupScreen';
import { ToggleButton } from '~components/ToggleButton';
import { useDomain } from '~hooks/useDomain';
import { useToggleWhitelistDomain } from '~hooks/useDomainWhitelist';
import { usePermission } from '~hooks/usePermission';

import './Popup.css';

function IndexPopup() {
  const domain = useDomain();
  const { isWhitelisted, toggle } = useToggleWhitelistDomain(domain);
  const { hasPermission } = usePermission();

  let page = 'toggle';
  if (!hasPermission) page = 'perm';
  else if (!domain) page = 'disabled';

  return page === 'perm' ? (
    <Frame>
      <div className="popup">
        <SetupScreen />
        <TopRightLabel />
      </div>
    </Frame>
  ) : (
    <Frame>
      <div className="popup">
        {page === 'toggle' && domain ? <ToggleButton active={isWhitelisted} onClick={toggle} domain={domain} /> : null}
        {page === 'disabled' ? <DisabledScreen /> : null}
        <BottomLabel />
      </div>
    </Frame>
  );
}

export default IndexPopup;
