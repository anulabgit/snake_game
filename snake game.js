//Delcare 전역변수
let s;
let scl = 30;
let food;
let foodlist = 0;
let bias = 15;
playfield = 600;

function preload() {
  img = loadImage("https://raw.githubusercontent.com/anulabgit/snake_game/main/background.png");
  red_ghost = loadImage(
    "https://raw.githubusercontent.com/anulabgit/snake_game/main/red_ghost.png"
  );
  blue_ghost = loadImage(
    "https://raw.githubusercontent.com/anulabgit/snake_game/main/blue_ghost.png"
  );
  pink_ghost = loadImage(
    "https://raw.githubusercontent.com/anulabgit/snake_game/main/pink_ghost.png"
  );
  yellow_ghost = loadImage(
    "https://raw.githubusercontent.com/anulabgit/snake_game/main/yellow_ghost.png"
  );
}
// p5js Setup function - required
function setup() {
  createCanvas(playfield, 640);
  background(51);
  background(img);
  
  s = new Snake();
  frameRate(10); //화면 프레임 높을수록 빨라짐
  pickLocation();
}

// p5js Draw function - required
function draw() {
  background(51);
  background(img);
  scoreboard();
  if (s.eat(food)) {
    pickLocation();
  }
  s.death();
  s.update();
  s.show();
  
  if (foodlist < 1) {
    image(red_ghost, food.x, food.y, scl, scl);
  } else if (foodlist < 2) {
    image(blue_ghost, food.x, food.y, scl, scl);
  } else if (foodlist < 3) {
    image(pink_ghost, food.x, food.y, scl, scl);
  } else {
    image(yellow_ghost, food.x, food.y, scl, scl);
    s.speed = 10;
  }
}

// 음식이 나타날 위치 선택
function pickLocation() {
  let cols = floor(playfield / scl);
  let rows = floor(playfield / scl);
  food = createVector(floor(random(cols)), floor(random(rows))); //음식위치
  food.mult(scl);
  // 음식이 꼬리 안에 나타나지 않는지 확인하십시오.
  for (let i = 0; i < s.tail.length; i++) {
    let pos = s.tail[i];
    let d = dist(food.x, food.y, pos.x, pos.y);
    if (d < 1) {
      pickLocation();
    }
  }
}

// 점수판
function scoreboard() {
  fill(0);
  rect(0, 600, 600, 40);
  fill(255);
  textFont("Georgia");
  textSize(18);
  text("Score: ", 10, 625);
  text("Highscore: ", 450, 625);
  text(s.score, 70, 625);
  text(s.highscore, 540, 625);
}

// CONTROLS function
function keyPressed() {
  if (keyCode === UP_ARROW) {
    s.dir(0, -1);
  } else if (keyCode === DOWN_ARROW) {
    s.dir(0, 1);
  } else if (keyCode === RIGHT_ARROW) {
    s.dir(1, 0);
  } else if (keyCode === LEFT_ARROW) {
    s.dir(-1, 0);
  }
}

function Snake() {
  this.x = 0;
  this.y = 0;
  this.xspeed = 1;
  this.yspeed = 0;
  this.total = 0;
  this.tail = [];
  this.score = 1;
  this.highscore = 1;
  this.ang = 0;
  this.speed = 10;
  this.dir = function (x, y) {
    this.xspeed = x;
    this.yspeed = y;
  };

  this.eat = function (pos) {
    let d = dist(this.x, this.y, pos.x, pos.y);
    if (d < 1) {
      this.total++;
      this.score++;
      text(this.score, 70, 625);
      if (this.score > this.highscore) {
        this.highscore = this.score;
      }
      text(this.highscore, 540, 625);
      this.speed += 1; // eat 할 때마다 속도 1 증가
      frameRate(this.speed); // frameRate 변경
      foodlist = random(0,4);
      return true;
    } else {
      return false;
    }
  };

  this.death = function () {
    for (let i = 0; i < this.tail.length; i++) {
      let pos = this.tail[i];
      let d = dist(this.x, this.y, pos.x, pos.y);
      if (d < 1) {
        this.total = 0;
        this.score = 0;
        this.tail = [];
        frameRate(0); // frameRate 0으로 설정
        this.speed = 10; // 죽을때 속도 설정
        frameRate(10); // 초기값으로 돌아가기
      }
    }
  };

  this.update = function () {
    if (this.total === this.tail.length) {
      for (let i = 0; i < this.tail.length - 1; i++) {
        this.tail[i] = this.tail[i + 1];
      }
    }
    this.tail[this.total - 1] = createVector(this.x, this.y);
    this.x = this.x + this.xspeed * scl;
    this.y = this.y + this.yspeed * scl;
    this.x = constrain(this.x, 0, playfield - scl);
    this.y = constrain(this.y, 0, playfield - scl);
  };

  //뱀 머리 움직이는 클래스
  this.head = function (ang) {
    //0.5초당 움직임
    if (millis() % 500 < 250) {
      push();
      translate(this.x + bias, this.y + bias);
      rotate(ang);
      arc(0, 0, scl, scl, 0, (TWO_PI * 3) / 4, PIE);
      pop();
    } else {
      circle(this.x + bias, this.y + bias, scl);
    }
  };
  //뱀 움직임 설정
  this.show = function () {
    fill(253, 255, 0); //뱀 색깔
    for (let i = 0; i < this.tail.length; i++) {
      circle(this.tail[i].x + bias, this.tail[i].y + bias, scl); //뱀 꼬리모양
    }
    //head 객체를 사용해서 방향대로 입이 움직임
    if (keyCode === UP_ARROW) {
      this.head(PI / -4);
    } else if (keyCode === DOWN_ARROW) {
      this.head(TWO_PI / 2.75);
    } else if (keyCode === RIGHT_ARROW) {
      this.head(TWO_PI / 8);
    } else if (keyCode === LEFT_ARROW) {
      this.head(TWO_PI / -2.75);
    } else {
      this.head(PI / 4);
    }
  };
}
