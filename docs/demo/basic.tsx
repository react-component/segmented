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
          options={Object.values(Platform)}
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
        <Segmented<Platform>
          options={[
            Platform.iOS,
            { label: 'Android', value: Platform.Android, disabled: true },
            Platform.Web,
          ]}
        />
        <hr />
        <Segmented<Platform, string>
          options={[
            Platform.iOS,
            { label: 'Android', value: 'Linux', disabled: true },
            Platform.Web,
          ]}
        />
      </div>
    </div>
  );
}
