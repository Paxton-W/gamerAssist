//
//
// PlayPal (original: game assist)
//
//by paxton

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

window.addEventListener("load", function () {
  // Set a timeout to ensure the address bar is hidden
  setTimeout(function () {
    // Hide the address bar by scrolling down 1 pixel
    window.scrollTo(0, 1);
  }, 0);
});

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
  //createAButton(btn name, btn lable, x pos, y pos)
  function createAButton(vari, lable, xS, yS, size = 1) {
    let buttonVar = createButton(lable);
    buttonVar.sizeSet = { w: 0.2 * size, h: 0.07 * size, font: size };
    buttonVar.pos = { x: xS, y: yS };
    buttonVar.position(
      buttonVar.pos.x * ww - vw * buttonVar.sizeSet.w * 0.5,
      buttonVar.pos.y * hh - vw * buttonVar.sizeSet.w * 0.5,
      "fixed"
    );
    buttonVar.size(vw * buttonVar.sizeSet.w, vw * buttonVar.sizeSet.h);
    buttonVar.style("font-size", String(vw * 0.02 * buttonVar.sizeSet.font) + "pt");
    buttonVar.addClass("button");
    buttonVar.id(vari);
    buttonVar.hide();
    //p5 mousePressed
    buttonVar.trigger = false;
    buttonVar.mousePressed(() => {
      buttonVar.trigger = true;
      // console.log(buttonVar);
    });
    //js eventlistener
    buttonVar.click = false;
    buttonVar.elt.addEventListener("click", () => {
      // console.log(vari);
      buttonVar.click = true;
    });
    Object.assign(btns, { [vari]: buttonVar });
    console.log(buttonVar);
  }
  //welcome page button
  createAButton("btn_start", "Start", 0.5, 0.7, 1.5);
  //function menu
  createAButton("func_timer", "Timer", 0.5, 0.4, 1.2);
  //rummikub players amount
  createAButton("timer_2p", "2p", 0.5, 0.5);
  createAButton("timer_3p", "3p", 0.5, 0.6);
  createAButton("timer_3pc", "3p (Corner)", 0.5, 0.7);
  createAButton("timer_4p", "4p", 0.5, 0.8);
  console.log(btns);
  // console.log({ orientationA });
  gameState = "welcome";
  btns.btn_start.show();
  textFont(font1);
  angleMode(DEGREES);
  imageMode(CENTER);
  rectMode(CENTER);
  textAlign(CENTER, CENTER);
  noStroke();
}
function mousePressed() {
  // if (gameState == "welcome") {
  //   if (mouseX > w * 0.46 && mouseX < w * 0.54) {
  //     gameState = "timer_select";
  //   }
  // } else if (gameState == "timer_select") {
  //   if (mouseX > w * 0.46 && mouseX < w * 0.54 && mouseY > h * 0.4 - vw * 0.05 && mouseY < h * 0.4 + vw * 0.05) {
  //     //2p
  //     gameplayPerson = 2;
  //     gameplay3pCornerMode = false;
  //   } else if (mouseX > w * 0.46 && mouseX < w * 0.54 && mouseY > h * 0.5 - vw * 0.05 && mouseY < h * 0.5 + vw * 0.05) {
  //     //3p
  //     gameplayPerson = 3;
  //     gameplay3pCornerMode = false;
  //   } else if (mouseX > w * 0.46 && mouseX < w * 0.54 && mouseY > h * 0.6 - vw * 0.05 && mouseY < h * 0.6 + vw * 0.05) {
  //     //3pc
  //     gameplayPerson = 3;
  //     gameplay3pCornerMode = true;
  //   } else if (mouseX > w * 0.46 && mouseX < w * 0.54 && mouseY > h * 0.7 - vw * 0.05 && mouseY < h * 0.7 + vw * 0.05) {
  //     //4p
  //     gameplayPerson = 4;
  //     gameplay3pCornerMode = false;
  //   }
  //   gameplayPersonTurns = 0;
  //   gameState = "play";
  //   t_cur_timer = t_set_timer;
  //   console.log({ gameplayPerson, gameplayPersonTurns, gameplay3pCornerMode });
  // } else if (gameState == "play") {
  //   if (mouseX > vw * 0 && mouseX < vw * 0.15 && mouseY > h * 0 && mouseY < vw * 0.15) {
  //     gameState = "pause";
  //   } else if (millis() - lastChangeTouch > 500) {
  //     touch_next_trigger = true;
  //     s_pop.play();
  //     console.log(t_cur_timer);
  //     lastChangeTouch = millis();
  //   }
  // }
}
function draw() {
  btnPress();
  Object.values(btns).forEach((b) => {
    if (b.trigger) {
      console.log("1");
      b.trigger = false;
    }
  });
  background(clr.greyDark);
  fill("#222");
  rect(w / 2, h / 2, vw * 0.8, vh * 0.8, 10);
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
    fill(clr.white);
    textSize(vw * 0.1);
    text("Gamer Assist", w / 2, h * 0.4);
    textSize(vw * 0.04);
    text("Timer", w / 2, h * 0.48);
    // fill(clr.red);
    // translate(w / 2, h * 0.6);
    // rect(0, 0, vw * 0.4, vw * 0.1, 10);
    // textSize(vw * 0.06);
    // fill(255);
    // text("Start", 0, 0);
    pop();
  } else if (gameState == "func_select") {
    push();
    fill(clr.white);
    textSize(vw * 0.1);
    text("Select Tool", w / 2, h * 0.2);
    textSize(vw * 0.04);
    pop();
  } else if (gameState == "timer_select") {
    push();
    rect(w / 2, h / 2, vw * 0.8, vh * 0.8, 10);
    fill(255);
    textSize(vw * 0.1);
    text("Select", w / 2, h * 0.3);
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

function btnPress() {
  if (gameState == "welcome" && btns.btn_start.click) {
    gameState = "func_select";
    btns.btn_start.click = false;
    btns.btn_start.hide();
    //display function select button
    btns.func_timer.show();
  } else if (gameState == "func_select" && btns.func_timer.click) {
    gameState = "timer_select";
    btns.func_timer.click = false;
    btns.func_timer.hide();
    //show timer player amount select button
    btns.timer_2p.show();
    btns.timer_3p.show();
    btns.timer_3pc.show();
    btns.timer_4p.show();
  } else if (gameState == "timer_select") {
    function gameSetup_37849() {
      gameplayPersonTurns = 0;
      gameState = "play";
      t_cur_timer = t_set_timer;
      btns.timer_2p.hide();
      btns.timer_3p.hide();
      btns.timer_3pc.hide();
      btns.timer_4p.hide();
    }
    if (btns.timer_2p.click) {
      gameplayPerson = 2;
      gameplay3pCornerMode = false;
      gameSetup_37849();
      btns.timer_2p.click = false;
    } else if (btns.timer_3p.click) {
      gameplayPerson = 3;
      gameplay3pCornerMode = false;
      gameSetup_37849();
      btns.timer_3p.click = false;
    } else if (btns.timer_3pc.click) {
      gameplayPerson = 3;
      gameplay3pCornerMode = true;
      gameSetup_37849();
      btns.timer_3pc.click = false;
    } else if (btns.timer_4p.click) {
      gameplayPerson = 4;
      gameplay3pCornerMode = false;
      gameSetup_37849();
      btns.timer_4p.click = false;
    }
  } else if (gameState == "play") {
  }
}
