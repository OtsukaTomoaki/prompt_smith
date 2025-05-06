import { describe, it, expect } from 'vitest';
import { mount } from '@vue/test-utils';
import IndexPage from '../../pages/index.vue';

// コンポーネントのスタブ
const stubs = {
  NuxtLink: {
    template: '<a :href="to"><slot /></a>',
    props: ['to'],
  },
  PromptCard: {
    template: '<div class="prompt-card-stub" :title="title" :description="description" :model="model" :last-edited="lastEdited" :link="link"></div>',
    props: ['title', 'description', 'model', 'lastEdited', 'link'],
  },
  PlusIcon: {
    template: '<div class="w-4 h-4">+</div>',
  },
};

describe('IndexPage', () => {
  it('コンポーネントが正しくレンダリングされる', () => {
    const wrapper = mount(IndexPage, {
      global: {
        stubs,
      },
    });

    // 新規プロンプト作成リンクが存在するか
    const createLink = wrapper.find('a[href="/create"]');
    expect(createLink.exists()).toBe(true);

    // PlusIconが含まれているか
    expect(wrapper.find('.w-4.h-4').exists()).toBe(true);
  });

  it('サンプルプロンプトが正しく表示される', () => {
    const wrapper = mount(IndexPage, {
      global: {
        stubs,
      },
    });

    // サンプルプロンプトが存在するか
    const promptCards = wrapper.findAll('.prompt-card-stub');
    expect(promptCards.length).toBe(5);

    // 各PromptCardの属性を検証
    const samplePrompts = [
      {
        id: '1',
        title: 'Code Explainer',
        description: 'Explains complex code in simple terms',
        model: 'GPT-4',
        lastEdited: '2 days ago',
      },
      {
        id: '2',
        title: 'SQL Query Generator',
        description: 'Generates SQL queries from natural language',
        model: 'Claude 3',
        lastEdited: '5 hours ago',
      },
      {
        id: '3',
        title: 'Bug Fixer',
        description: 'Identifies and fixes bugs in code snippets',
        model: 'GPT-4',
        lastEdited: '1 week ago',
      },
      {
        id: '4',
        title: 'Documentation Writer',
        description: 'Creates documentation from code comments',
        model: 'Claude 3',
        lastEdited: '3 days ago',
      },
      {
        id: '5',
        title: 'API Design Assistant',
        description: 'Helps design RESTful APIs',
        model: 'GPT-4',
        lastEdited: '2 days ago',
      },
    ];

    // 各PromptCardの属性を検証
    promptCards.forEach((card, index) => {
      const prompt = samplePrompts[index];
      expect(card.attributes('title')).toBe(prompt.title);
      expect(card.attributes('description')).toBe(prompt.description);
      expect(card.attributes('model')).toBe(prompt.model);
      expect(card.attributes('last-edited')).toBe(prompt.lastEdited);
      expect(card.attributes('link')).toBe(`/edit/${prompt.id}`);
    });
  });
});
