import { ref } from 'vue';

export type ToastType = 'success' | 'error' | 'warning';

/**
 * トースト通知を管理するためのコンポーザブル
 * @returns トースト通知の状態と操作メソッド
 */
export function useToast() {
  const visible = ref(false);
  const message = ref('');
  const type = ref<ToastType>('success');
  let timeout: NodeJS.Timeout | null = null;

  /**
   * トースト通知を表示する
   * @param newMessage 表示するメッセージ
   * @param newType 通知タイプ（success, error, warning）
   * @param duration 表示時間（ミリ秒）
   */
  const showToast = (newMessage: string, newType: ToastType = 'success', duration = 3000) => {
    message.value = newMessage;
    type.value = newType;
    visible.value = true;

    if (timeout) {
      clearTimeout(timeout);
    }

    timeout = setTimeout(() => {
      visible.value = false;
    }, duration);
  };

  /**
   * トースト通知を非表示にする
   */
  const hideToast = () => {
    visible.value = false;
    if (timeout) {
      clearTimeout(timeout);
    }
  };

  return {
    visible,
    message,
    type,
    showToast,
    hideToast,
  };
}
