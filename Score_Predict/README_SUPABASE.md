# 问卷数据存储 - Supabase 配置

## 🎯 功能说明

现在项目已集成 Supabase 云数据库，用户提交的问卷数据会自动保存到云端，方便您进行数据分析和统计。

## ⚡ 5 分钟快速配置

### 1️⃣ 创建 Supabase 账号
访问 https://supabase.com 注册并创建项目

### 2️⃣ 创建数据表
在 Supabase 的 SQL Editor 中运行 `setup-supabase.sql` 文件的内容

### 3️⃣ 获取密钥
在 Project Settings → API 中复制：
- Project URL
- anon public key

### 4️⃣ 配置项目
打开 `supabase-config.js`，替换你的 URL 和密钥：

```javascript
const SUPABASE_CONFIG = {
    url: '你的Project URL',
    anonKey: '你的anon key'
};
```

### 5️⃣ 设置权限
在 SQL Editor 中运行：

```sql
-- 允许插入数据
CREATE POLICY "允许公开插入" ON survey_results
FOR INSERT TO anon
WITH CHECK (true);
```

### ✅ 完成！
现在测试提交问卷，数据会自动保存到 Supabase！

## 📊 查看数据

在 Supabase Dashboard → Table Editor → survey_results 表中查看所有提交的数据。

## 📝 数据结构

每条记录包含：
- **total_score**: 总分
- **section1-4_score**: 各部分得分
- **answers**: 所有 30 道题的答案（JSON格式）
- **created_at**: 提交时间

## 🔍 数据分析示例

在 SQL Editor 中运行：

```sql
-- 查看平均分
SELECT AVG(total_score) as 平均分 FROM survey_results;

-- 查看提交数量
SELECT COUNT(*) as 提交总数 FROM survey_results;

-- 查看最近的提交
SELECT * FROM survey_results 
ORDER BY created_at DESC 
LIMIT 10;

-- 查看统计信息
SELECT * FROM survey_statistics;
```

## 📁 文件说明

- **supabase-config.js**: Supabase 配置和客户端初始化
- **setup-supabase.sql**: 数据库表结构和视图
- **test.html**: 已修改，集成了 Supabase 数据提交
- **SUPABASE_SETUP.md**: 详细配置指南

## 💡 提示

- 数据会同时保存到 localStorage（本地）和 Supabase（云端）
- 如果 Supabase 提交失败，不会影响用户查看结果
- 免费版 Supabase 足够存储数千份问卷数据

## ⚠️ 注意事项

1. **不要**将 anon key 提交到公开的 GitHub 仓库
2. 如果是敏感数据，建议配置更严格的 RLS 策略
3. 定期备份数据（Supabase 提供自动备份功能）

---

详细文档请查看 `SUPABASE_SETUP.md`
