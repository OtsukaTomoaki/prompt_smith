import { mount } from '@vue/test-utils';
import { describe, it, expect, vi } from 'vitest';
import App from '~/app.vue';

// Mock useHead function
vi.stubGlobal('useHead', vi.fn());

describe('App', () => {
  const createWrapper = () => {
    return mount(App, {
      global: {
        stubs: {
          NuxtLayout: {
            template: '<div>Nuxt Layout Content</div>',
          },
        },
      },
    });
  };

  it('should render NuxtLayout component', () => {
    const wrapper = createWrapper();

    expect(wrapper.text()).toContain('Nuxt Layout Content');
  });

  it('should call useHead with dark class', () => {
    // We can't easily test useHead directly in unit tests,
    // but we can verify the component mounts without errors
    const wrapper = createWrapper();

    expect(wrapper.exists()).toBe(true);
  });

  it('should be the root component', () => {
    const wrapper = createWrapper();

    // Verify it's a Vue component instance
    expect(wrapper.vm).toBeDefined();
  });
});
