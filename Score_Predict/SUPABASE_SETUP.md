# Supabase 数据存储配置指南

本指南将帮助您将问卷数据存储到 Supabase 云数据库中。

## 📋 前置条件

- 一个 Supabase 账号（免费版即可）
- 基本的网页开发知识

## 🚀 快速开始

### 步骤 1: 创建 Supabase 项目

1. 访问 [Supabase 官网](https://supabase.com/)
2. 点击 "Start your project" 注册/登录
3. 创建一个新项目：
   - 输入项目名称（例如：`score-predict`）
   - 设置数据库密码（请妥善保管）
   - 选择地区（推荐选择 `Northeast Asia (Tokyo)` 以获得更好的速度）
   - 点击 "Create new project"
4. 等待项目初始化完成（约 1-2 分钟）

### 步骤 2: 创建数据库表

1. 在项目控制台左侧菜单，点击 **SQL Editor**
2. 点击 "New query"
3. 复制并粘贴 `setup-supabase.sql` 文件中的所有内容
4. 点击 "Run" 执行 SQL 脚本
5. 看到 "Success" 提示即表示数据库表创建成功

### 步骤 3: 获取 API 密钥

1. 在左侧菜单点击 **Project Settings**（齿轮图标）
2. 点击 **API** 选项卡
3. 找到以下两个信息：
   - **Project URL**: 类似 `https://xxxxx.supabase.co`
   - **anon public**: 一串很长的密钥

### 步骤 4: 配置项目

1. 打开 `supabase-config.js` 文件
2. 替换以下内容：

```javascript
const SUPABASE_CONFIG = {
    // 替换为你的 Project URL
    url: 'https://your-project-id.supabase.co',
    
    // 替换为你的 anon public key
    anonKey: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...'
};
```

3. 保存文件

### 步骤 5: 测试

1. 打开 `test.html` 页面
2. 完成问卷并提交
3. 打开浏览器的开发者工具（F12）→ Console
4. 如果看到 "✅ 数据已成功保存到 Supabase"，说明配置成功！

## 📊 查看数据

### 方法 1: 使用 Supabase 控制台

1. 在项目控制台左侧菜单，点击 **Table Editor**
2. 选择 `survey_results` 表
3. 即可查看所有提交的问卷数据

### 方法 2: 查看统计信息

在 SQL Editor 中执行以下查询：

```sql
-- 查看总体统计
SELECT * FROM survey_statistics;

-- 查看每日统计
SELECT * FROM daily_survey_stats;

-- 查看最近 10 条记录
SELECT id, total_score, created_at 
FROM survey_results 
ORDER BY created_at DESC 
LIMIT 10;
```

## 🔒 安全性说明

- **anon public key** 是公开密钥，可以安全地在前端使用
- 默认情况下，Supabase 的表是受保护的
- 需要配置 RLS (Row Level Security) 策略以允许插入数据

### 配置数据插入权限

在 SQL Editor 中执行：

```sql
-- 允许任何人插入数据（适合公开问卷）
CREATE POLICY "允许公开插入" ON survey_results
FOR INSERT TO anon
WITH CHECK (true);

-- 允许任何人读取数据（可选）
CREATE POLICY "允许公开读取" ON survey_results
FOR SELECT TO anon
USING (true);
```

⚠️ **注意**: 如果这是内部使用的问卷，建议设置更严格的权限策略。

## 🛠️ 故障排查

### 问题: 提交失败，控制台显示 "new row violates row-level security policy"

**解决方案**: 需要配置 RLS 策略（见上方"配置数据插入权限"）

### 问题: 控制台显示 "Supabase 未配置"

**解决方案**: 
1. 检查 `supabase-config.js` 中的 URL 和 Key 是否正确替换
2. 确保没有多余的空格或引号
3. 刷新页面重试

### 问题: 页面加载慢

**解决方案**: 
- Supabase SDK 通过 CDN 加载，首次加载可能较慢
- 可以考虑将 SDK 文件下载到本地

## 📈 数据导出

### 导出为 CSV

1. 在 Table Editor 中，点击表格右上角的 "Export" 按钮
2. 选择 CSV 格式
3. 下载文件

### 使用 SQL 导出

```sql
-- 导出所有数据（复制结果）
SELECT 
    id,
    created_at,
    total_score,
    section1_score,
    section2_score,
    section3_score,
    section4_score,
    answers
FROM survey_results
ORDER BY created_at DESC;
```

## 🎯 高级功能

### 添加用户标识

如果想追踪用户，可以在表中添加 `user_ip` 或 `session_id` 字段：

```sql
ALTER TABLE survey_results ADD COLUMN user_ip TEXT;
ALTER TABLE survey_results ADD COLUMN session_id TEXT;
```

然后修改 `supabase-config.js` 中的 `submitToSupabase` 函数，添加这些字段。

### 设置数据保留期限

```sql
-- 自动删除 90 天前的数据（可选）
CREATE OR REPLACE FUNCTION delete_old_surveys()
RETURNS void AS $$
BEGIN
    DELETE FROM survey_results 
    WHERE created_at < NOW() - INTERVAL '90 days';
END;
$$ LANGUAGE plpgsql;

-- 创建定时任务（需要在 Supabase Dashboard 中配置）
```

## 📚 参考资料

- [Supabase 官方文档](https://supabase.com/docs)
- [Supabase JavaScript 客户端](https://supabase.com/docs/reference/javascript/introduction)
- [Row Level Security 指南](https://supabase.com/docs/guides/auth/row-level-security)

## ❓ 常见问题

**Q: Supabase 免费版有什么限制？**

A: 
- 500 MB 数据库存储
- 1 GB 文件存储
- 每月 2 GB 数据传输
- 50,000 次月活跃用户
对于一般的问卷调研，免费版完全够用。

**Q: 数据能保存多久？**

A: 只要项目存在，数据就会永久保存。免费版项目在 7 天无活动后会暂停，但数据不会丢失。

**Q: 可以在本地开发吗？**

A: 可以！Supabase 提供了本地开发环境，详见[本地开发文档](https://supabase.com/docs/guides/cli/local-development)。

## 🎉 完成

恭喜！您已经成功配置了 Supabase 数据存储。现在所有的问卷提交都会自动保存到云数据库中。

如有任何问题，请查看 Supabase 的官方文档或社区论坛。
