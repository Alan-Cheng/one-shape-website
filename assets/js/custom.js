// // 從 localStorage 中取出 savedVariable 的並剖析為 JavaScript 物件
// const jsonDataArray = JSON.parse(localStorage.getItem('portfolio_description'));
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

    // 移除现有的项目并重新构建内容
    var container = document.querySelector('.portfolio-container');
    var items = container.querySelectorAll('.col-md-4.portfolio-item');
    items.forEach(function(item) {
      item.remove();
    });
    result = temp;
    result_indexs = temp.map((item, index) => jsonDataArray.indexOf(item));
  }
  result.forEach((jsonData, index) => {
    const col = document.createElement('div');
    col.className = 'col-md-4 portfolio-item';
    col.style.marginBottom = '30px';
    col.style.padding = '0 15px';

    // 檢查螢幕寬度並調整大小
    if (window.innerWidth <= 767) {
      col.style.maxWidth = '90%';
      col.style.margin = '0 auto 30px auto';
    }

    const link = document.createElement('a');
    link.className = 'portfolio-link';
    link.setAttribute('data-toggle', 'modal');
    link.setAttribute('href', `#p${result_indexs[index] + 1}`);

    const hover = document.createElement('div');
    hover.className = 'portfolio-hover';

    const hoverContent = document.createElement('div');
    hoverContent.className = 'portfolio-hover-content';

    hover.appendChild(hoverContent);

    const image = document.createElement('img');
    image.className = 'img-fluid';
    image.setAttribute('src', jsonData.圖片連結 + `1.jpg`);
    image.setAttribute('alt', '');
    image.style.aspectRatio = '5/3';
    image.style.width = '100%';
    image.style.height = 'auto';
    image.style.objectFit = 'cover';

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

    const title = document.createElement('a');
    title.innerText = jsonData.專案名;
    title.style.letterSpacing = '0.2em';

    caption.appendChild(title);

    col.appendChild(link);
    col.appendChild(caption);

    const portfolioContainer = document.querySelector('.portfolio-container');
    portfolioContainer.appendChild(col);
  });

  result.forEach((jsonData, index) => {
    const image_item = [];
      for(let i = 0; i <=20 ; i++){
        const image = document.createElement('img');
        image.className = 'img-fluid d-block mx-auto';
        image.setAttribute('src', jsonData.圖片連結 + `${i}.jpg`);
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
      closeButton.setAttribute('onmouseover', "this.style.backgroundColor='lightgray';");
      closeButton.setAttribute('onmouseout', "this.style.backgroundColor='rgb(255, 255, 255, 0)';");

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

      const description = document.createElement('p');
      description.innerText = jsonData.描述;

      const desDiv = document.createElement('div');
      desDiv.className = 'lchild'
      desDiv.appendChild(description);
      
      const ul = document.createElement('ul');
      ul.className = 'list-inline';
      ul.style.textAlign = 'left;';

      const locateLi = document.createElement('li');
      
      const strongElement = document.createElement('strong');
      strongElement.innerText = 'Location';

      const textNode = document.createTextNode(' / ');

      locateLi.appendChild(strongElement);
      locateLi.appendChild(textNode);
      locateLi.appendChild(document.createTextNode(jsonData.區域));

      const dateLi = document.createElement('li');

      const strongElement2 = document.createElement('strong');
      strongElement2.innerText = 'Year';

      dateLi.appendChild(strongElement2);
      dateLi.appendChild(textNode.cloneNode(true));
      dateLi.appendChild(document.createTextNode(jsonData.日期));

      const sizeLi = document.createElement('li');

      const strongElement3 = document.createElement('strong');
      strongElement3.innerText = 'Area';

      sizeLi.appendChild(strongElement3);
      sizeLi.appendChild(textNode.cloneNode(true));
      sizeLi.appendChild(document.createTextNode(`${jsonData.坪數}坪`));

      const projectNameLi = document.createElement('li');
      
      const strongElement4 = document.createElement('strong');
      strongElement4.innerText = 'Project';

      projectNameLi.appendChild(strongElement4);
      projectNameLi.appendChild(textNode.cloneNode(true));
      projectNameLi.appendChild(document.createTextNode(jsonData.專案名));


      ul.appendChild(locateLi);
      ul.appendChild(dateLi);
      ul.appendChild(sizeLi);
      ul.appendChild(projectNameLi);

      const ulDiv = document.createElement('div');
      ulDiv.className = 'rchild'
      ulDiv.appendChild(ul);

      const div = document.createElement('div');
      div.className = 'row parent'; //要恢復左右排列就刪掉
      
      //決定哪個在左邊
      div.appendChild(ulDiv);
      div.appendChild(desDiv);

      modalBody.appendChild(image_item[0]);
      modalBody.appendChild(div);
      for(let j = 1; j <= 20; j++){
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
      var indexes = new Set();
      var catergory = new Set();
      //隨機取得n個不重複的索引
      // while (indexes.size < n) {
      //   const randomIndex = Math.floor(Math.random() * jsonDataArray.length);
      //   indexes.add(randomIndex);
      // }
      var rev_array = jsonDataArray.slice().reverse();
      for(var i = 0; i < rev_array.length; i++){
        if(indexes.size == n){
          break;
        }
        if(catergory.has(rev_array[i].種類)){
          continue;
        }
        if(rev_array[i].種類 == '專案工程'){
          continue;
        }
        else{
          indexes.add(i);
          catergory.add(rev_array[i].種類);
        }
      }
      //將三種不同種類的作品分別放入result
      indexes.forEach(index => {
        result.push(rev_array[index]);
      });
      build_portfolio(result.reverse(), 'home');
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
      if (text.innerHTML === 'Services') {
        text.innerHTML = '服務項目';
        text.style.fontSize = '1.1em';
        text.setAttribute('lang', 'zh-TW');
      }
      if (text.innerHTML === 'Projects') {
        text.innerHTML = '作品集';
        text.style.fontSize = '1.1em';
        text.setAttribute('lang', 'zh-TW');
      }
      if (text.innerHTML === 'About') {
        text.innerHTML = '關於我們';
        text.style.fontSize = '1.1em';
        text.setAttribute('lang', 'zh-TW');
      }
      if (text.innerHTML === 'Team') {
        text.innerHTML = '團隊成員';
        text.style.fontSize = '1.1em';
        text.setAttribute('lang', 'zh-TW');
      }
      if (text.innerHTML === 'Contact') {
        text.innerHTML = '聯絡我們';
        text.style.fontSize = '1.1em';
        text.setAttribute('lang', 'zh-TW');
      }
      if (text.innerHTML === 'Home') {
        text.innerHTML = '回到首頁';
        text.style.fontSize = '1.1em';
        text.setAttribute('lang', 'zh-TW');
      }
    }
  }

function changeToEnglish(element) {
  if (element) {
      var text = element.getElementsByTagName('a')[0];
      if (text.innerHTML === '服務項目') {
        text.innerHTML = 'Services';
        text.style.fontSize = '1em';
        text.setAttribute('lang', 'en');
      }
  }
  if (element) {
      var text = element.getElementsByTagName('a')[0];
      if (text.innerHTML === '作品集') {
        text.innerHTML = 'Projects';
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
        text.innerHTML = 'Contact';
        text.style.fontSize = '1em';
        text.setAttribute('lang', 'en');
      }
  }
  if (element) {
      var text = element.getElementsByTagName('a')[0];
      if (text.innerHTML === '回到首頁') {
        text.innerHTML = 'Home';
        text.style.fontSize = '1em';
        text.setAttribute('lang', 'en');
      }
  }
}

function portfolio_filter(catergory){
  // 先讓所有作品消失
  var container = document.querySelector('.portfolio-container');
  var items = container.querySelectorAll('.col-md-4.portfolio-item');
  items.forEach(function(item) {
      item.remove();
  });
  // 再讓符合條件的作品顯示
  if(catergory == 'all'){
    var temp = jsonDataArray.slice().reverse();
    temp.forEach((jsonData, index) =>  {
    var container = document.querySelector('.portfolio-container');
    var items = container.querySelectorAll('.col-md-4.portfolio-item');
    items.forEach(function(item) {
        item.remove();
    });
    build_portfolio(temp, 'portfolio');
  });
}
  else{
    var temp = jsonDataArray.slice().reverse();
    temp.forEach((jsonData, index) =>  {
      if(jsonData.種類 != catergory){
        return;
      }
      const col = document.createElement('div');
      col.className = 'col-md-4 portfolio-item';
      col.style.marginBottom = '30px';
      col.style.padding = '0 15px';

      const link = document.createElement('a');
      link.className = 'portfolio-link';
      link.setAttribute('data-toggle', 'modal');
      link.setAttribute('href', `#p${index + 1}`);

      const hover = document.createElement('div');
      hover.className = 'portfolio-hover';

      const hoverContent = document.createElement('div');
      hoverContent.className = 'portfolio-hover-content';

      hover.appendChild(hoverContent);

      const image = document.createElement('img');
      image.className = 'img-fluid';
      image.setAttribute('src', jsonData.圖片連結 + `1.jpg`);
      image.setAttribute('alt', jsonData.專案名);
      image.style.aspectRatio = '5/3';
      image.style.width = '100%';
      image.style.height = 'auto';
      image.style.objectFit = 'cover';

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

      const title = document.createElement('a');
      title.innerText = jsonData.專案名;
      title.style.letterSpacing = '0.2em';

      caption.appendChild(title);

      col.appendChild(link);
      col.appendChild(caption);

      // 將新建的元素添加到頁面中的適當位置
      const portfolioContainer = document.querySelector('.portfolio-container'); // 假設有一個包含這些區塊的容器元素
      portfolioContainer.appendChild(col);
    });
  }
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
  // 取得 workflow grid 容器
  const workflowgrid = document.querySelector('#wf-grid');
  // 清空內容
  workflowgrid.innerHTML = '';

  // 服務項目列
  const itemsRow = document.createElement('div');
  itemsRow.className = 'service-items';

  workflowDataArray.forEach((jsonData, idx) => {
    // 服務項目
    const item = document.createElement('div');
    item.className = 'service-item';
    item.innerText = jsonData.服務名稱.replace(/\s*\/.*$/, ''); // 只取主要名稱
    item.setAttribute('data-toggle', 'modal');
    item.setAttribute('href', `#wf${idx + 1}`);
    item.style.cursor = 'pointer';
    item.onclick = function() {
      const modal = document.getElementById(`wf${idx + 1}`);
      if(modal) $(modal).modal('show');
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

  // 保留原本 modal 敘述功能
  workflowDataArray.forEach((jsonData, index) => {
    // 创建一个新的div元素
    var modalDiv = document.createElement('div');

    // 添加必需的class和id属性
    modalDiv.className = 'portfolio-modal modal fade';
    modalDiv.id = 'wf' + (index + 1);
    modalDiv.setAttribute('tabindex', '-1');
    modalDiv.setAttribute('role', 'dialog');
    modalDiv.style.display = 'none';
    modalDiv.setAttribute('aria-hidden', 'true');

    // 创建modal-dialog元素
    var modalDialog = document.createElement('div');
    modalDialog.className = 'modal-dialog';

    // 创建modal-content元素
    var modalContent = document.createElement('div');
    modalContent.className = 'modal-content';

    // 创建popup-window-inner元素
    var popupWindowInner = document.createElement('div');
    popupWindowInner.className = 'popup-window-inner';

    // 创建包含按钮的相对定位的div元素
    var buttonContainer = document.createElement('div');
    buttonContainer.style.position = 'relative';

    // 创建关闭按钮
    var closeButton = document.createElement('button');
    closeButton.className = 'btn leave-button';
    closeButton.setAttribute('data-dismiss', 'modal');
    closeButton.setAttribute('type', 'button');
    closeButton.setAttribute('onmouseover', "this.style.backgroundColor='lightgray';");
    closeButton.setAttribute('onmouseout', "this.style.backgroundColor='rgb(255, 255, 255, 0)';");

    // 创建关闭按钮图标
    var closeIcon = document.createElement('i');
    closeIcon.className = 'fas fa-times';

    // 将关闭按钮图标附加到关闭按钮
    closeButton.appendChild(closeIcon);

    // 将关闭按钮附加到包含按钮的相对定位的div元素
    buttonContainer.appendChild(closeButton);

    // 创建container元素
    var containerDiv = document.createElement('div');
    containerDiv.className = 'container';

    // 创建row元素
    var rowDiv = document.createElement('div');
    rowDiv.className = 'row';

    // 创建col-lg-12 text-center元素
    var colDiv = document.createElement('div');
    colDiv.className = 'col-lg-12 text-center';

    // 创建h3元素
    var h3Element = document.createElement('h3');
    h3Element.className = 'section-heading text-uppercase';
    h3Element.innerText = jsonData.服務名稱;
    h3Element.style.marginTop = '20px';


    // 创建scalable-div元素
    const scalableDiv = document.createElement('div');
    scalableDiv.className = 'row scalable-div';

    const workflow_detail = JSON.parse(JSON.stringify(jsonData.服務說明));
    var index = 0;
    for(var key in workflow_detail){
      if(key == '費用備註'){
        continue;
      }
      const h4Div = document.createElement('div');
      h4Div.className = 'row';
      const h4Element = document.createElement('h4');
      h4Element.textContent = key;
      h4Div.appendChild(h4Element);

      const ulDiv = document.createElement('div');
      ulDiv.className = 'row';
      const ulElement = document.createElement('ul');
      ulElement.className = 'description_list';
      ulDiv.appendChild(ulElement);

      const liElement = document.createElement('li');
      liElement.style.whiteSpace = 'pre-line';
      liElement.textContent =workflow_detail[key];

      ulElement.appendChild(liElement);

      if(key == '費用' && workflow_detail['費用備註'] != null){
        const Textul = document.createElement('ul')
        Textul.style.listStyleType = 'none';
        Textul.style.padding = '0';

        const Textli = document.createElement('li');
        var split_text =(workflow_detail['費用備註'])
        Textli.textContent = `(${split_text})`;
        Textli.style.listStyleType = 'none';
        Textli.style.whiteSpace = 'pre-line';
        Textli.style.margin = '0';

        Textul.appendChild(Textli);
        ulElement.appendChild(Textul);
      }

      const col = document.createElement('div');
      col.className = 'col-md-6';
      col.style.height = 'auto';
      col.style.display = 'flex';
      col.style.flexDirection = 'column';
      col.style.alignItems = 'flex-start';
      col.style.marginTop = '30px';
      const numberDiv = document.createElement('div');
      numberDiv.className = 'row';
      numberDiv.style.width = '90%';
      numberDiv.style.alignSelf = 'center';
      const number = document.createElement('h2');
      if(index+1 >= 10){
        number.textContent = `${index+1}.`;
      }
      else{
        number.textContent = `0${index+1}.`;
      }
      numberDiv.appendChild(number);
      const textDiv = document.createElement('div');
      textDiv.className = 'col';
      textDiv.style.marginTop = 'auto';
      textDiv.style.width = '100%';
      textDiv.style.height = '100%';
      textDiv.style.marginLeft = '15px';
      textDiv.appendChild(h4Div);
      textDiv.appendChild(ulDiv);
      numberDiv.appendChild(textDiv);
      col.appendChild(numberDiv);
      scalableDiv.appendChild(col);
      index++;   
    }

    const scalableDiv2 = document.createElement('div');
    if(jsonData['備註'] != null){
      scalableDiv2.className = 'scalable-div';
      const remark = document.createElement('p');
      remark.style.fontSize = '0.9em';
      remark.style.fontWeight = 'normal';
      remark.style.alignSelf = 'center';
      remark.style.textAlign = 'center';
      remark.style.color = 'red';
      remark.textContent = splitTextWithPunctuation(jsonData['備註']);
      scalableDiv2.appendChild(remark);
    }
    
    colDiv.appendChild(h3Element);
    colDiv.appendChild(scalableDiv);
    colDiv.appendChild(scalableDiv2);

    rowDiv.appendChild(colDiv);

    containerDiv.appendChild(rowDiv);

    popupWindowInner.appendChild(buttonContainer);
    popupWindowInner.appendChild(containerDiv);

    modalContent.appendChild(popupWindowInner);

    modalDialog.appendChild(modalContent);

    modalDiv.appendChild(modalDialog);

    // 将modalDiv元素添加到文档的body中
    document.body.appendChild(modalDiv);

  });
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

  console.log('當前頁面:', currentPage);

  if (currentPage === '/index.html' || currentPage === '/') {
    // 在 page1.html 頁面上執行
    onScrollToSection(show_N_wrok, 3);
  } else if (currentPage === '/portfolio.html') {
    // 在 page2.html 頁面上執行
    show_N_wrok('all');
  }

  show_viewAll_button(3);  // 在兩個頁面都執行這個
};

// 防止頁面在頂部時向上滾動
function preventScrollAtTop() {
  let lastScrollTop = 0;
  
  window.addEventListener('scroll', function(e) {
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    
    if (scrollTop <= 0) {
      e.preventDefault();
      window.scrollTo(0, 0);
      lastScrollTop = 0;
    } else {
      lastScrollTop = scrollTop;
    }
  }, { passive: false });

  // 添加觸控事件處理
  document.addEventListener('touchmove', function(e) {
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    if (scrollTop <= 0) {
      e.preventDefault();
    }
  }, { passive: false });
}

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
  preventScrollAtTop();
  handleCrossPageScroll();
});