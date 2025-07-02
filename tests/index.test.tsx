import { act, fireEvent, render } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import * as React from 'react';
import Segmented from '../src';

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

  function exceptThumbHaveStyle(container: HTMLElement, matchStyle: object) {
    const styleText = container
      .querySelector('.rc-segmented-thumb')
      ?.getAttribute('data-test-style');
    const style = styleText ? JSON.parse(styleText!) : {};

    expect(style).toMatchObject(matchStyle);
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
    expect(container.querySelector('.rc-segmented')).toHaveClass(
      'rc-segmented-disabled',
    );

    container.querySelectorAll('label.rc-segmented-item').forEach((node) => {
      expect(
        node.classList.contains('rc-segmented-item-disabled'),
      ).toBeTruthy();
    });

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

    expect(ref.current).toBe(container.querySelector('.rc-segmented'));
  });

  it('render segmented with controlled mode', () => {
    const offsetParentSpy = jest
      .spyOn(HTMLElement.prototype, 'offsetParent', 'get')
      .mockImplementation(() => {
        return container;
      });

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

    // change it strangely
    fireEvent.change(container.querySelector('.control')!, {
      target: { value: 'Web4' },
    });

    // invalid changes: Should not active any item to make sure it's single source of truth
    expect(container.querySelector('.rc-segmented-item-selected')).toBeFalsy();

    offsetParentSpy.mockRestore();
  });

  describe('render segmented with CSSMotion', () => {
    it('basic', () => {
      const offsetParentSpy = jest
        .spyOn(HTMLElement.prototype, 'offsetParent', 'get')
        .mockImplementation(() => {
          return container;
        });
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

      // >>> Click: Web3
      fireEvent.click(
        container.querySelectorAll('.rc-segmented-item-input')[2],
      );
      expect(handleValueChange).toBeCalledWith('Web3');
      expectMatchChecked(container, [false, false, true]);

      expect(container.querySelectorAll('.rc-segmented-thumb')[0]).toHaveClass(
        'rc-segmented-thumb-motion',
      );

      // thumb appeared at `iOS`
      exceptThumbHaveStyle(container, {
        '--thumb-start-left': '0px',
        '--thumb-start-width': '62px',
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

      // thumb should disappear
      expect(container.querySelector('.rc-segmented-thumb')).toBeFalsy();

      // >>> Click: Android
      fireEvent.click(
        container.querySelectorAll('.rc-segmented-item-input')[1],
      );
      expect(handleValueChange).toBeCalledWith('Android');
      expectMatchChecked(container, [false, true, false]);

      // thumb should move
      expect(container.querySelector('.rc-segmented-thumb')).toHaveClass(
        'rc-segmented-thumb-motion',
      );

      // thumb appeared at `Web3`
      exceptThumbHaveStyle(container, {
        '--thumb-start-left': '180px',
        '--thumb-start-width': '76px',
      });

      // Motion appear end
      act(() => {
        jest.runAllTimers();
      });
      exceptThumbHaveStyle(container, {
        '--thumb-active-left': '62px',
        '--thumb-active-width': '118px',
      });
      fireEvent.animationEnd(container.querySelector('.rc-segmented-thumb')!);
      act(() => {
        jest.runAllTimers();
      });

      // thumb should disappear
      expect(container.querySelector('.rc-segmented-thumb')).toBeFalsy();

      offsetParentSpy.mockRestore();
    });

    it('quick switch', () => {
      const offsetParentSpy = jest
        .spyOn(HTMLElement.prototype, 'offsetParent', 'get')
        .mockImplementation(() => {
          return container;
        });
      const { container } = render(
        <Segmented
          options={['IOS', 'Android', 'Web3']}
          defaultValue="Android"
        />,
      );

      // >>> Click: Web3
      fireEvent.click(
        container.querySelectorAll('.rc-segmented-item-input')[2],
      );

      // Motion to active
      act(() => {
        jest.runAllTimers();
      });
      expect(container.querySelector('.rc-segmented-thumb')).toHaveClass(
        'rc-segmented-thumb-motion-appear-active',
      );

      exceptThumbHaveStyle(container, {
        '--thumb-active-left': '180px',
        '--thumb-active-width': '76px',
      });

      // >>> Click: IOS
      fireEvent.click(
        container.querySelectorAll('.rc-segmented-item-input')[0],
      );

      exceptThumbHaveStyle(container, {
        '--thumb-active-left': '0px',
        '--thumb-active-width': '62px',
      });

      offsetParentSpy.mockRestore();
    });

    it('stop animation early in hidden parent', () => {
      const offsetParentSpy = jest
        .spyOn(HTMLElement.prototype, 'offsetParent', 'get')
        .mockImplementation(() => null);
      const Demo = () => {
        const [value, setValue] = React.useState<string>('iOS');
        React.useEffect(() => setValue('Web3'), []);
        return <Segmented options={['iOS', 'Android', 'Web3']} value={value} />;
      };

      const { container } = render(<Demo />);

      // stop animation early and place "selected" class
      expect(container.querySelectorAll('.rc-segmented-item')[2]).toHaveClass(
        'rc-segmented-item-selected',
      );

      // thumb should disappear
      expect(container.querySelector('.rc-segmented-thumb')).toBeFalsy();

      offsetParentSpy.mockRestore();
    });
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

  it('render with rtl', () => {
    const { container } = render(
      <Segmented
        direction="rtl"
        options={[{ label: 'iOS', value: 'iOS' }, 'Android', 'Web']}
      />,
    );

    expect(container.querySelector('.rc-segmented')).toHaveClass(
      'rc-segmented-rtl',
    );

    expectMatchChecked(container, [true, false, false]);
  });

  it('click can work as expected with rtl', () => {
    const offsetParentSpy = jest
      .spyOn(HTMLElement.prototype, 'offsetParent', 'get')
      .mockImplementation(() => {
        return container;
      });
    const handleValueChange = jest.fn();
    const { container } = render(
      <Segmented
        direction="rtl"
        options={['iOS', 'Android', 'Web']}
        onChange={(value) => handleValueChange(value)}
      />,
    );

    fireEvent.click(container.querySelectorAll('.rc-segmented-item-input')[1]);
    expectMatchChecked(container, [false, true, false]);
    expect(handleValueChange).toBeCalledWith('Android');

    // Motion to active
    act(() => {
      jest.runAllTimers();
    });

    exceptThumbHaveStyle(container, {
      '--thumb-active-left': '-22px',
      '--thumb-active-width': '118px',
    });

    offsetParentSpy.mockRestore();
  });

  it('should render vertical segmented', () => {
    const { container, asFragment } = render(
      <Segmented options={['iOS', 'Android', 'Web']} vertical />,
    );

    expect(asFragment().firstChild).toMatchSnapshot();
    expect(container.querySelector('.rc-segmented')).toHaveClass(
      'rc-segmented-vertical',
    );
    expectMatchChecked(container, [true, false, false]);
  });

  it('should render vertical segmented and handle thumb animations correctly', () => {
    const offsetParentSpy = jest
      .spyOn(HTMLElement.prototype, 'offsetParent', 'get')
      .mockImplementation(() => {
        return container;
      });
    const handleValueChange = jest.fn();
    const { container, asFragment } = render(
      <Segmented
        options={['iOS', 'Android', 'Web']}
        vertical
        onChange={(value) => handleValueChange(value)}
      />,
    );

    // Snapshot test
    expect(asFragment().firstChild).toMatchSnapshot();
    expect(container.querySelector('.rc-segmented')).toHaveClass(
      'rc-segmented-vertical',
    );
    expectMatchChecked(container, [true, false, false]);

    // Click: Web
    fireEvent.click(container.querySelectorAll('.rc-segmented-item-input')[2]);
    expect(handleValueChange).toBeCalledWith('Web');
    expectMatchChecked(container, [false, false, true]);

    // Thumb should appear at `iOS`
    exceptThumbHaveStyle(container, {
      '--thumb-start-top': '0px',
      '--thumb-start-height': '0px',
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

    // Thumb should disappear
    expect(container.querySelector('.rc-segmented-thumb')).toBeFalsy();

    // Click: Android
    fireEvent.click(container.querySelectorAll('.rc-segmented-item-input')[1]);
    expect(handleValueChange).toBeCalledWith('Android');
    expectMatchChecked(container, [false, true, false]);

    // Thumb should move
    expect(container.querySelector('.rc-segmented-thumb')).toHaveClass(
      'rc-segmented-thumb-motion',
    );

    // Thumb appeared at `Web`
    exceptThumbHaveStyle(container, {
      '--thumb-start-top': '0px',
      '--thumb-start-height': '0px',
    });

    // Motion appear end
    act(() => {
      jest.runAllTimers();
    });
    exceptThumbHaveStyle(container, {
      '--thumb-active-top': '0px',
      '--thumb-active-height': '0px',
    });

    fireEvent.animationEnd(container.querySelector('.rc-segmented-thumb')!);
    act(() => {
      jest.runAllTimers();
    });

    // Thumb should disappear
    expect(container.querySelector('.rc-segmented-thumb')).toBeFalsy();

    offsetParentSpy.mockRestore();
  });

  it('all children should have a name property', () => {
    const GROUP_NAME = 'GROUP_NAME';
    const { container } = render(
      <Segmented options={['iOS', 'Android', 'Web']} name={GROUP_NAME} />,
    );

    container
      .querySelectorAll<HTMLInputElement>('input[type="radio"]')
      .forEach((el) => {
        expect(el.name).toEqual(GROUP_NAME);
      });
  });
});

describe('Segmented keyboard navigation', () => {
  it('should be focusable through Tab key', async () => {
    const user = userEvent.setup();
    const { getByRole, container } = render(
      <Segmented options={['Daily', 'Weekly', 'Monthly']} />,
    );

    const segmentedContainer = getByRole('radiogroup');
    const inputs = container.querySelectorAll('.rc-segmented-item-input');
    const firstInput = inputs[0];

    await user.tab();
    // segmented container should be focused
    expect(segmentedContainer).toHaveFocus();
    await user.tab();
    // first segmented item should be focused
    expect(firstInput).toHaveFocus();
  });

  it('should handle circular navigation with arrow keys', async () => {
    const user = userEvent.setup();
    const onChange = jest.fn();
    render(
      <Segmented options={['iOS', 'Android', 'Web']} onChange={onChange} />,
    );

    // focus on segmented
    await user.tab();
    // focus on first item
    await user.tab();

    // Test right navigation from first item and back to first item
    await user.keyboard('{ArrowRight}');
    expect(onChange).toHaveBeenCalledWith('Android');
    await user.keyboard('{ArrowRight}');
    expect(onChange).toHaveBeenCalledWith('Web');
    await user.keyboard('{ArrowRight}');
    expect(onChange).toHaveBeenCalledWith('iOS');

    // Test left navigation from first item to last item
    await user.keyboard('{ArrowLeft}');
    expect(onChange).toHaveBeenCalledWith('Web');
  });

  it('should skip Tab navigation when disabled', async () => {
    const user = userEvent.setup();
    const { container } = render(
      <Segmented options={['Daily', 'Weekly', 'Monthly']} disabled />,
    );

    const segmentedContainer = container.querySelector('.rc-segmented');

    await user.tab();

    // Disabled state should not get focus
    expect(segmentedContainer).not.toHaveFocus();

    // Verify container has no tabIndex attribute
    expect(segmentedContainer?.getAttribute('tabIndex')).toBeNull();
  });

  it('should handle keyboard navigation with disabled options', async () => {
    const user = userEvent.setup();
    const onChange = jest.fn();
    render(
      <Segmented
        options={[
          'iOS',
          { label: 'Android', value: 'Android', disabled: true },
          'Web',
        ]}
        defaultValue="iOS"
        onChange={onChange}
      />,
    );

    await user.tab();
    await user.tab();

    await user.keyboard('{ArrowRight}');
    expect(onChange).toHaveBeenCalledWith('Web');

    onChange.mockClear();

    await user.keyboard('{ArrowLeft}');
    expect(onChange).toHaveBeenCalledWith('iOS');
  });

  it('should not have focus style when clicking', async () => {
    const user = userEvent.setup();
    const { container } = render(
      <Segmented options={['iOS', 'Android', 'Web']} />,
    );

    await user.click(container.querySelector('.rc-segmented-item-input')!);
    expect(container.querySelector('.rc-segmented-item-input')).not.toHaveClass(
      'rc-segmented-item-input-focused',
    );
  });
  it('should apply custom styles to Segmented', () => {
    const customClassNames = {
      item: 'custom-item',
      label: 'custom-label',
    };

    const customStyles = {
      item: { color: 'yellow' },
      label: { backgroundColor: 'black' },
    };

    const { container } = render(
      <Segmented
        options={['iOS', 'Android', 'Web']}
        classNames={customClassNames}
        styles={customStyles}
      />,
    );

    const itemElement = container.querySelector(
      '.rc-segmented-item',
    ) as HTMLElement;
    const labelElement = container.querySelector(
      '.rc-segmented-item-label',
    ) as HTMLElement;

    // check classNames
    expect(itemElement.classList).toContain('custom-item');
    expect(labelElement.classList).toContain('custom-label');

    // check styles
    expect(itemElement.style.color).toBe('yellow');
    expect(labelElement.style.backgroundColor).toBe('black');
  });
  describe('itemRender', () => {
    it('When "itemRender" is not configured, render the original "label"', () => {
      const { container } = render(
        <Segmented options={['iOS', 'Android', 'Web']} />,
      );
      const label = container.querySelector('.rc-segmented-item-label');
      expect(label).toHaveTextContent('iOS');
    });
    it('Configure "itemRender" to render the return value', () => {
      const { container } = render(
        <Segmented
          options={['iOS', 'Android', 'Web']}
          itemRender={(node) => <div className="test-title">{node}</div>}
        />,
      );
      const labels = container.querySelectorAll('.test-title');
      expect(labels).toHaveLength(3);
    });
    it('should pass complete params to itemRender', () => {
      const mockItemRender = jest.fn((node, params) => node);
      const testData = {
        label: 'iOS',
        value: 'iOS',
        disabled: false,
        title: 'iOS',
      };
      render(
        <Segmented
          options={[{ ...testData, className: 'test-class' }, 'Android', 'Web']}
          itemRender={mockItemRender}
        />,
      );
      expect(mockItemRender).toHaveBeenCalledTimes(3);
      const callArgs = mockItemRender.mock.calls[0];
      const receivedParams = callArgs[1];
      expect(receivedParams).toEqual({
        item: {
          ...testData,
        },
      });
      expect(React.isValidElement(callArgs[0])).toBeTruthy();
    });
  });
});
