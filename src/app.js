let canvas = document.querySelector(".myCanvas");
let width = (canvas.width);
let height = (canvas.height);
let ctx = canvas.getContext("2d");
ctx.fillStyle = "rgb(255,255,255)";
ctx.fillRect(0, 0, width, height);

let getI = document.getElementById('amper');
let clearButton = document.getElementById('clear');
let inputValue = document.getElementById('value');
let inputValueL = document.getElementById('valueL');
let delButton = document.getElementById('del');
let resultButton = document.getElementById('result');

let mu = 4*Math.PI*Math.pow(10,-7);

class Point{
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }
}

class Vector{
    constructor(start, finish, modul) {
        this.start = start;
        this.finish = finish;
        this.modul = modul;
    }
}

class Circle {
    constructor(x, y, radius, color,isSelected,q) {
        this.x = x;
        this.y = y;
        this.radius = radius;
        this.color = color;
        this.isSelected = isSelected;
        this.q = q;
    }
}
// Этот массив хранит все окружности на холсте
var circles = [];

var vectors = [];

var previousSelectedCircle;

function SumVector(vector1, vector2){
    if (vector1.start.x != vector2.start.x || vector1.start.y != vector2.start.y){
        return;
    }
    let A1 = vector1.finish.x- vector1.start.x;
    let A2 = vector2.finish.x- vector2.start.x;
    let B1 = vector1.finish.y- vector1.start.y;
    let B2 = vector2.finish.y- vector2.start.y;
    return new Vector(vector1.start,new Point(vector1.start.x+A1+A2, vector1.start.y+B1+B2),vector1.modul+vector2.modul)
}

function GetB(x,y,circle) {

    r = Math.sqrt(Math.pow(x-circle.x,2)+Math.pow(y-circle.y,2));
    if (r < circle.radius) {
        return;
    }
    modul = Math.pow(10,-7)*Math.abs(circle.q)/Math.pow(r,2);
    console.log(modul);
    let mnozh = Math.pow(11,9);
    if (circle.q>0){
        let B =(x-circle.x)*modul*mnozh;
        B= Math.min(B,45);
        B= Math.max(B,-45);
        let A =  -(circle.y-y)*modul*mnozh;
        A= Math.min(A,45);
        A= Math.max(A,-45);
        console.log("A ",A,"B ",B);
        return new Vector(new Point(x,y), new Point(x+A,y-B), modul);
    }
    else if (circle.q<0){
        let B =-(x-circle.x)*modul*mnozh;
        B= Math.min(B,50);
        B= Math.max(B,-50);
        let A =  (circle.y-y)*modul*mnozh;
        A= Math.min(A,50);
        A= Math.max(A,-50);
        return new Vector(new Point(x,y),new Point(x+A,y-B), modul);
    }
    return new Vector(new Point(x,y), new Point(x,y), modul);
  }

function DrawVector(vector) {
    if (vector == null){
        return;
    }
    var len = Math.sqrt(Math.pow(vector.finish.x-vector.start.x,2)+Math.pow(vector.finish.y-vector.start.y,2));
    console.log("vector.start.x: ", vector.start.x, "vector.start.y", vector.start.y);
    console.log("vector.finish.x: ", vector.finish.x, "vector.finish.y", vector.finish.y);
    /*
    while (len <= 1){
        vector.finish.x += (vector.finish.x - vector.start.x);
        vector.finish.y += (vector.finish.y - vector.start.y);
        len = Math.sqrt(Math.pow(vector.finish.x-vector.start.x,2)+Math.pow(vector.finish.y-vector.start.y,2));
    }
    */
    console.log(len);
    if (len <=0){
        return;
    }
    var PI=Math.PI;
    var headLength = 5;
  var degreesInRadians225=225*PI/180;
  var degreesInRadians135=135*PI/180;

  // calc the angle of the line
  var dx=vector.finish.x-vector.start.x;
  var dy=vector.finish.y-vector.start.y;
  var angle=Math.atan2(dy,dx);

  // calc arrowhead points
  var x225=vector.finish.x+headLength*Math.cos(angle+degreesInRadians225);
  var y225=vector.finish.y+headLength*Math.sin(angle+degreesInRadians225);
  var x135=vector.finish.x+headLength*Math.cos(angle+degreesInRadians135);
  var y135=vector.finish.y+headLength*Math.sin(angle+degreesInRadians135);

  ctx.strokeStyle = "rgb(55 48 163 / 100%)";
  // draw line plus arrowhead
  ctx.beginPath();
  // draw the line from p0 to p1
  ctx.moveTo(vector.start.x,vector.start.y);
  ctx.lineTo(vector.finish.x,vector.finish.y);
  // draw partial arrowhead at 225 degrees
  ctx.moveTo(vector.finish.x,vector.finish.y);
  ctx.lineTo(x225,y225);
  // draw partial arrowhead at 135 degrees
  ctx.moveTo(vector.finish.x,vector.finish.y);
  ctx.lineTo(x135,y135);
  // stroke the line and arrowhead
  ctx.stroke();
}
resultButton.onclick = function(){
    if (circles.length == 0){
        return;
    }
    for(var curX=0; curX<600; curX+=45) {
        for(var curY=0; curY<500; curY+=45) {
            let res_vec = new Vector(new Point(curX,curY),new Point(curX,curY),0);
            for(var i=circles.length-1; i>=0; i--) {
                let r = Math.sqrt(Math.pow(curX-circles[i].x,2)+Math.pow(curY-circles[i].y,2));
                if (r < circles[i].radius) {
                    res_vec = new Vector(new Point(curX,curY),new Point(curX,curY),0);
                    break;
                }
                let vec = GetB(curX,curY,circles[i]);
                if (vec !=null){
                    res_vec = SumVector(res_vec,vec)
                }
            }
            DrawVector(res_vec);
        }
    }
    
}



