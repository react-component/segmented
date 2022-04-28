import '../../assets/style.less';
import React from 'react';
import Segmented from 'rc-segmented';
import type { SegmentedValue } from 'rc-segmented';

export default class Demo extends React.Component<
  unknown,
  { value: SegmentedValue }
> {
  state = {
    value: 'Web3',
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
        &nbsp;&nbsp;
        <Segmented
          options={['iOS', 'Android', 'Web3']}
          value={this.state.value}
          onChange={(value) =>
            this.setState({
              value,
            })
          }
        />
      </React.StrictMode>
    );
  }
}
