import React from 'react';
import { render, act, fireEvent } from '@testing-library/react';
import Segmented from '../src';
import type { SegmentedValue } from '../src';

jest.mock('rc-motion/lib/util/motion', () => {
  return {
    ...jest.requireActual('rc-motion/lib/util/motion'),
    supportTransition: true,
  };
});

describe('rc-segmented', () => {
  function expectMatchChecked(container: HTMLElement, checkedList: boolean[]) {
    const inputList = Array.from(
      container.querySelectorAll<HTMLInputElement>('.rc-segmented-item-input'),
    );
    expect(inputList).toHaveLength(checkedList.length);

    inputList.forEach((input, i) => {
      const checked = checkedList[i];

      expect(input.checked).toBe(checked);
    });
  }

  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('render empty segmented', () => {
    const { asFragment } = render(<Segmented options={[]} />);
    expect(asFragment().firstChild).toMatchSnapshot();
  });

  it('render segmented ok', () => {
    const { container, asFragment } = render(
      <Segmented
        options={[{ label: 'iOS', value: 'iOS' }, 'Android', 'Web']}
      />,
    );

    expect(asFragment().firstChild).toMatchSnapshot();

    expectMatchChecked(container, [true, false, false]);
  });

  it('render label with ReactNode', () => {
    const { container, asFragment } = render(
      <Segmented
        options={[
          { label: 'iOS', value: 'iOS' },
          { label: <div id="android">Android</div>, value: 'Android' },
          { label: <h2>Web</h2>, value: 'Web' },
        ]}
      />,
    );

    expect(asFragment().firstChild).toMatchSnapshot();
    expectMatchChecked(container, [true, false, false]);

    expect(container.querySelector('#android')?.textContent).toContain(
      'Android',
    );
    expect(container.querySelector('h2')?.textContent).toContain('Web');
  });

  it('render segmented with defaultValue', () => {
    const { container } = render(
      <Segmented options={['iOS', 'Android', 'Web']} defaultValue="Web" />,
    );

    expectMatchChecked(container, [false, false, true]);
  });

  it('render segmented with options', () => {
    const handleValueChange = jest.fn();
    const { container, asFragment } = render(
      <Segmented
        options={['iOS', 'Android', 'Web']}
        onChange={(value) => handleValueChange(value)}
      />,
    );
    expect(asFragment().firstChild).toMatchSnapshot();
    expectMatchChecked(container, [true, false, false]);

    expect(container.querySelectorAll('.rc-segmented-item')[0]).toHaveClass(
      'rc-segmented-item-selected',
    );

    fireEvent.click(container.querySelectorAll('.rc-segmented-item-input')[2]);
    expect(handleValueChange).toBeCalledWith('Web');
    expectMatchChecked(container, [false, false, true]);
  });

  it('render segmented with options: 1', () => {
    const handleValueChange = jest.fn();
    const { container, asFragment } = render(
      <Segmented
        options={[1, 2, 3, 4, 5]}
        onChange={(value) => handleValueChange(value)}
      />,
    );
    expect(asFragment().firstChild).toMatchSnapshot();
    expectMatchChecked(container, [true, false, false, false, false]);

    fireEvent.click(container.querySelectorAll('.rc-segmented-item-input')[4]);
    expect(handleValueChange).toBeCalledWith(5);
    expectMatchChecked(container, [false, false, false, false, true]);
  });

  it('render segmented with options: 2', () => {
    const handleValueChange = jest.fn();
    const { container, asFragment } = render(
      <Segmented
        options={['iOS', { label: 'Android', value: 'Android' }, 'Web']}
        onChange={(value) => handleValueChange(value)}
      />,
    );
    expect(asFragment().firstChild).toMatchSnapshot();

    fireEvent.click(container.querySelectorAll('.rc-segmented-item-input')[1]);
    expect(handleValueChange).toBeCalledWith('Android');

    expectMatchChecked(container, [false, true, false]);
  });

  it('render segmented with options: disabled', () => {
    const handleValueChange = jest.fn();
    const { container, asFragment } = render(
      <Segmented
        options={[
          'iOS',
          { label: 'Android', value: 'Android', disabled: true },
          'Web',
        ]}
        onChange={(value) => handleValueChange(value)}
      />,
    );
    expect(asFragment().firstChild).toMatchSnapshot();
    expect(
      container.querySelectorAll('label.rc-segmented-item')[1],
    ).toHaveClass('rc-segmented-item-disabled');
    expect(
      container.querySelectorAll<HTMLInputElement>(
        '.rc-segmented-item-input',
      )[1].disabled,
    ).toBeTruthy();

    fireEvent.click(container.querySelectorAll('.rc-segmented-item-input')[1]);
    expect(handleValueChange).not.toBeCalled();

    expectMatchChecked(container, [true, false, false]);

    fireEvent.click(container.querySelectorAll('.rc-segmented-item-input')[2]);
    expect(handleValueChange).toBeCalledWith('Web');
    expect(handleValueChange).toBeCalledTimes(1);

    expectMatchChecked(container, [false, false, true]);
  });

  it('render segmented: disabled', () => {
    const handleValueChange = jest.fn();
    const { container, asFragment } = render(
      <Segmented
        options={['iOS', 'Android', 'Web']}
        disabled
        onChange={(value) => handleValueChange(value)}
      />,
    );
    expect(asFragment().firstChild).toMatchSnapshot();
    expect(container.querySelector('.rc-segmented')).toHaveClass(
      'rc-segmented-disabled',
    );

    fireEvent.click(container.querySelectorAll('.rc-segmented-item-input')[1]);
    expect(handleValueChange).not.toBeCalled();
    expectMatchChecked(container, [true, false, false]);

    fireEvent.click(container.querySelectorAll('.rc-segmented-item-input')[2]);
    expect(handleValueChange).not.toBeCalled();
    expectMatchChecked(container, [true, false, false]);
  });

  it('render segmented with className and other html attributes', () => {
    const { container } = render(
      <Segmented
        options={['iOS', 'Android', 'Web']}
        defaultValue="Web"
        className="mock-cls"
        data-test-id="hello"
      />,
    );

    expect(container.firstChild).toHaveClass('mock-cls');
    expect(container.firstChild).toHaveAttribute('data-test-id', 'hello');
  });

  it('render segmented with ref', () => {
    const ref = React.createRef<HTMLDivElement>();
    const { container } = render(
      <Segmented
        options={['iOS', 'Android', 'Web']}
        defaultValue="Web"
        ref={ref}
      />,
    );

    expect(ref.current).toBe(container.querySelector('.rc-segmented-wrapper'));
  });

  it('render segmented with controlled mode', () => {
    const Demo = () => {
      const options = ['iOS', 'Android', 'Web3'];

      const [value, setValue] = React.useState<any>('Web3');

      return (
        <>
          <Segmented options={options} value={value} onChange={setValue} />
          <div className="value">{value}</div>
          <input
            className="control"
            onChange={(e) => {
              setValue(e.target.value);
            }}
          />
        </>
      );
    };
    const { container } = render(<Demo />);
    fireEvent.click(container.querySelectorAll('.rc-segmented-item-input')[0]);
    expect(container.querySelector('.value')?.textContent).toBe('iOS');

    fireEvent.click(container.querySelectorAll('.rc-segmented-item-input')[1]);
    expect(container.querySelector('.value')?.textContent).toBe('Android');

    // change state directly
    fireEvent.change(container.querySelector('.control')!, {
      target: { value: 'Web3' },
    });
    expect(container.querySelector('.value')?.textContent).toBe('Web3');

    // Motion to active
    act(() => {
      jest.runAllTimers();
    });

    // Motion end
    fireEvent.animationEnd(container.querySelector('.rc-segmented-thumb')!);
    act(() => {
      jest.runAllTimers();
    });

    expect(
      container.querySelector('.rc-segmented-item-selected')?.textContent,
    ).toContain('Web3');

    // Motion end
    fireEvent.animationEnd(container.querySelector('.rc-segmented-thumb')!);
    act(() => {
      jest.runAllTimers();
    });

    // change it strangely
    fireEvent.change(container.querySelector('.control')!, {
      target: { value: 'Web4' },
    });

    // invalid changes
    expect(
      container.querySelector('.rc-segmented-item-selected')?.textContent,
    ).toContain('Web3');
  });

  it('render segmented with CSSMotion', () => {
    const handleValueChange = jest.fn();
    const { container, asFragment } = render(
      <Segmented
        options={['iOS', 'Android', 'Web3']}
        onChange={(value) => handleValueChange(value)}
      />,
    );
    expect(asFragment().firstChild).toMatchSnapshot();

    expectMatchChecked(container, [true, false, false]);
    expect(container.querySelectorAll('.rc-segmented-item')[0]).toHaveClass(
      'rc-segmented-item-selected',
    );

    fireEvent.click(container.querySelectorAll('.rc-segmented-item-input')[2]);
    expect(handleValueChange).toBeCalledWith('Web3');
    expectMatchChecked(container, [false, false, true]);

    expect(container.querySelectorAll('.rc-segmented-thumb')[0]).toHaveClass(
      'rc-segmented-thumb-motion',
    );

    // thumb appeared at `iOS`
    expect(container.querySelectorAll('.rc-segmented-thumb')[0]).toHaveStyle({
      transform: 'translateX(0px)',
      width: '62px',
    });

    // Motion => active
    act(() => {
      jest.runAllTimers();
    });

    // Motion enter end
    fireEvent.animationEnd(container.querySelector('.rc-segmented-thumb')!);
    act(() => {
      jest.runAllTimers();
    });

    // Motion leave end
    fireEvent.animationEnd(container.querySelector('.rc-segmented-thumb')!);
    act(() => {
      jest.runAllTimers();
    });

    // thumb should disappear
    expect(container.querySelector('.rc-segmented-thumb')).toBeFalsy();

    // change selection again
    fireEvent.click(container.querySelectorAll('.rc-segmented-item-input')[1]);
    expect(handleValueChange).toBeCalledWith('Android');
    expectMatchChecked(container, [false, true, false]);

    // thumb should move
    expect(container.querySelector('.rc-segmented-thumb')).toHaveClass(
      'rc-segmented-thumb-motion',
    );

    // thumb appeared at `Web3`
    expect(container.querySelector('.rc-segmented-thumb')).toHaveStyle({
      transform: 'translateX(180px)',
      width: '76px',
    });

    // Motion enter end
    act(() => {
      jest.runAllTimers();
    });
    fireEvent.animationEnd(container.querySelector('.rc-segmented-thumb')!);
    act(() => {
      jest.runAllTimers();
    });

    // Motion leave end
    fireEvent.animationEnd(container.querySelector('.rc-segmented-thumb')!);
    act(() => {
      jest.runAllTimers();
    });

    // thumb should disappear
    expect(container.querySelector('.rc-segmented-thumb')).toBeFalsy();
  });

  it('render segmented with options null/undefined', () => {
    const handleValueChange = jest.fn();
    const { asFragment, container } = render(
      <Segmented
        options={[null, undefined, ''] as any}
        disabled
        onChange={(value) => handleValueChange(value)}
      />,
    );
    expect(asFragment().firstChild).toMatchSnapshot();

    expect(
      Array.from(
        container.querySelectorAll<HTMLLabelElement>(
          '.rc-segmented-item-label',
        ),
      ).map((n) => n.textContent),
    ).toEqual(['', '', '']);
  });

  it('render segmented with title', () => {
    const { asFragment, container } = render(
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
    expect(asFragment().firstChild).toMatchSnapshot();

    expect(
      Array.from(
        container.querySelectorAll<HTMLLabelElement>(
          '.rc-segmented-item-label',
        ),
      ).map((n) => n.title),
    ).toEqual(['Web', 'hello1', '', 'hello1.5', '']);
  });
});
