import '../../assets/style.less';
import React from 'react';
import Segmented, { SegmentedValue } from 'rc-segmented';

export default class Demo extends React.Component<
  {},
  { value: SegmentedValue }
> {
  state = {
    value: 'Web3',
  };

  render() {
    return (
      <Segmented
        options={['iOS', 'Android', 'Web3']}
        value={this.state.value}
        onChange={(e) =>
          this.setState({
            value: e.target.value,
          })
        }
      />
    );
  }
}
