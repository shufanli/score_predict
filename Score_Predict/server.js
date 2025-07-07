const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// 中间件
app.use(cors());
app.use(express.json());
app.use(express.static('.'));

// 初始化数据库
const db = new sqlite3.Database('visits.db', (err) => {
    if (err) {
        console.error('数据库连接错误:', err.message);
    } else {
        console.log('数据库连接成功');
        
        // 创建访问记录表
        db.run(`CREATE TABLE IF NOT EXISTS visits (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            page_name TEXT NOT NULL,
            visit_time DATETIME DEFAULT CURRENT_TIMESTAMP,
            ip_address TEXT,
            user_agent TEXT
        )`, (err) => {
            if (err) {
                console.error('创建表错误:', err.message);
            } else {
                console.log('访问记录表创建成功');
            }
        });
        
        // 创建访问统计表
        db.run(`CREATE TABLE IF NOT EXISTS visit_stats (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            page_name TEXT UNIQUE NOT NULL,
            total_visits INTEGER DEFAULT 0,
            last_updated DATETIME DEFAULT CURRENT_TIMESTAMP
        )`, (err) => {
            if (err) {
                console.error('创建统计表错误:', err.message);
            } else {
                console.log('访问统计表创建成功');
                
                // 初始化test.html的访问统计
                db.run(`INSERT OR IGNORE INTO visit_stats (page_name, total_visits) VALUES (?, ?)`, 
                    ['test.html', 0], (err) => {
                    if (err) {
                        console.error('初始化统计数据错误:', err.message);
                    }
                });
            }
        });
    }
});

// API路由 - 记录访问
app.post('/api/visit', (req, res) => {
    const { page_name } = req.body;
    const ip_address = req.ip || req.connection.remoteAddress;
    const user_agent = req.get('User-Agent');
    
    if (!page_name) {
        return res.status(400).json({ error: '页面名称不能为空' });
    }
    
    // 记录详细访问信息
    db.run(`INSERT INTO visits (page_name, ip_address, user_agent) VALUES (?, ?, ?)`,
        [page_name, ip_address, user_agent], function(err) {
        if (err) {
            console.error('记录访问错误:', err.message);
            return res.status(500).json({ error: '数据库错误' });
        }
        
        // 更新统计数据
        db.run(`INSERT OR REPLACE INTO visit_stats (page_name, total_visits, last_updated) 
                VALUES (?, COALESCE((SELECT total_visits FROM visit_stats WHERE page_name = ?), 0) + 1, CURRENT_TIMESTAMP)`,
            [page_name, page_name], function(err) {
            if (err) {
                console.error('更新统计错误:', err.message);
                return res.status(500).json({ error: '统计更新错误' });
            }
            
            // 获取最新的访问次数
            db.get(`SELECT total_visits FROM visit_stats WHERE page_name = ?`, [page_name], (err, row) => {
                if (err) {
                    console.error('查询统计错误:', err.message);
                    return res.status(500).json({ error: '查询错误' });
                }
                
                res.json({ 
                    success: true, 
                    message: '访问记录成功',
                    total_visits: row ? row.total_visits : 1
                });
            });
        });
    });
});

// API路由 - 获取访问统计
app.get('/api/stats/:page_name', (req, res) => {
    const { page_name } = req.params;
    
    db.get(`SELECT total_visits, last_updated FROM visit_stats WHERE page_name = ?`, 
        [page_name], (err, row) => {
        if (err) {
            console.error('查询统计错误:', err.message);
            return res.status(500).json({ error: '查询错误' });
        }
        
        res.json({
            page_name: page_name,
            total_visits: row ? row.total_visits : 0,
            last_updated: row ? row.last_updated : null
        });
    });
});

// API路由 - 获取所有页面统计
app.get('/api/stats', (req, res) => {
    db.all(`SELECT * FROM visit_stats ORDER BY total_visits DESC`, (err, rows) => {
        if (err) {
            console.error('查询所有统计错误:', err.message);
            return res.status(500).json({ error: '查询错误' });
        }
        
        res.json(rows);
    });
});

// API路由 - 获取访问记录
app.get('/api/visits/:page_name', (req, res) => {
    const { page_name } = req.params;
    const limit = parseInt(req.query.limit) || 100;
    
    db.all(`SELECT * FROM visits WHERE page_name = ? ORDER BY visit_time DESC LIMIT ?`, 
        [page_name, limit], (err, rows) => {
        if (err) {
            console.error('查询访问记录错误:', err.message);
            return res.status(500).json({ error: '查询错误' });
        }
        
        res.json(rows);
    });
});

// 静态文件路由
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// 启动服务器
app.listen(PORT, () => {
    console.log(`服务器运行在 http://localhost:${PORT}`);
});

// 优雅关闭数据库连接
process.on('SIGINT', () => {
    console.log('\n正在关闭数据库连接...');
    db.close((err) => {
        if (err) {
            console.error('关闭数据库错误:', err.message);
        } else {
            console.log('数据库连接已关闭');
        }
        process.exit(0);
    });
}); 