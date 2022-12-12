import '../../assets/style.less';
import * as React from 'react';
import Segmented from 'rc-segmented';

const options = [
  {
    label: (
      <div>
        iOS
        <br />
        10
        <br />
        11
      </div>
    ),
    value: 'iOS',
  },
  { label: <h1>Android</h1>, value: 'Android' },
  {
    label: (
      <div>
        Web
        <br />
        345
      </div>
    ),
    value: 'Web',
  },
  { label: <h1>Electron</h1>, value: 'Electron', disabled: true },
  // debug usage
  // { label: '', value: 'Empty' },
];

export default () => {
  return (
    <>
      <Segmented options={options} />
    </>
  );
};
