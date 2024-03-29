let cvs;
let font1;
let img_arrow;
let w, h;
let s_pop;
let btns = {};

let gameState = "wait";
let gameplayPerson = 2;
let gameplay3pCornerMode = false;
let gameplayPersonTurns = 1;

//timer
let t_cur_timer;
let t_set_timer = 30000;
let t_start_timer;
let t_timesup = false;
let t_running = false;
let touch_next_trigger = false;
let lastChangeTouch = 0;

let clr = {
  white: "#EFEEF6",
  blue: "#0C6C8F",
  red: "#B4151E",
  orange: "#BF3E0F",
  darkBlue: "#153243",
  greyDark: "#333",
  greyLight: "#777",
};
let orientationA = "v";

function windowResized() {
  var parentElement = document.getElementById("p5cvs");
  const parentWidth = parentElement.offsetWidth;
  const parentHeight = parentElement.offsetHeight;

  resizeCanvas(parentWidth, parentHeight);
  if (parentWidth < parentHeight || parentHeight > 500) {
    orientationA = "v";
  } else {
    orientationA = "h";
  }
  w = width;
  h = height;
  vw = min(w, 600);
  vh = min(h, 1200);
  ww = windowWidth;
  hh = windowHeight;
  Object.values(btns).forEach((b) => {
    b.position(b.pos.x * ww - vw * b.sizeSet.w * 0.5, b.pos.y * hh - vw * b.sizeSet.w * 0.5, "fixed");
    b.size(vw * b.sizeSet.w, vw * b.sizeSet.h);
    b.style("font-size", String(vw * 0.02) + "pt");
  });
}

