# 哈希测试后台演示原型

基于目标运营后台与用户端 H5 复刻并持续扩展的纯前端演示项目。当前运营后台覆盖 84 个非首页路由，用户端 H5 覆盖 66 个 `/front/pages/*` 路由。项目不连接 API、数据库或真实链上能力，所有业务操作均在浏览器本地模拟。

线上演示：[https://npc-sikong.github.io/](https://npc-sikong.github.io/)

## 本地运行

```bash
npm install
npm run dev
```

打开 `http://127.0.0.1:4173` 即可直接进入白色主题的会员列表页，无需登录。

## 生产构建

```bash
npm run build
```
