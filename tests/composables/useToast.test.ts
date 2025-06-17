import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { useToast } from '~/composables/useToast';

describe('useToast', () => {
  let toast: ReturnType<typeof useToast>;

  beforeEach(() => {
    vi.useFakeTimers();
    toast = useToast();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('should initialize with correct default values', () => {
    expect(toast.visible.value).toBe(false);
    expect(toast.message.value).toBe('');
    expect(toast.type.value).toBe('success');
  });

  describe('showToast', () => {
    it('should show toast with message and default type', () => {
      const message = 'Test message';

      toast.showToast(message);

      expect(toast.visible.value).toBe(true);
      expect(toast.message.value).toBe(message);
      expect(toast.type.value).toBe('success');
    });

    it('should show toast with custom type', () => {
      const message = 'Error message';
      const type = 'error';

      toast.showToast(message, type);

      expect(toast.visible.value).toBe(true);
      expect(toast.message.value).toBe(message);
      expect(toast.type.value).toBe(type);
    });

    it('should show toast with warning type', () => {
      const message = 'Warning message';
      const type = 'warning';

      toast.showToast(message, type);

      expect(toast.visible.value).toBe(true);
      expect(toast.message.value).toBe(message);
      expect(toast.type.value).toBe(type);
    });

    it('should hide toast after default duration', () => {
      toast.showToast('Test message');

      expect(toast.visible.value).toBe(true);

      // Fast-forward time by 3000ms (default duration)
      vi.advanceTimersByTime(3000);

      expect(toast.visible.value).toBe(false);
    });

    it('should hide toast after custom duration', () => {
      const customDuration = 5000;

      toast.showToast('Test message', 'success', customDuration);

      expect(toast.visible.value).toBe(true);

      // Fast-forward time by custom duration
      vi.advanceTimersByTime(customDuration);

      expect(toast.visible.value).toBe(false);
    });

    it('should clear previous timeout when showing new toast', () => {
      // Show first toast
      toast.showToast('First message');
      expect(toast.visible.value).toBe(true);

      // Advance time partially
      vi.advanceTimersByTime(1000);
      expect(toast.visible.value).toBe(true);

      // Show second toast (should clear first timeout)
      toast.showToast('Second message');
      expect(toast.visible.value).toBe(true);
      expect(toast.message.value).toBe('Second message');

      // Advance time by the remaining time of first toast
      vi.advanceTimersByTime(2000);
      expect(toast.visible.value).toBe(true); // Should still be visible

      // Advance time by full duration of second toast
      vi.advanceTimersByTime(3000);
      expect(toast.visible.value).toBe(false); // Should now be hidden
    });

    it('should update message and type when showing new toast', () => {
      // Show first toast
      toast.showToast('First message', 'success');
      expect(toast.message.value).toBe('First message');
      expect(toast.type.value).toBe('success');

      // Show second toast with different type
      toast.showToast('Error occurred', 'error');
      expect(toast.message.value).toBe('Error occurred');
      expect(toast.type.value).toBe('error');
    });
  });

  describe('hideToast', () => {
    it('should hide visible toast', () => {
      toast.showToast('Test message');
      expect(toast.visible.value).toBe(true);

      toast.hideToast();
      expect(toast.visible.value).toBe(false);
    });

    it('should clear timeout when hiding toast manually', () => {
      toast.showToast('Test message');
      expect(toast.visible.value).toBe(true);

      // Hide manually
      toast.hideToast();
      expect(toast.visible.value).toBe(false);

      // Advance time by full duration
      vi.advanceTimersByTime(3000);

      // Should remain hidden (timeout was cleared)
      expect(toast.visible.value).toBe(false);
    });

    it('should work when called on already hidden toast', () => {
      expect(toast.visible.value).toBe(false);

      // Should not throw error
      toast.hideToast();
      expect(toast.visible.value).toBe(false);
    });
  });

  describe('reactive state', () => {
    it('should maintain reactive message state', () => {
      const message1 = 'First message';
      const message2 = 'Second message';

      toast.showToast(message1);
      expect(toast.message.value).toBe(message1);

      toast.showToast(message2);
      expect(toast.message.value).toBe(message2);
    });

    it('should maintain reactive type state', () => {
      toast.showToast('Success message', 'success');
      expect(toast.type.value).toBe('success');

      toast.showToast('Error message', 'error');
      expect(toast.type.value).toBe('error');

      toast.showToast('Warning message', 'warning');
      expect(toast.type.value).toBe('warning');
    });

    it('should maintain reactive visible state', () => {
      expect(toast.visible.value).toBe(false);

      toast.showToast('Test message');
      expect(toast.visible.value).toBe(true);

      toast.hideToast();
      expect(toast.visible.value).toBe(false);
    });
  });
});
