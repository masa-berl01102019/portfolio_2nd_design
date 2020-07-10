"use strict";

{ // typing_game

  const content = document.querySelector('#cell_1 > div.content');
  const target = document.getElementById('target');
  const correct = document.getElementById('correct');
  const wrong = document.getElementById('wrong');
  const timer = document.getElementById('timer');

  const codes = ['KeyA', 'KeyB', 'KeyC', 'KeyD', 'KeyE', 'KeyF', 'KeyG', 'KeyH', 'KeyI',
                 'KeyJ', 'KeyK', 'KeyL', 'KeyM', 'KeyN', 'KeyO', 'KeyP', 'KeyQ', 'KeyR',
                 'KeyS', 'KeyT', 'KeyU', 'KeyV', 'KeyW', 'KeyX', 'KeyY', 'KeyZ'];
  const words = ['vowel','adjective','pluto','dwarf','sentence','properly','clarify','take turns','stressed',
                 'syllable','dialogue','mars','spin','significant','native','elastic','decompose','solitary',
                 'arabic','in turn','astronaut','flag','crowded','for free','pyramid','range from','sculpture',
                 'sphinx','rule','pharaoh','statue','oversleep','tablet','place','religious','monument','restoration',
                 'come from','strangle','beside','crawl','cane','invasion','iraq','ally','anonymous','short for'];

   let currentNum = 0;
   let shuffledwords = shuffle(words);
   let word = shuffledwords[currentNum];

   let location = 0;
   let score = 0;
   let miss = 0;

  const timeLimit = 2 * 60 * 1000;
  let timeLeft;
  let startTime;
  let timeId;
  let isPlaying = false;

  function shuffle (arr) {
    for (let i = arr.length - 1; i > 0; i-- ) {
      const r = Math.floor(Math.random() * (i + 1));
      [arr[r],arr[i]] = [arr[i],arr[r]];
    }
    return arr;
  }

  function reshuffle () {
    currentNum = 0;
    shuffledwords = shuffle(words);
    word = shuffledwords[currentNum];
  }

  function initStatus() {
    isPlaying = false;
    target.classList.remove('typing');
    target.textContent = 'click to replay';
    score = 0;
    correct.textContent = score;
    miss = 0;
    wrong.textContent = miss;
    timer.textContent = "2:00.00";
    location = 0;
  }

  function showResult () {
    const accuracyRate = score + miss === 0 ? 0 : score / (score + miss) * 100; // 正答数0の時は計算できないので条件分岐
    alert (`Your result is correct: ${score} wrong: ${miss} accuracy rate: ${accuracyRate.toFixed(2)}%`);
  }

  function displayTimeLeft () {
    timeLeft = startTime + timeLimit - Date.now();
    const timeLeftMinutes = Math.floor(timeLeft / 60 / 1000);
    const leftSeconds = Math.floor((timeLeft / 1000) - (timeLeftMinutes * 60));
    const leftMilliseconds = Math.floor((timeLeft - (timeLeftMinutes * 60 * 1000) - (leftSeconds * 1000)) / 10);
    let timeLeftSeconds = String(leftSeconds).padStart(2,'0');
    let timeLeftMilliseconds = String(leftMilliseconds).padStart(2,'0');
    timer.textContent = `${timeLeftMinutes}:${timeLeftSeconds}.${timeLeftMilliseconds}`;
  }

  function countDown () {
    displayTimeLeft();
    timeId = setTimeout(() => {
      countDown();
    },10);
    if(timeLeft < 0) {
      clearTimeout(timeId);
      timer.textContent = "0:00.00";
      setTimeout(() => {
        showResult();
        reshuffle();
        initStatus();
      },100); // 時間の微修正
    }
  }

  function focedTermination () {
    for(let i = 0; i < target.value.length; i++) { // 一文字ずつ展開してチェック
      target.disabled = true;
    }
    clearTimeout(timeId);
    alert("You can't play this game with full-width character. \n This page is automatically reloaded, please check your input format again and enjoy it.");
    setTimeout(() => {
      reshuffle();
      initStatus();
      target.disabled = false;
    },3000);
  }

  function controllTarget () {
    if (location === word.length) {
      currentNum++;
      word = words[currentNum];
      target.textContent = word;
      location = 0;
    }
    if(currentNum === words.length - 1) {
      reshuffle();
      target.textContent = word;
    }
  }

  function updateTarget () {
    let placeholder = ''; // 変数の初期化
    for(let i = 0; i < location; i++) {
      placeholder += '_';
    }
    target.textContent = placeholder + word.substring(location); // substringは引数一つの場合は残りの文字列を取得してくれる
  }

  window.addEventListener('keyup', e => {
    if (target.disabled === true || isPlaying === false) {
      return;
    }
    if(e.isComposing || e.keyCode === 13 || e.keyCode == 229) { // IME入力感知
      let code = e.code;
      let result = codes.some( value => {
        return value === code;
      });
      if(e.keyCode == 229 && result !== true) { // Chromのバグ対策
        focedTermination();
      }
    }
  });

  window.addEventListener('keydown', e => { // typeされた文字の取得 keydownで全角入力受け取れない
    if (target.disabled === true || isPlaying === false) {
      return;
    }
    if(e.isComposing || e.keyCode === 229 || e.keyCode == 0) { // IME入力感知
      focedTermination();
    }
    e.preventDefault();
    if (e.key === word[location]) {
      location++; // 正解のみ次に進む
      updateTarget();
      score++;
      correct.textContent = score;
      controllTarget();
    } else {
      miss++;
      wrong.textContent = miss;
    }
  });

  content.addEventListener('click', () => {
    if (isPlaying === true) {
      return;
    }
    isPlaying = true;
    target.classList.add('typing');
    target.textContent = word;
    startTime = Date.now();
    countDown();
  });

  window.addEventListener('popstate', () => { // ajax 対策
    clearTimeout(timeId);
  });

}

