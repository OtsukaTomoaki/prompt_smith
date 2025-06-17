import { mount } from '@vue/test-utils';
import { describe, it, expect } from 'vitest';
import Button from '~/components/ui/button.vue';

describe('Button Component', () => {
  it('should render with default classes', () => {
    const wrapper = mount(Button);

    expect(wrapper.classes()).toEqual([
      'bg-blue-600',
      'hover:bg-blue-700',
      'text-white',
      'text-sm',
      'px-4',
      'py-2',
      'rounded-lg',
      'font-medium',
      'transition',
    ]);
  });

  it('should render slot content', () => {
    const content = 'Click Me';
    const wrapper = mount(Button, {
      slots: {
        default: content,
      },
    });

    expect(wrapper.text()).toBe(content);
  });

  it('should render HTML content in slot', () => {
    const wrapper = mount(Button, {
      slots: {
        default: '<span>Button with HTML</span>',
      },
    });

    expect(wrapper.html()).toContain('<span>Button with HTML</span>');
  });

  it('should be a button element', () => {
    const wrapper = mount(Button);

    expect(wrapper.element.tagName).toBe('BUTTON');
  });

  it('should emit click event when clicked', async () => {
    const wrapper = mount(Button);

    await wrapper.trigger('click');

    expect(wrapper.emitted('click')).toBeTruthy();
    expect(wrapper.emitted('click')).toHaveLength(1);
  });

  it('should accept additional attributes', () => {
    const wrapper = mount(Button, {
      attrs: {
        type: 'submit',
        disabled: true,
      },
    });

    expect(wrapper.attributes('type')).toBe('submit');
    expect(wrapper.attributes('disabled')).toBe('');
  });

  it('should render complex slot content', () => {
    const wrapper = mount(Button, {
      slots: {
        default: `
          <svg class="w-4 h-4 mr-2" fill="currentColor">
            <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z"/>
          </svg>
          Home
        `,
      },
    });

    expect(wrapper.find('svg').exists()).toBe(true);
    expect(wrapper.text()).toContain('Home');
  });
});
