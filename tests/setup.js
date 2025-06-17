import { vi } from 'vitest';
import { config } from '@vue/test-utils';
import { ref, onMounted } from 'vue';

// Vue composablesをグローバルに設定
global.ref = ref;
global.onMounted = onMounted;

// Nuxtの自動インポート機能をモック
global.usePromptValidation = vi.fn().mockImplementation(() => ({
  form: {
    title: 'テストタイトル',
    description: 'テスト説明',
    prompt_text: 'テストプロンプト',
    model: 'GPT-4',
  },
  errors: {},
  availableModels: ['GPT-4', 'GPT-3.5', 'Claude 3', 'Claude 2', 'Gemini Pro', 'Llama 3'],
  isSubmitting: ref(false),
  submitError: ref(''),
  validateForm: vi.fn().mockReturnValue(true),
  initializeDefaultModel: vi.fn(),
  resetForm: vi.fn(),
}));

global.useNuxtApp = vi.fn().mockImplementation(() => ({
  $supabase: {
    auth: {
      getUser: vi.fn().mockResolvedValue({
        data: { user: { id: 'test-user-id' } },
      }),
    },
    from: vi.fn().mockReturnValue({
      insert: vi.fn().mockResolvedValue({ error: null }),
    }),
  },
}));

global.useRoute = vi.fn().mockImplementation(() => ({
  params: {
    id: 'test-id',
  },
}));

global.navigateTo = vi.fn();

global.useHead = vi.fn();

// usePromptsApiのモック
global.usePromptsApi = vi.fn().mockImplementation(() => ({
  createPrompt: vi.fn().mockResolvedValue({ id: 'new-prompt-id' }),
  getPrompts: vi.fn().mockResolvedValue([
    {
      id: '1',
      title: 'Code Explainer',
      description: 'Explains complex code in simple terms',
      model: 'GPT-4',
      created_at: '2023-01-01T00:00:00Z',
    },
    {
      id: '2',
      title: 'SQL Query Generator',
      description: 'Generates SQL queries from natural language',
      model: 'Claude 3',
      created_at: '2023-01-02T00:00:00Z',
    },
    {
      id: '3',
      title: 'Bug Fixer',
      description: 'Identifies and fixes bugs in code snippets',
      model: 'GPT-4',
      created_at: '2023-01-03T00:00:00Z',
    },
    {
      id: '4',
      title: 'Documentation Writer',
      description: 'Creates documentation from code comments',
      model: 'Claude 3',
      created_at: '2023-01-04T00:00:00Z',
    },
    {
      id: '5',
      title: 'API Design Assistant',
      description: 'Helps design RESTful APIs',
      model: 'GPT-4',
      created_at: '2023-01-05T00:00:00Z',
    },
  ]),
  getPromptById: vi.fn().mockResolvedValue({
    id: 'test-id',
    title: 'テストプロンプト',
    description: '複雑な概念を説明するためのプロンプト',
    prompt_text: 'You are an expert at explaining complex topics.',
    model: 'gpt-4',
    created_at: '2023-01-01T00:00:00Z',
  }),
  updatePrompt: vi.fn().mockResolvedValue({ id: 'test-id' }),
  deletePrompt: vi.fn().mockResolvedValue(true),
  error: ref(null),
  isLoading: ref(false),
}));

// useOpenAiApiのモック
global.useOpenAiApi = vi.fn().mockImplementation(() => ({
  sendRequest: vi.fn().mockResolvedValue({
    choices: [
      {
        message: {
          content: 'Mock OpenAI response content',
        },
      },
    ],
  }),
  hasApiKey: ref(true),
  initialize: vi.fn().mockResolvedValue(true),
  apiKey: ref('mock-api-key'),
  isLoading: ref(false),
  error: ref(null),
  isValidating: ref(false),
  isValid: ref(true),
  hasStoredKey: ref(true),
  getApiKey: vi.fn().mockResolvedValue(true),
  saveApiKey: vi.fn().mockResolvedValue(true),
  removeApiKey: vi.fn().mockResolvedValue(true),
  validateApiKey: vi.fn().mockResolvedValue(true),
}));

// Lucideアイコンのモック
config.global.stubs = {
  ...config.global.stubs,
  PlusIcon: { template: '<div class="w-4 h-4"></div>' },
  EyeIcon: { template: '<div class="w-4 h-4"></div>' },
  SaveIcon: { template: '<div class="w-4 h-4"></div>' },
};

// NuxtLinkのカスタムスタブ
config.global.stubs.NuxtLink = {
  template: '<a :href="to"><slot /></a>',
  props: ['to'],
};
