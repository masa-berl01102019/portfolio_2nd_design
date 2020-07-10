{
  'use strict';

  window.addEventListener('load', function() {
    setTimeout(() => {
      alert("I'm really sorry but this blog article is creating now !\nSo you cannot enter next pages!");
    },10000);
  });

  const p_images = [
    ["../img/blog_pic/address registration.jpg", "#","ベルリンで住所登録の方法"],
    ["../img/blog_pic/N26.jpg","#","ネットバンクN26で口座開設"],
    ["../img/blog_pic/O2.jpg","#","SiMカードならO2がおすすめ"]
  ];

  let m_number = 1;
  let p_number = m_number - 1;
  let n_number = m_number + 1;

  const prev_img = document.getElementById('prev_img');
  const main_img = document.getElementById('main_img');
  const next_img = document.getElementById('next_img');
  const prev_link = document.getElementById('prev_link');
  const main_link = document.getElementById('main_link');
  const next_link = document.getElementById('next_link');
  const prev_title = document.getElementById('prev_title');
  const main_title = document.getElementById('main_title');
  const next_title = document.getElementById('next_title');

  window.onload = function slideshow() {
    main_img.src = p_images[m_number][0];
    prev_img.src = p_images[p_number][0];
    next_img.src = p_images[n_number][0];
    main_link.href = p_images[m_number][1];
    prev_link.href = p_images[p_number][1];
    next_link.href = p_images[n_number][1];
    main_title.textContent = p_images[m_number][2];
    prev_title.textContent = p_images[p_number][2];
    next_title.textContent = p_images[n_number][2];
    m_number++;
    p_number++;
    n_number++;
    if (m_number === p_images.length) {
      m_number = 0;
    }
    if (p_number === p_images.length) {
      p_number = 0;
    }
    if (n_number === p_images.length) {
      n_number = 0;
    }
    setTimeout(() => {
      slideshow();
    },3000);
  };

}
