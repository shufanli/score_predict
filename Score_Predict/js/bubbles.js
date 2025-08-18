// 动态生成气泡
(function() {
    const bubbleColors = ['#fff', '#e2e8f0', '#f8fafc'];
    const bubbles = document.querySelector('.bubbles');
    const bubbleCount = 18;
    
    for (let i = 0; i < bubbleCount; i++) {
        const bubble = document.createElement('div');
        bubble.className = 'bubble';
        
        // 随机大小
        const size = Math.random() * 48 + 32; // 32~80px
        bubble.style.width = `${size}px`;
        bubble.style.height = `${size}px`;
        
        // 随机横向位置
        bubble.style.left = `${Math.random() * 100}%`;
        
        // 随机动画时长
        const duration = Math.random() * 10 + 12; // 12~22s
        bubble.style.animationDuration = `${duration}s`;
        
        // 随机延迟
        bubble.style.animationDelay = `${-Math.random() * duration}s`;
        
        // 随机颜色
        bubble.style.background = bubbleColors[Math.floor(Math.random() * bubbleColors.length)];
        
        // 随机透明度
        bubble.style.opacity = (Math.random() * 0.25 + 0.18).toFixed(2);
        
        bubbles.appendChild(bubble);
    }
})();