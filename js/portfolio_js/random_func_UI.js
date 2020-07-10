"use strict";

{ // random_btn
  const random_btn = document.getElementById('random_btn');
  random_btn.addEventListener('click', () => {
    random_btn.classList.add('pressed');
    const n = Math.random(); // 0~4
    if (n < 0.1) { // 10%
      random_btn.textContent = '10%';
    } else if (n < 0.35) { // 25 %
      random_btn.textContent = '25%';
    } else if (n < 0.65) { // 30 %
      random_btn.textContent = '30%';
    } else if (n < 0.99) { // 34 %
      random_btn.textContent = '34%';
    } else { // 1%
      random_btn.textContent = '1%';
    }
  });
}

{ // random_ad
  const random_ad = document.querySelector('#random_ad > img');
  const ads = [
    "../../img/portfolio_js/sample1.png",
    "../../img/portfolio_js/sample2.png",
    "../../img/portfolio_js/sample3.png"
  ];

  function randomPlay () {
    const n = Math.floor(Math.random() * ads.length);
    random_ad.src = ads[n];
    setTimeout(() => {
      randomPlay();
    },2000);
  }

  window.addEventListener('onload', randomPlay());
}

{ // randomAnimation
  const boxes = document.querySelectorAll('.boxes');

  function randomAnimation () {
    boxes.forEach( box => {
      let n = Math.floor(Math.random() * 5); // 0~4
      switch (n) {
        case 0:
        box.className = 'boxes';
        box.classList.add('move1');
        break;
        case 1:
        box.className = 'boxes';
        box.classList.add('move2');
        break;
        case 2:
        box.className = 'boxes';
        box.classList.add('egg_shape');
        break;
        case 3:
        box.className = 'boxes';
        box.classList.add('gradation_ring');
        break;
        case 4:
        box.className = 'boxes';
        box.classList.add('transform_diagram');
        break;
      }
      let color = { r: 0, g: 0, b: 0 };
      for (let i in color) {
        color[i] = Math.floor(Math.random() * 256);
      }
      box.style.backgroundColor = "rgb(" + color.r + "," + color.g + "," + color.b + ")";
   });
    setTimeout(() => {
      randomAnimation();
    },3000);
  }

  window.addEventListener('onload', randomAnimation ());  
}
