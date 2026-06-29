import Segmented from '@rc-component/segmented';
import React, { useState } from 'react';
import '../../assets/style.less';

export default function App() {
  const [direction, setDirection] = useState<'rtl' | 'ltr'>('rtl');
  return (
    <div className="wrapper">
      <button
        onClick={() => {
          setDirection('rtl');
        }}
        style={{
          padding: '0 8px',
          marginRight: 8,
        }}
      >
        rtl
      </button>
      <button
        onClick={() => {
          setDirection('ltr');
        }}
        style={{
          padding: '0 8px',
        }}
      >
        ltr
      </button>
      <p
        style={{
          marginBottom: 8,
        }}
      />
      <Segmented
        options={['iOS', 'Android', 'Web']}
        onChange={(value) => console.log(value, typeof value)}
        direction={direction}
      />
    </div>
  );
}
