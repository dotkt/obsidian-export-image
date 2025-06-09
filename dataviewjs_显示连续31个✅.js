// 创建一个包含31个✅的字符串
const checkmarks = "✅".repeat(31);

// 创建容器元素
const container = dv.el("div", "", {cls: "checkmark-container"});

// 设置样式
container.style.cssText = `
    font-size: 1.2em;
    line-height: 1.5;
    padding: 10px;
    background-color: #f6f8fa;
    border-radius: 6px;
    margin: 10px 0;
`;

// 显示✅符号
container.textContent = checkmarks; 