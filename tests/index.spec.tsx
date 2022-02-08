import React from 'react';
import { mount } from 'enzyme';

import Segmented from '../src';

jest.useFakeTimers();

describe('rc-segmented', () => {
  it('render empty segmented', () => {
    const wrapper = mount(<Segmented options={[]} />);
    expect(wrapper.render()).toMatchSnapshot();
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
        .find('.rc-segmented-item')
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

    expect(
      wrapper.find('.rc-segmented-item-input').map((el) => el.prop('disabled')),
    ).toEqual([true, true, true]);

    expect(
      wrapper
        .find('.rc-segmented-item')
        .map((el) => el.hasClass('rc-segmented-item-disabled')),
    ).toEqual([true, true, true]);

    wrapper.find('.rc-segmented-item-input').at(2).simulate('change');
    expect(handleValueChange).not.toBeCalled();

    expect(
      wrapper
        .find('.rc-segmented-item-input')
        .map((el) => (el.getDOMNode() as HTMLInputElement).checked),
    ).toEqual([true, false, false]);
  });

  it('render segmented with className and other html attribues', () => {
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
});
