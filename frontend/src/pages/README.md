# Frontend Pages 结构说明

## 新的页面组织结构

基于 CloudCollab proposal 的需求，pages 文件夹已重新组织为按功能模块分类的结构：

```
frontend/src/pages/
├── auth/              # 认证相关页面
│   ├── Login.jsx     # 登录页面
│   └── Register.jsx  # 注册页面（当前仅显示提示）
│
├── dashboard/         # 仪表板
│   └── Dashboard.jsx # 主仪表板，显示项目概览和统计
│
├── projects/          # 项目相关页面
│   ├── ProjectsList.jsx    # 项目列表
│   ├── ProjectBoard.jsx    # 项目看板（任务管理）
│   └── ProjectSettings.jsx # 项目设置
│
├── settings/          # 设置页面
│   └── UserSettings.jsx   # 用户设置
│
└── common/           # 通用页面
    └── NotFound.jsx  # 404 页面
```

## 路由结构

### 公开路由
- `/login` - 登录页面
- `/register` - 注册页面

### 受保护路由（需要登录）
- `/dashboard` - 仪表板（默认首页）
- `/projects` - 项目列表
- `/projects/:id` - 项目看板（任务管理）
- `/projects/:id/settings` - 项目设置
- `/settings` - 用户设置

## 页面功能说明

### Dashboard (仪表板)
- 显示欢迎信息和用户统计
- 显示项目总数和活跃项目数
- 显示最近的项目列表
- 快速访问所有项目

### ProjectsList (项目列表)
- 显示所有项目
- 搜索项目
- 创建新项目
- 删除项目

### ProjectBoard (项目看板)
- 显示项目的任务看板（Kanban）
- 拖拽排序任务
- 创建、编辑、删除任务
- 实时更新（WebSocket）
- 任务过滤和搜索
- 任务详情查看

### ProjectSettings (项目设置)
- 查看项目信息
- 编辑项目名称和描述
- 删除项目

### UserSettings (用户设置)
- 查看用户信息
- 登出功能
- 关于信息

## 导航结构

侧边栏导航包含：
- **Main**
  - Dashboard
  - Projects
- **Settings**
  - User Settings

## 设计原则

1. **模块化**: 按功能模块组织，便于维护和扩展
2. **可扩展性**: 每个模块可以独立添加新页面
3. **一致性**: 统一的页面结构和样式
4. **用户体验**: 清晰的导航和页面流程

## 后续扩展建议

根据 proposal 的需求，未来可以考虑添加：
- 团队管理页面 (`teams/`)
- 任务详情页面 (`tasks/`)
- 通知中心 (`notifications/`)
- 分析报告页面 (`analytics/`)

