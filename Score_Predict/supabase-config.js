// Supabase 配置文件
// 请在 https://supabase.com 创建项目后，将以下信息替换为你的实际配置

const SUPABASE_CONFIG = {
    // 你的 Supabase 项目 URL (格式: https://xxxxx.supabase.co)
    url: 'https://orbhgnegqiofbmtsxfmq.supabase.co',
    
    // 你的 Supabase 公开 API 密钥 (anon/public key)
    anonKey: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9yYmhnbmVncWlvZmJtdHN4Zm1xIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjgyMDM1NTIsImV4cCI6MjA4Mzc3OTU1Mn0.KvMB2iNCrJfgsM24-9JajElsgi6PfNsww4PywSetzm0'
};

// Supabase 客户端初始化
let supabaseClient = null;

function initSupabase() {
    if (typeof supabase !== 'undefined' && SUPABASE_CONFIG.url !== 'YOUR_SUPABASE_URL') {
        supabaseClient = supabase.createClient(SUPABASE_CONFIG.url, SUPABASE_CONFIG.anonKey);
        console.log('Supabase 客户端初始化成功');
        return true;
    } else {
        console.warn('Supabase 未配置或库未加载');
        return false;
    }
}

// 提交问卷数据到 Supabase
async function submitToSupabase(data) {
    if (!supabaseClient) {
        if (!initSupabase()) {
            console.error('Supabase 客户端未初始化');
            return { success: false, error: 'Supabase 未配置' };
        }
    }

    try {
        const { data: result, error } = await supabaseClient
            .from('survey_results')
            .insert([{
                total_score: data.totalScore,
                section1_score: data.sectionScores.section1,
                section2_score: data.sectionScores.section2,
                section3_score: data.sectionScores.section3,
                section4_score: data.sectionScores.section4,
                answers: data.answers,
                created_at: new Date().toISOString()
            }])
            .select();

        if (error) {
            console.error('提交到 Supabase 失败:', error);
            return { success: false, error: error.message };
        }

        console.log('数据提交成功:', result);
        return { success: true, data: result };
    } catch (err) {
        console.error('提交数据时发生异常:', err);
        return { success: false, error: err.message };
    }
}

// 获取统计数据（可选功能）
async function getStatistics() {
    if (!supabaseClient) {
        if (!initSupabase()) {
            return null;
        }
    }

    try {
        const { data, error } = await supabaseClient
            .from('survey_results')
            .select('total_score, created_at');

        if (error) {
            console.error('获取统计数据失败:', error);
            return null;
        }

        return data;
    } catch (err) {
        console.error('获取统计数据时发生异常:', err);
        return null;
    }
}
