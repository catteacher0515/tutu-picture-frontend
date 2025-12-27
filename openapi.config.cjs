// eslint-disable-next-line @typescript-eslint/no-require-imports
const { generateService } = require('@umijs/openapi');

generateService({
  // 🕵️‍♂️ 修正点：端口改为 8081
  schemaPath: 'http://localhost:8081/api/v3/api-docs',
  serversPath: './src/generated',
  requestLibPath: "import { request } from '@/utils/request'",
  projectName: 'backend',
});
