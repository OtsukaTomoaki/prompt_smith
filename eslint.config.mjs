// @ts-check
import withNuxt from './.nuxt/eslint.config.mjs'

export default withNuxt({
  languageOptions: {
    globals: {
      // 必要なグローバル変数を定義します
      isVue2: 'readonly',
      isVue3: 'readonly',
      // 他のグローバル変数もここに追加
    },
  },
  // 他のカスタム設定があればここに追加
})
