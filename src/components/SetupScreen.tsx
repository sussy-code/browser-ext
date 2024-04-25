import { useCallback } from 'react';

import { Button } from '~components/Button';
import { Icon } from '~components/Icon';

import './SetupScreen.css';

export function SetupScreen() {
  const open = useCallback(() => {
    const url = (chrome || browser).runtime.getURL(`/tabs/PermissionRequest.html`);
    (chrome || browser).tabs.create({ url });
    window.close();
  }, []);

  return (
    <div className="setup-screen">
      <div className="top">
        <div className="icon">
          <Icon name="logo" />
        </div>
        <h1 className="title">Let&apos;s get this set up!</h1>
        <p className="paragraph" style={{ paddingBottom: 25, paddingTop: 10 }}>
          To get started, we need to setup some things first. Click the button below to continue.
        </p>
      </div>
      <Button onClick={open} full>
        Continue
      </Button>
    </div>
  );
}
