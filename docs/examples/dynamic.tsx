import '../../assets/index.less';
import * as React from 'react';
import Segmented from 'rc-segmented';

const defaultOptions1 = ['iOS', 'Android', 'Web'];
const defaultOptions2 = [
  { title: 'iOS', value: 'iOS' },
  { title: 'Android', value: 'Android' },
  { title: 'Web', value: 'Web' },
];

export default () => {
  const [options1, setOptions1] = React.useState(defaultOptions1);
  const [options2, setOptions2] = React.useState(defaultOptions2);

  const handleLoadOptions1 = () => {
    setOptions1((r) => r.concat('Electron', 'Mini App'));
  };

  const handleLoadOptions2 = () => {
    setOptions2([
      { title: 'Electron', value: 'Electron' },
      'Mini App',
      ...defaultOptions2.reverse(),
    ]);
  };

  return (
    <>
      <div>
        <Segmented options={options1} />
        <button type="primary" onClick={handleLoadOptions1}>
          load option1
        </button>
        <Segmented options={options2} defaultValue="Android" />
        <button type="primary" onClick={handleLoadOptions2}>
          load option2
        </button>
      </div>
    </>
  );
};
