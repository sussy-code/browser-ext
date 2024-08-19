import { useCallback } from 'react';

import { Button } from '~components/Button';
import { Icon } from '~components/Icon';
import { usePermission } from '~hooks/usePermission';

import './PermissionRequest.css';

function Card(props: { purple?: boolean; children: React.ReactNode; icon?: React.ReactNode; right?: React.ReactNode }) {
  return (
    <div className={['card', props.purple ? 'purple' : ''].join(' ')}>
      <div>
        <div className="icon-circle">{props.icon}</div>
      </div>
      <div>{props.children}</div>
      {props.right ? <div className="center-y">{props.right}</div> : null}
    </div>
  );
}

export default function PermissionRequest() {
  const { grantPermission } = usePermission();

  const grant = useCallback(() => {
    grantPermission().then(() => window.close());
  }, [grantPermission]);

  return (
    <div className="container permission-request">
      <div className="inner-container">
        <h1 className="color-white">
          We need some <br /> browser permissions
        </h1>
        <p className="text-color paragraph">
          We don&apos;t like it either, but the sudo-flix extension needs quite a few permissions to function. Listed
          below is an explanation for all permissions we need.
        </p>

        <div className="card-list" style={{ marginTop: '2.5rem' }}>
          <Card
            purple
            icon={<Icon name="github" />}
            right={
              <Button type="secondary" href="https://github.com/sussy-code/browser-ext">
                Read source code
              </Button>
            }
          >
            <h3>Read the source code on GitHub</h3>
            <p className="text-color paragraph">
              Don&apos;t trust us? Read the code and decide for yourself if it&apos;s safe!
            </p>
          </Card>
        </div>

        <h2>Permission list</h2>
        <div className="card-list">
          <Card icon={<Icon name="windows" />}>
            <h3>Read & change data from all sites</h3>
            <p className="text-color paragraph">
              This is so the extension can gather content from the sources. We need to be able to reach those sources.
              Unfortunately that requires us to request the permissions from all sites.
            </p>
          </Card>
          <Card icon={<Icon name="network" />}>
            <h3>Network Requests</h3>
            <p className="text-color paragraph">
              This permission allows the extension to instruct the browser how to request data from sites. In more
              technical terms, this allows sudo-flix to modify HTTP headers that it wouldn&apos;t normally be allowed
              to.
            </p>
            <p className="text-color paragraph">
              You won&apos;t be prompted for this permission, it&apos;s included in “Read & change data from all sites”.
            </p>
          </Card>
          <Card icon={<Icon name="cookie" />}>
            <h3>Read and write cookies</h3>
            <p className="text-color paragraph">
              Some sources use cookies for authentication. We need to be able to read and set those cookies. The
              extension will only be able to accees the cookies for a few sites we scrape.
            </p>
            <p className="text-color paragraph">
              You won&apos;t be prompted for this permission, it&apos;s included in “Read & change data from all sites”.
            </p>
          </Card>
          <Card icon={<Icon name="shield" />}>
            <h3>Active tab</h3>
            <p className="text-color paragraph">
              To determine which site has access to the extension or not, we need to know what tab you&apos;re currently
              using.
            </p>
            <p className="text-color paragraph">
              This permission is given to all extensions by default, so your browser won&apos;t prompt you for it.
            </p>
          </Card>
        </div>

        <div className="footer">
          <div style={{ width: '250px' }}>
            <Button full onClick={grant}>
              Grant Permission
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
