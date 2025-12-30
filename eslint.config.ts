import { globalIgnores } from 'eslint/config'
import { defineConfigWithVueTs, vueTsConfigs } from '@vue/eslint-config-typescript'
import pluginVue from 'eslint-plugin-vue'
import skipFormatting from '@vue/eslint-config-prettier/skip-formatting'

// To allow more languages other than `ts` in `.vue` files, uncomment the following lines:
// import { configureVueProject } from '@vue/eslint-config-typescript'
// configureVueProject({ scriptLangs: ['ts', 'tsx'] })
// More info at https://github.com/vuejs/eslint-config-typescript/#advanced-setup

export default defineConfigWithVueTs(
  {
    name: 'app/files-to-lint',
    files: ['**/*.{ts,mts,tsx,vue}'],
  },

  // 1. 忽略目录配置 (保持你之前的配置)
  globalIgnores([
    '**/dist/**',
    '**/dist-ssr/**',
    '**/coverage/**',
    'src/generated/**/*'
  ]),

  // 2. Vue 和 TS 的推荐配置预设
  pluginVue.configs['flat/essential'],
  vueTsConfigs.recommended,

  // 👇👇👇 3. 核心修改：在这里注入自定义规则 👇👇👇
  {
    name: 'app/custom-rules',
    rules: {
      // 关掉 "定义了但未使用" 的报错 (TS 和 JS 都要关)
      'no-unused-vars': 'off',
      '@typescript-eslint/no-unused-vars': 'off',

      // 关掉 "组件名必须多单词" 的报错 (防止 User.vue 这种文件名报错)
      'vue/multi-word-component-names': 'off',

      // (可选) 关掉 "必须显式声明 any" 的报错，赶工期时 any 大法好
      '@typescript-eslint/no-explicit-any': 'off'
    }
  },

  skipFormatting,
)
