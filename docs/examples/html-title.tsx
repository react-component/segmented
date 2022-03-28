import '../../assets/style.less';
import React from 'react';
import Segmented from 'rc-segmented';

export default function App() {
  return (
    <div>
      <div className="wrapper">
        <Segmented options={['iOS', 'Android', 'Web']} />
      </div>
      <div className="wrapper">
        <Segmented
          options={[
            {
              label: 'iOS',
              value: 'iOS',
            },
            {
              label: <h3>Web</h3>,
              value: 'Web',
            },
            {
              label: 'Android',
              value: 'Android',
              htmlTitle: 'Android12',
            },
          ]}
        />
      </div>
      <div className="wrapper">
        <Segmented
          options={[
            { label: 'iOS', value: 'iOS', htmlTitle: 'IOS' },
            { label: 'Android', value: 'Android', htmlTitle: '' },
            { label: <h1>Web</h1>, value: 'Web', htmlTitle: 'WEB' },
          ]}
        />
      </div>
    </div>
  );
}
