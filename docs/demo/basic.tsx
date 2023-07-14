import Segmented from 'rc-segmented';
import React from 'react';
import '../../assets/style.less';
type Options = 'iOS' | 'Android' | 'Web';
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
        <Segmented<Options>
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
