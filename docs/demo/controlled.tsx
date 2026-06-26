import type { SegmentedValue } from '@rc-component/segmented';
import Segmented from '@rc-component/segmented';
import React from 'react';
import '../../assets/style.less';

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
