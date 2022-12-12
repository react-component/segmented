import '../../assets/style.less';
import * as React from 'react';
import Segmented from 'rc-segmented';

const defaultOptions1 = ['iOS', 'Android', 'Web'];
const defaultOptions2 = [
  { label: 'iOS', value: 'iOS' },
  { label: 'Android', value: 'Android' },
  'Web',
];

export default () => {
  const [options1, setOptions1] = React.useState(defaultOptions1);
  const [options2, setOptions2] = React.useState(defaultOptions2);

  const handleLoadOptions1 = () => {
    setOptions1((r) => r.concat('Electron', 'Mini App'));
  };

  const handleLoadOptions2 = () => {
    setOptions2([
      { label: 'Electron', value: 'Electron' },
      'Mini App',
      ...defaultOptions2.reverse(),
    ]);
  };

  return (
    <>
      <div>
        <div className="wrapper">
          <Segmented options={options1} />
          <div>
            <button onClick={handleLoadOptions1}>load option1</button>
          </div>
        </div>
        <div className="wrapper">
          <Segmented options={options2} defaultValue="Android" />
          <div>
            <button onClick={handleLoadOptions2}>load option2</button>
          </div>
        </div>
      </div>
    </>
  );
};
