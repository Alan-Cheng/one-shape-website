// 初始化作品集
window.onPortfolioLoaded = function(data) {
  // 只取前三個作品
  const firstThreeProjects = data.slice(0, 3);
  build_portfolio(firstThreeProjects, "home");
};

// 如果資料已經載入，直接顯示前三個
if (window.portfolioData) {
  const firstThreeProjects = window.portfolioData.slice(0, 3);
  build_portfolio(firstThreeProjects, "home");
}

// // 從 localStorage 中取出 savedVariable 的並剖析為 JavaScript 物件
// let jsonDataArray = JSON.parse(localStorage.getItem('portfolio_description'));
const workflowDataArray = JSON.parse(localStorage.getItem('workflow_description'));

function splitTextWithPunctuation(text) {
  const punctuations = ['，', '。', '！', '？', '：', '；', '♡', '.', ';'];
  let result = '';
  let currentLine = '';

  for (let i = 0; i < text.length; i++) {
      currentLine += text[i];
      if (punctuations.includes(text[i])) {
          result += currentLine + '\n';
          currentLine = '';
      }
  }

  if (currentLine !== '') {
      result += currentLine + '\n';
  }

  return result;
}

function build_portfolio(jsonDataArray, page){
  var result = [];
  var result_indexs = [];
  if(page == "home"){
    var temp = jsonDataArray.slice();
    var last_category = [];
    var last_category_indexs = [];
    temp.forEach((jsonData, index) => {
      if(jsonData.種類 == '概念/3D'){
        last_category.push(jsonData);
        last_category_indexs.push(index);
      }
      else{
        result.push(jsonData);
        result_indexs.push(index);
      }
    });
    result = result.concat(last_category);
    result_indexs = result_indexs.concat(last_category_indexs);
  }
  else{
    var sortOrder = ['概念/3D', '專案工程'];

    // 分類數據
    var residentialAndCommercial = jsonDataArray.filter(item => item.種類 === '住宅空間' || item.種類 === '商業空間');
    var others = jsonDataArray.filter(item => item.種類 !== '住宅空間' && item.種類 !== '商業空間');

    // 按指定順序排序其他類別
    others.sort((a, b) => sortOrder.indexOf(a.種類) - sortOrder.indexOf(b.種類));

    // 合併回去，確保 '住宅空間' 和 '商業空間' 保持原來順序
    var sortedArray = [...residentialAndCommercial, ...others];

    // 反转排序后的数组
    var temp = sortedArray.slice();

    // 移除現有的項目並重新構建內容
    var container = document.querySelector('.portfolio-container');
    var items = container.querySelectorAll('.col-md-4.portfolio-item');
    items.forEach(function(item) {
      item.remove();
    });
    result = temp;
    // 在 portfolio 頁面使用順序索引，而不是原始數組索引
    result_indexs = temp.map((item, index) => index);
  }

  // 請注意：此處已移除動態添加 <style> 標籤的程式碼，
  // 假定您已將相關 CSS 規則移至外部 CSS 檔案（如 style.css）。
  // 如果您尚未這麼做，請參閱我上一個回答中的「步驟三」。

  result.forEach((jsonData, index) => {
    const col = document.createElement('div');
    col.className = 'col-md-4 portfolio-item';
    col.style.marginBottom = '30px';
    col.style.transition = 'all 0.5s cubic-bezier(0.4, 0, 0.2, 1)';
    col.style.borderTopLeftRadius = '4px';
    col.style.borderTopRightRadius = '4px';
    col.style.overflow = 'hidden';
    col.style.cursor = 'pointer';
    col.setAttribute('data-toggle', 'modal');
    col.setAttribute('data-target', `#p${result_indexs[index] + 1}`);
    // 加入動畫效果
    col.style.opacity = '0';
    col.style.transform = 'translateY(20px)';

    // 檢查螢幕寬度並調整大小
    if (window.innerWidth <= 767) {
      col.style.maxWidth = '100%';
      // col.style.margin = '0 auto 20px auto';
      // col.style.padding = '0 10px';
    }

    const link = document.createElement('a');
    link.className = 'portfolio-link';
    link.style.textDecoration = 'none';
    link.style.display = 'block';
    link.style.overflow = 'hidden';
    link.style.borderTopLeftRadius = '4px';
    link.style.borderTopRightRadius = '4px';

    const hover = document.createElement('div');
    hover.className = 'portfolio-hover';
    hover.style.backgroundColor = 'rgba(0, 0, 0, 0.5)';
    hover.style.opacity = '0';
    hover.style.transition = 'opacity 0.3s ease';
    col.onmouseover = function() {
      hover.style.opacity = '1';
      this.style.transform = 'translateY(-5px)';
    };
    col.onmouseout = function() {
      hover.style.opacity = '0';
      this.style.transform = 'translateY(0)';
    };

    const hoverContent = document.createElement('div');
    hoverContent.className = 'portfolio-hover-content';
    hoverContent.style.color = 'white';
    hoverContent.style.fontSize = '1.2em';
    hoverContent.style.letterSpacing = '0.1em';

    hover.appendChild(hoverContent);

    const image = document.createElement('img');
    image.className = 'img-fluid';
    image.setAttribute('src', jsonData.圖片連結 + `1.webp`);
    image.setAttribute('alt', '');
    image.style.aspectRatio = '5/3';
    image.style.width = '100%';
    image.style.height = 'auto';
    image.style.objectFit = 'cover';
    image.style.transition = 'transform 0.3s ease';
    col.onmouseover = function() {
      image.style.transform = 'scale(1.05)';
      hover.style.opacity = '1';
      this.style.transform = 'translateY(-5px)';
    };
    col.onmouseout = function() {
      image.style.transform = 'scale(1)';
      hover.style.opacity = '0';
      this.style.transform = 'translateY(0)';
    };

    // 移動端樣式調整
    if (window.innerWidth <= 767) {
      image.style.aspectRatio = '4/3';
    }

    link.appendChild(hover);
    link.appendChild(image);

    const caption = document.createElement('div');
    caption.className = 'portfolio-caption';
    caption.style.backgroundColor = 'rgb(63,62,63)';
    caption.style.height = '40px';
    caption.style.display = 'flex';
    caption.style.alignItems = 'center';
    caption.style.justifyContent = 'flex-start';
    caption.style.paddingLeft = '20px';
    caption.style.borderBottomLeftRadius = '4px';
    caption.style.borderBottomRightRadius = '4px';
    caption.style.transition = 'background-color 0.3s ease';

    // 移動端樣式調整
    if (window.innerWidth <= 767) {
      caption.style.height = '45px';
      caption.style.paddingLeft = '15px';
    }

    const title = document.createElement('a');
    title.innerText = jsonData.專案名;
    title.style.letterSpacing = '0.2em';
    title.style.color = 'white';
    title.style.textDecoration = 'none';
    title.style.transition = 'color 0.3s ease';

    // 移動端樣式調整
    if (window.innerWidth <= 767) {
      title.style.fontSize = '0.9em';
    }

    caption.appendChild(title);

    col.appendChild(link);
    col.appendChild(caption);

    const portfolioContainer = document.querySelector('.portfolio-container');
    portfolioContainer.appendChild(col);

    // 觸發動畫
    requestAnimationFrame(() => {
      setTimeout(() => {
        col.style.opacity = '1';
        col.style.transform = 'translateY(0)';
      }, 50 + index * 80);
    });
  });

  result.forEach((jsonData, index) => {
    const image_item = [];
      for(let i = 0; i <=20 ; i++){
        const image = document.createElement('img');
        image.className = 'img-fluid d-block mx-auto';
        image.setAttribute('src', jsonData.圖片連結 + `${i}.webp`);
        image.onerror = function(){
          image.remove();
        }
        image_item.push(image);
      }

      const modal = document.createElement('div');
      modal.className = 'portfolio-modal modal fade';
      modal.id = (`p${result_indexs[index] + 1}`);
      modal.tabIndex = '-1';
      modal.role = 'dialog';
      modal.style.display = 'none';
      modal.setAttribute('aria-hidden', 'true');

      const modalDialog = document.createElement('div');
      modalDialog.className = 'modal-dialog';

      const modalContent = document.createElement('div');
      modalContent.className = 'modal-content';

      const closeButtonContainer = document.createElement('div');
      closeButtonContainer.style.position = 'relative';

      const closeButton = document.createElement('button');
      closeButton.className = 'btn leave-button';
      closeButton.setAttribute('data-dismiss', 'modal');
      closeButton.setAttribute('type', 'button');

      const closeIcon = document.createElement('i');
      closeIcon.className = 'fas fa-times';

      closeButton.appendChild(closeIcon);
      closeButtonContainer.appendChild(closeButton);

      const container = document.createElement('div');
      container.className = 'container';

      const row = document.createElement('div');
      row.className = 'row';

      const col = document.createElement('div');
      col.className = 'col-lg-12 mx-auto';

      const modalBody = document.createElement('div');
      modalBody.className = 'modal-body';

      // **TEXT CONTENT WRAPPER - START**
      const textContentWrapper = document.createElement('div');
      textContentWrapper.className = 'text-content-wrapper';

      const titleH2 = document.createElement('h2');
      titleH2.innerText = jsonData.專案名;
      textContentWrapper.appendChild(titleH2);

      // --- REMOVED DESCRIPTION PARAGRAPH ---
      // const description = document.createElement('p');
      // description.innerText = jsonData.描述;
      // textContentWrapper.appendChild(description);

      const ul = document.createElement('ul');
      ul.className = 'project-details-list'; // 使用新的 class name

      // 動態生成列表項目，包含新定義的項目：風格、屋況、格局、坪數、地點
      const projectDetails = [
          { label: '風格', value: jsonData.風格 },
          { label: '屋況', value: jsonData.屋況 },
          { label: '格局', value: jsonData.格局 },
          { label: '坪數', value: `${jsonData.坪數}` }, // 確保坪數後綴
          { label: '地點', value: jsonData.地點 }
      ];

      const textNode = document.createElement('strong');
      textNode.className = 'project-divider';
      textNode.innerText = ' | ';
 
      projectDetails.forEach(detail => {
          if (detail.value) { // 確保值存在才創建 li
              const li = document.createElement('li');
              const strongElement = document.createElement('strong');
              strongElement.innerText = detail.label;

              li.appendChild(strongElement);
              li.appendChild(textNode.cloneNode(true)); // 克隆分隔符
              li.appendChild(document.createTextNode(detail.value));
              ul.appendChild(li);
          }
      });

      textContentWrapper.appendChild(ul);
      // **TEXT CONTENT WRAPPER - END**

      modalBody.appendChild(textContentWrapper); // Append the wrapper with all text content

      // Add the divider line
      const divider = document.createElement('div');
      divider.className = 'divider';
      modalBody.appendChild(divider);

      // Append all images after the divider
      for(let j = 0; j <= 20; j++){ // Start from index 0 for images
        if(image_item[j] != null)
          modalBody.appendChild(image_item[j]);
      }
      
      modalBody.appendChild(document.createElement('p'));
      

      col.appendChild(modalBody);
      row.appendChild(col);
      container.appendChild(row);
      modalContent.appendChild(closeButtonContainer);
      modalContent.appendChild(container);
      modalDialog.appendChild(modalContent);
      modal.appendChild(modalDialog);

      // 添加 modal 動畫效果
      modal.addEventListener('show.bs.modal', function () {
        const modalDialog = this.querySelector('.modal-dialog');
        modalDialog.style.transform = 'scale(0.95)';
        modalDialog.style.transition = 'transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)';
        requestAnimationFrame(() => {
          modalDialog.style.transform = 'scale(1)';
        });
      });

      modal.addEventListener('hide.bs.modal', function () {
        const modalDialog = this.querySelector('.modal-dialog');
        modalDialog.style.transition = 'transform 0.4s cubic-bezier(0.4, 0, 0.2, 1)';
        requestAnimationFrame(() => {
          modalDialog.style.transform = 'scale(0.95)';
        });
      });

      // 確保動畫完成後再關閉
      modal.addEventListener('hidden.bs.modal', function () {
        const modalDialog = this.querySelector('.modal-dialog');
        modalDialog.style.transform = 'scale(0.95)';
      });

      // 將新建的元素添加到頁面中的適當位置
      const portfolioContainer = document.querySelector('.portfolio-detail'); // 假設有一個包含這些區塊的容器元素
      portfolioContainer.appendChild(modal);
  });
}


