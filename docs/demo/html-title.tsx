import Segmented from '@rc-component/segmented';
import React from 'react';
import '../../assets/style.less';

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
              label: 'Android',
              value: 'Android',
              title: 'Android12',
            },
            {
              label: <h3>Web</h3>,
              value: 'Web',
            },
          ]}
        />
      </div>
      <div className="wrapper">
        <Segmented
          options={[
            { label: 'iOS', value: 'iOS', title: 'IOS' },
            { label: 'Android', value: 'Android', title: '' },
            { label: <h1>Web</h1>, value: 'Web', title: 'WEB' },
          ]}
        />
      </div>
    </div>
  );
}
