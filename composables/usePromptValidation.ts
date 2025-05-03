import { reactive, ref } from 'vue';

// プロンプトフォームの型定義
export interface PromptForm {
  title: string;
  description: string;
  prompt_text: string;
  model: string;
}

// プロンプトエラーの型定義
export interface PromptErrors {
  title: string;
  description: string;
  prompt_text: string;
  model: string;
}

export function usePromptValidation() {
  // 利用可能なモデルリスト
  const availableModels = [
    'GPT-4',
    'GPT-3.5',
    'Claude 3',
    'Claude 2',
    'Gemini Pro',
    'Llama 3'
  ];

  // フォームの初期状態
  const form = reactive<PromptForm>({
    title: '',
    description: '',
    prompt_text: '',
    model: ''
  });

  // エラー状態
  const errors = reactive<PromptErrors>({
    title: '',
    description: '',
    prompt_text: '',
    model: ''
  });

  // 送信状態
  const isSubmitting = ref(false);
  const submitError = ref('');

  // バリデーション関数
  const validateForm = () => {
    let isValid = true;

    // エラーをリセット
    errors.title = '';
    errors.description = '';
    errors.prompt_text = '';
    errors.model = '';

    // タイトルのバリデーション
    if (!form.title) {
      errors.title = 'タイトルは必須です';
      isValid = false;
    } else if (form.title.length > 100) {
      errors.title = 'タイトルは100文字以内で入力してください';
      isValid = false;
    }

    // 説明のバリデーション
    if (form.description && form.description.length > 300) {
      errors.description = '説明は300文字以内で入力してください';
      isValid = false;
    }

    // プロンプト本文のバリデーション
    if (!form.prompt_text) {
      errors.prompt_text = 'プロンプト本文は必須です';
      isValid = false;
    } else if (form.prompt_text.length > 4000) {
      errors.prompt_text = 'プロンプト本文は4000文字以内で入力してください';
      isValid = false;
    }

    // モデルのバリデーション
    if (!form.model) {
      errors.model = 'モデルを選択してください';
      isValid = false;
    }

    return isValid;
  };

  // テスト環境用の自動モデル選択
  const initializeDefaultModel = () => {
    if (process.env.NODE_ENV === 'development') {
      console.log('テスト環境のため、自動的にモデルを選択します');
      form.model = availableModels[0]; // 最初のモデルを選択
    }
  };

  // フォームをリセット
  const resetForm = () => {
    form.title = '';
    form.description = '';
    form.prompt_text = '';
    form.model = '';

    errors.title = '';
    errors.description = '';
    errors.prompt_text = '';
    errors.model = '';

    submitError.value = '';
    isSubmitting.value = false;
  };

  return {
    form,
    errors,
    availableModels,
    isSubmitting,
    submitError,
    validateForm,
    initializeDefaultModel,
    resetForm
  };
}
