'use strict';

{ // slideshow for portfolio.html
  const images = [
    ["../img/portfolio_js/slider_random_UI.png","./portfolio_js/random_func_UI.html"],
    ["../img/portfolio_js/slider_date_object_UI.png","./portfolio_js/date_object_UI.html"],
    ["../img/portfolio_js/slider_mini_game.png","./portfolio_js/mini_game.html"],
    ["../img/img/pic03.png","#"],
    ["../img/img/pic04.png","#"],
    ["../img/img/pic05.png","#"]
  ];

  let current_number = 0;
  let timeoutId = undefined;

  const main_screan = document.getElementById('main_screan');
  const main_screan_url = document.getElementById('main_screan_url');

  main_screan.src = images[current_number][0];
  main_screan_url.href = images[current_number][1];

  images.forEach((image,index) => {
    const img = document.createElement('img');
    img.src = image[0];
    const a = document.createElement('a');
    a.href = image[1];
    const li = document.createElement('li');
    if(index === current_number) {
      li.classList.add('current');
    }
    li.addEventListener('click', () => {
      main_screan.src = image[0];
      main_screan_url.href = image[1];
      const all_list = document.querySelectorAll('ul.thumbnails > li');
      all_list[current_number].classList.remove('current');
      current_number = index;
      all_list[current_number].classList.add('current');
    });
    a.appendChild(img);
    li.appendChild(a);
    const thumbnails = document.querySelector('ul.thumbnails')
    thumbnails.appendChild(li);
  });

  const next = document.querySelector('div.next');
  next.addEventListener('click', () => {
    let target = current_number + 1;
    if (target === images.length) {
      target = 0;
    }
    document.querySelectorAll('ul.thumbnails > li')[target].click();
  });

  const prev = document.querySelector('div.prev');
  prev.addEventListener('click', () => {
    let target = current_number - 1;
    if (target < 0) {
      target = images.length - 1;
    }
    document.querySelectorAll('ul.thumbnails > li')[target].click();
  });

  main_screan_url.addEventListener('mouseover', () => {
    clearTimeout(timeoutId);
  });

  main_screan_url.addEventListener('mouseout', () => {
    playSlideshow();
  });

  function playSlideshow () {
    timeoutId = setTimeout( () => {
      next.click();
      playSlideshow();
    },2500);
  }

  window.addEventListener('load', playSlideshow());


  // ajax通信
  const display_componet = document.getElementById('cell_2');
  const TARGET_URL = "http://192.168.33.11:8000/public/portfolio.html"; // ローカル開発環境用
  let ajax = undefined;
  let keyword = undefined;
  let display_touch = true;
  let move = 0;

  function initializeComponents () {
    while (display_componet.firstChild) {
      display_componet.removeChild(display_componet.firstChild);
    }
    let stylesheet = document.head.getElementsByTagName('link');
    if(stylesheet.length > 2) {
      document.head.removeChild(document.head.lastChild);
    }
    let scriptfile = document.body.getElementsByTagName('script');
    if(scriptfile.length > 2) {
      document.body.removeChild(document.body.lastChild);
    }
  }

  function injectResource (url) {
    if (document.readyState === 'complete' || document.readyState === 'interactive') {
      keyword = (url.substring(46)).replace('.html',''); // ローカル開発環境用
      const link = document.createElement('link');
      link.rel = "stylesheet";
      link.href = "../css/portfolio_js/" + keyword + ".css"; // ローカル開発環境用
      document.head.appendChild(link);
      const script = document.createElement('script');
      script.src = "../js/portfolio_js/" + keyword + ".js";
      document.body.appendChild(script);
    } else {
      ajax.abort();
      display_componet.textContent = 'Failed to read script. Please click the panel again.';
    }
  }

  function validateUrl (url) {
    if (url === TARGET_URL + "#") { // urlのないスライドではそれ以降の処理を進めないにvalidate
      throw new Error("There is no reference. \n Please click other panels which has be written the title.");
    }
  }

  function pushHistory (url) {
    if(history && history.pushState && history.replaceState !== undefined) {
      history.pushState(keyword, null);
    }
  }

  function resetHistory () {
    if(history && history.pushState && history.replaceState !== undefined) { // historyAPIに対応している場合の処理
      history.replaceState('slideshow', null, TARGET_URL);
    }
  }

  function autoScroll () {
    display_touch = false;
    let clientRect = display_componet.getBoundingClientRect(); //目標の要素の位置座標等をオブジェクトで取得
    let py = window.pageYOffset + clientRect.top; // ページの上端から目標の要素の上端までの距離

    move += 5; // 5ミリ秒ごとに5px進む
    window.scrollTo(0,move);

    let timeId = setTimeout (() => { // 800
      autoScroll();
    },5);
    if (move > py) {
      clearTimeout(timeId);
      move = 0;
      display_touch = true;
    }
  }

  const promise = url => { // 引数にurlを取ってresolveもしくはrejectオブジェクトを返す関数式
      return new Promise((resolve, reject) => {
        ajax = new XMLHttpRequest();
        ajax.open('GET', url);
        ajax.setRequestHeader('pragma','no-cache'); //キャッシュをクリア
        ajax.setRequestHeader('Cache-Control','no-cache'); //キャッシュをクリア
        ajax.responseType = "document"; // xmlを扱う場合に必要
        ajax.onreadystatechange = function () {
          if (ajax.readyState === 4 && ajax.status === 200) {
            const content = ajax.responseXML.documentElement;
            const components = content.childNodes[2].childNodes[1].childNodes;
            Array.prototype.forEach.call(components, elm => { // Nordlistの処理
              if(elm.className === 'component') {
                display_componet.innerHTML += elm.outerHTML
                display_componet.classList.add('show');
              }
            });
            injectResource(url);
          } else {
            reject(new Error(` Failed to XMLHttpRequest: ${ajax.statusText}`));
          }
        };
        ajax.onerror = function () {
          reject(new Error(` Failed to XMLHttpRequest: ${ajax.statusText}`));
        }
        ajax.send();
        resolve();
      });
    };

  window.addEventListener('load', resetHistory());

  main_screan_url.addEventListener('click', e => {
    e.preventDefault();
    if (display_touch === false)  {
      return;
    }
    initializeComponents();
    let url = main_screan_url.href;
    promise(url)
      .then(() => {
        validateUrl(url);
        keyword = (url.substring(46)).replace('.html',''); // ローカル開発環境用
        pushHistory(url);
        autoScroll();
      })
      .catch(status => {
          ajax.abort(); // ajaxの処理を中断してエラーメッセージ
          display_componet.textContent = status;
      });
  });

  window.addEventListener('popstate', e => {
    if(history && history.pushState && history.replaceState !== undefined) { // historyAPIに対応している場合の処理
      if(e.state){ // 初回読み込み時のpopstateイベントを回避
        if(e.state === 'slideshow') {
          window.location.href = TARGET_URL;
        } else {
          initializeComponents();
          let newUrl = "http://192.168.33.11:8000/public/portfolio_js/" + e.state + ".html"; // ローカル開発環境用
          promise(newUrl)
            .then(() => {
              autoScroll();
            })
            .catch(status => {
              ajax.abort();
              display_componet.textContent = status;
            });
        }
      }
    }
  });
}

