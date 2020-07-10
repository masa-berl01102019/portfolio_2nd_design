"use strict";

{ // stopwatch
  const timer = document.getElementById('timer');
  const start = document.getElementById('start');
  const stop = document.getElementById('stop');
  const reset = document.getElementById('reset');

  let startTime;
  let timeoutId;
  let pauseTime = 0;

  function countUp () {
    const d = new Date(Date.now() - startTime + pauseTime);
    const m = String(d.getMinutes()).padStart(2,'0');
    const s = String(d.getSeconds()).padStart(2,'0');
    const ms = String(d.getMilliseconds()).padStart(3,'0');
    timer.textContent = `${m}:${s}.${ms}`;
    timeoutId = setTimeout(() =>{
      countUp();
    },10);
  }

  function setButtonStateInitial() {
    start.classList.remove('inactive');
    stop.classList.add('inactive');
    reset.classList.add('inactive');
  }

  function setButtonStateRunning() {
    start.classList.add('inactive');
    stop.classList.remove('inactive');
    reset.classList.add('inactive');
  }

  function setButtonStateStopped() {
    start.classList.remove('inactive');
    stop.classList.add('inactive');
    reset.classList.remove('inactive');
  }

  start.addEventListener('click', () => {
    if (start.classList.contains('inactive')) {
      return;
    }
    setButtonStateRunning();
    startTime = Date.now();
    countUp();
  });

  stop.addEventListener('click', () => {
    if(stop.classList.contains('inactive')) {
      return;
    }
    setButtonStateStopped();
    clearTimeout(timeoutId);
    pauseTime += Date.now() - startTime; // timerが走ってた時間を全ての管理するために+=
  });

  reset.addEventListener('click', () => {
    if(reset.classList.contains('inactive')) {
      return;
    }
    setButtonStateInitial();
    timer.textContent = '00:00.000';
    pauseTime = 0;
  });

  window.addEventListener('onload', setButtonStateInitial());

  window.addEventListener('popstate', () => { // ajax 対策
    clearTimeout(timeoutId);
  });
}

{ // calendar
   const calendar = document.querySelector('.calender');
   const calenderHeader = document.getElementById('calenderHeader');
   const calendarBody = document.querySelector('tbody');
   const prevMonth = document.getElementById('prevMonth');
   const nextMonth = document.getElementById('nextMonth');

   const d = new Date();
   const today = d.getDate();
   let nowYear = d.getFullYear(); // getYear()は非推奨
   let nowMonth = d.getMonth(); // +1しないと当月の数字と合わない

   function resetCalender () {
     while(calendarBody.firstChild) {
       calendarBody.removeChild(calendarBody.firstChild);
     }
   }

   function createCalender () {
     const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
     calenderHeader.innerHTML = `${monthNames[nowMonth]}  ${nowYear}`;

     const validateYear = d.getFullYear(); // ブラウザ最初に呼び出された年の値を保持
     const validateMonth = d.getMonth(); //  ブラウザ最初に呼び出された月の値を保持
     let firstDayOfMonth = new Date(nowYear, nowMonth, 1).getDay(); // 今月の初日の曜日
     let lastDateOfMonth = new Date(nowYear, nowMonth + 1, 0).getDate(); // 今月の最終日 ＊翌月の0日は存在しないので自動補正されて前月の末日を指定してくれる

     const dateArray = [ // カレンダーは最大6週間なので1～42の数字を配列で管理
       1,2,3,4,5,6,7,
       8,9,10,11,12,13,14,
       15,16,17,18,19,20,21,
       22,23,24,25,26,27,28,
       29,30,31,32,33,34,35,
       36,37,38,39,40,41,42
     ].map(function (date) {
       return date - firstDayOfMonth; // 初日の曜日に応じて右にシフトする
     });

     for (let i = 0; i < 6; i++) {
       const weekRaw = calendarBody.insertRow(-1); // tebleに6列の<tr></tr>を挿入 ＊引数-1で末尾に挿入
       const dateSubArray = dateArray.slice(i * 7, i * 7 + 7); // 配列を1週間ごとに切り取り i=0 0~7; i=1 7~14; i=2 14~21; i=3 21~28; i=4 28~35; i=5 35~42;
       weekRaw.innerHTML = dateSubArray.map(function (date) {
         // textContentはhtmlのタグを文字として出力してしまうのでinnerHTMLを使ってhtmlのタグを解釈して出力する
         if (date < 1 || date > lastDateOfMonth) { // 配列の数字が1より小さいか、当月の末日より大きい場合は空白を代入する
           date = '';
         }
         if (date === today && nowYear === validateYear && nowMonth === validateMonth) {
           return '<td class="today">' + date + '</td>';
         }
         return '<td>' + date + '</td>';
       }).join('');
     }
   }

   nextMonth.addEventListener('click', e => {
     e.preventDefault();
     nowMonth += 1;
     if (nowMonth > 11) {
       nowMonth = 0;
       nowYear++;
     }
     resetCalender();
     createCalender();
   });

   prevMonth.addEventListener('click', e => {
     e.preventDefault();
     nowMonth -= 1;
     if (nowMonth < 0) {
       nowMonth = 11;
       nowYear--;
     }
     resetCalender();
     createCalender();
   });

   window.addEventListener('onload', createCalender());
}

{ // countDownDisplay
  const countDownDisplay = document.getElementById('countDownDisplay');
  let timeoutId;

  function countDowon () {
    const today = new Date();
    const finishDate = new Date(2020,10,20,0,0,0);
    const d_beween = finishDate - today;
    const leftDays = Math.floor( d_beween / (24 * 60 * 60 * 1000));
    const leftHours = Math.floor( d_beween / (60 * 60 * 1000) - (leftDays * 24));
    const leftMinutes = Math.floor( d_beween / (60 * 1000) - (leftDays * 24 * 60) - (leftHours * 60));
    const leftSeconds = Math.floor( (d_beween / 1000) - (leftDays * 24 * 60 * 60) - (leftHours * 60 * 60) - (leftMinutes * 60));

    let h = String(leftHours).padStart(2,'0');
    let m = String(leftMinutes).padStart(2,'0');
    let s = String(leftSeconds).padStart(2,'0');

    countDownDisplay.textContent = `${leftDays}DAYS ${h}:${m}:${s}`;

    if (leftDays <= 0) {
      countDownDisplay.textContent = `${h}:${m}:${s}`;
      if (leftHours <= 0) {
        countDownDisplay.textContent = `${m}:${s}`;
        if (leftMinutes <= 0) {
          countDownDisplay.textContent = `${s}`;
        }
      }
    }
    timeoutId = setTimeout(() =>{
      countDowon();
    },1000);

    if (leftDays <= 0 && leftHours <= 0 && leftMinutes <= 0 && leftSeconds <= 0) {
      countDownDisplay.textContent = `EXPIRE`;
      clearTimeout(timeoutId);
    }
  };

  window.addEventListener('onload', countDowon());
}