{ // three_choice_quiz

  const question = document.getElementById('question');
  const choices = document.getElementById('choices');
  const btn = document.getElementById('btn');
  const result = document.getElementById('result');
  const scoreLabel = document.querySelector('div#result > p');
  const replayBtn = document.querySelector('div#result > a');

  const quizSet = shuffle([
    {q: 'Who is The USA president?', a: ['Donald John Trump','Harland David Sanders','Angela Dorothea Merkel']},
    {q: 'Which is the tallest Mountain?', a: ['Mt.Evelest','Mt.Fuji','Mt.Kilimanjaro']},
    {q: 'Which one is not a mammalian?', a: ['penguin','dolphin','whale']}
  ]);

  let currentNum = 0;
  let isAnswered;
  let score = 0;

  function shuffle (arr) {
    for (let i = arr.length - 1; i > 0; i-- ) { // iは配列の終点
      const r = Math.floor(Math.random() * (i + 1)); // rはランダムに選ばれる配列
      [arr[r],arr[i]] = [arr[i],arr[r]]; // ランダムに選ばれた配列と配列の終点をひっくり返して分割代入
    }
    return arr;
  }

  function checkAnswer (li) {
    if(isAnswered === true) {
      return;
    }
    isAnswered = true;
    if (li.textContent === quizSet[currentNum].a[0]) {
      li.classList.add('correct');
      score++;
    } else {
      li.classList.add('wrong');
    }
    btn.classList.remove('disabled');
  }

  function setQuiz () {
    isAnswered = false;
    question.textContent = quizSet[currentNum].q; // 連想配列はkeyを渡せば値にアクセスできる
    while(choices.firstChild) {
      choices.removeChild(choices.firstChild);
    }
    const shuffledChoices = shuffle([...quizSet[currentNum].a]);
    // objectは値を参照してしまうので元の配列が書き換わってしまうので[...配列]の形で配列のコピーを関数に渡せばいい
    shuffledChoices.forEach(choice => {
      const li = document.createElement('li');
      li.textContent = choice;
      li.addEventListener('click', () => {
        checkAnswer(li);
      });
      choices.appendChild(li);
    });
    if (currentNum === quizSet.length - 1) {
      btn.textContent = 'SHOW SCORE';
    }
  }

  replayBtn.addEventListener('click', e => {
    e.preventDefault();
    result.classList.add('hidden');
    currentNum = 0;
    score = 0;
    shuffle(quizSet);
    setQuiz()
  });

  btn.addEventListener('click', () => {
    if(btn.classList.contains('disabled')) {
      return;
    }
    btn.classList.add('disabled');
    if (currentNum === quizSet.length - 1) {
      scoreLabel.textContent = `Score: ${score} / ${quizSet.length}`;
      result.classList.remove('hidden');
    } else {
      currentNum++;
      setQuiz ();
    }
  });

  window.addEventListener('onload', setQuiz());

}

