import { mount } from '@vue/test-utils';
import { describe, it, expect } from 'vitest';
import Card from '~/components/ui/card.vue';

describe('Card Component', () => {
  it('should render with default classes', () => {
    const wrapper = mount(Card);

    expect(wrapper.classes()).toEqual([
      'rounded-xl',
      'border',
      'border-white/10',
      'bg-white/5',
      'p-4',
      'shadow',
    ]);
  });

  it('should render slot content', () => {
    const content = 'Card Content';
    const wrapper = mount(Card, {
      slots: {
        default: content,
      },
    });

    expect(wrapper.text()).toBe(content);
  });

  it('should render HTML content in slot', () => {
    const wrapper = mount(Card, {
      slots: {
        default: '<div class="test">Card with HTML</div>',
      },
    });

    expect(wrapper.html()).toContain('<div class="test">Card with HTML</div>');
  });

  it('should be a div element', () => {
    const wrapper = mount(Card);

    expect(wrapper.element.tagName).toBe('DIV');
  });

  it('should render multiple elements in slot', () => {
    const wrapper = mount(Card, {
      slots: {
        default: `
          <h2>Title</h2>
          <p>Description</p>
        `,
      },
    });

    expect(wrapper.find('h2').text()).toBe('Title');
    expect(wrapper.find('p').text()).toBe('Description');
  });
});
