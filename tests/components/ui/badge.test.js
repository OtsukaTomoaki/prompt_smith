import { mount } from '@vue/test-utils';
import { describe, it, expect } from 'vitest';
import Badge from '~/components/ui/badge.vue';

describe('Badge Component', () => {
  it('should render with default classes', () => {
    const wrapper = mount(Badge);

    expect(wrapper.classes()).toEqual([
      'text-xs',
      'px-2',
      'py-0.5',
      'rounded',
      'bg-gray-700',
      'text-white',
      'font-mono',
    ]);
  });

  it('should render slot content', () => {
    const content = 'Test Badge';
    const wrapper = mount(Badge, {
      slots: {
        default: content,
      },
    });

    expect(wrapper.text()).toBe(content);
  });

  it('should render HTML content in slot', () => {
    const wrapper = mount(Badge, {
      slots: {
        default: '<strong>Bold Badge</strong>',
      },
    });

    expect(wrapper.html()).toContain('<strong>Bold Badge</strong>');
  });

  it('should be a span element', () => {
    const wrapper = mount(Badge);

    expect(wrapper.element.tagName).toBe('SPAN');
  });
});
