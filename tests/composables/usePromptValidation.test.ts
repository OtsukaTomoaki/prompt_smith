import { describe, it, expect, beforeEach, vi } from 'vitest';
import { usePromptValidation } from '~/composables/usePromptValidation';

describe('usePromptValidation', () => {
  let validation: ReturnType<typeof usePromptValidation>;

  beforeEach(() => {
    validation = usePromptValidation();
  });

  it('should initialize with empty form and errors', () => {
    expect(validation.form.title).toBe('');
    expect(validation.form.description).toBe('');
    expect(validation.form.prompt_text).toBe('');
    expect(validation.form.model).toBe('');

    expect(validation.errors.title).toBe('');
    expect(validation.errors.description).toBe('');
    expect(validation.errors.prompt_text).toBe('');
    expect(validation.errors.model).toBe('');

    expect(validation.isSubmitting.value).toBe(false);
    expect(validation.submitError.value).toBe('');
  });

  it('should have available models list', () => {
    expect(validation.availableModels).toEqual([
      'GPT-4',
      'GPT-3.5',
      'Claude 3',
      'Claude 2',
      'Gemini Pro',
      'Llama 3',
    ]);
  });

  describe('validateForm', () => {
    it('should return false for empty form', () => {
      const isValid = validation.validateForm();

      expect(isValid).toBe(false);
      expect(validation.errors.title).toBe('タイトルは必須です');
      expect(validation.errors.prompt_text).toBe('プロンプト本文は必須です');
      expect(validation.errors.model).toBe('モデルを選択してください');
    });

    it('should return true for valid form', () => {
      validation.form.title = 'Test Title';
      validation.form.description = 'Test Description';
      validation.form.prompt_text = 'Test Prompt';
      validation.form.model = 'GPT-4';

      const isValid = validation.validateForm();

      expect(isValid).toBe(true);
      expect(validation.errors.title).toBe('');
      expect(validation.errors.description).toBe('');
      expect(validation.errors.prompt_text).toBe('');
      expect(validation.errors.model).toBe('');
    });

    it('should validate title length', () => {
      validation.form.title = 'a'.repeat(101); // 101 characters
      validation.form.prompt_text = 'Test Prompt';
      validation.form.model = 'GPT-4';

      const isValid = validation.validateForm();

      expect(isValid).toBe(false);
      expect(validation.errors.title).toBe('タイトルは100文字以内で入力してください');
    });

    it('should validate description length', () => {
      validation.form.title = 'Test Title';
      validation.form.description = 'a'.repeat(301); // 301 characters
      validation.form.prompt_text = 'Test Prompt';
      validation.form.model = 'GPT-4';

      const isValid = validation.validateForm();

      expect(isValid).toBe(false);
      expect(validation.errors.description).toBe('説明は300文字以内で入力してください');
    });

    it('should validate prompt text length', () => {
      validation.form.title = 'Test Title';
      validation.form.prompt_text = 'a'.repeat(4001); // 4001 characters
      validation.form.model = 'GPT-4';

      const isValid = validation.validateForm();

      expect(isValid).toBe(false);
      expect(validation.errors.prompt_text).toBe('プロンプト本文は4000文字以内で入力してください');
    });

    it('should allow empty description', () => {
      validation.form.title = 'Test Title';
      validation.form.description = '';
      validation.form.prompt_text = 'Test Prompt';
      validation.form.model = 'GPT-4';

      const isValid = validation.validateForm();

      expect(isValid).toBe(true);
      expect(validation.errors.description).toBe('');
    });

    it('should reset errors before validation', () => {
      // Set some errors first
      validation.errors.title = 'Previous error';
      validation.errors.description = 'Previous error';

      // Now provide valid data
      validation.form.title = 'Test Title';
      validation.form.prompt_text = 'Test Prompt';
      validation.form.model = 'GPT-4';

      validation.validateForm();

      expect(validation.errors.title).toBe('');
      expect(validation.errors.description).toBe('');
    });
  });

  describe('initializeDefaultModel', () => {
    it('should set default model in development environment', () => {
      const originalEnv = process.env.NODE_ENV;
      process.env.NODE_ENV = 'development';

      const consoleSpy = vi.spyOn(console, 'log').mockImplementation(() => {});

      validation.initializeDefaultModel();

      expect(validation.form.model).toBe('GPT-4');
      expect(consoleSpy).toHaveBeenCalledWith('テスト環境のため、自動的にモデルを選択します');

      consoleSpy.mockRestore();
      process.env.NODE_ENV = originalEnv;
    });

    it('should not set default model in production environment', () => {
      const originalEnv = process.env.NODE_ENV;
      process.env.NODE_ENV = 'production';

      validation.initializeDefaultModel();

      expect(validation.form.model).toBe('');

      process.env.NODE_ENV = originalEnv;
    });
  });

  describe('resetForm', () => {
    it('should reset form and errors to initial state', () => {
      // Set form data and errors
      validation.form.title = 'Test Title';
      validation.form.description = 'Test Description';
      validation.form.prompt_text = 'Test Prompt';
      validation.form.model = 'GPT-4';

      validation.errors.title = 'Test Error';
      validation.errors.description = 'Test Error';
      validation.errors.prompt_text = 'Test Error';
      validation.errors.model = 'Test Error';

      validation.isSubmitting.value = true;
      validation.submitError.value = 'Test Submit Error';

      // Reset form
      validation.resetForm();

      // Check all fields are reset
      expect(validation.form.title).toBe('');
      expect(validation.form.description).toBe('');
      expect(validation.form.prompt_text).toBe('');
      expect(validation.form.model).toBe('');

      expect(validation.errors.title).toBe('');
      expect(validation.errors.description).toBe('');
      expect(validation.errors.prompt_text).toBe('');
      expect(validation.errors.model).toBe('');

      expect(validation.isSubmitting.value).toBe(false);
      expect(validation.submitError.value).toBe('');
    });
  });

  describe('form reactivity', () => {
    it('should maintain reactive form data', () => {
      validation.form.title = 'New Title';
      expect(validation.form.title).toBe('New Title');

      validation.form.description = 'New Description';
      expect(validation.form.description).toBe('New Description');

      validation.form.prompt_text = 'New Prompt';
      expect(validation.form.prompt_text).toBe('New Prompt');

      validation.form.model = 'Claude 3';
      expect(validation.form.model).toBe('Claude 3');
    });

    it('should maintain reactive error state', () => {
      validation.errors.title = 'Title Error';
      expect(validation.errors.title).toBe('Title Error');

      validation.errors.description = 'Description Error';
      expect(validation.errors.description).toBe('Description Error');
    });
  });
});
