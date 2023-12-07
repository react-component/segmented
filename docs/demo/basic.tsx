import Segmented from 'rc-segmented';
import React from 'react';
import '../../assets/style.less';

enum Platform {
  iOS = 'iOS',
  Android = 'Android',
  Web = 'Web',
}

export default function App() {
  const [platform, setPlatform] = React.useState<Platform>(Platform.iOS);

  return (
    <div>
      <div className="wrapper">
        <Segmented
          value={platform}
          options={['iOS', 'Android', 'Web']}
          onChange={setPlatform}
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
