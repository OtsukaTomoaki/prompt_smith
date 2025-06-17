import { mount } from '@vue/test-utils';
import { describe, it, expect } from 'vitest';
import Toast from '~/components/ui/Toast.vue';

describe('Toast Component', () => {
  const createWrapper = (props = {}) => {
    return mount(Toast, {
      props: {
        visible: true,
        message: 'Test message',
        ...props,
      },
      global: {
        stubs: {
          CheckCircleIcon: true,
          XCircleIcon: true,
          AlertCircleIcon: true,
        },
      },
    });
  };

  it('should not render when visible is false', () => {
    const wrapper = mount(Toast, {
      props: {
        visible: false,
        message: 'Test message',
      },
    });

    expect(wrapper.find('div').exists()).toBe(false);
  });

  it('should render when visible is true', () => {
    const wrapper = createWrapper();

    expect(wrapper.find('.fixed').exists()).toBe(true);
    expect(wrapper.text()).toContain('Test message');
  });

  it('should apply success styling by default', () => {
    const wrapper = createWrapper();

    expect(wrapper.find('.bg-green-100').exists()).toBe(true);
    expect(wrapper.find('.text-green-800').exists()).toBe(true);
  });

  it('should apply error styling', () => {
    const wrapper = createWrapper({
      type: 'error',
    });

    expect(wrapper.find('.bg-red-100').exists()).toBe(true);
    expect(wrapper.find('.text-red-800').exists()).toBe(true);
  });

  it('should apply warning styling', () => {
    const wrapper = createWrapper({
      type: 'warning',
    });

    expect(wrapper.find('.bg-yellow-100').exists()).toBe(true);
    expect(wrapper.find('.text-yellow-800').exists()).toBe(true);
  });

  it('should apply success styling for explicit success type', () => {
    const wrapper = createWrapper({
      type: 'success',
    });

    expect(wrapper.find('.bg-green-100').exists()).toBe(true);
    expect(wrapper.find('.text-green-800').exists()).toBe(true);
  });

  it('should have fixed positioning classes', () => {
    const wrapper = createWrapper();
    const toastDiv = wrapper.find('div');

    expect(toastDiv.classes()).toContain('fixed');
    expect(toastDiv.classes()).toContain('bottom-4');
    expect(toastDiv.classes()).toContain('right-4');
    expect(toastDiv.classes()).toContain('z-50');
  });

  it('should have styling classes', () => {
    const wrapper = createWrapper();
    const toastDiv = wrapper.find('div');

    expect(toastDiv.classes()).toContain('p-4');
    expect(toastDiv.classes()).toContain('rounded-lg');
    expect(toastDiv.classes()).toContain('shadow-lg');
    expect(toastDiv.classes()).toContain('transition-all');
    expect(toastDiv.classes()).toContain('duration-300');
  });

  it('should display the message', () => {
    const message = 'Custom toast message';
    const wrapper = createWrapper({
      message,
    });

    expect(wrapper.find('span').text()).toBe(message);
  });

  it('should render icon component', () => {
    const wrapper = createWrapper();

    expect(wrapper.find('.w-5').exists()).toBe(true);
    expect(wrapper.find('.h-5').exists()).toBe(true);
    expect(wrapper.find('.mr-2').exists()).toBe(true);
  });

  it('should have flex layout for content', () => {
    const wrapper = createWrapper();
    const contentDiv = wrapper.find('.flex');

    expect(contentDiv.exists()).toBe(true);
    expect(contentDiv.classes()).toContain('items-center');
  });

  it('should fallback to blue styling for invalid type', () => {
    const wrapper = createWrapper({
      type: 'invalid',
    });

    expect(wrapper.find('.bg-blue-100').exists()).toBe(true);
    expect(wrapper.find('.text-blue-800').exists()).toBe(true);
  });

  it('should render dark mode classes', () => {
    const wrapper = createWrapper({
      type: 'success',
    });
    const toastDiv = wrapper.find('div');

    expect(toastDiv.classes()).toContain('dark:bg-green-800');
    expect(toastDiv.classes()).toContain('dark:text-green-100');
  });
});
