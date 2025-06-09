// 贡献图主色
const COLOR_DONE = '#40c463';   // 绿色
const COLOR_FAIL = '#d73a49';   // 红色
const COLOR_EMPTY = '#fff';     // 白色
const BORDER_COLOR = '#222';    // 边框色

// 解析任务数据
function parseTasks() {
    const items = Array.from(document.querySelectorAll('.markdown-embed-content .task-list-item'));
    const result = {};
    items.forEach(item => {
        const text = item.textContent;
        const dateMatch = text.match(/📅 (\d{4}-\d{2}-\d{2})/);
        if (!dateMatch) return;
        const date = dateMatch[1];
        if (text.includes('#failed')) {
            result[date] = 'fail';
        } else if (text.includes('#todo') && item.classList.contains('is-checked')) {
            result[date] = 'done';
        } else {
            result[date] = 'empty';
        }
    });
    return result;
}

// 生成日历二维数组
function buildCalendarGrid(tasks) {
    // 获取所有日期，找出本月
    const dates = Object.keys(tasks).sort();
    if (dates.length === 0) return [];
    const firstDate = new Date(dates[0]);
    const year = firstDate.getFullYear();
    const month = firstDate.getMonth();
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    // 计算本月1号是星期几
    const firstDay = new Date(year, month, 1).getDay(); // 0=周日
    const grid = [];
    let week = new Array(7).fill(null);

    // 填充前置空格
    for (let i = 0; i < firstDay; i++) week[i] = null;

    for (let d = 1; d <= daysInMonth; d++) {
        const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
        const status = tasks[dateStr] || 'empty';
        const dayOfWeek = new Date(year, month, d).getDay();
        week[dayOfWeek] = status;

        if (dayOfWeek === 6 || d === daysInMonth) {
            // 补齐本周
            for (let i = 0; i < 7; i++) {
                if (typeof week[i] === 'undefined') week[i] = null;
            }
            grid.push([...week]);
            week = new Array(7).fill(null);
        }
    }
    return grid;
}

// 渲染贡献图
function renderContributionCalendar() {
    removeContributionCalendar(); // 先移除旧的
    const tasks = parseTasks();
    const grid = buildCalendarGrid(tasks);
    if (grid.length === 0) {
        alert('未找到本月任务数据');
        return;
    }

    // 创建容器
    const container = document.createElement('div');
    container.id = 'contribution-calendar';
    container.style.display = 'inline-block';
    container.style.background = '#f6f8fa';
    container.style.padding = '10px';
    container.style.borderRadius = '6px';
    container.style.margin = '10px 0';

    // 渲染表格
    const table = document.createElement('table');
    table.style.borderCollapse = 'collapse';
    table.style.margin = '0 auto';

    grid.forEach(week => {
        const tr = document.createElement('tr');
        week.forEach(status => {
            const td = document.createElement('td');
            td.style.width = '18px';
            td.style.height = '18px';
            td.style.border = `1px solid ${BORDER_COLOR}`;
            td.style.background = status === 'done' ? COLOR_DONE :
                                  status === 'fail' ? COLOR_FAIL : COLOR_EMPTY;
            tr.appendChild(td);
        });
        table.appendChild(tr);
    });

    container.appendChild(table);
    // 插入到页面最前面
    document.querySelector('.markdown-embed-content').prepend(container);
}

// 移除贡献图
function removeContributionCalendar() {
    const old = document.getElementById('contribution-calendar');
    if (old) old.remove();
}

// 使用方法：
// renderContributionCalendar() 生成贡献图
// removeContributionCalendar() 移除贡献图
