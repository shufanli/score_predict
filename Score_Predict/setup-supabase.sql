-- Supabase 数据库表结构
-- 在 Supabase 控制台的 SQL Editor 中执行此脚本

-- 创建问卷结果表
CREATE TABLE IF NOT EXISTS survey_results (
    -- 主键，自动生成 UUID
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    
    -- 创建时间
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    -- 总分
    total_score NUMERIC NOT NULL,
    
    -- 各部分得分
    section1_score NUMERIC NOT NULL,  -- 学习基础与潜力
    section2_score NUMERIC NOT NULL,  -- 心理抗压能力
    section3_score NUMERIC NOT NULL,  -- 方法与规划能力
    section4_score NUMERIC NOT NULL,  -- 目标与动机
    
    -- 所有问题的答案（JSON 格式）
    answers JSONB NOT NULL
);

-- 创建索引以提高查询性能
CREATE INDEX IF NOT EXISTS idx_created_at ON survey_results(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_total_score ON survey_results(total_score);

-- 添加注释
COMMENT ON TABLE survey_results IS '复读提分预测问卷结果表';
COMMENT ON COLUMN survey_results.id IS '唯一标识符';
COMMENT ON COLUMN survey_results.created_at IS '问卷提交时间';
COMMENT ON COLUMN survey_results.total_score IS '总分';
COMMENT ON COLUMN survey_results.section1_score IS '第一部分得分（学习基础与潜力）';
COMMENT ON COLUMN survey_results.section2_score IS '第二部分得分（心理抗压能力）';
COMMENT ON COLUMN survey_results.section3_score IS '第三部分得分（方法与规划能力）';
COMMENT ON COLUMN survey_results.section4_score IS '第四部分得分（目标与动机）';
COMMENT ON COLUMN survey_results.answers IS '所有30道题的答案（JSON格式）';

-- 可选：创建一个视图来查看统计信息
CREATE OR REPLACE VIEW survey_statistics AS
SELECT 
    COUNT(*) as total_surveys,
    ROUND(AVG(total_score), 2) as avg_score,
    ROUND(AVG(section1_score), 2) as avg_section1,
    ROUND(AVG(section2_score), 2) as avg_section2,
    ROUND(AVG(section3_score), 2) as avg_section3,
    ROUND(AVG(section4_score), 2) as avg_section4,
    MAX(total_score) as max_score,
    MIN(total_score) as min_score
FROM survey_results;

-- 可选：创建按日期统计的视图
CREATE OR REPLACE VIEW daily_survey_stats AS
SELECT 
    DATE(created_at) as survey_date,
    COUNT(*) as daily_count,
    ROUND(AVG(total_score), 2) as daily_avg_score
FROM survey_results
GROUP BY DATE(created_at)
ORDER BY survey_date DESC;
