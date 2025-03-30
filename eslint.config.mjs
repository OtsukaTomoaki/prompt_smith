// @ts-check
import withNuxt from './.nuxt/eslint.config.mjs'

export default withNuxt({
  languageOptions: {
    globals: {
      isVue2: 'readonly',
      isVue3: 'readonly',
      test: 'readonly', // Jestなどのテストフレームワーク用
      expect: 'readonly', // Jestなどのテストフレームワーク用
      // 他のグローバル変数もここに追加
    },
  },
  // 他のカスタム設定があればここに追加
})
