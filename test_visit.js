// 测试访问统计功能的脚本
const fetch = require('node-fetch');

async function testVisitAPI() {
    const baseURL = 'http://localhost:3000';
    
    console.log('🚀 开始测试访问统计功能...\n');
    
    try {
        // 1. 测试记录访问
        console.log('1. 测试记录访问...');
        const visitResponse = await fetch(`${baseURL}/api/visit`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                page_name: 'test.html'
            })
        });
        
        if (visitResponse.ok) {
            const visitResult = await visitResponse.json();
            console.log('✅ 访问记录成功:', visitResult.message);
            console.log('📊 总访问次数:', visitResult.total_visits);
        } else {
            console.log('❌ 访问记录失败:', visitResponse.status);
        }
        
        // 2. 测试获取统计
        console.log('\n2. 测试获取统计...');
        const statsResponse = await fetch(`${baseURL}/api/stats/test.html`);
        
        if (statsResponse.ok) {
            const statsResult = await statsResponse.json();
            console.log('✅ 获取统计成功:');
            console.log('📄 页面名称:', statsResult.page_name);
            console.log('📊 总访问次数:', statsResult.total_visits);
            console.log('🕐 最后更新:', statsResult.last_updated);
        } else {
            console.log('❌ 获取统计失败:', statsResponse.status);
        }
        
        // 3. 测试获取所有统计
        console.log('\n3. 测试获取所有页面统计...');
        const allStatsResponse = await fetch(`${baseURL}/api/stats`);
        
        if (allStatsResponse.ok) {
            const allStatsResult = await allStatsResponse.json();
            console.log('✅ 获取所有统计成功:');
            console.table(allStatsResult);
        } else {
            console.log('❌ 获取所有统计失败:', allStatsResponse.status);
        }
        
        console.log('\n🎉 测试完成！');
        console.log('💡 提示:');
        console.log('- 访问 http://localhost:3000 查看主页面');
        console.log('- 访问 http://localhost:3000/admin.html 查看管理页面');
        console.log('- 密码: 7834520');
        
    } catch (error) {
        console.error('❌ 测试过程中出错:', error.message);
        console.log('💡 请确保服务器已启动 (运行 npm start)');
    }
}

// 如果直接运行此脚本
if (require.main === module) {
    testVisitAPI();
}

module.exports = { testVisitAPI }; 