function preload() {
  font1 = loadFont("assets/CourierPrime-Bold.ttf");
  img_arrow = loadImage("assets/ar.png");
  s_pop = loadSound("assets/pop.mp3");
  s_fail = loadSound("assets/fail.wav");
}
function setup() {
  cvs = createCanvas(10, 10);
  cvs.parent("p5cvs");
  windowResized();
  function createAButton(vari, lable, xS, yS) {
    let buttonVar = createButton(lable);
    buttonVar.sizeSet = { w: 0.2, h: 0.07, font: 10 };
    buttonVar.pos = { x: xS, y: yS };
    buttonVar.position(
      buttonVar.pos.x * ww - vw * buttonVar.sizeSet.w * 0.5,
      buttonVar.pos.y * hh - vw * buttonVar.sizeSet.w * 0.5,
      "fixed"
    );
    buttonVar.size(vw * buttonVar.sizeSet.w, vw * buttonVar.sizeSet.h);
    buttonVar.style("font-size", String(vw * 0.02) + "pt");
    buttonVar.hide();
    buttonVar.trigger = false;
    buttonVar.mousePressed(() => {
      buttonVar.trigger = true;
      console.log(buttonVar);
    });
    buttonVar.addClass("button");
    buttonVar.id(vari);
    buttonVar.elt.addEventListener("click", () => {
      console.log(vari);
    });
    Object.assign(btns, { [vari]: buttonVar });
    console.log(buttonVar);
  }

  createAButton("btn_start", "Start", 0.5, 0.6);
  createAButton("btn_2p", "2p", 0.5, 0.5);
  createAButton("btn_3p", "3p", 0.5, 0.6);
  createAButton("btn_3pc", "3pc", 0.5, 0.7);
  createAButton("btn_4p", "4p", 0.5, 0.8);
  console.log(btns);
  // console.log({ orientationA });
  gameState = "welcome";
  // btns.btn_start.show();
  textFont(font1);
  angleMode(DEGREES);
  imageMode(CENTER);
  rectMode(CENTER);
  textAlign(CENTER, CENTER);
  noStroke();
}
function mousePressed() {
  if (gameState == "welcome") {
    if (mouseX > w * 0.46 && mouseX < w * 0.54) {
      gameState = "timer_select";
    }
  } else if (gameState == "timer_select") {
    if (mouseX > w * 0.46 && mouseX < w * 0.54 && mouseY > h * 0.4 - vw * 0.05 && mouseY < h * 0.4 + vw * 0.05) {
      //2p
      gameplayPerson = 2;
      gameplay3pCornerMode = false;
    } else if (mouseX > w * 0.46 && mouseX < w * 0.54 && mouseY > h * 0.5 - vw * 0.05 && mouseY < h * 0.5 + vw * 0.05) {
      //3p
      gameplayPerson = 3;
      gameplay3pCornerMode = false;
    } else if (mouseX > w * 0.46 && mouseX < w * 0.54 && mouseY > h * 0.6 - vw * 0.05 && mouseY < h * 0.6 + vw * 0.05) {
      //3pc
      gameplayPerson = 3;
      gameplay3pCornerMode = true;
    } else if (mouseX > w * 0.46 && mouseX < w * 0.54 && mouseY > h * 0.7 - vw * 0.05 && mouseY < h * 0.7 + vw * 0.05) {
      //4p
      gameplayPerson = 4;
      gameplay3pCornerMode = false;
    }
    gameplayPersonTurns = 0;
    gameState = "play";
    t_cur_timer = t_set_timer;
    console.log({ gameplayPerson, gameplayPersonTurns, gameplay3pCornerMode });
  } else if (gameState == "play") {
    if (mouseX > vw * 0 && mouseX < vw * 0.15 && mouseY > h * 0 && mouseY < vw * 0.15) {
      gameState = "pause";
    } else if (millis() - lastChangeTouch > 500) {
      touch_next_trigger = true;
      s_pop.play();
      console.log(t_cur_timer);
      lastChangeTouch = millis();
    }
  }
}
function draw() {
  Object.values(btns).forEach((b) => {
    if (b.trigger) {
      console.log("1");
      b.trigger = false;
    }
  });
  background(clr.greyDark);
  fill("#222");
  if (orientationA == "h") {
    push();
    rect(w / 2, h / 2, vw * 0.8, vh * 0.8, 10);
    fill(clr.white);
    textSize(vw * 0.1);
    text("Gamer Assist", w / 2, h * 0.4);
    textSize(vw * 0.04);
    text("Please rotate to Portait Mode.", w / 2, h * 0.48);
    pop();
    return;
  }
  if (gameState == "welcome") {
    push();
    rect(w / 2, h / 2, vw * 0.8, vh * 0.8, 10);
    fill(clr.white);
    textSize(vw * 0.1);
    text("Gamer Assist", w / 2, h * 0.4);
    textSize(vw * 0.04);
    text("Timer", w / 2, h * 0.48);
    fill(clr.red);
    translate(w / 2, h * 0.6);
    rect(0, 0, vw * 0.4, vw * 0.1, 10);
    textSize(vw * 0.06);
    fill(255);
    text("Start", 0, 0);
    pop();
  } else if (gameState == "timer_select") {
    push();
    rect(w / 2, h / 2, vw * 0.8, vh * 0.8, 10);
    fill(255);
    textSize(vw * 0.1);
    text("Select", w / 2, h * 0.3);
    pop();
    //2p
    push();
    fill(160, 16, 15);
    translate(w / 2, h * 0.4);
    rect(0, 0, vw * 0.4, vw * 0.1, 10);
    textSize(vw * 0.06);
    fill(255);
    text("2p", 0, 0);
    pop();
    //3p
    push();
    fill(160, 16, 15);
    translate(w / 2, h * 0.5);
    rect(0, 0, vw * 0.4, vw * 0.1, 10);
    textSize(vw * 0.06);
    fill(255);
    text("3p", 0, 0);
    pop();
    //3p corner
    push();
    fill(160, 16, 15);
    translate(w / 2, h * 0.6);
    rect(0, 0, vw * 0.4, vw * 0.1, 10);
    textSize(vw * 0.06);
    fill(255);
    text("3p Corner", 0, 0);
    pop();
    //4p
    push();
    fill(160, 16, 15);
    translate(w / 2, h * 0.7);
    rect(0, 0, vw * 0.4, vw * 0.1, 10);
    textSize(vw * 0.06);
    fill(255);
    text("4p", 0, 0);
    pop();
  } else if (gameState == "play") {
    //arrow
    //2p 3p 4p
    push();
    fill(255, 0, 0);
    translate(0, 0);
    rect(0, 0, vw * 0.3, vw * 0.3);
    pop();
    if (gameplayPersonTurns > 0) {
      push();
      translate(w / 2, h / 2);
      if (gameplayPerson == 2 && gameplayPersonTurns == 1) {
        rotate(90);
      } else if (gameplayPerson == 2 && gameplayPersonTurns == 2) {
        rotate(-90);
      } else if (gameplayPerson == 3 && gameplayPersonTurns == 1 && gameplay3pCornerMode) {
        rotate(-90);
      } else if (gameplayPerson == 3 && gameplayPersonTurns == 2 && gameplay3pCornerMode) {
        rotate(0);
      } else if (gameplayPerson == 3 && gameplayPersonTurns == 3 && gameplay3pCornerMode) {
        rotate(90);
      } else if (gameplayPerson == 3 && gameplayPersonTurns == 1 && !gameplay3pCornerMode) {
        rotate(-90);
      } else if (gameplayPerson == 3 && gameplayPersonTurns == 2 && !gameplay3pCornerMode) {
        rotate(30);
      } else if (gameplayPerson == 3 && gameplayPersonTurns == 3 && !gameplay3pCornerMode) {
        rotate(150);
      } else if (gameplayPerson == 4 && gameplayPersonTurns == 1) {
        rotate(-90);
      } else if (gameplayPerson == 4 && gameplayPersonTurns == 2) {
        rotate(0);
      } else if (gameplayPerson == 4 && gameplayPersonTurns == 3) {
        rotate(90);
      } else if (gameplayPerson == 4 && gameplayPersonTurns == 4) {
        rotate(180);
      }
      scale(vw * 0.0015);
      image(img_arrow, 0, 0);
      pop();
      // console.log({ gameplayPerson, gameplayPersonTurns, gameplay3pCornerMode });
    }

    //player's turn
    if (touch_next_trigger) {
      if (gameplayPersonTurns < gameplayPerson) {
        gameplayPersonTurns++;
      } else {
        gameplayPersonTurns = 1;
      }
      touch_next_trigger = false;
      t_running = true;
      t_cur_timer = t_set_timer;
      t_start_timer = millis();
      console.log({ gameplayPersonTurns });
    }
    //timer run
    if (t_running && t_cur_timer > 20) {
      t_cur_timer = t_set_timer - (millis() - t_start_timer);
    } else if (t_running) {
      t_cur_timer = 0;
      t_running = false;
      s_fail.play();
    }
    var t_min = floor(t_cur_timer / 1000 / 60);
    var t_sec = ceil((t_cur_timer / 1000) % 60);
    fill(255);
    //top timer
    push();
    textSize(vw * 0.25);
    translate(0, -18);
    translate(w / 2, h * 0.2);
    rotate(180);
    if (t_sec < 10) {
      text(`0${t_min}:0${t_sec}`, 0, 0);
    } else {
      text(`0${t_min}:${t_sec}`, 0, 0);
    }
    pop();

    //bottom timer
    push();
    textSize(vw * 0.25);
    translate(0, 18);
    translate(w / 2, h * 0.8);
    if (t_sec < 10) {
      text(`0${t_min}:0${t_sec}`, 0, 0);
    } else {
      text(`0${t_min}:${t_sec}`, 0, 0);
    }
    pop();
  }
}
