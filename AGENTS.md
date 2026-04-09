# 天气查询应用 - 开发指令 (AGENTS)

## 1. 代码规范
- **语言**: React + TypeScript
- **组件范式**: 必须使用函数式组件 (Functional Components) 和 React Hooks。
- **样式方案**: 必须使用 Tailwind CSS，可搭配 `clsx` 或 `tailwind-merge` 进行动态类名拼接。
- **类型安全**: 必须定义完整的 TypeScript 接口，特别是对 OpenWeatherMap API 返回的数据结构。

## 2. API 与网络请求规范
- **封装**: 所有向外部 API 的请求必须封装在 `src/api` 目录下的专门文件中（如 `weather.ts`）。
- **环境变量**:
  - API 基础 URL 必须使用环境变量 `import.meta.env.VITE_WEATHER_BASE_URL`。
  - API Key 必须使用环境变量 `import.meta.env.VITE_OPENWEATHER_API_KEY`。
  - 严禁在代码中硬编码 API Key。
- **错误处理**:
  - 必须对 `axios.get` 等请求进行 `try...catch` 处理。
  - 在遇到错误时（如 `404 Not Found` 或 `401 Unauthorized`），返回一个标准的错误对象，供前端组件统一展示。

## 3. 浏览器原生 API 规范
- **Geolocation API**:
  - 获取位置前，检查 `navigator.geolocation` 是否存在。
  - 处理权限请求的各种情况（用户拒绝、获取超时、浏览器不支持）。
  - 若获取位置失败，应有默认的降级方案（如提示用户手动搜索城市）。

## 4. 状态管理与数据持久化
- **Zustand 或 Context**: 推荐使用 Zustand 管理全局天气状态、加载状态、错误状态以及收藏的城市列表。
- **避免无限渲染死循环**: 遵循 `COMMON_ERRORS.md` 中的规范，在 Zustand selector 中不要直接返回新对象或数组。
- **LocalStorage**:
  - 收藏的城市必须保存在 `LocalStorage` 中。
  - 在组件挂载时读取，更新时同步保存。

## 5. 避免常见前端错误 (Frontend Pitfalls)
- **类型导入**: 在导入 TypeScript 接口和类型时，务必加上 `type` 关键字（如 `import type { WeatherData } from './types'`），避免 Vite + TS 编译时的白屏错误。
- **Git 与部署**:
  - 确保 `.env.local` 已经加入 `.gitignore`。
  - 确保每次提交前执行了 `git add .`。
  - 如果部署到 Vercel，确保 `package.json` 中的 `build` 脚本使用 `npx tsc -b && vite build` 避免权限错误。

## 6. 开发执行步骤
1. **项目初始化与环境配置**: 初始化 Vite 项目，安装依赖，配置 Tailwind CSS。
2. **API 封装与测试**: 创建 `src/api/weather.ts`，定义数据接口并编写 API 请求方法，测试请求是否能成功获取数据。
3. **UI 构建与状态接入**: 开发当前天气、预报、详情等组件，并将 API 返回的数据绑定到组件状态上。
4. **定位与收藏功能**: 实现 Geolocation 获取位置并查询天气，添加城市收藏列表及 LocalStorage 持久化功能。
5. **加载与错误状态处理**: 完善 Loading 动画和错误提示界面，确保用户体验。
6. windows环境开发