import '../../assets/style.less';
import React from 'react';
import Segmented from 'rc-segmented';

class ClassComponentWithStringRef extends React.Component {
  componentDidMount() {
    // eslint-disable-next-line react/no-string-refs
    console.log(this.refs.segmentedRef, 'ref');
  }

  render() {
    return (
      <Segmented
        options={['iOS', 'Android', 'Web']}
        ref={'segmentedRef' as any}
      />
    );
  }
}

class ClassComponent2 extends React.Component {
  segmentedRef: HTMLDivElement | null = null;

  componentDidMount() {
    console.log(this.segmentedRef, 'ref');
  }

  render() {
    return (
      <Segmented
        options={['iOS', 'Android', 'Web']}
        ref={(ref) => (this.segmentedRef = ref)}
      />
    );
  }
}

class ClassComponentWithCreateRef extends React.Component<
  Record<string, never>,
  Record<string, never>
> {
  segmentedRef = React.createRef<HTMLDivElement>();

  componentDidMount() {
    console.log(this.segmentedRef.current, 'ref');
  }

  render() {
    return (
      <Segmented options={['iOS', 'Android', 'Web']} ref={this.segmentedRef} />
    );
  }
}

function FunctionalComponent() {
  const segmentedRef = React.useRef<HTMLDivElement>(null);
  React.useEffect(() => {
    console.log(segmentedRef.current, 'ref');
  }, []);
  return <Segmented options={['iOS', 'Android', 'Web']} ref={segmentedRef} />;
}

export default function App() {
  return (
    <div>
      <div className="wrapper">
        <ClassComponentWithStringRef />
      </div>
      <div className="wrapper">
        <ClassComponent2 />
      </div>
      <div className="wrapper">
        <ClassComponentWithCreateRef />
      </div>
      <div className="wrapper">
        <FunctionalComponent />
      </div>
    </div>
  );
}
