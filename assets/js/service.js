// 讀取 workflow_description
const workflowDataArrayService = JSON.parse(localStorage.getItem('workflow_description'));

// 從 URL 獲取服務名稱
const urlParams = new URLSearchParams(window.location.search);
const serviceName = urlParams.get('service');

// 找到對應的服務索引
const serviceIndex = workflowDataArrayService.findIndex(w => w.服務名稱 === serviceName);
const currentIndex = serviceIndex !== -1 ? serviceIndex : 0;

// 找到對應的服務
const workflow = workflowDataArrayService[currentIndex];
const steps = Object.entries(workflow.服務說明).map(([key, items]) => ({
  title: key,
  items: items
}));

const workflowStepsDiv = document.getElementById('workflow-steps');
workflowStepsDiv.innerHTML = '';
// workflowStepsDiv.style.padding = '0 24px'; // Commented out as per original code

steps.forEach((step, idx) => {
  const row = document.createElement('div');
  row.className = 'workflow-row';
  row.style.display = 'flex';
  row.style.alignItems = 'flex-start';
  row.style.padding = '20px 0';
  row.style.borderBottom = idx < steps.length - 1 ? '1px solid #aaa' : 'none';
  // row.style.gap = '48px'; // Removed: Let CSS handle the gap
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
#workflow .section-heading {
  letter-spacing: 0.1em;
}
.workflow-tab.active {
  text-decoration: underline;
  text-underline-offset: 4px;
}

/* Animation styles */
.workflow-row {
  opacity: 0;
  transform: translateY(20px);
  transition: opacity 0.5s ease, transform 0.5s ease;
}

.workflow-row.visible {
  opacity: 1;
  transform: translateY(0);
}

.workflow-tab {
  transition: all 0.3s ease;
}

.workflow-tab:hover {
  opacity: 0.8;
}

#workflow-steps {
  opacity: 0;
  transition: opacity 0.5s ease;
}

#workflow-steps.visible {
  opacity: 1;
}

/* Base gap for very large screens */
.workflow-row {
  gap: 120px; /* Increased gap for very large screens */
}

.workflow-step-desc ul li {
  padding-left: 25% !important;
}

@media (max-width: 1400px) {
  .workflow-row {
    gap: 90px; /* Generous gap for large screens */
  }
}

@media (max-width: 1200px) {
  .workflow-row {
    gap: 70px; /* Substantial gap for medium-large screens */
  }
}

@media (max-width: 991.98px) {
  .workflow-title {
    justify-content: center !important;
    flex-wrap: nowrap !important;
    gap: 8px !important;
  }
  .workflow-tab {
    font-size: 0.8em !important;
    padding: 4px 8px !important;
  }
  #workflow-steps {
    padding: 0 0 !important;
  }
  .row.align-items-center {
    margin-top: 1vh;
  }
  .workflow-row {
    gap: 40px; /* Reduced gap for smaller medium screens */
  }
  .workflow-step-title {
    flex: 0 0 280px !important; /* Adjust flex basis if needed */
  }
}

@media (max-width: 768px) {
  .workflow-title {
    justify-content: center !important;
    flex-wrap: nowrap !important;
    gap: 4px !important;
    display: none !important; /* Hide tabs on mobile */
  }
  .workflow-select-wrapper {
    display: flex !important;
    justify-content: flex-end !important;
  }
  .workflow-tab {
    font-size: 0.9em !important;
    padding: 4px 6px !important;
  }
  .workflow-row {
    flex-direction: column !important;
    gap: 16px !important;
    padding: 16px 0 !important;
  }
  .workflow-step-title {
    padding-left: 0 !important;
    text-align: left !important;
    font-size: 1em !important;
    margin-bottom: 8px;
    flex: 1 1 100% !important;
  }
  .workflow-step-desc {
    padding-right: 0 !important;
    padding-top: 0 !important;
    font-size: 0.9em !important;
    justify-content: flex-start !important;
    flex: 1 1 100% !important;
  }
  .workflow-step-desc ul {
    align-items: flex-start !important;
  }
  .workflow-step-desc ul li {
    font-size: 0.9em !important;
    padding-left: 50px !important;
  }
  #workflow-steps {
    padding: 0 0px !important;
  }
  .fee-box {
    padding: 0 16px !important;
  }
  .fee-box li {
    flex-direction: column !important;
    align-items: flex-start !important;
    gap: 8px !important;
    padding: 16px 0 !important;
  }
  .fee-box li span:first-child {
    flex: 1 1 100% !important;
    font-size: 0.9em !important;
    line-height: 1.8 !important;
    padding-left: 0 !important;
  }
  .fee-box li span:nth-child(2) {
    display: none !important;
  }
  .fee-note {
    font-size: 0.8em !important;
    color: #aaa !important;
  }
  .row.align-items-center {
    margin-top: 12vh;
  }
}

