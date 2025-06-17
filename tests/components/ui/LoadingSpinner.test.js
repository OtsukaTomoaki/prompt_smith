import { mount } from '@vue/test-utils';
import { describe, it, expect } from 'vitest';
import LoadingSpinner from '~/components/ui/LoadingSpinner.vue';

describe('LoadingSpinner Component', () => {
  it('should render with default props', () => {
    const wrapper = mount(LoadingSpinner);

    expect(wrapper.find('.animate-spin').exists()).toBe(true);
    expect(wrapper.find('.rounded-full').exists()).toBe(true);
    expect(wrapper.find('.border-b-2').exists()).toBe(true);
  });

  it('should apply default size and color classes', () => {
    const wrapper = mount(LoadingSpinner);
    const spinner = wrapper.find('.animate-spin');

    expect(spinner.classes()).toContain('border-blue-500');
    expect(spinner.classes()).toContain('dark:border-blue-400');
    expect(spinner.classes()).toContain('h-6');
    expect(spinner.classes()).toContain('w-6');
  });

  it('should apply white color class', () => {
    const wrapper = mount(LoadingSpinner, {
      props: {
        color: 'white',
      },
    });
    const spinner = wrapper.find('.animate-spin');

    expect(spinner.classes()).toContain('border-white');
  });

  it('should apply gray color class', () => {
    const wrapper = mount(LoadingSpinner, {
      props: {
        color: 'gray',
      },
    });
    const spinner = wrapper.find('.animate-spin');

    expect(spinner.classes()).toContain('border-gray-400');
    expect(spinner.classes()).toContain('dark:border-gray-600');
  });

  it('should apply blue color class (explicit)', () => {
    const wrapper = mount(LoadingSpinner, {
      props: {
        color: 'blue',
      },
    });
    const spinner = wrapper.find('.animate-spin');

    expect(spinner.classes()).toContain('border-blue-500');
    expect(spinner.classes()).toContain('dark:border-blue-400');
  });

  it('should apply small size class', () => {
    const wrapper = mount(LoadingSpinner, {
      props: {
        size: 'sm',
      },
    });
    const spinner = wrapper.find('.animate-spin');

    expect(spinner.classes()).toContain('h-4');
    expect(spinner.classes()).toContain('w-4');
  });

  it('should apply medium size class (explicit)', () => {
    const wrapper = mount(LoadingSpinner, {
      props: {
        size: 'md',
      },
    });
    const spinner = wrapper.find('.animate-spin');

    expect(spinner.classes()).toContain('h-6');
    expect(spinner.classes()).toContain('w-6');
  });

  it('should apply large size class', () => {
    const wrapper = mount(LoadingSpinner, {
      props: {
        size: 'lg',
      },
    });
    const spinner = wrapper.find('.animate-spin');

    expect(spinner.classes()).toContain('h-8');
    expect(spinner.classes()).toContain('w-8');
  });

  it('should have center container classes', () => {
    const wrapper = mount(LoadingSpinner);
    const container = wrapper.find('div');

    expect(container.classes()).toContain('flex');
    expect(container.classes()).toContain('justify-center');
    expect(container.classes()).toContain('items-center');
  });

  it('should combine color and size props correctly', () => {
    const wrapper = mount(LoadingSpinner, {
      props: {
        color: 'white',
        size: 'lg',
      },
    });
    const spinner = wrapper.find('.animate-spin');

    expect(spinner.classes()).toContain('border-white');
    expect(spinner.classes()).toContain('h-8');
    expect(spinner.classes()).toContain('w-8');
  });

  it('should fallback to default classes for invalid props', () => {
    const wrapper = mount(LoadingSpinner, {
      props: {
        color: 'invalid',
        size: 'invalid',
      },
    });
    const spinner = wrapper.find('.animate-spin');

    // Should fallback to default blue color and medium size
    expect(spinner.classes()).toContain('border-blue-500');
    expect(spinner.classes()).toContain('h-6');
    expect(spinner.classes()).toContain('w-6');
  });
});
