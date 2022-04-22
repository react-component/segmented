import React from 'react';
import { act } from 'react-dom/test-utils';
import { mount } from './wrapper';

import Segmented from '../src';
import type { SegmentedValue } from '../src';

jest.mock('rc-motion/lib/util/motion', () => {
  return {
    ...jest.requireActual('rc-motion/lib/util/motion'),
    supportTransition: true,
  };
});

jest.useFakeTimers();

describe('rc-segmented', () => {
  it('render empty segmented', () => {
    const wrapper = mount(<Segmented options={[]} />);
    expect(wrapper.render()).toMatchSnapshot();
  });

  it('render segmented ok', () => {
    const wrapper = mount(
      <Segmented
        options={[{ label: 'iOS', value: 'iOS' }, 'Android', 'Web']}
      />,
    );

    expect(wrapper.render()).toMatchSnapshot();

    expect(
      wrapper
        .find('.rc-segmented-item-input')
        .map((el) => (el.getDOMNode() as HTMLInputElement).checked),
    ).toEqual([true, false, false]);
  });

  it('render label with ReactNode', () => {
    const wrapper = mount(
      <Segmented
        options={[
          { label: 'iOS', value: 'iOS' },
          { label: <div id="android">Android</div>, value: 'Android' },
          { label: <h2>Web</h2>, value: 'Web' },
        ]}
      />,
    );

    expect(wrapper.render()).toMatchSnapshot();

    expect(
      wrapper
        .find('.rc-segmented-item-input')
        .map((el) => (el.getDOMNode() as HTMLInputElement).checked),
    ).toEqual([true, false, false]);

    expect(wrapper.find('#android').at(0).text()).toContain('Android');
    expect(wrapper.find('h2').at(0).text()).toContain('Web');
  });

  it('render segmented with defaultValue', () => {
    const wrapper = mount(
      <Segmented options={['iOS', 'Android', 'Web']} defaultValue="Web" />,
    );

    expect(
      wrapper
        .find('.rc-segmented-item-input')
        .map((el) => (el.getDOMNode() as HTMLInputElement).checked),
    ).toEqual([false, false, true]);
  });

  it('render segmented with options', () => {
    const handleValueChange = jest.fn();
    const wrapper = mount(
      <Segmented
        options={['iOS', 'Android', 'Web']}
        onChange={(e) => handleValueChange(e.target.value)}
      />,
    );
    expect(wrapper.render()).toMatchSnapshot();

    expect(
      wrapper
        .find('.rc-segmented-item-input')
        .map((el) => (el.getDOMNode() as HTMLInputElement).checked),
    ).toEqual([true, false, false]);
    expect(
      wrapper
        .find('.rc-segmented-item')
        .at(0)
        .hasClass('rc-segmented-item-selected'),
    ).toBeTruthy();

    wrapper.find('.rc-segmented-item-input').at(2).simulate('change');
    expect(handleValueChange).toBeCalledWith('Web');

    expect(
      wrapper
        .find('.rc-segmented-item-input')
        .map((el) => (el.getDOMNode() as HTMLInputElement).checked),
    ).toEqual([false, false, true]);
  });

  it('render segmented with options: 1', () => {
    const handleValueChange = jest.fn();
    const wrapper = mount(
      <Segmented
        options={[1, 2, 3, 4, 5]}
        onChange={(e) => handleValueChange(e.target.value)}
      />,
    );
    expect(wrapper.render()).toMatchSnapshot();
    expect(
      wrapper
        .find('.rc-segmented-item-input')
        .map((el) => (el.getDOMNode() as HTMLInputElement).checked),
    ).toEqual([true, false, false, false, false]);

    wrapper.find('.rc-segmented-item-input').last().simulate('change');
    expect(handleValueChange).toBeCalledWith(5);

    expect(
      wrapper
        .find('.rc-segmented-item-input')
        .map((el) => (el.getDOMNode() as HTMLInputElement).checked),
    ).toEqual([false, false, false, false, true]);
  });

  it('render segmented with options: 2', () => {
    const handleValueChange = jest.fn();
    const wrapper = mount(
      <Segmented
        options={['iOS', { label: 'Android', value: 'Android' }, 'Web']}
        onChange={(e) => handleValueChange(e.target.value)}
      />,
    );
    expect(wrapper.render()).toMatchSnapshot();

    wrapper.find('.rc-segmented-item-input').at(1).simulate('change');
    expect(handleValueChange).toBeCalledWith('Android');

    expect(
      wrapper
        .find('.rc-segmented-item-input')
        .map((el) => (el.getDOMNode() as HTMLInputElement).checked),
    ).toEqual([false, true, false]);
  });

  it('render segmented with options: disabled', () => {
    const handleValueChange = jest.fn();
    const wrapper = mount(
      <Segmented
        options={[
          'iOS',
          { label: 'Android', value: 'Android', disabled: true },
          'Web',
        ]}
        onChange={(e) => handleValueChange(e.target.value)}
      />,
    );
    expect(wrapper.render()).toMatchSnapshot();
    expect(
      wrapper
        .find('label.rc-segmented-item')
        .at(1)
        .hasClass('rc-segmented-item-disabled'),
    ).toBeTruthy();
    expect(
      wrapper.find('.rc-segmented-item-input').at(1).prop('disabled'),
    ).toBeTruthy();

    wrapper.find('.rc-segmented-item-input').at(1).simulate('change');
    expect(handleValueChange).not.toBeCalled();

    expect(
      wrapper
        .find('.rc-segmented-item-input')
        .map((el) => (el.getDOMNode() as HTMLInputElement).checked),
    ).toEqual([true, false, false]);

    wrapper.find('.rc-segmented-item-input').at(2).simulate('change');
    expect(handleValueChange).toBeCalledWith('Web');
    expect(handleValueChange).toBeCalledTimes(1);

    expect(
      wrapper
        .find('.rc-segmented-item-input')
        .map((el) => (el.getDOMNode() as HTMLInputElement).checked),
    ).toEqual([false, false, true]);
  });

  it('render segmented: disabled', () => {
    const handleValueChange = jest.fn();
    const wrapper = mount(
      <Segmented
        options={['iOS', 'Android', 'Web']}
        disabled
        onChange={(e) => handleValueChange(e.target.value)}
      />,
    );
    expect(wrapper.render()).toMatchSnapshot();
    expect(
      wrapper.find('.rc-segmented').hasClass('rc-segmented-disabled'),
    ).toBeTruthy();

    wrapper.find('.rc-segmented-item-input').at(1).simulate('change');
    expect(handleValueChange).not.toBeCalled();

    expect(
      wrapper
        .find('.rc-segmented-item-input')
        .map((el) => (el.getDOMNode() as HTMLInputElement).checked),
    ).toEqual([true, false, false]);

    wrapper.find('.rc-segmented-item-input').at(2).simulate('change');
    expect(handleValueChange).not.toBeCalled();

    expect(
      wrapper
        .find('.rc-segmented-item-input')
        .map((el) => (el.getDOMNode() as HTMLInputElement).checked),
    ).toEqual([true, false, false]);
  });

  it('render segmented with className and other html attributes', () => {
    const wrapper = mount(
      <Segmented
        options={['iOS', 'Android', 'Web']}
        defaultValue="Web"
        className="mock-cls"
        data-test-id="hello"
      />,
    );

    expect(wrapper.hasClass('mock-cls')).toBeTruthy();
    expect(wrapper.prop('data-test-id')).toBe('hello');
  });

  it('render segmented with ref', () => {
    const ref = React.createRef<HTMLDivElement>();
    const wrapper = mount(
      <Segmented
        options={['iOS', 'Android', 'Web']}
        defaultValue="Web"
        ref={ref}
      />,
    );

    expect(wrapper.find(Segmented).getElement().ref).toBe(ref);
  });

  it('render segmented with controlled mode', () => {
    class Demo extends React.Component<{}, { value: SegmentedValue }> {
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
    const wrapper = mount<Demo>(<Demo />);
    wrapper
      .find('Segmented')
      .find('.rc-segmented-item-input')
      .at(0)
      .simulate('change');
    expect(wrapper.state().value).toBe('iOS');

    wrapper
      .find('Segmented')
      .find('.rc-segmented-item-input')
      .at(1)
      .simulate('change');
    expect(wrapper.state().value).toBe('Android');
  });

  it('render segmented with CSSMotion', () => {
    const handleValueChange = jest.fn();
    const wrapper = mount(
      <Segmented
        options={['iOS', 'Android', 'Web3']}
        onChange={(e) => handleValueChange(e.target.value)}
      />,
    );
    expect(wrapper.render()).toMatchSnapshot();

    expect(
      wrapper
        .find('.rc-segmented-item-input')
        .map((el) => (el.getDOMNode() as HTMLInputElement).checked),
    ).toEqual([true, false, false]);
    expect(
      wrapper
        .find('.rc-segmented-item')
        .at(0)
        .hasClass('rc-segmented-item-selected'),
    ).toBeTruthy();

    wrapper.find('.rc-segmented-item-input').at(2).simulate('change');
    expect(handleValueChange).toBeCalledWith('Web3');

    expect(
      wrapper
        .find('.rc-segmented-item-input')
        .map((el) => (el.getDOMNode() as HTMLInputElement).checked),
    ).toEqual([false, false, true]);

    const thumb = wrapper.find('.rc-segmented-thumb').at(0);
    expect(thumb.hasClass('rc-segmented-thumb-motion'));

    // thumb appeared at `iOS`
    const thumbDom = wrapper
      .find('.rc-segmented-thumb')
      .at(0)
      .getDOMNode() as HTMLDivElement;
    expect(thumbDom.style.transform).toBe('translateX(0px)');
    expect(thumbDom.style.width).toBe('62px');

    // Motion end
    wrapper.triggerMotionEvent();
    act(() => {
      jest.runAllTimers();
      wrapper.update();
    });
    // thumb should disappear
    expect(wrapper.find('.rc-segmented-thumb').length).toBe(0);

    // change selection again
    wrapper.find('.rc-segmented-item-input').at(1).simulate('change');
    expect(handleValueChange).toBeCalledWith('Android');

    expect(
      wrapper
        .find('.rc-segmented-item-input')
        .map((el) => (el.getDOMNode() as HTMLInputElement).checked),
    ).toEqual([false, true, false]);

    // thumb should move
    const thumb1 = wrapper.find('.rc-segmented-thumb').at(0);
    expect(thumb1.hasClass('rc-segmented-thumb-motion'));

    // thumb appeared at `Web3`
    const thumbDom1 = wrapper
      .find('.rc-segmented-thumb')
      .at(0)
      .getDOMNode() as HTMLDivElement;
    expect(thumbDom1.style.transform).toBe('translateX(180px)');
    expect(thumbDom1.style.width).toBe('76px');

    // Motion end
    wrapper.triggerMotionEvent();
    act(() => {
      jest.runAllTimers();
      wrapper.update();
    });
    // thumb should disappear
    expect(wrapper.find('.rc-segmented-thumb').length).toBe(0);
  });

  it('render segmented with options null/undefined', () => {
    const handleValueChange = jest.fn();
    const wrapper = mount(
      <Segmented
        options={[null, undefined, ''] as any}
        disabled
        onChange={(e) => handleValueChange(e.target.value)}
      />,
    );
    expect(wrapper.render()).toMatchSnapshot();
    expect(
      wrapper
        .find('.rc-segmented-item-label')
        .map((n) => n.getDOMNode().textContent),
    ).toEqual(['', '', '']);
  });

  it('render segmented with title', () => {
    const wrapper = mount(
      <Segmented
        options={[
          'Web',
          {
            label: 'hello1',
            value: 'hello2',
          },
          {
            label: <div>test1</div>,
            value: 'test2',
          },
          {
            label: 'hello1',
            value: 'hello1',
            title: 'hello1.5',
          },
          {
            label: 'foo1',
            value: 'foo2',
            title: '',
          },
        ]}
      />,
    );
    expect(wrapper.render()).toMatchSnapshot();
    expect(
      wrapper
        .find('.rc-segmented-item-label')
        .map((n) => (n.getDOMNode() as HTMLElement).title),
    ).toEqual(['Web', 'hello1', '', 'hello1.5', '']);
  });
});