function show_N_wrok(N){
    if(N == 'all'){
      var temp = jsonDataArray.slice().reverse();
      build_portfolio(temp, 'portfolio');
    }
    else{
      var n = N;
      var result = [];
      // 只取最新的三個住宅空間案子
      var rev_array = jsonDataArray.slice().reverse();
      result = rev_array.filter(item => item.種類 === '住宅空間').slice(0, 3);
      build_portfolio(result, 'home');
    } 
}

//滑動到指定區域時才顯示作品
function onScrollToSection(callback, N) {
  function isElementInViewport(el) {
    const rect = el.getBoundingClientRect();
    return (
      rect.top >= 0 &&
      rect.bottom <= (window.innerHeight || document.documentElement.clientHeight)
    );
  }

  function handleScroll() {
    const section = document.getElementById('portfolio');

    if (isElementInViewport(section)) {
      // 如果滾動到指定區塊，則執行提供的回調函數
      callback(N);
      // 一旦執行過回調函數，停止監聽滾動事件，以防止重複觸發
      window.removeEventListener('scroll', handleScroll);
    }
  }

  // 監聽滾動事件
  window.addEventListener('scroll', handleScroll);
}


function back_to_top(){
    document.body.scrollTop = 0;
    document.documentElement.scrollTop = 0;
}

