import re

# 读取文件
with open('test.html', 'r', encoding='utf-8') as f:
    content = f.read()

# 替换所有剩余的 scale-labels 结构
pattern = r'<div class="scale-labels">\s*<span>不同意</span>\s*<span>同意</span>\s*</div>'
replacement = '<div class="scale-label-left">不同意</div>'

content = re.sub(pattern, replacement, content)

# 为每个 scale-options 结尾添加右侧标签
pattern = r'(</div>\s*</div>\s*</div>\s*<div class="question">)'
replacement = r'</div>\n                        <div class="scale-label-right">同意</div>\n                    </div>\n                </div>\n\n                <div class="question">'

content = re.sub(pattern, replacement, content)

# 处理最后一个问题（没有下一个question）
pattern = r'(</div>\s*</div>\s*</div>\s*<div class="submit-section">)'
replacement = r'</div>\n                        <div class="scale-label-right">同意</div>\n                    </div>\n                </div>\n\n            <div class="submit-section">'

content = re.sub(pattern, replacement, content)

# 写回文件
with open('test.html', 'w', encoding='utf-8') as f:
    f.write(content)

print("标签结构修复完成")
