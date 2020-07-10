"use strict";

{  // character animation
  const charcter_Ani = document.querySelector('.charcter_Ani');

  let i = 0;
  let timeId = undefined;
  const count_num = charcter_Ani.children.length;

  function charcterAnimation () {
    if (i === count_num) {
      clearTimeout(timeId);
      return;
    }
    if (charcter_Ani.children[i].classList.contains('typewriter')) {
      charcter_Ani.children[i].classList.remove('typewriter');
    }
    i++;
    timeId = setTimeout(() => {
      charcterAnimation();
    },100);
  }

  window.requestAnimationFrame(() => {
    setTimeout(() => {
      charcterAnimation();
    },1000);
  });
}

{ // Animation for smartphone
  const options = {
    root: null,
    rootMargin: `-100px`,
  };
  let target = document.querySelectorAll('.vbox');
  let observer = new IntersectionObserver( change => {
    if (change[0].isIntersecting) {
      Array.prototype.forEach.call(change[0].target.children, elm => {
          if(elm.className === 'hidden') { 
            elm.classList.add('showAnimation');
          }
          if(elm.className === 'pic_cover') {      
            elm.classList.add('open_pic_cover');
          }
          if(elm.className === 'fade_out') {      
            elm.classList.add('fade_in');
          }
        });
    } else {
      Array.prototype.forEach.call(change[0].target.children, elm => {
          elm.classList.remove('showAnimation');     
          elm.classList.remove('open_pic_cover');     
          elm.classList.remove('fade_in');
      });
    }
  }, options);

  for(let i = 0; i < target.length; i++) {
    observer.observe(target[i]);
  }
}

