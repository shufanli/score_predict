// AI分析配置
const AI_CONFIG = {
    // 使用SiliconFlow的Qwen API
    apiUrl: 'https://api.siliconflow.cn/v1/chat/completions',
    apiKey: 'sk-ipckkktkubagekqyfzbabwhefalccimeglkkpkopjfkhzyyr',
    model: 'Qwen/QwQ-32B',
    maxTokens: 512,
    temperature: 0.7,
    enableThinking: true,
    thinkingBudget: 4096,
    minP: 0.05,
    topP: 0.7,
    topK: 50,
    frequencyPenalty: 0.5,
    n: 1
};

// 页面加载时获取测试结果
document.addEventListener('DOMContentLoaded', function() {
    const results = localStorage.getItem('testResults');
    
    if (!results) {
        document.getElementById('noResults').style.display = 'block';
        return;
    }
    
    const data = JSON.parse(results);
    
    // 启动AI分析流程
    startAIAnalysis(data);
});

// 启动AI分析流程
async function startAIAnalysis(testData) {
    let useRealAPI = true;
    let aiResult = null;
    
    try {
        // 显示加载界面
        document.getElementById('aiLoadingContainer').style.display = 'block';
        
        // 添加页面加载提示
        updateLoadingText('正在初始化AI分析引擎...');
        
        // 模拟分析步骤
        await simulateAnalysisSteps();
        
        // 尝试调用真实AI API
        updateLoadingText('AI正在深度分析您的测试数据...');
        
        try {
            aiResult = await callQwenAPI(testData);
            console.log('✅ 真实AI API调用成功');
        } catch (apiError) {
            console.warn('⚠️ 真实AI API调用失败，降级到模拟分析:', apiError.message);
            useRealAPI = false;
            
            // 显示降级信息
            updateLoadingText(`API调用失败 (${apiError.type || 'unknown'}): ${apiError.message}`);
            await new Promise(resolve => setTimeout(resolve, 2000));
            
            updateLoadingText('正在使用本地智能分析引擎...');
            await new Promise(resolve => setTimeout(resolve, 1000));
            
            // 使用模拟AI结果
            aiResult = generateMockAIResult(testData);
            console.log('✅ 模拟AI分析完成');
        }
        
        // 显示AI分析结果
        updateLoadingText('生成个性化分析报告...');
        await new Promise(resolve => setTimeout(resolve, 500)); // 短暂延迟增加真实感
        
        displayAIResults(aiResult, testData, useRealAPI);
        
        // 隐藏加载界面，显示结果
        document.getElementById('aiLoadingContainer').style.display = 'none';
        document.getElementById('aiResultsContainer').style.display = 'block';
        
        // 添加结果展示动画
        animateResultsAppearance();
        
    } catch (error) {
        console.error('❌ AI分析流程完全失败:', error);
        
        // 显示错误信息
        showErrorMessage(`分析流程失败: ${error.message}`);
        
        // 最后的降级方案：直接显示传统结果
        setTimeout(() => {
            console.log('🔄 最终降级到传统结果展示');
            fallbackToTraditionalResults(testData);
        }, 3000);
    }
}

// 更新加载文本
function updateLoadingText(text) {
    const loadingTextElement = document.querySelector('.loading-text');
    if (loadingTextElement) {
        loadingTextElement.textContent = text;
    }
}

// 显示错误信息
function showErrorMessage(message) {
    const loadingContainer = document.getElementById('aiLoadingContainer');
    const errorHTML = `
        <div class="ai-loading-content">
            <div class="error-icon">⚠️</div>
            <h2>AI分析遇到问题</h2>
            <p class="error-message">${message}</p>
            <p class="loading-text">正在为您切换到传统分析模式...</p>
        </div>
    `;
    loadingContainer.innerHTML = errorHTML;
    
    // 添加错误样式
    loadingContainer.style.background = 'linear-gradient(135deg, #ff6b6b 0%, #ee5a52 100%)';
}

