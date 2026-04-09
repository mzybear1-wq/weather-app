# 天气查询应用 - 技术设计 (TECH_DESIGN)

## 1. 技术选型
- **前端框架**: React + TypeScript + Vite
- **样式处理**: Tailwind CSS
- **状态管理**: Zustand (或 React Context + Hooks，Zustand 对于管理收藏列表更优)
- **网络请求**: Axios 或原生 Fetch 封装
- **API 提供商**: OpenWeatherMap API (Current Weather Data / Forecast)
- **本地存储**: `LocalStorage` (用于存储收藏的城市列表)
- **浏览器原生 API**: `Geolocation API`

## 2. API 调用与封装
- 采用环境变量 (`.env.local`) 存储 API Key，防止泄露。
- **工具文件封装**: 在 `src/api/weather.ts` 中封装所有网络请求。
- **接口设计**:
  - `getCurrentWeather(city: string)`: 传入城市名称查询当前天气。
  - `getCurrentWeatherByCoords(lat: number, lon: number)`: 传入经纬度查询当前天气。
  - `getForecast(city: string)`: 传入城市获取未来几天的预报。
  - **错误处理**: 对 axios 请求的 catch 进行统一拦截，返回友好的错误信息（如“找不到该城市”、“网络连接失败”）。

## 3. 核心模块设计

### 3.1 搜索与加载模块 (Search & Loading)
- **Search Bar**: 包含输入框和搜索按钮。
- **Loading State**: 使用全局 `isLoading` 状态，当请求发出时置为 `true`，渲染骨架屏或加载动画。
- **Error State**: 如果请求报错，显示一个错误提示组件。

### 3.2 当前天气展示模块 (Current Weather Display)
- 核心 UI，类似截图中的大屏展示：
  - 城市名与天气状况描述。
  - 超大字体的当前温度。
  - 最高/最低温度，以及空气质量 (AQI) 提示。

### 3.3 详细预报模块 (Forecast & Details)
- **逐小时预报 (Hourly Forecast)**: 横向滚动列表，展示时间、图标、温度。
- **多天预报 (Daily Forecast)**: 纵向列表，展示今天、明天、后天的高低温度范围。
- **详细数据网格 (Detailed Stats Grid)**:
  - 包含紫外线、日落时间、风力、湿度、能见度、体感温度等卡片。

### 3.4 收藏与定位功能 (Favorites & Geolocation)
- **收藏管理**:
  - `favorites` 状态存储在 Zustand 或 LocalStorage 中。
  - 提供 `addFavorite` 和 `removeFavorite` 方法。
  - 提供一个侧边栏或下拉列表展示所有已收藏的城市。
- **Geolocation API**:
  - 组件挂载时（或点击“定位”按钮时），调用 `navigator.geolocation.getCurrentPosition`。
  - 获取成功后调用 `getCurrentWeatherByCoords`。
  - 失败（拒绝权限或超时）则静默或显示错误提示，要求用户手动输入。

## 4. 环境变量与安全
- 创建 `.env.local` 文件并添加：
  ```
  VITE_OPENWEATHER_API_KEY=你的API_KEY
  ```
- **重要**: 必须在 `.gitignore` 中确保 `.env.local` 不被提交到 Git，防止 API Key 泄露。

## 5. 开发步骤规划
1. **环境初始化**: 搭建 Vite + React + TS 项目，安装 Tailwind、Axios、Lucide-React。
2. **API 封装与环境变量**: 配置 `.env.local`，编写 `weather.ts` API 请求工具并测试。
3. **基础 UI 搭建**: 实现天气展示的三个主要面板（当前天气、小时/多天预报、详细数据网格）。
4. **功能接入**: 将真实 API 数据绑定到 UI 上，处理 Loading 和 Error 状态。
5. **定位与收藏**: 接入 Geolocation API，实现自动定位；添加收藏功能及 LocalStorage 持久化。