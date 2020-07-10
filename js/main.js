'use strict';

{ // accordion_wrap_btn
  function accordionWrapFunc () {
    const a = document.querySelectorAll('.accordion_wrap_btn > a');
    const icon = document.querySelectorAll('.accordion_wrap_btn > a > i');
    const wrap = document.querySelectorAll('.accordion_wrap_btn');
    const span = document.querySelectorAll('.accordion_wrap_hide');

    for(let i = 0; i < a.length; i++) {
      a[i].addEventListener('click', e => {
        e.preventDefault();
        if (span[i].classList.contains('accordion_wrap_hide')) {
          span[i].classList.remove('accordion_wrap_hide');
          wrap[i].classList.remove('accordion_wrap_btn');
          icon[i].classList.remove('fa-chevron-down');
        } else {
          span[i].classList.add('accordion_wrap_hide');
          wrap[i].classList.add('accordion_wrap_btn');
        }
      });
    }
  }
  window.addEventListener('load', () => {
    if (window.location.href !== 'http://192.168.33.11:8000/public/portfolio_js/mini_game.html') { // ローカル開発環境用
      accordionWrapFunc();
    }
  });
}

{ // hamberger Tag

  const open = document.getElementById('open');
  const close = document.getElementById('close');
  const lists = document.querySelectorAll ('#menu li');

  open.addEventListener('click', () => {
    document.body.className = 'menu_open';
    lists.forEach( (list, index) => {
      list.classList.add("fadein_lean");
      lists[index].classList.add(`delay_${index}`);
    });
  });
  close.addEventListener('click', () => {
    document.body.className = '';
    lists.forEach(  list  => {
      list.className = '';
    });
  });

}