// 结果展示动画
function animateResultsAppearance() {
    const sections = document.querySelectorAll('#aiResultsContainer > div');
    sections.forEach((section, index) => {
        section.style.opacity = '0';
        section.style.transform = 'translateY(20px)';
        section.style.transition = 'all 0.5s ease';
        
        setTimeout(() => {
            section.style.opacity = '1';
            section.style.transform = 'translateY(0)';
        }, index * 200);
    });
}

// 模拟分析步骤动画
async function simulateAnalysisSteps() {
    const steps = document.querySelectorAll('.step');
    
    for (let i = 0; i < steps.length; i++) {
        // 移除之前的active状态
        steps.forEach(step => step.classList.remove('active'));
        
        // 设置当前步骤为active
        steps[i].classList.add('active');
        
        // 等待一段时间
        await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 1000));
        
        // 标记为完成
        steps[i].classList.remove('active');
        steps[i].classList.add('completed');
    }
}

// 调用Qwen AI API
async function callQwenAPI(testData) {
    const { totalScore, sectionScores } = testData;
    
    // 构建分析提示词
    const prompt = `你是一位专业的教育心理学专家和复读指导顾问。请基于以下学生的复读适应性测试结果，提供深度分析和个性化建议。

测试结果数据：
- 总分：${totalScore}/100
- 学习基础与潜力：${sectionScores.foundation}/25
- 心理抗压能力：${sectionScores.psychology}/25  
- 方法与规划能力：${sectionScores.planning}/25
- 目标与动机：${sectionScores.motivation}/25

请提供以下分析（请用JSON格式回复）：
{
  "scoreAnalysis": "对总分的专业解读和预测提升空间",
  "dimensionAnalysis": {
    "foundation": "学习基础分析",
    "psychology": "心理状态分析", 
    "planning": "规划能力分析",
    "motivation": "动机分析"
  },
  "predictedImprovement": {
    "minScore": 最低预期提升分数,
    "maxScore": 最高预期提升分数,
    "confidence": "预测置信度(0-1)"
  },
  "recommendations": [
    {
      "category": "学习方法",
      "title": "建议标题",
      "content": "具体建议内容",
      "priority": "high/medium/low"
    }
  ],
  "riskAssessment": "复读风险评估和注意事项",
  "timeline": "建议的复读时间规划"
}`;

    console.log('🚀 开始调用Qwen AI API...');
    console.log('📊 测试数据:', testData);
    console.log('🔗 API URL:', AI_CONFIG.apiUrl);
    console.log('🤖 模型:', AI_CONFIG.model);
    
    try {
        // 检查网络连接
        if (!navigator.onLine) {
            throw new Error('网络连接不可用，请检查网络设置');
        }
        
        // 设置请求超时
        const controller = new AbortController();
        const timeoutId = setTimeout(() => {
            controller.abort();
        }, 30000); // 30秒超时
        
        console.log('📤 发送API请求...');
        
        const requestBody = {
            model: AI_CONFIG.model,
            messages: [
                {
                    role: 'user',
                    content: prompt
                }
            ],
            max_tokens: AI_CONFIG.maxTokens,
            enable_thinking: AI_CONFIG.enableThinking,
            thinking_budget: AI_CONFIG.thinkingBudget,
            min_p: AI_CONFIG.minP,
            temperature: AI_CONFIG.temperature,
            top_p: AI_CONFIG.topP,
            top_k: AI_CONFIG.topK,
            frequency_penalty: AI_CONFIG.frequencyPenalty,
            n: AI_CONFIG.n
        };
        
        console.log('📋 请求体:', JSON.stringify(requestBody, null, 2));
        
        const response = await fetch(AI_CONFIG.apiUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${AI_CONFIG.apiKey}`
            },
            body: JSON.stringify(requestBody),
            signal: controller.signal
        });
        
        clearTimeout(timeoutId);
        
        console.log('📥 收到API响应:', response.status, response.statusText);
        
        if (!response.ok) {
            const errorText = await response.text();
            console.error('❌ API响应错误:', {
                status: response.status,
                statusText: response.statusText,
                headers: Object.fromEntries(response.headers.entries()),
                body: errorText
            });
            
            // 检查是否是CORS错误
            if (response.status === 0 || response.type === 'opaque') {
                throw new Error('CORS跨域限制：浏览器阻止了对第三方API的直接访问');
            }
            
            throw new Error(`API调用失败 (${response.status}): ${errorText || response.statusText}`);
        }

        const result = await response.json();
        console.log('✅ API调用成功:', result);
        
        if (!result.choices || !result.choices[0] || !result.choices[0].message) {
            throw new Error('API返回格式异常：缺少choices或message字段');
        }
        
        const aiContent = result.choices[0].message.content;
        console.log('🤖 AI回复内容:', aiContent);
        
        // 尝试解析JSON响应
        try {
            const parsedResult = JSON.parse(aiContent);
            console.log('✅ JSON解析成功:', parsedResult);
            return parsedResult;
        } catch (parseError) {
            console.warn('⚠️ JSON解析失败，使用文本格式:', parseError);
            // 如果解析失败，返回格式化的文本结果
            return {
                scoreAnalysis: aiContent,
                predictedImprovement: { minScore: 30, maxScore: 80, confidence: 0.7 },
                recommendations: [{
                    category: "综合建议",
                    title: "AI分析建议",
                    content: aiContent,
                    priority: "high"
                }]
            };
        }
    } catch (error) {
        console.error('❌ Qwen API调用失败:', error);
        
        // 详细错误分析
        let errorMessage = error.message;
        let errorType = 'unknown';
        
        if (error.name === 'AbortError') {
            errorMessage = '请求超时，请检查网络连接';
            errorType = 'timeout';
        } else if (error.message.includes('CORS') || error.message.includes('跨域')) {
            errorMessage = 'CORS跨域限制：需要服务器端代理或使用CORS代理服务';
            errorType = 'cors';
        } else if (error.message.includes('Failed to fetch') || error.message.includes('网络')) {
            errorMessage = '网络连接失败，请检查网络设置';
            errorType = 'network';
        } else if (error.message.includes('401') || error.message.includes('403')) {
            errorMessage = 'API密钥无效或权限不足';
            errorType = 'auth';
        } else if (error.message.includes('429')) {
            errorMessage = 'API调用频率超限，请稍后重试';
            errorType = 'rate_limit';
        }
        
        console.log('🔄 错误类型:', errorType, '错误信息:', errorMessage);
        console.log('🔄 自动降级到模拟AI分析结果...');
        
        // 抛出带有详细信息的错误，让上层处理降级
        const detailedError = new Error(errorMessage);
        detailedError.type = errorType;
        detailedError.originalError = error;
        throw detailedError;
    }
}

// 生成模拟AI结果（用于演示）
function generateMockAIResult(testData) {
    const { totalScore, sectionScores } = testData;
    
    let scoreAnalysis, predictedImprovement, recommendations, riskAssessment;
    
    if (totalScore >= 70) {
        scoreAnalysis = `您的总分${totalScore}分显示出优秀的复读适应性。各维度发展均衡，具备扎实的学习基础和良好的心理素质。AI预测您有很大潜力在复读期间实现显著提升。`;
        predictedImprovement = { minScore: 50, maxScore: 120, confidence: 0.85 };
        riskAssessment = "复读风险较低，成功概率高。建议保持当前良好状态，重点关注薄弱科目突破。";
        recommendations = [
            { category: "学习策略", title: "制定精准提升计划", content: "基于您的高适应性，建议制定更具挑战性的学习目标，重点攻克高难度题型，争取在优势科目上实现突破。", priority: "high" },
            { category: "心理调适", title: "保持积极心态", content: "您的心理抗压能力较强，建议继续保持，同时可以帮助其他同学，在互助中进一步提升自己。", priority: "medium" },
            { category: "时间管理", title: "优化学习效率", content: "建议采用番茄工作法等高效学习方法，合理分配各科学习时间，确保全面发展。", priority: "medium" },
            { category: "目标设定", title: "设定阶段性目标", content: "将年度目标分解为月度、周度小目标，定期检查进度，及时调整学习策略。", priority: "high" }
        ];
    } else if (totalScore >= 40) {
        scoreAnalysis = `您的总分${totalScore}分处于中等水平，显示出一定的复读潜力，但需要在某些方面加强。AI分析发现您在部分维度还有提升空间。`;
        predictedImprovement = { minScore: 25, maxScore: 70, confidence: 0.65 };
        riskAssessment = "复读存在一定风险，需要针对性改进。建议先提升薄弱环节再决定是否复读。";
        recommendations = [
            { category: "基础强化", title: "补强薄弱环节", content: "重点关注得分较低的维度，制定专项提升计划。建议寻求专业指导，系统性地改善学习方法。", priority: "high" },
            { category: "心理建设", title: "增强抗压能力", content: "通过冥想、运动等方式提升心理韧性，学会正确处理学习压力和挫折感。", priority: "high" },
            { category: "学习方法", title: "改进学习策略", content: "尝试多种学习方法，找到最适合自己的学习模式，提高学习效率和效果。", priority: "medium" },
            { category: "支持系统", title: "建立支持网络", content: "与家人、老师、同学建立良好沟通，获得必要的情感支持和学习帮助。", priority: "medium" }
        ];
    } else {
        scoreAnalysis = `您的总分${totalScore}分显示复读适应性较低，存在多个需要改善的方面。AI建议您慎重考虑复读决定，或先进行全面的能力提升。`;
        predictedImprovement = { minScore: 10, maxScore: 40, confidence: 0.45 };
        riskAssessment = "复读风险较高，不建议立即复读。建议先进行6个月以上的综合能力提升训练。";
        recommendations = [
            { category: "全面评估", title: "深度自我分析", content: "建议进行更全面的学习能力和心理状态评估，明确具体的改进方向和目标。", priority: "high" },
            { category: "专业指导", title: "寻求专业帮助", content: "建议咨询教育心理专家，制定个性化的能力提升方案，系统性地改善各项能力。", priority: "high" },
            { category: "替代方案", title: "考虑其他选择", content: "可以考虑其他升学途径或职业发展方向，不一定要通过复读实现目标。", priority: "medium" },
            { category: "基础重建", title: "重建学习基础", content: "如果坚持复读，需要从基础开始，重新建立学习习惯和方法体系。", priority: "high" }
        ];
    }
    
    return {
        scoreAnalysis,
        dimensionAnalysis: {
            foundation: `学习基础得分${sectionScores.foundation}/25，${sectionScores.foundation >= 18 ? '基础扎实，具备良好的知识储备' : sectionScores.foundation >= 12 ? '基础一般，需要系统性复习' : '基础薄弱，需要从基础知识开始重建'}。`,
            psychology: `心理抗压得分${sectionScores.psychology}/25，${sectionScores.psychology >= 18 ? '心理素质优秀，能够很好地应对压力' : sectionScores.psychology >= 12 ? '心理状态尚可，需要进一步提升抗压能力' : '心理抗压能力较弱，需要专业心理指导'}。`,
            planning: `规划能力得分${sectionScores.planning}/25，${sectionScores.planning >= 18 ? '具备优秀的学习规划和执行能力' : sectionScores.planning >= 12 ? '规划能力中等，需要改进执行力' : '缺乏有效的学习规划，需要系统性训练'}。`,
            motivation: `目标动机得分${sectionScores.motivation}/25，${sectionScores.motivation >= 18 ? '目标明确，动机强烈，具备持续学习的内驱力' : sectionScores.motivation >= 12 ? '目标相对明确，但动机强度有待提升' : '目标不够明确，缺乏足够的学习动机'}。`
        },
        predictedImprovement,
        recommendations,
        riskAssessment,
        timeline: "建议复读周期为10-12个月，前3个月重点补基础，中间6个月强化提升，最后3个月冲刺突破。"
    };
}

// 显示AI分析结果
function displayAIResults(aiResult, testData, useRealAPI = true) {
    const { totalScore } = testData;
    const { scoreAnalysis, dimensionAnalysis, predictedImprovement, recommendations, riskAssessment } = aiResult;
    
    const apiSource = useRealAPI ? 'Qwen大模型' : '本地智能引擎';
    const apiIcon = useRealAPI ? '🤖' : '🧠';
    const apiNote = useRealAPI ? '' : '<div class="api-fallback-note">⚠️ 由于网络限制，当前使用本地分析引擎。结果仍具有参考价值。</div>';
    
    const resultsHTML = `
        <div class="ai-result-header">
            <h2>${apiIcon} AI智能分析报告</h2>
            <p>基于${apiSource}的专业分析</p>
            ${apiNote}
        </div>
        
        <div class="ai-score-prediction">
            <div class="predicted-score">${predictedImprovement.minScore}-${predictedImprovement.maxScore}</div>
            <div class="score-range">预测提升分数范围 (置信度: ${Math.round(predictedImprovement.confidence * 100)}%)</div>
        </div>
        
        <div class="ai-analysis-section">
            <div class="ai-section-title">
                📊 综合分析
            </div>
            <div class="ai-section-content">
                ${scoreAnalysis}
            </div>
        </div>
        
        ${dimensionAnalysis ? `
        <div class="ai-analysis-section">
            <div class="ai-section-title">
                🔍 维度分析
            </div>
            <div class="ai-section-content">
                <p><strong>学习基础：</strong>${dimensionAnalysis.foundation}</p>
                <p><strong>心理状态：</strong>${dimensionAnalysis.psychology}</p>
                <p><strong>规划能力：</strong>${dimensionAnalysis.planning}</p>
                <p><strong>目标动机：</strong>${dimensionAnalysis.motivation}</p>
            </div>
        </div>
        ` : ''}
        
        <div class="ai-analysis-section">
            <div class="ai-section-title">
                ⚠️ 风险评估
            </div>
            <div class="ai-section-content">
                ${riskAssessment}
            </div>
        </div>
        
        <div class="ai-recommendations">
            ${recommendations.map((rec, index) => `
                <div class="recommendation-card">
                    <div class="recommendation-title">
                        ${getRecommendationIcon(rec.category)} ${rec.title}
                    </div>
                    <div class="recommendation-content">
                        ${rec.content}
                    </div>
                </div>
            `).join('')}
        </div>
        
        <div class="actions">
            <a href="test.html" class="btn">重新测试</a>
            <button onclick="window.print()" class="btn btn-secondary">保存报告</button>
            <button onclick="shareResults()" class="btn btn-secondary">分享结果</button>
        </div>
    `;
    
    document.getElementById('aiResultsContainer').innerHTML = resultsHTML;
}

// 获取建议图标
function getRecommendationIcon(category) {
    const icons = {
        '学习策略': '📚',
        '学习方法': '📚', 
        '心理调适': '🧠',
        '心理建设': '🧠',
        '时间管理': '⏰',
        '目标设定': '🎯',
        '基础强化': '💪',
        '专业指导': '👨‍🏫',
        '全面评估': '📋',
        '替代方案': '🔄',
        '基础重建': '🏗️',
        '支持系统': '🤝'
    };
    return icons[category] || '💡';
}

// 降级到传统结果展示
function fallbackToTraditionalResults(testData) {
    console.log('🔄 执行降级到传统结果展示');
    
    // 隐藏AI加载界面
    const aiLoadingContainer = document.getElementById('aiLoadingContainer');
    if (aiLoadingContainer) {
        aiLoadingContainer.style.display = 'none';
    }
    
    // 隐藏AI结果容器
    const aiResultsContainer = document.getElementById('aiResultsContainer');
    if (aiResultsContainer) {
        aiResultsContainer.style.display = 'none';
    }
    
    // 显示传统结果容器
    let traditionalContainer = document.getElementById('traditionalResults');
    if (!traditionalContainer) {
        // 如果不存在传统结果容器，创建一个
        traditionalContainer = document.createElement('div');
        traditionalContainer.id = 'traditionalResults';
        traditionalContainer.className = 'results-container';
        document.body.appendChild(traditionalContainer);
    }
    
    traditionalContainer.style.display = 'block';
    
    // 显示降级提示和传统结果
    const fallbackHTML = `
        <div class="fallback-notice">
            <div class="fallback-content">
                <span class="fallback-icon">⚠️</span>
                <span class="fallback-text">AI分析暂时不可用，已切换到传统分析模式</span>
                <button onclick="location.reload()" class="retry-btn">重试AI分析</button>
            </div>
        </div>
        <div id="resultsContainer"></div>
    `;
    
    traditionalContainer.innerHTML = fallbackHTML;
    displayResults(testData);
}

// 分享结果功能
function shareResults() {
    if (navigator.share) {
        navigator.share({
            title: 'AI复读提分预测结果',
            text: '我刚完成了AI复读适应性测试，快来看看我的分析报告！',
            url: window.location.href
        });
    } else {
        // 复制链接到剪贴板
        navigator.clipboard.writeText(window.location.href).then(() => {
            alert('链接已复制到剪贴板，可以分享给朋友了！');
        });
    }
}

function displayResults(data) {
    const { totalScore, sectionScores } = data;
    
    // 确定适配性级别
    let level, levelClass, levelText, analysis, recommendations;
    
    if (totalScore >= 70) {
        level = '适合复读';
        levelClass = 'level-high';
        levelText = '高适配性';
        analysis = '恭喜！您的测试结果显示您非常适合复读。您具备良好的学习基础、心理抗压能力、方法规划能力和明确的目标动机。预计提分潜力较大，中等基础的同学可提高50-100分，基础薄弱的同学可提高100分以上。';
        recommendations = [
            '制定详细的复读计划，包括长期目标和短期任务',
            '继续保持良好的学习习惯和心理状态',
            '重点关注薄弱科目，进行专项突破',
            '定期进行模拟考试，检验复习效果',
            '与老师和同学保持良好沟通，及时调整策略'
        ];
    } else if (totalScore >= 40) {
        level = '需谨慎评估';
        levelClass = 'level-medium';
        levelText = '中等适配性';
        analysis = '您的测试结果显示复读需要谨慎考虑。建议您先优化学习方法或进行心理调适，提高各维度能力后再决定是否复读。可以考虑寻求专业指导，制定更有针对性的提升计划。';
        recommendations = [
            '分析薄弱环节，重点提升得分较低的维度',
            '寻求专业的学习指导和心理咨询',
            '制定更具体的学习计划和目标',
            '加强时间管理和压力调节能力',
            '考虑参加复读预备课程或辅导班'
        ];
    } else {
        level = '复读风险较高';
        levelClass = 'level-low';
        levelText = '低适配性';
        analysis = '测试结果显示您当前的复读适配性较低。可能因为动力不足、压力管理能力差或学习方法不当等原因导致复读效果有限。建议您慎重考虑复读决定，或者先进行较长时间的自我提升。';
        recommendations = [
            '深入思考复读的真正动机和目标',
            '寻求专业的心理咨询和学习指导',
            '考虑其他升学途径或职业发展方向',
            '如果坚持复读，需要进行全面的能力提升',
            '建立更强的支持系统和监督机制'
        ];
    }
    
    // 构建结果HTML
    const resultsHTML = `
        <div class="score-overview">
            <div class="total-score">${totalScore}</div>
            <div class="score-label">预估提分</div>
        </div>
        
        <div class="result-analysis">
            <div class="analysis-title">
                <span class="result-level ${levelClass}">${levelText}</span>
                <br><strong>${level}</strong>
            </div>
            <div class="analysis-content">
                ${analysis}
            </div>
        </div>
        
        <div class="recommendations">
            <h3>建议与指导</h3>
            <ul>
                ${recommendations.map(rec => `<li>${rec}</li>`).join('')}
            </ul>
        </div>
        
        <div class="actions">
            <a href="test.html" class="btn">重新测试</a>
            <button onclick="window.print()" class="btn btn-secondary">打印结果</button>
        </div>
    `;
    
    document.getElementById('resultsContainer').innerHTML = resultsHTML;
}