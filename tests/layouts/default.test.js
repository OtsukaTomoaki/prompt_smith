import { mount } from '@vue/test-utils';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { ref } from 'vue';
import DefaultLayout from '~/layouts/default.vue';

const mockSupabase = {
  auth: {
    getUser: vi.fn(),
    signOut: vi.fn(),
  },
};

const mockRouter = {
  push: vi.fn(),
  replace: vi.fn(),
};

vi.mock('vue-router', () => ({
  useRouter: () => mockRouter,
}));

describe('Default Layout', () => {
  let wrapper;

  beforeEach(() => {
    // Mock window.Teleport
    global.Teleport = {
      name: 'Teleport',
      props: ['to'],
      template: '<div><slot /></div>',
    };

    mockSupabase.auth.getUser.mockReset();
    mockSupabase.auth.signOut.mockReset();
    mockRouter.push.mockReset();
    mockRouter.replace.mockReset();
    
    // Reset user state
    if (wrapper) {
      wrapper.unmount();
    }
  });

  const createWrapper = (options = {}) => {
    return mount(DefaultLayout, {
      global: {
        plugins: [
          {
            install(app) {
              app.config.globalProperties.$supabase = mockSupabase;
            },
          },
        ],
        stubs: {
          NuxtLink: {
            template: '<a :to="to"><slot /></a>',
            props: ['to'],
          },
          NuxtPage: {
            template: '<div>Page Content</div>',
          },
          HammerIcon: true,
          UserIcon: true,
          Teleport: {
            template: '<div><slot /></div>',
          },
        },
        ...options.global,
      },
      ...options,
    });
  };

  it('should render the layout with header', async () => {
    mockSupabase.auth.getUser.mockResolvedValue({ data: { user: null } });
    wrapper = createWrapper();

    await wrapper.vm.$nextTick();

    expect(wrapper.find('h1').text()).toContain('Promptsmith');
    expect(wrapper.find('header').exists()).toBe(true);
    expect(wrapper.find('main').exists()).toBe(true);
  });

  it('should have basic layout structure', async () => {
    wrapper = createWrapper();
    await wrapper.vm.$nextTick();

    // Check for basic components that are always rendered
    expect(wrapper.find('.min-h-screen').exists()).toBe(true);
    expect(wrapper.find('header').exists()).toBe(true);
    expect(wrapper.find('main').exists()).toBe(true);
    expect(wrapper.text()).toContain('Promptsmith');
  });

  it('should render without authentication components initially', async () => {
    mockSupabase.auth.getUser.mockResolvedValue({ data: { user: null } });
    wrapper = createWrapper();
    await wrapper.vm.$nextTick();

    // User button should not be present when no user
    expect(wrapper.find('button[ref="userIconBtn"]').exists()).toBe(false);
  });

  it('should have proper CSS classes applied', async () => {
    wrapper = createWrapper();
    await wrapper.vm.$nextTick();

    const rootDiv = wrapper.find('.min-h-screen');
    expect(rootDiv.classes()).toContain('dark:bg-gray-900');
    expect(rootDiv.classes()).toContain('dark:text-white');

    const header = wrapper.find('header');
    expect(header.classes()).toContain('max-w-5xl');
    expect(header.classes()).toContain('mx-auto');
  });
});