function show_viewAll_button(n){
    if(jsonDataArray.length <= n){
        document.getElementById('viewAll').style.display = 'none';
    }
}


function changeToChinese(element) {
    if (element) {
      var text = element.getElementsByTagName('a')[0];
      if (text.innerHTML === 'SERVICES') {
        text.innerHTML = '服務項目';
        text.style.fontSize = '1.2em';
        text.setAttribute('lang', 'zh-TW');
      }
      if (text.innerHTML === 'PROJECTS') {
        text.innerHTML = '作品集';
        text.style.fontSize = '1.2em';
        text.setAttribute('lang', 'zh-TW');
      }
      if (text.innerHTML === 'About') {
        text.innerHTML = '關於我們';
        text.style.fontSize = '1.2em';
        text.setAttribute('lang', 'zh-TW');
      }
      if (text.innerHTML === 'Team') {
        text.innerHTML = '團隊成員';
        text.style.fontSize = '1.2em';
        text.setAttribute('lang', 'zh-TW');
      }
      if (text.innerHTML === 'CONTACT') {
        text.innerHTML = '聯絡我們';
        text.style.fontSize = '1.2em';
        text.setAttribute('lang', 'zh-TW');
      }
      if (text.innerHTML === 'HOME') {
        text.innerHTML = '首頁';
        text.style.fontSize = '1.2em';
        text.setAttribute('lang', 'zh-TW');
      }
    }
  }