@media (max-width: 600px) {
  .workflow-title {
    gap: 2px !important;
  }
  .workflow-tab {
    font-size: 0.85em !important;
    padding: 4px 4px !important;
    letter-spacing: 0.05em !important;
  }
  .workflow-row {
    padding: 12px 0 !important;
  }
  .workflow-step-title {
    font-size: 1em !important;
  }
  .workflow-step-desc {
    font-size: 0.9em !important;
  }
  .workflow-step-desc ul li {
    font-size: 0.9em !important;
    margin-bottom: 6px !important;
  }
  #workflow-steps {
    padding: 0 0px !important;
  }
  .fee-box {
    padding: 0 16px !important;
  }
  .fee-box li {
    padding: 12px 0 !important;
  }
  .fee-box li span {
    font-size: 0.8em !important;
    line-height: 1.8 !important;
  }
  .fee-note {
    font-size: 0.4em !important;
    color: #aaa !important;
  }
  .row.align-items-center {
    margin-top: 15vh;
  }
}
`;
document.head.appendChild(style);

// Service Fee Box
const feeBox = document.getElementById('fee-box');
feeBox.innerHTML = '';
const ul = document.createElement('ul');
ul.style.listStyle = 'none';
ul.style.padding = '0';
ul.style.margin = '0';

workflowDataArrayService.forEach((row, idx) => {
  const li = document.createElement('li');
  li.style.display = 'flex';
  li.style.alignItems = 'center';
  li.style.justifyContent = 'space-between';
  li.style.padding = '18px 0';
  li.style.borderBottom = idx < workflowDataArrayService.length - 1 ? '1px solid #666' : 'none';
  li.style.fontSize = '1.1em';
  li.style.color = '#fff';

  const left = document.createElement('span');
  left.textContent = '・' + row.服務名稱;
  left.setAttribute('lang', 'zh-TW');
  left.style.flex = '0 0 200px';
  left.style.textAlign = 'left';
  left.style.paddingLeft = '50px';
  left.style.letterSpacing = '0.05em';

  const divider = document.createElement('span');
  divider.textContent = '|';
  divider.style.margin = '0 24px';
  divider.style.color = '#aaa';
  divider.style.fontWeight = '300';

  const right = document.createElement('span');
  right.textContent = row.費用說明;
  right.setAttribute('lang', 'zh-TW');
  right.style.flex = '1 1 0';
  right.style.textAlign = 'left';
  right.style.paddingLeft = '5%';
  right.style.letterSpacing = '0.05em';
  right.style.fontSize = '1em';
  right.style.lineHeight = '1.8';

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

workflowDataArrayService.forEach((item, idx) => {
  const tab = document.createElement('div');
  tab.textContent = item['服務名稱'];
  tab.setAttribute('lang', 'zh-TW');
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

// 新增：動態產生 workflow-select
const workflowSelectWrapper = document.querySelector('.workflow-select-wrapper');
if (workflowSelectWrapper) {
  const select = document.createElement('select');
  select.id = 'service-select';
  select.className = 'service-select-button';
  select.onchange = function () {
    showWorkflow(parseInt(this.value)); // 確保是數字
  };
  select.lang = 'zh-TW';

  workflowDataArrayService.forEach((item, idx) => {
    const option = document.createElement('option');
    option.value = idx;
    option.textContent = item['服務名稱'];
    option.lang = 'zh-TW';
    if (idx === currentIndex) {
      option.selected = true;
    }
    select.appendChild(option);
  });
  workflowSelectWrapper.appendChild(select);
  
  // 初始化 select2
  $(document).ready(function () {
    $('#service-select').select2({
      theme: 'bootstrap-5',
      minimumResultsForSearch: Infinity,
      width: '180px'
    });
  });
}

// 新增：在選單/tab 下方加一條分隔線
if (!document.getElementById('workflow-title-divider')) {
  const divider = document.createElement('div');
  divider.id = 'workflow-title-divider';
  divider.style.width = '100%';
  divider.style.height = '1px';
  divider.style.background = '#aaa';
  workflowStepsDiv.parentNode.insertBefore(divider, workflowStepsDiv);
}

// 渲染對應服務內容
function showWorkflow(idx) {
  // tab 樣式切換
  document.querySelectorAll('.workflow-tab').forEach((el, i) => {
    el.style.borderBottom = i === parseInt(idx) ? '2px solid #fff' : '2px solid transparent';
  });

  // 更新 select dropdown 的值
  const select = document.getElementById('service-select');
  if (select && select.value !== idx) {
    select.value = idx;
  }

  // 清空流程內容
  workflowStepsDiv.innerHTML = '';
  workflowStepsDiv.classList.remove('visible');
  
  const data = workflowDataArrayService[idx];
  const desc = data['服務說明'];
  
  // 使用 Promise 來處理動畫序列
  const createRows = async () => {
    const rows = [];
    Object.keys(desc).forEach((key, i) => {
      if (key.startsWith('費用')) return;
      const row = document.createElement('div');
      row.className = 'workflow-row';
      row.style.display = 'flex';
      row.style.alignItems = 'flex-start';
      row.style.padding = '20px 0';
      row.style.width = '100%';
      row.style.borderBottom = '1px solid #aaa';

      const left = document.createElement('div');
      left.className = 'workflow-step-title';
      left.setAttribute('lang', 'zh-TW');
      left.style.flex = '0 0 230px';
      left.style.fontSize = '1.2em';
      left.style.fontWeight = '500';
      left.style.letterSpacing = '0.12em';
      left.style.textAlign = 'left';
      left.style.paddingLeft = '40px';
      left.style.lineHeight = '1.7';
      left.textContent = `${(i + 1).toString().padStart(2, '0')}.${key}`;

      const right = document.createElement('div');
      right.className = 'workflow-step-desc';
      right.setAttribute('lang', 'zh-TW');
      right.style.flex = '1 1 0';
      right.style.fontSize = '1em';
      right.style.color = '#fff';
      right.style.textAlign = 'left';
      right.style.paddingTop = '40px';
      right.style.paddingRight = '0px';
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
      ul.style.margin = '0';
      ul.style.padding = '0';
      ul.style.lineHeight = '1.8';

      (desc[key] || []).forEach(item => {
        const li = document.createElement('li');
        if (window.innerWidth > 768) {
          li.innerHTML = item.replace(/\\n|\n/g, '<br>');
        } else {
          li.textContent = item.replace(/\\n|\n/g, '');
        }
        li.setAttribute('lang', 'zh-TW');
        li.style.marginBottom = '8px';
        li.style.listStyleType = 'none';
        li.style.textIndent = '-1.5em';
        ul.appendChild(li);
      });

      inner.appendChild(ul);
      right.appendChild(inner);

      row.appendChild(left);
      row.appendChild(right);
      rows.push(row);
    });

    // 先添加所有行但保持隱藏
    rows.forEach(row => {
      workflowStepsDiv.appendChild(row);
    });

    // 顯示容器
    workflowStepsDiv.classList.add('visible');

    // 依次顯示每一行
    for (let i = 0; i < rows.length; i++) {
      await new Promise(resolve => {
        setTimeout(() => {
          rows[i].classList.add('visible');
          resolve();
        }, 100); // 每行延遲 100ms
      });
    }
  };

  createRows();
}

// 初始化顯示當前服務的內容
showWorkflow(currentIndex);