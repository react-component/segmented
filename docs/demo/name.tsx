import Segmented from 'rc-segmented';
import React from 'react';
import '../../assets/style.less';

export default function App() {
  return (
    <div>
      <div className="wrapper">
        <Segmented
          name="group"
          options={['iOS', 'Android', 'Web']}
          onChange={(value) => console.log(value, typeof value)}
        />
      </div>
    </div>
  );
}
