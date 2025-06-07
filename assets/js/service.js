// 讀取 workflow_description
const workflowDataArray = JSON.parse(localStorage.getItem('workflow_description'));

// 從 URL 獲取服務名稱
const urlParams = new URLSearchParams(window.location.search);
const serviceName = urlParams.get('service');

// 找到對應的服務索引
const serviceIndex = workflowDataArray.findIndex(w => w.服務名稱 === serviceName);
const currentIndex = serviceIndex !== -1 ? serviceIndex : 0;

// 找到對應的服務
const workflow = workflowDataArray[currentIndex];
const steps = Object.entries(workflow.服務說明).map(([key, items]) => ({
    title: key,
    items: items
}));

const workflowStepsDiv = document.getElementById('workflow-steps');
workflowStepsDiv.innerHTML = '';
steps.forEach((step, idx) => {
    const row = document.createElement('div');
    row.className = 'workflow-row';
    row.style.display = 'flex';
    row.style.alignItems = 'flex-start';
    row.style.padding = '20px 0';
    row.style.borderBottom = idx < steps.length - 1 ? '1px solid #aaa' : 'none';
    row.style.gap = '48px';
    row.style.width = '100%';

    const left = document.createElement('div');
    left.className = 'workflow-step-title';
    left.style.flex = '0 0 340px';
    left.style.fontSize = '1em';
    left.style.fontWeight = '500';
    left.style.letterSpacing = '0.12em';
    left.style.textAlign = 'left';
    left.style.paddingLeft = '40px';
    left.style.lineHeight = '1.7';
    left.textContent = step.title;

    const right = document.createElement('div');
    right.className = 'workflow-step-desc';
    right.style.flex = '1 1 0';
    right.style.fontSize = '1em';
    right.style.color = '#fff';
    right.style.textAlign = 'left';
    right.style.paddingRight = '40px';
    right.style.display = 'flex';
    right.style.justifyContent = 'flex-end';

    const inner = document.createElement('div');
    inner.style.maxWidth = '500px';
    inner.style.textAlign = 'left';
    inner.style.width = '100%';

    const ul = document.createElement('ul');
    ul.style.display = 'flex';
    ul.style.flexDirection = 'column';
    ul.style.alignItems = 'flex-start';
    ul.style.listStyle = 'disc inside';
    ul.style.margin = '0';
    ul.style.padding = '0';
    ul.style.lineHeight = '1.8';

    step.items.forEach(item => {
        const li = document.createElement('li');
        li.textContent = item;
        li.style.marginBottom = '8px';
        ul.appendChild(li);
    });

    inner.appendChild(ul);
    right.appendChild(inner);

    row.appendChild(left);
    row.appendChild(right);
    workflowStepsDiv.appendChild(row);
});

// RWD: 600px 以下左右變上下
const style = document.createElement('style');
style.textContent = `
@media (max-width: 600px) {
  .workflow-row { flex-direction: column !important; gap: 0 !important; padding: 12px 0 !important; }
  .workflow-step-title { padding-left: 0 !important; text-align: left !important; font-size: 1em !important; margin-bottom: 16px; }
  .workflow-step-desc { padding-right: 0 !important; font-size: 1em !important; justify-content: flex-start !important; }
  .workflow-step-desc ul { align-items: flex-start !important; }
}`;
document.head.appendChild(style);

// Service Fee Box
const feeBox = document.getElementById('fee-box');
feeBox.innerHTML = '';
const feeRows = [
    {
        title: '預售屋客變',
        value: '$2500 / 坪 優惠費用 $2000 / 坪 60%訂金 40%尾款'
    },
    {
        title: '新成屋裝修',
        value: '$5000 / 坪 優惠費用 $4000 / 坪 80%訂金 20%尾款/ 監工費 10%'
    },
    {
        title: '老屋舊翻新',
        value: '$5000 / 坪 優惠費用 $4000 / 坪 80%訂金 20%尾款/ 監工費 10%'
    },
    {
        title: '商業空間',
        value: '視個案需求，坪數大小而定，將以專案另計'
    },
];
const ul = document.createElement('ul');
ul.style.listStyle = 'none';
ul.style.padding = '0';
ul.style.margin = '0';
feeRows.forEach((row, idx) => {
    const li = document.createElement('li');
    li.style.display = 'flex';
    li.style.alignItems = 'center';
    li.style.justifyContent = 'space-between';
    li.style.padding = '18px 0';
    li.style.borderBottom = idx < feeRows.length - 1 ? '1px solid #666' : 'none';
    li.style.fontSize = '1.1em';
    li.style.color = '#fff';

    const left = document.createElement('span');
    left.textContent = '・' + row.title;
    left.style.flex = '0 0 220px';
    left.style.textAlign = 'left';
    left.style.letterSpacing = '0.05em';

    const divider = document.createElement('span');
    divider.textContent = '|';
    divider.style.margin = '0 24px';
    divider.style.color = '#aaa';
    divider.style.fontWeight = '300';

    const right = document.createElement('span');
    right.textContent = row.value;
    right.style.flex = '1 1 0';
    right.style.textAlign = 'left';
    right.style.letterSpacing = '0.05em';

    li.appendChild(left);
    li.appendChild(divider);
    li.appendChild(right);
    ul.appendChild(li);
});
feeBox.appendChild(ul);

