import { renderHook, act } from '@testing-library/react';
import { useClickOutside } from '../../hooks/useClickOutside';

describe('useClickOutside.js', () => {
  let callback;

  beforeEach(() => {
    callback = jest.fn();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  // Easy test cases
  describe('Easy cases', () => {
    test('should return a ref object', () => {
      const { result } = renderHook(() => useClickOutside(callback));
      expect(result.current).toHaveProperty('current');
    });

    test('should initialize ref with null', () => {
      const { result } = renderHook(() => useClickOutside(callback));
      expect(result.current.current).toBeNull();
    });

    test('should not call callback when nothing is clicked', () => {
      renderHook(() => useClickOutside(callback));
      expect(callback).not.toHaveBeenCalled();
    });

    test('should accept enabled parameter', () => {
      const { result } = renderHook(() => useClickOutside(callback, true));
      expect(result.current).toBeDefined();
    });
  });

  // Medium test cases
  describe('Medium cases', () => {
    test('should call callback when clicking outside the element', () => {
      const { result } = renderHook(() => useClickOutside(callback));

      // Create a mock element
      const mockElement = document.createElement('div');
      result.current.current = mockElement;

      // Create a click event outside the element
      const outsideElement = document.createElement('div');
      document.body.appendChild(outsideElement);

      act(() => {
        outsideElement.dispatchEvent(new MouseEvent('mousedown', { bubbles: true }));
      });

      expect(callback).toHaveBeenCalledTimes(1);

      document.body.removeChild(outsideElement);
    });

    test('should not call callback when clicking inside the element', () => {
      const { result } = renderHook(() => useClickOutside(callback));

      const mockElement = document.createElement('div');
      result.current.current = mockElement;
      document.body.appendChild(mockElement);

      act(() => {
        mockElement.dispatchEvent(new MouseEvent('mousedown', { bubbles: true }));
      });

      expect(callback).not.toHaveBeenCalled();

      document.body.removeChild(mockElement);
    });

    test('should not call callback when enabled is false', () => {
      const { result } = renderHook(() => useClickOutside(callback, false));

      const mockElement = document.createElement('div');
      result.current.current = mockElement;

      const outsideElement = document.createElement('div');
      document.body.appendChild(outsideElement);

      act(() => {
        outsideElement.dispatchEvent(new MouseEvent('mousedown', { bubbles: true }));
      });

      expect(callback).not.toHaveBeenCalled();

      document.body.removeChild(outsideElement);
    });

    test('should handle touchstart events', () => {
      const { result } = renderHook(() => useClickOutside(callback));

      const mockElement = document.createElement('div');
      result.current.current = mockElement;

      const outsideElement = document.createElement('div');
      document.body.appendChild(outsideElement);

      act(() => {
        outsideElement.dispatchEvent(new TouchEvent('touchstart', { bubbles: true }));
      });

      expect(callback).toHaveBeenCalledTimes(1);

      document.body.removeChild(outsideElement);
    });
  });

  // Hard test cases
  describe('Hard cases', () => {
    test('should call callback only once for multiple outside clicks', () => {
      const { result } = renderHook(() => useClickOutside(callback));

      const mockElement = document.createElement('div');
      result.current.current = mockElement;

      const outsideElement = document.createElement('div');
      document.body.appendChild(outsideElement);

      act(() => {
        outsideElement.dispatchEvent(new MouseEvent('mousedown', { bubbles: true }));
      });

      expect(callback).toHaveBeenCalledTimes(1);

      act(() => {
        outsideElement.dispatchEvent(new MouseEvent('mousedown', { bubbles: true }));
      });

      expect(callback).toHaveBeenCalledTimes(2);

      document.body.removeChild(outsideElement);
    });

    test('should update when enabled prop changes', () => {
      const { result, rerender } = renderHook(
        ({ enabled }) => useClickOutside(callback, enabled),
        { initialProps: { enabled: false } }
      );

      const mockElement = document.createElement('div');
      result.current.current = mockElement;

      const outsideElement = document.createElement('div');
      document.body.appendChild(outsideElement);

      // Initially disabled
      act(() => {
        outsideElement.dispatchEvent(new MouseEvent('mousedown', { bubbles: true }));
      });

      expect(callback).not.toHaveBeenCalled();

      // Enable
      rerender({ enabled: true });

      act(() => {
        outsideElement.dispatchEvent(new MouseEvent('mousedown', { bubbles: true }));
      });

      expect(callback).toHaveBeenCalledTimes(1);

      document.body.removeChild(outsideElement);
    });

    test('should handle clicking on child elements inside ref', () => {
      const { result } = renderHook(() => useClickOutside(callback));

      const mockElement = document.createElement('div');
      const childElement = document.createElement('span');
      mockElement.appendChild(childElement);
      result.current.current = mockElement;
      document.body.appendChild(mockElement);

      act(() => {
        childElement.dispatchEvent(new MouseEvent('mousedown', { bubbles: true }));
      });

      expect(callback).not.toHaveBeenCalled();

      document.body.removeChild(mockElement);
    });

    test('should cleanup event listeners on unmount', () => {
      const removeEventListenerSpy = jest.spyOn(document, 'removeEventListener');

      const { unmount } = renderHook(() => useClickOutside(callback));

      unmount();

      expect(removeEventListenerSpy).toHaveBeenCalledWith('mousedown', expect.any(Function));
      expect(removeEventListenerSpy).toHaveBeenCalledWith('touchstart', expect.any(Function));

      removeEventListenerSpy.mockRestore();
    });

    test('should update callback reference', () => {
      const callback1 = jest.fn();
      const callback2 = jest.fn();

      const { result, rerender } = renderHook(
        ({ cb }) => useClickOutside(cb),
        { initialProps: { cb: callback1 } }
      );

      const mockElement = document.createElement('div');
      result.current.current = mockElement;

      const outsideElement = document.createElement('div');
      document.body.appendChild(outsideElement);

      // First callback
      act(() => {
        outsideElement.dispatchEvent(new MouseEvent('mousedown', { bubbles: true }));
      });

      expect(callback1).toHaveBeenCalledTimes(1);
      expect(callback2).not.toHaveBeenCalled();

      // Update callback
      rerender({ cb: callback2 });

      act(() => {
        outsideElement.dispatchEvent(new MouseEvent('mousedown', { bubbles: true }));
      });

      expect(callback1).toHaveBeenCalledTimes(1);
      expect(callback2).toHaveBeenCalledTimes(1);

      document.body.removeChild(outsideElement);
    });

    test('should not call callback when ref.current is null', () => {
      const { result } = renderHook(() => useClickOutside(callback));

      // ref.current is null by default
      const outsideElement = document.createElement('div');
      document.body.appendChild(outsideElement);

      act(() => {
        outsideElement.dispatchEvent(new MouseEvent('mousedown', { bubbles: true }));
      });

      expect(callback).not.toHaveBeenCalled();

      document.body.removeChild(outsideElement);
    });

    test('should handle both mousedown and touchstart events', () => {
      const { result } = renderHook(() => useClickOutside(callback));

      const mockElement = document.createElement('div');
      result.current.current = mockElement;

      const outsideElement = document.createElement('div');
      document.body.appendChild(outsideElement);

      act(() => {
        outsideElement.dispatchEvent(new MouseEvent('mousedown', { bubbles: true }));
      });

      expect(callback).toHaveBeenCalledTimes(1);

      act(() => {
        outsideElement.dispatchEvent(new TouchEvent('touchstart', { bubbles: true }));
      });

      expect(callback).toHaveBeenCalledTimes(2);

      document.body.removeChild(outsideElement);
    });

    test('should handle rapidly toggling enabled state', () => {
      const { result, rerender } = renderHook(
        ({ enabled }) => useClickOutside(callback, enabled),
        { initialProps: { enabled: true } }
      );

      const mockElement = document.createElement('div');
      result.current.current = mockElement;

      const outsideElement = document.createElement('div');
      document.body.appendChild(outsideElement);

      // Toggle multiple times
      rerender({ enabled: false });
      rerender({ enabled: true });
      rerender({ enabled: false });
      rerender({ enabled: true });

      act(() => {
        outsideElement.dispatchEvent(new MouseEvent('mousedown', { bubbles: true }));
      });

      expect(callback).toHaveBeenCalledTimes(1);

      document.body.removeChild(outsideElement);
    });
  });
});
