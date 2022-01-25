import '../../assets/index.less';
import React from 'react';
import Segmented from 'rc-segmented';

export default function App() {
  return (
    <div>
      <Segmented options={['iOS', 'Android', 'Web']} />
      <Segmented options={['13333333333', '057110000', '02110086']} />
      <Segmented options={['iOS', 'Android', 'Web']} disabled />
      <Segmented
        options={[
          'iOS',
          { title: 'Android', value: 'Android', disabled: true },
          'Web',
        ]}
      />
    </div>
  );
}
