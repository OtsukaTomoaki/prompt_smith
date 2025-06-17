import { describe, it, expect, beforeEach, vi } from 'vitest';
import { ref } from 'vue';
import { usePromptsApi } from '~/composables/usePromptsApi';
import { PromptsApi } from '~/api/prompts';

// Mock PromptsApi
vi.mock('~/api/prompts', () => ({
  PromptsApi: vi.fn().mockImplementation(() => ({
    createPrompt: vi.fn(),
    getPrompts: vi.fn(),
    getPromptById: vi.fn(),
    updatePrompt: vi.fn(),
    deletePrompt: vi.fn(),
  })),
}));

// Mock useNuxtApp
const mockSupabase = {
  auth: {
    getUser: vi.fn(),
  },
  from: vi.fn(),
};

const mockUseNuxtApp = {
  $supabase: mockSupabase,
};

vi.stubGlobal('useNuxtApp', () => mockUseNuxtApp);

describe('usePromptsApi', () => {
  let api: ReturnType<typeof usePromptsApi>;
  let mockPromptsApi: any;

  beforeEach(() => {
    vi.clearAllMocks();
    api = usePromptsApi();
    mockPromptsApi = (PromptsApi as any).mock.results[0].value;
  });

  it('should initialize with correct initial state', () => {
    expect(api.error.value).toBe(null);
    expect(api.isLoading.value).toBe(false);
  });

  it('should create PromptsApi instance with supabase client', () => {
    expect(PromptsApi).toHaveBeenCalledWith(mockSupabase);
  });

  describe('createPrompt', () => {
    const mockPrompt = {
      title: 'Test Prompt',
      description: 'Test Description',
      prompt_text: 'Test prompt text',
      model: 'GPT-4',
    };

    it('should successfully create a prompt', async () => {
      const expectedResult = { id: '1', ...mockPrompt };
      mockPromptsApi.createPrompt.mockResolvedValue(expectedResult);

      const result = await api.createPrompt(mockPrompt);

      expect(mockPromptsApi.createPrompt).toHaveBeenCalledWith(mockPrompt);
      expect(result).toEqual(expectedResult);
      expect(api.error.value).toBe(null);
      expect(api.isLoading.value).toBe(false);
    });

    it('should handle errors correctly', async () => {
      const errorMessage = 'Failed to create prompt';
      mockPromptsApi.createPrompt.mockRejectedValue(new Error(errorMessage));
      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

      const result = await api.createPrompt(mockPrompt);

      expect(result).toBe(null);
      expect(api.error.value).toBe(errorMessage);
      expect(api.isLoading.value).toBe(false);
      expect(consoleSpy).toHaveBeenCalledWith('API Error:', expect.any(Error));

      consoleSpy.mockRestore();
    });

    it('should set loading state during operation', async () => {
      mockPromptsApi.createPrompt.mockImplementation(() => {
        expect(api.isLoading.value).toBe(true);
        return Promise.resolve({ id: '1', ...mockPrompt });
      });

      await api.createPrompt(mockPrompt);
      expect(api.isLoading.value).toBe(false);
    });
  });

  describe('getPrompts', () => {
    it('should successfully get prompts list', async () => {
      const expectedResult = [
        { id: '1', title: 'Prompt 1' },
        { id: '2', title: 'Prompt 2' },
      ];
      mockPromptsApi.getPrompts.mockResolvedValue(expectedResult);

      const result = await api.getPrompts();

      expect(mockPromptsApi.getPrompts).toHaveBeenCalled();
      expect(result).toEqual(expectedResult);
      expect(api.error.value).toBe(null);
    });

    it('should handle errors correctly', async () => {
      const errorMessage = 'Failed to get prompts';
      mockPromptsApi.getPrompts.mockRejectedValue(new Error(errorMessage));

      const result = await api.getPrompts();

      expect(result).toBe(null);
      expect(api.error.value).toBe(errorMessage);
    });
  });

  describe('getPromptById', () => {
    it('should successfully get prompt by id', async () => {
      const promptId = '123';
      const expectedResult = { id: promptId, title: 'Test Prompt' };
      mockPromptsApi.getPromptById.mockResolvedValue(expectedResult);

      const result = await api.getPromptById(promptId);

      expect(mockPromptsApi.getPromptById).toHaveBeenCalledWith(promptId);
      expect(result).toEqual(expectedResult);
      expect(api.error.value).toBe(null);
    });

    it('should handle errors correctly', async () => {
      const promptId = '123';
      const errorMessage = 'Prompt not found';
      mockPromptsApi.getPromptById.mockRejectedValue(new Error(errorMessage));

      const result = await api.getPromptById(promptId);

      expect(result).toBe(null);
      expect(api.error.value).toBe(errorMessage);
    });
  });

  describe('updatePrompt', () => {
    it('should successfully update prompt', async () => {
      const promptId = '123';
      const updateData = { title: 'Updated Title' };
      const expectedResult = { id: promptId, ...updateData };
      mockPromptsApi.updatePrompt.mockResolvedValue(expectedResult);

      const result = await api.updatePrompt(promptId, updateData);

      expect(mockPromptsApi.updatePrompt).toHaveBeenCalledWith(promptId, updateData);
      expect(result).toEqual(expectedResult);
      expect(api.error.value).toBe(null);
    });

    it('should handle errors correctly', async () => {
      const promptId = '123';
      const updateData = { title: 'Updated Title' };
      const errorMessage = 'Failed to update prompt';
      mockPromptsApi.updatePrompt.mockRejectedValue(new Error(errorMessage));

      const result = await api.updatePrompt(promptId, updateData);

      expect(result).toBe(null);
      expect(api.error.value).toBe(errorMessage);
    });
  });

  describe('deletePrompt', () => {
    it('should successfully delete prompt', async () => {
      const promptId = '123';
      mockPromptsApi.deletePrompt.mockResolvedValue(undefined);

      const result = await api.deletePrompt(promptId);

      expect(mockPromptsApi.deletePrompt).toHaveBeenCalledWith(promptId);
      expect(result).toBeUndefined();
      expect(api.error.value).toBe(null);
    });

    it('should handle errors correctly', async () => {
      const promptId = '123';
      const errorMessage = 'Failed to delete prompt';
      mockPromptsApi.deletePrompt.mockRejectedValue(new Error(errorMessage));

      const result = await api.deletePrompt(promptId);

      expect(result).toBe(null);
      expect(api.error.value).toBe(errorMessage);
    });
  });

  describe('error handling', () => {
    it('should handle non-Error objects', async () => {
      const errorMessage = 'String error';
      mockPromptsApi.getPrompts.mockRejectedValue(errorMessage);

      await api.getPrompts();

      expect(api.error.value).toBe(errorMessage);
    });

    it('should reset error before each API call', async () => {
      // Set initial error
      api.error.value = 'Previous error';

      mockPromptsApi.getPrompts.mockResolvedValue([]);

      await api.getPrompts();

      expect(api.error.value).toBe(null);
    });
  });
});
