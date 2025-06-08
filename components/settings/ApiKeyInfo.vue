<template>
  <Card class="w-full max-w-2xl">
    <template #header>
      <h2 class="text-xl font-semibold text-gray-900 dark:text-white">OpenAI API Keyについて</h2>
    </template>

    <template #default>
      <div class="space-y-6">
        <!-- API Key取得方法 -->
        <div class="space-y-3">
          <h3 class="text-lg font-medium text-gray-900 dark:text-white">API Keyの取得方法</h3>
          <div class="text-sm text-gray-600 dark:text-gray-300 space-y-2">
            <p>OpenAI API Keyを取得するには、以下の手順に従ってください：</p>
            <ol class="list-decimal list-inside space-y-1 ml-4">
              <li>
                <a
                  href="https://platform.openai.com/api-keys"
                  target="_blank"
                  rel="noopener noreferrer"
                  class="text-blue-600 dark:text-blue-400 hover:underline"
                >
                  OpenAI Platform
                </a>
                にアクセスしてログインします
              </li>
              <li>「Create new secret key」ボタンをクリックします</li>
              <li>キーに名前を付けて作成します</li>
              <li>表示されたAPI Keyをコピーして、上記のフォームに貼り付けます</li>
            </ol>
          </div>
        </div>

        <!-- セキュリティ警告 -->
        <div
          class="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-md p-4"
        >
          <div class="flex items-start space-x-3">
            <svg
              class="h-5 w-5 text-yellow-600 dark:text-yellow-400 mt-0.5 flex-shrink-0"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.5 0L4.268 19.5c-.77.833.192 2.5 1.732 2.5z"
              />
            </svg>
            <div class="space-y-2">
              <h4 class="text-sm font-medium text-yellow-800 dark:text-yellow-200">
                セキュリティに関する重要な注意事項
              </h4>
              <ul class="text-sm text-yellow-700 dark:text-yellow-300 space-y-1">
                <li>• API Keyは他人と共有しないでください</li>
                <li>• API Keyは暗号化されてサーバーに保存されます</li>
                <li>• 不要になったAPI Keyは削除することをお勧めします</li>
                <li>• 定期的にAPI Keyをローテーションすることをお勧めします</li>
              </ul>
            </div>
          </div>
        </div>

        <!-- 料金について -->
        <div class="space-y-3">
          <h3 class="text-lg font-medium text-gray-900 dark:text-white">料金について</h3>
          <div class="text-sm text-gray-600 dark:text-gray-300 space-y-2">
            <p>OpenAI APIは使用量に応じて課金されます：</p>
            <ul class="list-disc list-inside space-y-1 ml-4">
              <li>GPT-4: 入力トークンあたり$0.03、出力トークンあたり$0.06</li>
              <li>GPT-3.5 Turbo: 入力トークンあたり$0.0015、出力トークンあたり$0.002</li>
              <li>
                詳細な料金については
                <a
                  href="https://openai.com/pricing"
                  target="_blank"
                  rel="noopener noreferrer"
                  class="text-blue-600 dark:text-blue-400 hover:underline"
                >
                  OpenAI公式サイト
                </a>
                をご確認ください
              </li>
            </ul>
          </div>
        </div>

        <!-- 使用制限について -->
        <div class="space-y-3">
          <h3 class="text-lg font-medium text-gray-900 dark:text-white">使用制限について</h3>
          <div class="text-sm text-gray-600 dark:text-gray-300 space-y-2">
            <p>OpenAI APIには以下の制限があります：</p>
            <ul class="list-disc list-inside space-y-1 ml-4">
              <li>レート制限: 1分間あたりのリクエスト数に制限があります</li>
              <li>月間使用量制限: アカウントの種類により異なります</li>
              <li>コンテンツポリシー: OpenAIの利用規約に従う必要があります</li>
            </ul>
          </div>
        </div>

        <!-- サポート情報 -->
        <div
          class="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-md p-4"
        >
          <div class="flex items-start space-x-3">
            <svg
              class="h-5 w-5 text-blue-600 dark:text-blue-400 mt-0.5 flex-shrink-0"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <div class="space-y-2">
              <h4 class="text-sm font-medium text-blue-800 dark:text-blue-200">サポート情報</h4>
              <div class="text-sm text-blue-700 dark:text-blue-300">
                <p>
                  API Keyの設定や使用に関してご不明な点がございましたら、
                  <a
                    href="https://help.openai.com/"
                    target="_blank"
                    rel="noopener noreferrer"
                    class="underline hover:no-underline"
                  >
                    OpenAIヘルプセンター
                  </a>
                  をご参照ください。
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </template>
  </Card>
</template>

<script setup lang="ts">
import Card from '~/components/ui/card.vue';

defineOptions({
  name: 'ApiKeyInfo',
});
</script>
