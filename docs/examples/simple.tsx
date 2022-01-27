import '../../assets/index.less';
import React from 'react';
import Segmented from 'rc-segmented';

export default function App() {
  return (
    <div>
      <div className="wrapper">
        <Segmented
          options={['iOS', 'Android', 'Web']}
          onChange={(e) => console.log(e.target.value, typeof e.target.value)}
        />
      </div>
      <div className="wrapper">
        <Segmented
          options={[13333333333, 157110000, 12110086]}
          onChange={(e) => console.log(e.target.value, typeof e.target.value)}
        />
      </div>
      <div className="wrapper">
        <Segmented options={['iOS', 'Android', 'Web']} disabled />
      </div>
      <div className="wrapper">
        <Segmented
          options={[
            'iOS',
            { label: 'Android', value: 'Android', disabled: true },
            'Web',
          ]}
        />
      </div>
    </div>
  );
}
