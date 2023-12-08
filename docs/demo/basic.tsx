import Segmented from 'rc-segmented';
import React from 'react';

import '../../assets/style.less';

const Demo = () => {
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
          onChange={(value) => console.log(value, typeof value)}
        />
      </div>
    </div>
  );
};

export default Demo;
