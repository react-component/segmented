import '../../assets/style.less';
import React from 'react';
import Segmented from 'rc-segmented';

export default function App() {
  return (
    <div>
      <div className="wrapper">
        <Segmented
          options={['iOS', 'Android', 'Web']}
          onChange={(value) => console.log(value, typeof value)}
        />
      </div>
      <div className="wrapper">
        <Segmented
          options={[13333333333, 157110000, 12110086]}
          onChange={(value) => console.log(value, typeof value)}
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
