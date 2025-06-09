function createMonthDayTable() {
    const months = 12;
    const maxDays = 31;
    let html = '<table style="border-collapse: collapse; margin: 20px 0;">';
    
    // 创建表头
    html += '<tr><th style="border: 1px solid #ccc; padding: 8px;">月份</th>';
    for (let day = 1; day <= maxDays; day++) {
        html += `<th style="border: 1px solid #ccc; padding: 8px;">${day}</th>`;
    }
    html += '</tr>';
    
    // 创建表格内容
    const daysInMonth = [31, 29, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
    
    for (let month = 1; month <= months; month++) {
        html += '<tr>';
        html += `<td style="border: 1px solid #ccc; padding: 8px;">${month}月</td>`;
        
        for (let day = 1; day <= maxDays; day++) {
            const isLastDay = day === daysInMonth[month - 1];
            const bgColor = isLastDay ? '#ffcccc' : '#ccffcc';
            html += `<td style="border: 1px solid #ccc; padding: 8px; background-color: ${bgColor};"></td>`;
        }
        html += '</tr>';
    }
    
    html += '</table>';
    return html;
}

// 在控制台中使用
console.log(createMonthDayTable());