// 動態產生 workflow-title 服務名稱 tab
const workflowTitleDiv = document.querySelector('.workflow-title');
workflowTitleDiv.innerHTML = '';
workflowTitleDiv.style.display = 'flex';
workflowTitleDiv.style.justifyContent = 'flex-end';
workflowTitleDiv.style.gap = '32px';
workflowTitleDiv.style.marginBottom = '40px';

// 新增：在 workflow-title 下方加一條分隔線
if (!document.getElementById('workflow-title-divider')) {
    const divider = document.createElement('div');
    divider.id = 'workflow-title-divider';
    divider.style.width = '100%';
    divider.style.height = '1px';
    divider.style.background = '#aaa';
    divider.style.margin = '0 0 24px 0';
    workflowTitleDiv.parentNode.insertBefore(divider, workflowTitleDiv.nextSibling);
}

workflowDataArray.forEach((item, idx) => {
    const tab = document.createElement('div');
    tab.textContent = item['服務名稱'];
    tab.style.cursor = 'pointer';
    tab.style.fontWeight = 'bold';
    tab.style.fontSize = '1.1em';
    tab.style.letterSpacing = '0.15em';
    tab.style.padding = '4px 16px';
    tab.style.borderBottom = idx === currentIndex ? '2px solid #fff' : '2px solid transparent';
    tab.style.transition = 'border 0.2s';
    tab.onclick = () => showWorkflow(idx);
    tab.className = 'workflow-tab';
    workflowTitleDiv.appendChild(tab);
});

// 渲染對應服務內容
function showWorkflow(idx) {
    // tab 樣式切換
    document.querySelectorAll('.workflow-tab').forEach((el, i) => {
        el.style.borderBottom = i === idx ? '2px solid #fff' : '2px solid transparent';
    });
    // 清空流程內容
    workflowStepsDiv.innerHTML = '';
    const data = workflowDataArray[idx];
    const desc = data['服務說明'];
    Object.keys(desc).forEach((key, i) => {
        if (key.startsWith('費用')) return; // 不顯示費用
        const row = document.createElement('div');
        row.className = 'workflow-row';
        row.style.display = 'flex';
        row.style.alignItems = 'flex-start';
        row.style.padding = '20px 0';
        row.style.gap = '48px';
        row.style.width = '100%';
        // 只給中間和最後一個步驟底線，第一個步驟不加
        row.style.borderBottom = '1px solid #aaa';

        const left = document.createElement('div');
        left.className = 'workflow-step-title';
        left.style.flex = '0 0 340px';
        left.style.fontSize = '1em';
        left.style.fontWeight = '500';
        left.style.letterSpacing = '0.12em';
        left.style.textAlign = 'left';
        left.style.paddingLeft = '40px';
        left.style.lineHeight = '1.7';
        left.textContent = `${(i+1).toString().padStart(2,'0')}.${key}`;

        const right = document.createElement('div');
        right.className = 'workflow-step-desc';
        right.style.flex = '1 1 0';
        right.style.fontSize = '1em';
        right.style.color = '#fff';
        right.style.textAlign = 'left';
        right.style.paddingRight = '40px';
        right.style.display = 'flex';
        right.style.justifyContent = 'flex-end';

        const inner = document.createElement('div');
        inner.style.maxWidth = '500px';
        inner.style.textAlign = 'left';
        inner.style.width = '100%';

        const ul = document.createElement('ul');
        ul.style.display = 'flex';
        ul.style.flexDirection = 'column';
        ul.style.alignItems = 'flex-start';
        ul.style.listStyle = 'disc inside';
        ul.style.margin = '0';
        ul.style.padding = '0';
        ul.style.lineHeight = '1.8';

        // 新版，直接處理陣列
        (desc[key] || []).forEach(item => {
            const li = document.createElement('li');
            li.textContent = item;
            li.style.marginBottom = '8px';
            ul.appendChild(li);
        });

        inner.appendChild(ul);
        right.appendChild(inner);
        row.appendChild(left);
        row.appendChild(right);
        workflowStepsDiv.appendChild(row);
    });
}

// 初始化顯示當前服務的內容
showWorkflow(currentIndex);