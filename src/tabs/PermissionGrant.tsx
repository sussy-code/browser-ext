import { Button } from '~components/Button';
import { usePermission } from '~hooks/usePermission';
import { makeUrlIntoDomain } from '~utils/domains';

import './PermissionGrant.css';

export default function PermissionGrant() {
  const { grantPermission } = usePermission();

  const queryParams = new URLSearchParams(window.location.search);
  const redirectUrl = queryParams.get('redirectUrl') ?? undefined;
  const domain = redirectUrl ? makeUrlIntoDomain(redirectUrl) : undefined;

  if (!domain) {
    return (
      <div className="permission-grant container">
        <div className="inner-container">
          <div className="permission-card">
            <h1 className="color-white">Permission</h1>
            <p className="text-color" style={{ textAlign: 'center' }}>
              No domain found to grant permission to.
            </p>
          </div>
        </div>
      </div>
    );
  }

  const redirectBack = () => {
    chrome.tabs.getCurrent((tab) => {
      if (!tab?.id) return;
      chrome.tabs.update(tab.id, { url: redirectUrl });
    });
  };

  const handleGrantPermission = () => {
    grantPermission(domain).then(() => {
      redirectBack();
    });
  };

  return (
    <div className="permission-grant container">
      <div className="inner-container">
        <div className="permission-card">
          <h1 className="color-white">Permission</h1>
          <p className="text-color" style={{ textAlign: 'center' }}>
            The website <span className="color-white">{domain}</span> wants to <br /> use the extension on their page.
            Do you trust them?
          </p>
          <div className="buttons">
            <Button full onClick={handleGrantPermission}>
              Grant Permission
            </Button>
            <Button full onClick={redirectBack} type="secondary">
              Decline
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
