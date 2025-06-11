// ===== 可调节的参数 =====
async function renderCalendar({dv, filePath, title = ''}) {
    // 你可以把前面那段完整的渲染代码粘贴到这里
    // 只需把所有的 let/const STYLE = ... 换成 style = style || 默认值
    // 把 filePath, year 作为参数传进来
    // dv 也作为参数传进来
    // 代码主体略，见下方说明

// ====== 你可以在这里设置年份 ======
let year = window.moment().year(); // 默认当前年份
// year = 2025; // 取消注释并修改为你想要的年份

// ===== 读取并解析任务数据 =====
//const filePath = "每日任务/早睡早起早上6点起床.md";

const STYLE = {
    container: {
        fontSize: '16px',         // 原10px，整体放大
        padding: '8px',           // 原4px
        margin: '10px 0',         // 原5px 0
        backgroundColor: '#f6f8fa',
        borderRadius: '8px',      // 原4px
    },
    title: {
        fontSize: '16px',
        fontWeight: 'bold',
        marginBottom: '8px',
        textAlign: 'center',
        color: '#333',
    },
    rowLabel: {
        fontSize: '13px',         // 原8px
        color: '#888',
        width: '24px',            // 原16px
        textAlign: 'right',
        paddingRight: '8px',      // 原4px
        userSelect: 'none',
        flex: 'none',
    },
    numbers: {
        fontSize: '12px',         // 原8px
        color: '#666',
        marginBottom: '3px',      // 原1px
        padding: '0',
    },
    checkmarks: {
        fontSize: '18px',         // 原10px
        padding: '0',
    },
    cell: {
        width: '22px',            // 原14px
        height: '22px',           // 原14px
    }
};

console.log("【DEBUG】尝试读取文件路径：", filePath);

let file = dv.page(filePath);
let lines = [];
if (file && file.file && file.file.content) {
    lines = file.file.content.split('\n');
    console.log("【DEBUG】通过file.file.content读取到内容，行数：", lines.length);
} else if (file && file.content) {
    lines = file.content.split('\n');
    console.log("【DEBUG】通过file.content读取到内容，行数：", lines.length);
} else {
    // 兼容不同dataview版本
    let raw = await dv.io.load(filePath);
    if (raw) {
        lines = raw.split('\n');
        console.log("【DEBUG】通过dv.io.load读取到内容，行数：", lines.length);
    } else {
        console.log("【DEBUG】未能读取到文件内容！");
    }
}
console.log("【DEBUG】前5行内容：", lines.slice(0, 5));

// 解析每一行，提取日期和状态，只保留指定年份
let dateStatus = {}; // { 'YYYY-MM-DD': 'done' | 'failed' }
const today = window.moment().format('YYYY-MM-DD');
for (let line of lines) {
    // 新正则，适配你的数据格式
    let match = line.match(/#(todo|failed).*?📅 (\d{4}-\d{2}-\d{2})/);
    if (!match) continue;
    let status = match[1] === 'todo' ? 'done' : 'failed';
    let date = match[2];
    if (date.startsWith(year + '-')) {
        dateStatus[date] = status;
        // console.log(`【DEBUG】解析到：${date} 状态：${status}`);
    }
}
// console.log("【DEBUG】最终解析到的dateStatus对象：", dateStatus);

// ===== 生成日历矩阵 =====
const container = dv.el("div", "", {cls: "checkmark-calendar-matrix"});
container.style.cssText = `
    font-size: ${STYLE.container.fontSize};
    line-height: 1;
    padding: ${STYLE.container.padding};
    background-color: ${STYLE.container.backgroundColor};
    border-radius: ${STYLE.container.borderRadius};
    margin: ${STYLE.container.margin};
    text-align: left;
    display: inline-block;
`;

// ===== 创建标题栏 =====
if (title) {
    const titleDiv = dv.el("div", title, {cls: "calendar-title"});
    titleDiv.style.cssText = `
        font-size: ${STYLE.title.fontSize};
        font-weight: ${STYLE.title.fontWeight};
        margin-bottom: ${STYLE.title.marginBottom};
        text-align: ${STYLE.title.textAlign};
        color: ${STYLE.title.color};
    `;
    container.appendChild(titleDiv);
}

// ===== 创建数字行 =====
const numbersRow = dv.el("div", "", {cls: "numbers-row"});
numbersRow.style.cssText = `
    display: flex;
    align-items: center;
    margin-bottom: ${STYLE.numbers.marginBottom};
`;
// 左上角空格
const emptyLabel = dv.el("span", "", {});
emptyLabel.style.cssText = `
    width: ${STYLE.rowLabel.width};
    padding-right: ${STYLE.rowLabel.paddingRight};
    flex: none;
`;
numbersRow.appendChild(emptyLabel);
// 1-31数字
for (let i = 1; i <= 31; i++) {
    const num = dv.el("span", i.toString(), {cls: "number"});
    num.style.cssText = `
        width: ${STYLE.cell.width};
        height: ${STYLE.cell.height};
        text-align: center;
        font-size: ${STYLE.numbers.fontSize};
        color: ${STYLE.numbers.color};
        display: inline-block;
        margin: 0;
        padding: 0;
        flex: none;
    `;
    numbersRow.appendChild(num);
}
container.appendChild(numbersRow);

// ===== 创建12行内容 =====
container.appendChild(numbersRow);

// ===== 创建12行内容 =====
const currentMonth = window.moment().month() + 1; // 获取当前月份（1-12）
for (let month = 1; month <= currentMonth; month++) {
    const daysInMonth = window.moment([year, month - 1]).daysInMonth();
    const rowDiv = dv.el("div", "", {cls: "calendar-row"});
    rowDiv.style.cssText = `
        display: flex;
        align-items: center;
        margin-bottom: 0;
    `;
    // 行号
    const rowLabel = dv.el("span", month.toString(), {cls: "row-label"});
    rowLabel.style.cssText = `
        font-size: ${STYLE.rowLabel.fontSize};
        color: ${STYLE.rowLabel.color};
        width: ${STYLE.rowLabel.width};
        text-align: ${STYLE.rowLabel.textAlign};
        padding-right: ${STYLE.rowLabel.paddingRight};
        user-select: ${STYLE.rowLabel.userSelect};
        display: inline-block;
        flex: none;
    `;
    rowDiv.appendChild(rowLabel);
    // 31个格子
    for (let day = 1; day <= 31; day++) {
        let dateStr = `${year}-${String(month).padStart(2,'0')}-${String(day).padStart(2,'0')}`;
        let char = '';
        let bg = '#fff';
        if (day > daysInMonth) {
            char = '';
            bg = 'transparent';
        } else if (window.moment(dateStr).isAfter(today)) {
            char = '';
            bg = '#fff';
        } else if (dateStatus[dateStr] === 'done') {
            char = '✅';
            bg = '#fff';
        } else if (dateStatus[dateStr] === 'failed') {
            char = '❌';
            bg = '#fff';
        } else {
            char = '';
            bg = '#fff';
        }
        const check = dv.el("span", char, {cls: "checkmark"});
        check.style.cssText = `
            width: ${STYLE.cell.width};
            height: ${STYLE.cell.height};
            text-align: center;
            font-size: ${STYLE.checkmarks.fontSize};
            display: inline-block;
            margin: 0;
            padding: 0;
            flex: none;
            background: ${bg};
        `;
        rowDiv.appendChild(check);
    }
    container.appendChild(rowDiv);
}
}

// 关键：挂到 window 上，供外部调用
window.renderCalendar = renderCalendar;