function changeToEnglish(element) {
  if (element) {
      var text = element.getElementsByTagName('a')[0];
      if (text.innerHTML === '服務項目') {
        text.innerHTML = 'SERVICES';
        text.style.fontSize = '1em';
        text.setAttribute('lang', 'en');
      }
  }
  if (element) {
      var text = element.getElementsByTagName('a')[0];
      if (text.innerHTML === '作品集') {
        text.innerHTML = 'PROJECTS';
        text.style.fontSize = '1em';
        text.setAttribute('lang', 'en');
      }
  }
  if (element) {
      var text = element.getElementsByTagName('a')[0];
      if (text.innerHTML === '關於我們') {
        text.innerHTML = 'About';
        text.style.fontSize = '1em';
        text.setAttribute('lang', 'en');
      }
  }
  if (element) {
      var text = element.getElementsByTagName('a')[0];
      if (text.innerHTML === '團隊成員') {
        text.innerHTML = 'Team';
        text.style.fontSize = '1em';
        text.setAttribute('lang', 'en');
      }
  }
  if (element) {
      var text = element.getElementsByTagName('a')[0];
      if (text.innerHTML === '聯絡我們') {
        text.innerHTML = 'CONTACT';
        text.style.fontSize = '1em';
        text.setAttribute('lang', 'en');
      }
  }
  if (element) {
      var text = element.getElementsByTagName('a')[0];
      if (text.innerHTML === '首頁') {
        text.innerHTML = 'HOME';
        text.style.fontSize = '1em';
        text.setAttribute('lang', 'en');
      }
  }
}