{ // slot_game

  class Panel {
    constructor() {
      const section = document.createElement('section');
      section.classList.add('panel');
      this.img = document.createElement('img');
      this.img.src = this.getRandomImage();
      this.timeoutId = undefined; // 値の初期化が必要
      this.stop = document.createElement('div');
      this.stop.textContent = 'STOP';
      this.stop.classList.add('stop', 'inactive');
      this.stop.addEventListener('click', () => {
        if(this.stop.classList.contains('inactive')) {
          return;
        }
        this.stop.classList.add('inactive');
        clearTimeout(this.timeoutId);
        panelsLeft--;
        if(panelsLeft === 0) {
          checkAnswer();
          spin.classList.remove('inactive');
          panelsLeft = 3;
        }
      });
      section.appendChild(this.img);
      section.appendChild(this.stop);
      const main = document.querySelector('main');
      main.appendChild(section);
    }
    getRandomImage() {
      const images = [
        "../../img/portfolio_js/seven_mini_game.png",
        "../../img/portfolio_js/bell_mini_game.png",
        "../../img/portfolio_js/cherry_mini_game.png"
      ];
      return images[Math.floor(Math.random() * images.length)];
    }
    spin () {
      this.img.src = this.getRandomImage();
      this.timeoutId = setTimeout(() => {
        this.spin();
      }, 50);
    }
    isUnmatched (p1,p2) {
      if(this.img.src !== p1.img.src && this.img.src !== p2.img.src) {
        return true;
      } else {
        return false;
      }
    }
    unmatch () {
      this.img.classList.add('unmatched');
    }
    activate () {
      this.img.classList.remove('unmatched');
      this.stop.classList.remove('inactive');
    }
  }

  function checkAnswer () {
    if (panels[0].isUnmatched(panels[1],panels[2])) {
      panels[0].unmatch();
    }
    if (panels[1].isUnmatched(panels[0],panels[2])) {
      panels[1].unmatch();
    }
    if (panels[2].isUnmatched(panels[1],panels[0])) {
      panels[2].unmatch();
    }
  }

  const panels = [ // 配列にインスタンスを作成する
    new Panel(),
    new Panel(),
    new Panel()
  ];

  let panelsLeft = 3;

  const spin = document.getElementById('spin');
  spin.addEventListener('click', () => {
    if(spin.classList.contains('inactive')) {
      return;
    }
    spin.classList.add('inactive');
    panels.forEach( panel => {
      panel.activate();
      panel.spin();
    });
  });

}

{ // tauch_number_game
  class Board {
    constructor (game) { // boardクラスのインスタンス作成時に渡された引数thisを仮引数gameで受ける
      this.game = game; // gameクラスをプロパティとして代入する
      const board = document.getElementById('board');
      for(let i = 1; i < 17; i++) {
        this.li = document.createElement('li');
        this.li.classList.add('pressed');
        board.appendChild(this.li);
      }
      board.addEventListener('click', e => { // 動的に生成された要素にイベントハンドラが設定されない時の対策
        const target = e.target; // list要素を取得
        if(target.matches('ul#board > li')){ // 要素にmatches();で正しい要素か確認
          this.check(target,e.target.innerHTML); // clickされた要素と値を引数で渡す
        }
      });
    }
    activate () {
      const listItem = document.querySelectorAll('ul#board > li');
      const nums = ['1','2','3','4','5','6','7','8','9','10','11','12','13','14','15','16'];
      listItem.forEach( li => {
        const num = nums.splice(Math.floor(Math.random() * nums.length),1)[0];
        li.textContent = num;
        li.classList.remove('pressed');
      });
    }
    check (index,value) {  // 他のクラスのプロパティに直接アクセスするのは良くないのでメソッドとして取得する
      if(this.game.getCurrentNum() === parseInt(value, 10)) {
        index.classList.add('pressed');
        this.game.addCurrentNum();
        if (this.game.getCurrentNum() === 17) {
          clearTimeout(this.game.getTimeoutId());
        }
      }
    }
  }

  class Game {
    constructor () {
      this.board = new Board(this);
      // Gameのインスタンスが呼び出された時に立ち上がり時にconstructorでboardのインスタンスを生成することでパネルが作成される
      // boardクラスでcurrentNumとtimeoutIdが使えるようにboardのインスタンスの引数にthisを渡す
      this.currentNum = undefined;
      this.startTime = undefined;
      this.timeoutId = undefined;
      const button = document.getElementById('button');
      button.addEventListener('click', () => {
        this.start();
      });
    }
    start () {
      if(this.timeoutId !== 'undefined') { // Timerがスタートしている段階でボタンが押された場合はタイマーを止める
        clearTimeout(this.timeoutId);
      }
      this.currentNum = 1;
      this.board.activate(); // 他のクラスのインスタンスからメソッドの呼び出し
      this.startTime = Date.now();
      this.runTimer();
    }
    runTimer () {
      if (flag === false) {
        clearTimeout(this.timeoutId);
        return;
      }
      const timer = document.getElementById('timer2');
      timer.textContent = ((Date.now() - this.startTime) / 1000).toFixed(2);
      this.timeoutId = setTimeout(() => {
        this.runTimer();
      }, 10);
    }
    addCurrentNum () {
      this.currentNum++;
    }
    getCurrentNum () {
      return this.currentNum;
    }
    getTimeoutId () {
      return this.timeoutId;
    }
  }

  new Game();

  let flag = true;

  window.addEventListener('popstate', () => { // ajax 対策
      flag = false;
  });
}

{ // accordion_wrap_btn ajax用 ＊ajax読み込み時にmain.jsのroadイベントと紐づけ出来ないから

  // accordion_wrap_btn
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

