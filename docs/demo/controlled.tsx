import '../../assets/style.less';
import React from 'react';
import Segmented from 'rc-segmented';
import type { SegmentedValue } from 'rc-segmented';

export default class Demo extends React.Component<
  unknown,
  { value: SegmentedValue; value2?: SegmentedValue }
> {
  state = {
    value: 'Web3',
    value2: undefined,
  };

  render() {
    return (
      <React.StrictMode>
        <Segmented
          options={['iOS', 'Android', 'Web3']}
          value={this.state.value}
          onChange={(value) =>
            this.setState({
              value,
            })
          }
        />
        &nbsp;
        <Segmented
          options={['iOS', 'Android', 'Web3']}
          value={this.state.value}
          onChange={(value) =>
            this.setState({
              value,
            })
          }
        />
        &nbsp;
        <Segmented
          options={['iOS', 'Android', 'Web3']}
          value={this.state.value2}
          onChange={(value2) =>
            this.setState({
              value2,
            })
          }
        />
      </React.StrictMode>
    );
  }
}