function portfolio_filter(catergory){
  var container = document.querySelector('.portfolio-container');
  container.style.opacity = '0';
  container.style.transition = 'opacity 0.3s cubic-bezier(0.4, 0, 0.2, 1)';

  setTimeout(() => {
    // 清除現有的作品項目
    var items = container.querySelectorAll('.col-md-4.portfolio-item');
    items.forEach(function(item) {
        item.remove();
    });
    
    // 清除現有的 modal
    var existingModals = document.querySelectorAll('.portfolio-modal');
    existingModals.forEach(function(modal) {
        modal.remove();
    });
    
    var temp = jsonDataArray.slice().reverse();
    if(catergory != 'all'){
      temp = temp.filter(item => item.種類 === catergory);
    }
    build_portfolio(temp, 'portfolio');
    requestAnimationFrame(() => {
      container.style.opacity = '1';
    });
  }, 300);
}

function enlargeIcon(element) {
  var text = element.getElementsByTagName('a')[0];
  text.originalFontSize = window.getComputedStyle(text).fontSize;
  var originalSize = parseFloat(text.originalFontSize);
  text.style.fontSize = originalSize * 1.1 + 'px';
}

function resetIcon(element) {
  var text = element.getElementsByTagName('a')[0];
  text.style.fontSize = text.originalFontSize;
}

function show_workflow() {
  const workflowgrid = document.getElementById('wf-grid');
  workflowgrid.innerHTML = '';
  
  // 根據螢幕寬度設定樣式
  if (window.innerWidth > 768) {
    workflowgrid.style.marginLeft = 'auto';
    workflowgrid.style.marginRight = '0';
    workflowgrid.style.maxWidth = '90%';
    workflowgrid.style.paddingTop = '5%';
    workflowgrid.style.paddingBottom = '5%';
  } else {
    workflowgrid.style.margin = '0 auto';
    workflowgrid.style.maxWidth = '100%';
  }

  // 服務項目列
  const itemsRow = document.createElement('div');
  itemsRow.className = 'service-items';
  itemsRow.style.justifyContent = 'center';
  itemsRow.style.alignItems = 'center';
  itemsRow.style.gap = '15px';

  workflowDataArray.forEach((jsonData, idx) => {
    // 服務項目
    const item = document.createElement('div');
    item.className = 'service-item';
    item.innerText = jsonData.服務名稱.replace(/\s*\/.*$/, ''); // 只取主要名稱
    item.style.cursor = 'pointer';
    item.style.letterSpacing = '0.7em';
    item.style.fontSize = '1.2em';
    item.onclick = function() {
      window.location.href = 'service.html?service=' + encodeURIComponent(jsonData.服務名稱);
    };
    itemsRow.appendChild(item);
    // 分隔線（最後一個不加）
    if (idx < workflowDataArray.length - 1) {
      const divider = document.createElement('div');
      divider.className = 'service-divider';
      itemsRow.appendChild(divider);
    }
  });
  workflowgrid.appendChild(itemsRow);
}

//禁止點擊右鍵與複製
function disableRightClickAndCopy() {
  document.addEventListener('contextmenu', function (e) {
      e.preventDefault();
  });

  document.addEventListener('copy', function (e) {
      e.preventDefault();
  });
}

//重新整理後回到最頂端
window.addEventListener('load', function() {
  window.scrollTo(0, 0);
});

let jsonDataArray = [];
window.onPortfolioLoaded = function(data) {
  console.log('custom.js 收到 portfolio 資料:', data);
  jsonDataArray = data;

  // 取得當前頁面的 URL 路徑
  const currentPage = window.location.pathname;
  const lastPath = currentPage.split('/').pop(); // 取得最後的路徑部分

  console.log('當前頁面:', lastPath);

  if (lastPath === 'index.html' || lastPath === '') {
    // 在首頁執行
    console.log("目前在首頁");
    show_N_wrok(3);
  } else if (lastPath === 'portfolio.html') {
    // 在作品集頁面執行
    console.log("目前在作品集頁面");
    show_N_wrok('all');
  }

  show_viewAll_button(3);
};

// 處理從 portfolio.html 到 index.html 的滾動
function handleCrossPageScroll() {
  const hash = window.location.hash;
  if (hash) {
    const targetElement = document.querySelector(hash);
    if (targetElement) {
      setTimeout(() => {
        window.scrollTo({
          top: targetElement.offsetTop - 54,
          behavior: 'smooth'
        });
      }, 100);
    }
  }
}

// 在頁面載入時執行
document.addEventListener('DOMContentLoaded', function() {
  handleCrossPageScroll();
});