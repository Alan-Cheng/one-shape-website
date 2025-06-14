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

    // 移除現有的項目並重新構築內容
    var container = document.querySelector('.portfolio-container');
    var items = container.querySelectorAll('.col-md-4.portfolio-item');
    items.forEach(function(item) {
      item.remove();
    });
    result = temp;
    result_indexs = temp.map((item, index) => jsonDataArray.indexOf(item));
  }

  // 檢查是否為手機版
  const isMobile = window.innerWidth <= 767;
  const itemsPerPage = isMobile ? 6 : result.length;
  const totalPages = Math.ceil(result.length / itemsPerPage);

  // 清除現有的分頁按鈕
  const existingPagination = document.querySelector('.portfolio-pagination');
  if (existingPagination) {
    existingPagination.remove();
  }

  // 創建分頁容器
  const paginationContainer = document.createElement('div');
  paginationContainer.className = 'portfolio-pagination';
  paginationContainer.style.display = 'flex';
  paginationContainer.style.justifyContent = 'center';
  paginationContainer.style.marginTop = '20px';
  paginationContainer.style.gap = '10px';

  // 只在手機版顯示分頁
  if (isMobile) {
    // 創建分頁按鈕
    for (let i = 1; i <= totalPages; i++) {
      const pageButton = document.createElement('button');
      pageButton.innerText = i;
      pageButton.style.padding = '8px 16px';
      pageButton.style.border = '1px solid white';
      pageButton.style.background = 'transparent';
      pageButton.style.color = 'white';
      pageButton.style.cursor = 'pointer';
      pageButton.style.borderRadius = '4px';
      pageButton.style.transition = 'all 0.3s ease';

      // 設置當前頁面按鈕樣式
      if (i === 1) {
        pageButton.style.background = 'white';
        pageButton.style.color = '#3a3a3a';
      }

      pageButton.onclick = function() {
        // 更新按鈕樣式
        const buttons = paginationContainer.querySelectorAll('button');
        buttons.forEach(btn => {
          btn.style.background = 'transparent';
          btn.style.color = 'white';
        });
        this.style.background = 'white';
        this.style.color = '#3a3a3a';

        // 顯示對應頁面的作品
        const startIndex = (i - 1) * itemsPerPage;
        const endIndex = startIndex + itemsPerPage;
        const pageItems = result.slice(startIndex, endIndex);
        const pageIndexes = result_indexs.slice(startIndex, endIndex);

        const container = document.querySelector('.portfolio-container');
        // 淡出效果
        container.style.opacity = '0';
        container.style.transition = 'opacity 0.3s ease-out';

        setTimeout(() => {
          // 清除現有作品
          container.innerHTML = '';

          // 顯示當前頁面的作品
          pageItems.forEach((jsonData, index) => {
            const col = document.createElement('div');
            col.className = 'col-md-4 portfolio-item';
            col.style.marginBottom = '30px';
            col.style.transition = 'transform 0.3s ease, box-shadow 0.3s ease';
            col.style.borderTopLeftRadius = '4px';
            col.style.borderTopRightRadius = '4px';
            col.style.overflow = 'hidden';
            col.style.cursor = 'pointer';
            col.setAttribute('data-toggle', 'modal');
            col.setAttribute('data-target', `#p${pageIndexes[index] + 1}`);
            // 加入動畫效果
            col.style.opacity = '0'; // 初始隱藏
            col.style.transform = 'translateY(100px)'; // 初始位置在下方

            col.onmouseover = function() {
              this.style.transform = 'translateY(-5px)';
            };
            col.onmouseout = function() {
              this.style.transform = 'translateY(0)';
            };

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

            const title = document.createElement('a');
            title.innerText = jsonData.專案名;
            title.style.letterSpacing = '0.2em';
            title.style.color = 'white';
            title.style.textDecoration = 'none';
            title.style.transition = 'color 0.3s ease';

            caption.appendChild(title);

            col.appendChild(link);
            col.appendChild(caption);

            container.appendChild(col);

            // 觸發動畫
            setTimeout(() => {
              col.style.transition = 'opacity 0.6s ease-out, transform 0.6s ease-out';
              col.style.opacity = '1';
              col.style.transform = 'translateY(0)';
            }, 50 + index * 100); // 錯開時間，產生逐一顯示效果
          });
          // 淡入效果
          container.style.opacity = '1';
        }, 400); // 延遲時間應與 CSS transition-duration 匹配

        // 滾動到頂部
        window.scrollTo({
          top: document.querySelector('.portfolio-container').offsetTop - 100,
          behavior: 'smooth'
        });
      };

      paginationContainer.appendChild(pageButton);
    }

    // 將分頁容器添加到頁面
    const container = document.querySelector('.portfolio-container');
    container.parentNode.insertBefore(paginationContainer, container.nextSibling);

    // 顯示第一頁的作品
    const firstPageItems = result.slice(0, itemsPerPage);
    const firstPageIndexes = result_indexs.slice(0, itemsPerPage);
    firstPageItems.forEach((jsonData, index) => {
      const col = document.createElement('div');
      col.className = 'col-md-4 portfolio-item';
      col.style.marginBottom = '30px';
      col.style.transition = 'transform 0.3s ease, box-shadow 0.3s ease';
      col.style.borderTopLeftRadius = '4px';
      col.style.borderTopRightRadius = '4px';
      col.style.overflow = 'hidden';
      col.style.cursor = 'pointer';
      col.setAttribute('data-toggle', 'modal');
      col.setAttribute('data-target', `#p${firstPageIndexes[index] + 1}`);
      col.onmouseover = function() {
        this.style.transform = 'translateY(-5px)';
      };
      col.onmouseout = function() {
        this.style.transform = 'translateY(0)';
      };

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

      const title = document.createElement('a');
      title.innerText = jsonData.專案名;
      title.style.letterSpacing = '0.2em';
      title.style.color = 'white';
      title.style.textDecoration = 'none';
      title.style.transition = 'color 0.3s ease';

      caption.appendChild(title);

      col.appendChild(link);
      col.appendChild(caption);

      const portfolioContainer = document.querySelector('.portfolio-container');
      portfolioContainer.appendChild(col);
    });
  } else {
    // 非手機版顯示所有作品
    result.forEach((jsonData, index) => {
      const col = document.createElement('div');
      col.className = 'col-md-4 portfolio-item';
      col.style.marginBottom = '30px';
      col.style.transition = 'transform 0.3s ease, box-shadow 0.3s ease';
      col.style.borderTopLeftRadius = '4px';
      col.style.borderTopRightRadius = '4px';
      col.style.overflow = 'hidden';
      col.style.cursor = 'pointer';
      col.setAttribute('data-toggle', 'modal');
      col.setAttribute('data-target', `#p${result_indexs[index] + 1}`);
      col.onmouseover = function() {
        this.style.transform = 'translateY(-5px)';
      };
      col.onmouseout = function() {
        this.style.transform = 'translateY(0)';
      };

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

      const title = document.createElement('a');
      title.innerText = jsonData.專案名;
      title.style.letterSpacing = '0.2em';
      title.style.color = 'white';
      title.style.textDecoration = 'none';
      title.style.transition = 'color 0.3s ease';

      caption.appendChild(title);

      col.appendChild(link);
      col.appendChild(caption);

      const portfolioContainer = document.querySelector('.portfolio-container');
      portfolioContainer.appendChild(col);
    });
  }

  // 創建作品詳情模態框
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
    div.className = 'row parent';
    
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

    const portfolioContainer = document.querySelector('.portfolio-detail');
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
      callback(N);
      window.removeEventListener('scroll', handleScroll);
    }
  }

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
  // 淡出效果
  container.style.opacity = '0';
  container.style.transition = 'opacity 0.3s ease-out';

  setTimeout(() => {
    // 先讓所有作品消失
    var items = container.querySelectorAll('.col-md-4.portfolio-item');
    items.forEach(function(item) {
        item.remove();
    });
    
    // 再讓符合條件的作品顯示
    var temp = jsonDataArray.slice().reverse();
    if(catergory != 'all'){
      temp = temp.filter(item => item.種類 === catergory);
    }
    build_portfolio(temp, 'portfolio');
    // 淡入效果
    container.style.opacity = '1';
  }, 400); // 延遲時間應與 CSS transition-duration 匹配
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
    workflowgrid.style.maxWidth = '80%';
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