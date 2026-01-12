-- 设置 Supabase 数据库权限
-- 在 Supabase SQL Editor 中执行此脚本

-- 首先，启用 RLS（Row Level Security）
ALTER TABLE survey_results ENABLE ROW LEVEL SECURITY;

-- 删除可能存在的旧策略（如果有）
DROP POLICY IF EXISTS "允许公开插入" ON survey_results;
DROP POLICY IF EXISTS "允许公开读取" ON survey_results;

-- 创建允许匿名用户插入数据的策略
CREATE POLICY "允许公开插入" 
ON survey_results
FOR INSERT 
TO anon
WITH CHECK (true);

-- 创建允许匿名用户读取数据的策略（用于 admin.html 管理面板）
CREATE POLICY "允许公开读取" 
ON survey_results
FOR SELECT 
TO anon
USING (true);

-- 验证策略是否创建成功
SELECT 
    schemaname,
    tablename,
    policyname,
    permissive,
    roles,
    cmd
FROM pg_policies
WHERE tablename = 'survey_results';