inputValue.onkeydown= function (e){
    if(e.key == 'Enter') {
        console.log("kjkj"); 
        console.log(e.currentTarget.value);
        var circle = new Circle(25, 25, 25, "black",false,Number(e.currentTarget.value));

        // Сохраняем его в массиве
        circles.push(circle);

        // Обновляем отображение круга
        drawCircles();   
        inputValue.classList.add('hidden');
        inputValueL.classList.add('hidden');  
    }
}
canvas.onclick = function (e){
    // Получаем координаты точки холста, в которой щелкнули
  var clickX = e.pageX - canvas.offsetLeft - 577;
  var clickY = e.pageY - canvas.offsetTop - 114;
  console.log(canvas.offsetLeft);
  console.log(canvas.offsetTop);
  console.log(clickX);
  console.log(clickY);

  // Проверяем, щелкнули ли no кругу
  for(var i=circles.length-1; i>=0; i--) {
    var circle = circles[i];

    // С помощью теоремы Пифагора вычисляем расстояние от 
	// точки, в которой щелкнули, до центра текущего круга
    var distanceFromCenter = Math.sqrt(Math.pow(circle.x - clickX, 2) + Math.pow(circle.y - clickY, 2))
	
	// Определяем, находится ли точка, в которой щелкнули, в данном круге
    if (distanceFromCenter <= circle.radius) {
	  // Сбрасываем предыдущий выбранный круг	
      if (previousSelectedCircle != null) {
        previousSelectedCircle = null;
        delButton.classList.add('hidden');
      }
      if (circle.isSelected){
        circle.isSelected = false;
        previousSelectedCircle = null;
        circle.color = "black";
        delButton.classList.add('hidden');
      }
      else{
        previousSelectedCircle = i;
        circle.isSelected = true;
        circle.color = "red";
        delButton.classList.remove('hidden');
      }
      drawCircles();
      return;
    }
  }
};

delButton.onclick = function () {
    if (previousSelectedCircle != null) {
        circles.splice(previousSelectedCircle,1);
        previousSelectedCircle = null;
        delButton.classList.add('hidden');
        drawCircles();
      }
}

canvas.onmousemove = function (e){
    if (previousSelectedCircle != null) {
        // Сохраняем позицию мыши
        var x = e.pageX - canvas.offsetLeft - 577;
        var y = e.pageY - canvas.offsetTop - 114;
        if (x <0 || y<0){
            return;
        }
  
        // Перемещаем круг в новую позицию
        circles[previousSelectedCircle].x = x;
        circles[previousSelectedCircle].y = y;
  
        // Обновляем холст
        drawCircles();
      }
};

getI.onclick = function () {
    // Создаем новый круг
    if (circles.length == 4){
        return;
    }
    inputValue.classList.remove('hidden');
    inputValueL.classList.remove('hidden');
  };

  function drawCircles() {
    // Очистить холст
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = '#ffffff'; // белый цвет
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Перебираем все круги
    for(var i=0; i<circles.length; i++) {
        var circle = circles[i];

        // Рисуем текущий круг
        ctx.globalAlpha = 0.85;
        ctx.beginPath();
        ctx.arc(circle.x, circle.y, circle.radius, 0, Math.PI*2);
        // ctx.fillStyle = circle.color;
        ctx.strokeStyle = circle.color;

        // Выделяем выбранный круг рамкой (потребуется позже)
        if (circle.isSelected) {
            ctx.lineWidth = 3;
        }
        else {
            ctx.lineWidth = 1;
        }
        ctx.fill();
        ctx.stroke(); 
        ctx.font = "15px serif";
        console.log(circle.q.toString());
        ctx.strokeText(circle.q.toString(), circle.x-3*circle.radius/4, circle.y);
        ctx.stroke(); 

    }
}

function clearCanvas() {
    // Очистить массив
    circles = [];

    // Очистить холст
    drawCircles();
}

clearButton.onclick = function () {
    circles = [];
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = '#ffffff'; // белый цвет
    ctx.fillRect(0, 0, canvas.width, canvas.height);
}
