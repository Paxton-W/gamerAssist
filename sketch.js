//
//
// PlayPal (original: game assist)
//
//by paxton

let cvs;
let font1, font2;
let img_arrow;
let w, h;
let s_pop, s_fail, s_beep;
let btns = {};
let countDownSound = [false, false, false, false, false];

let gameState = "wait";

//timer
let t_cur_timer;
let t_set_timer = 30000;
let t_start_timer;
let t_timesup = false;
let t_running = false;
let touch_next_trigger = false;
let lastChangeTouch = 0;
let playerWin = { p1: false, p2: false, p3: false, p4: false };
let timer_p = 2;
let timer_t = 0;
let gameplay3pCornerMode = false;
let timer_pTurns = 1;

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

// window.addEventListener("load", function () {
//   // Set a timeout to ensure the address bar is hidden
//   setTimeout(function () {
//     // Hide the address bar by scrolling down 1 pixel
//     window.scrollTo(0, 1);
//   }, 0);
// });

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
  font2 = loadFont("assets/TiltWarp-Regular-VariableFont_XROT,YROT.ttf");
  img_arrow = loadImage("assets/ar.png");
  s_pop = loadSound("assets/pop.mp3");
  s_fail = loadSound("assets/fail.wav");
  s_beep = loadSound("assets/beep.wav");
}
function setup() {
  cvs = createCanvas(10, 10);
  cvs.parent("p5cvs");
  windowResized();
  //createAButton(btn name, btn lable, x pos, y pos)
  function createAButton(vari, lable, xS, yS, size = 1, sizew = 1) {
    let buttonVar = createButton(lable);
    buttonVar.sizeSet = { w: 0.2 * size * sizew, h: 0.07 * size, font: size };
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
  createAButton("timer_2p", "2", 0.5, 0.5, 1.2);
  createAButton("timer_3p", "3", 0.5, 0.6, 1.2);
  createAButton("timer_3pc", "3<br>(corner)", 0.5, 0.7, 1.2);
  createAButton("timer_4p", "4", 0.5, 0.8, 1.2);
  //timer time select
  createAButton("timer_t_15", "15s", 0.4, 0.4, 1.3, 0.68);
  createAButton("timer_t_30", "30s", 0.4, 0.5, 1.3, 0.68);
  createAButton("timer_t_45", "45s", 0.4, 0.6, 1.3, 0.68);
  createAButton("timer_t_60", "60s", 0.6, 0.4, 1.3, 0.68);
  createAButton("timer_t_75", "75s", 0.6, 0.5, 1.3, 0.68);
  createAButton("timer_t_90", "90s", 0.6, 0.6, 1.3, 0.68);
  //timer win option
  createAButton("win1", "P1", 0.4, 0.6, 1, 0.6);
  createAButton("win2", "P2", 0.4, 0.7, 1, 0.6);
  createAButton("win3", "P3", 0.6, 0.6, 1, 0.6);
  createAButton("win4", "P4", 0.6, 0.7, 1, 0.6);
  //pause menu
  createAButton("pause", "-", 0.1, 0.1, 1);
  createAButton("resume", "Resume", 0.5, 0.3, 1.3);
  createAButton("restart", "Restart", 0.5, 0.35, 1.3);
  createAButton("endGame", "Exit", 0.5, 0.4, 1.3);
  //
  console.log(btns);
  // console.log({ orientationA });
  gameState = "welcome";
  btns.btn_start.show();
  textFont(font2);
  angleMode(DEGREES);
  imageMode(CENTER);
  rectMode(CENTER);
  textAlign(CENTER, CENTER);
  noStroke();
}
function mousePressed() {
  if (gameState == "timer_play") {
    if (mouseX < 0.2 * vw && mouseY < 0.2 * vw) {
    } else if (millis() - lastChangeTouch > 500) {
      touch_next_trigger = true;
      s_pop.play();
      console.log(t_cur_timer);
      lastChangeTouch = millis();
      countDownSound = [false, false, false, false, false];
    }
  }
}
function draw() {
  btnPress();
  background(clr.greyDark);
  //rect inner background
  fill("#222");
  rect(w / 2, h / 2, vw * 0.8, vh * 0.8, 10);
  //
  //should fix the button still shown when "h"
  if (orientationA == "h") {
    push();
    rect(w / 2, h / 2, vw * 0.8, vh * 0.8, 10);
    fill(clr.white);
    textSize(vw * 0.1);
    text("PlayPal", w / 2, h * 0.4);
    textSize(vw * 0.04);
    text("Please rotate to Portait Mode.", w / 2, h * 0.48);
    pop();
    return;
  }
  //
  switch (gameState) {
    case "welcome":
      push();
      fill(clr.white);
      textSize(vw * 0.1);
      text("PlayPal", w / 2, h * 0.4);
      textSize(vw * 0.04);
      text("Board Game Widget", w / 2, h * 0.48);
      textSize(vw * 0.03);
      text("ver 1.1.1 ", w * 0.93, h * 0.97);
      pop();
      break;
    case "func_select":
      push();
      fill(clr.white);
      textSize(vw * 0.1);
      text("Select Tool", w / 2, h * 0.2);
      textSize(vw * 0.04);
      pop();
      break;
    case "timer_select":
      push();
      rect(w / 2, h / 2, vw * 0.8, vh * 0.8, 10);
      fill(255);
      textSize(vw * 0.05);
      text("Select\nNumber of Players", w / 2, h * 0.3);
      pop();
      break;
    case "timer_time":
      push();
      rect(w / 2, h / 2, vw * 0.8, vh * 0.8, 10);
      fill(255);
      textSize(vw * 0.05);
      text("Select Duration", w / 2, h * 0.3);
      pop();
      break;
    case "timer_play":
      if (timer_pTurns > 0) {
        push();
        translate(w / 2, h / 2);
        if (timer_p === 2) {
          if (timer_pTurns === 1) {
            rotate(90);
          } else if (timer_pTurns === 2) {
            rotate(-90);
          }
        } else if (timer_p === 3) {
          if (gameplay3pCornerMode) {
            if (timer_pTurns === 1) {
              rotate(-90);
            } else if (timer_pTurns === 2) {
              rotate(0);
            } else if (timer_pTurns === 3) {
              rotate(90);
            }
          } else {
            if (timer_pTurns === 1) {
              rotate(-90);
            } else if (timer_pTurns === 2) {
              rotate(30);
            } else if (timer_pTurns === 3) {
              rotate(150);
            }
          }
        } else if (timer_p === 4) {
          if (timer_pTurns === 1) {
            rotate(-90);
          } else if (timer_pTurns === 2) {
            rotate(0);
          } else if (timer_pTurns === 3) {
            rotate(90);
          } else if (timer_pTurns === 4) {
            rotate(180);
          }
        }

        scale(vw * 0.0015);
        image(img_arrow, 0, 0);
        pop();
        // console.log({ timer_p, timer_pTurns, gameplay3pCornerMode });
      }

      //player's turn
      if (touch_next_trigger) {
        if (timer_p == 2) {
          if (timer_pTurns == 1) {
            timer_pTurns++;
          } else {
            timer_pTurns = 1;
          }
        } else if (timer_p == 3) {
          if (playerWin.p1 && timer_pTurns == 3) {
            timer_pTurns = 1;
          } else if (playerWin.p2 && timer_pTurns == 1) {
            timer_pTurns = 2;
          } else if (playerWin.p3 && timer_pTurns == 2) {
            timer_pTurns = 3;
          }
          if (timer_pTurns < 3) {
            timer_pTurns++;
          } else {
            timer_pTurns = 1;
          }
        } else if (timer_p == 4) {
          if (playerWin.p1 && timer_pTurns == 3) {
            timer_pTurns = 1;
          } else if (playerWin.p2 && timer_pTurns == 1) {
            timer_pTurns = 2;
          } else if (playerWin.p3 && timer_pTurns == 2) {
            timer_pTurns = 3;
          } else if (playerWin.p4 && timer_pTurns == 3) {
            timer_pTurns = 4;
          }
          if (playerWin.p1 && timer_pTurns == 3) {
            timer_pTurns = 1;
          } else if (playerWin.p2 && timer_pTurns == 1) {
            timer_pTurns = 2;
          } else if (playerWin.p3 && timer_pTurns == 2) {
            timer_pTurns = 3;
          } else if (playerWin.p4 && timer_pTurns == 3) {
            timer_pTurns = 4;
          }
          if (timer_pTurns < 4) {
            timer_pTurns++;
          } else {
            timer_pTurns = 1;
          }
        }

        touch_next_trigger = false;
        t_running = true;
        t_cur_timer = t_set_timer;
        t_start_timer = millis();
        console.log({ timer_pTurns });
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
      if (t_cur_timer < 5000 && !countDownSound[4]) {
        s_beep.play();
        countDownSound[4] = true;
      } else if (t_cur_timer < 4000 && !countDownSound[3]) {
        s_beep.play();
        countDownSound[3] = true;
      } else if (t_cur_timer < 3000 && !countDownSound[2]) {
        s_beep.play();
        countDownSound[2] = true;
      } else if (t_cur_timer < 2000 && !countDownSound[1]) {
        s_beep.play();
        countDownSound[1] = true;
      } else if (t_cur_timer < 1000 && !countDownSound[0]) {
        s_beep.play();
        countDownSound[0] = true;
      }
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
      textSize(vw * 0.05);
      text("Player " + timer_pTurns, 0, h * -0.05);
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
      textSize(vw * 0.05);
      text("Player " + timer_pTurns, 0, h * -0.05);
      pop();
      break;
    case "timer_pause":
      push();
      fill(clr.white);
      textSize(vw * 0.1);
      text("Pause", w / 2, h * 0.17);
      textSize(vw * 0.05);
      text("Finished?", w / 2, h * 0.5);
      pop();
      break;
  }
  // debugInfo();
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
      gameState = "timer_time";
      btns.timer_2p.hide();
      btns.timer_3p.hide();
      btns.timer_3pc.hide();
      btns.timer_4p.hide();
      btns.timer_t_15.show();
      btns.timer_t_30.show();
      btns.timer_t_45.show();
      btns.timer_t_60.show();
      btns.timer_t_75.show();
      btns.timer_t_90.show();
    }
    if (btns.timer_2p.click) {
      timer_p = 2;
      gameplay3pCornerMode = false;
      gameSetup_37849();
      btns.timer_2p.click = false;
    } else if (btns.timer_3p.click) {
      timer_p = 3;
      gameplay3pCornerMode = false;
      gameSetup_37849();
      btns.timer_3p.click = false;
    } else if (btns.timer_3pc.click) {
      timer_p = 3;
      gameplay3pCornerMode = true;
      gameSetup_37849();
      btns.timer_3pc.click = false;
    } else if (btns.timer_4p.click) {
      timer_p = 4;
      gameplay3pCornerMode = false;
      gameSetup_37849();
      btns.timer_4p.click = false;
    }
  } else if (gameState == "timer_time") {
    function gameSetup_timer_time() {
      timer_pTurns = 0;
      gameState = "timer_play";
      btns.pause.show();
      t_cur_timer = t_set_timer;
      btns.timer_t_15.hide();
      btns.timer_t_30.hide();
      btns.timer_t_45.hide();
      btns.timer_t_60.hide();
      btns.timer_t_75.hide();
      btns.timer_t_90.hide();
    }
    if (btns.timer_t_15.click) {
      t_set_timer = 15000;
      gameSetup_timer_time();
      timer_t = 15;
      btns.timer_t_15.click = false;
    } else if (btns.timer_t_30.click) {
      t_set_timer = 30000;
      gameSetup_timer_time();
      timer_t = 30;
      btns.timer_t_30.click = false;
    } else if (btns.timer_t_45.click) {
      t_set_timer = 45000;
      gameplay3pCornerMode = true;
      gameSetup_timer_time();
      timer_t = 45;
      btns.timer_t_45.click = false;
    } else if (btns.timer_t_60.click) {
      t_set_timer = 60000;
      gameSetup_timer_time();
      timer_t = 60;
      btns.timer_t_60.click = false;
    } else if (btns.timer_t_75.click) {
      t_set_timer = 75000;
      gameSetup_timer_time();
      timer_t = 75;
      btns.timer_t_75.click = false;
    } else if (btns.timer_t_90.click) {
      t_set_timer = 90000;
      gameSetup_timer_time();
      timer_t = 90;
      btns.timer_t_90.click = false;
    }
  } else if (gameState == "timer_play") {
    if (btns.pause.click) {
      btns.pause.click = false;
      btns.pause.hide();
      gameState = "timer_pause";
      btns.resume.show();
      btns.endGame.show();
      btns.restart.show();
      if (timer_p == 3) {
        //win
        if (!playerWin.p1 && !playerWin.p2 && !playerWin.p3) {
          btns.win1.show();
          btns.win2.show();
          btns.win3.show();
        }
      } else if (timer_p == 4) {
        //win

        btns.win1.show();
        btns.win2.show();
        btns.win3.show();
        btns.win4.show();

        let winCount = 0;
        playerWin.p1 && winCount++;
        playerWin.p2 && winCount++;
        playerWin.p3 && winCount++;
        playerWin.p4 && winCount++;
        playerWin.p1 && btns.win1.hide();
        playerWin.p2 && btns.win2.hide();
        playerWin.p3 && btns.win3.hide();
        playerWin.p4 && btns.win4.hide();
        if (winCount > 1) {
          btns.win1.hide();
          btns.win2.hide();
          btns.win3.hide();
          btns.win4.hide();
        }
      }
    }
  } else if (gameState == "timer_pause") {
    function gameSetup_timer_pause() {
      gameState = "timer_play";
      btns.pause.show();
      t_cur_timer = t_set_timer;
      //
      btns.resume.hide();
      btns.endGame.hide();
      btns.restart.hide();
      //win
      btns.win1.hide();
      btns.win2.hide();
      btns.win3.hide();
      btns.win4.hide();
    }
    if (btns.resume.click) {
      gameSetup_timer_pause();
      btns.resume.click = false;
    } else if (btns.endGame.click) {
      gameSetup_timer_pause();
      gameReset();

      btns.endGame.click = false;
    } else if (btns.win1.click) {
      playerWin.p1 = true;
      gameSetup_timer_pause();
      btns.win1.click = false;
    } else if (btns.win2.click) {
      playerWin.p2 = true;
      gameSetup_timer_pause();
      btns.win2.click = false;
    } else if (btns.win3.click) {
      playerWin.p3 = true;
      gameSetup_timer_pause();
      btns.win3.click = false;
    } else if (btns.win4.click) {
      playerWin.p4 = true;
      gameSetup_timer_pause();
      btns.win4.click = false;
    } else if (btns.restart.click) {
      gameSetup_timer_pause();
      playerWin = { p1: false, p2: false, p3: false, p4: false };
      t_cur_timer = t_set_timer;
      timer_pTurns = 1;
      btns.restart.click = false;
    }
  }
}
function gameReset() {
  gameState = "welcome";
  btns.btn_start.show();
  t_cur_timer = t_set_timer;
  t_running = false;
  btns.pause.hide();
  gameplay3pCornerMode = false;
  timer_pTurns = 1;
  t_timesup = false;
  touch_next_trigger = false;
  lastChangeTouch = 0;
  [playerWin.p1, playerWin.p2, playerWin.p3, playerWin.p4] = [false, false, false, false];
}
function debugInfo() {
  push();
  fill(0, 255, 0);
  textAlign(LEFT);
  textSize(15);
  let xtop = 10;
  let ytop = 10;
  let ygap = 15;
  text("gameState: " + gameState, xtop, (ytop += ygap));
  text("timer_pTurns: " + timer_pTurns, xtop, (ytop += ygap));
  pop();
}
