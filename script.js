const pointsText = document.querySelector(".popup__points");
const popup = document.querySelector(".popup");
const infoSet = document.querySelector(".first_set");
const graph = document.querySelector(".graph");
const colors = [
  "#fc5c65",
  "#fd9644",
  "#fed330",
  "#26de81",
  "#2bcbba",
  "#45aaf2",
  "#4b7bec",
  "#a55eea",
  "#d1d8e0",
  "#4b6584",
];
const width = document.querySelector(".graph").getAttribute("width");
const height = document.querySelector(".graph").getAttribute("height");

const fontSize = parseInt(
  getComputedStyle(document.querySelector("body")).fontSize
);
const padding = fontSize * 3;
const chartWidth = width - padding;
const chartHeight = height - padding;

const data = [
  [
    {x: 0, y: 0 },
    {x: 8, y: 3 },
    {x: 1, y: 1 },
    {x: 9, y: 5 },
    {x: 2, y: 4 },
    {x: 7, y: 4 },
    {x: 3, y: 7 },
    {x: 5, y: 3 },
  ],

  [
    {x: 0, y: 0 },
    {x: 4, y: 3 },
    {x: 1, y: 9 },
    {x: 7, y: 8 },
    {x: 2, y: 4 },
    {x: 9, y: 4 },
    {x: 3, y: 7 },
    {x: 5, y: 3 },
  ],
  [
    {x: 2, y: 1 },
    {x: 9, y: 6 },
    {x: 4, y: 9 },
    {x: 10, y: 8 },
  ],
];

let numberOfVerticalGuides = 4;
let numberOfHorizontalGuides = 4;


data.forEach((elem) => {
  elem.sort(function (a, b) {
    if (a.x > b.x) {
      return 1;
    }
    if (a.x < b.x) {
      return -1;
    }
  });
});

function catmullRom2bezier(points) {
  var result = [];
  for (var i = 0; i < points.length - 1; i++) {
    var p = [];

    p.push({
      x: points[Math.max(i - 1, 0)].x,
      y: points[Math.max(i - 1, 0)].y,
    });
    p.push({
      x: points[i].x,
      y: points[i].y,
    });
    p.push({
      x: points[i + 1].x,
      y: points[i + 1].y,
    });
    p.push({
      x: points[Math.min(i + 2, points.length - 1)].x,
      y: points[Math.min(i + 2, points.length - 1)].y,
    });

    // Catmull-Rom to Cubic Bezier conversion matrix
    //    0       1       0       0
    //  -1/6      1      1/6      0
    //    0      1/6      1     -1/6
    //    0       0       1       0

    var bp = [];
    bp.push({
      x: (-p[0].x + 6 * p[1].x + p[2].x) / 6,
      y: (-p[0].y + 6 * p[1].y + p[2].y) / 6,
    });
    bp.push({
      x: (p[1].x + 6 * p[2].x - p[3].x) / 6,
      y: (p[1].y + 6 * p[2].y - p[3].y) / 6,
    });
    bp.push({
      x: p[2].x,
      y: p[2].y,
    });
    result.push(bp);
  }

  return result;
}

function makePath(points) {
  var result = "M" + points[0].x + "," + points[0].y + " ";
  var catmull = catmullRom2bezier(points);
  for (var i = 0; i < catmull.length; i++) {
    result +=
      "C" +
      catmull[i][0].x +
      "," +
      catmull[i][0].y +
      " " +
      catmull[i][1].x +
      "," +
      catmull[i][1].y +
      " " +
      catmull[i][2].x +
      "," +
      catmull[i][2].y +
      " ";
  }
  return result;
}

function dataConvert(arr) {
  arr.forEach((elem)=>{
    const xes = dataConvertDispersion(elem, 'x', chartWidth -3*padding);
    const yes = dataConvertDispersion(elem, 'y', chartHeight - 3*padding);
    


    for (let value of elem) {
      value.x= parseInt(xes[elem.indexOf(value)]);
    }
    for (let value of elem) {
      value.y= parseInt(yes[elem.indexOf(value)]);
      
      value.y = chartHeight - value.y
    }


    return elem
    })
}

function drawPath(i, color) {
  const infoPath = document.createElementNS(
    "http://www.w3.org/2000/svg",
    "path"
  );
  infoPath.setAttribute("fill", `none`);
  infoPath.setAttribute("stroke", `${color}`);
  infoPath.setAttribute("stroke-width", `3`);
  infoPath.setAttribute("id", `graph${i}`);
  return infoPath;
}

function drawCircles(item, color, place) {
  let c = document.createElementNS("http://www.w3.org/2000/svg", "circle");
  c.setAttribute("cx", item.x);
  c.setAttribute("cy", item.y);
  c.setAttribute("r", "5");
  c.setAttribute("fill", `${color}`);
  place.appendChild(c);
}

function dataConvertDispersion(array, axis, dimension){
  
  // dimension = 300
  const minimumFromData=Math.min(...array.flat().map((e) => e[axis]));
  const axisFromData = (array.flat().map((e) => e[axis]))
  const reducer = (accumulator, currentValue) => accumulator + currentValue;
  const avgFromData = axisFromData.reduce(reducer)/axisFromData.length;
  const squares = axisFromData.map(elem => Math.pow(elem, 2))
  const avgSquares = squares.reduce(reducer)/squares.length;
  const disp = avgSquares - Math.pow(avgFromData, 2);
  return axisFromData.map(elem=>(((elem-minimumFromData)/disp)*dimension).toFixed(2))
}
   
function getMaxFromData (array, axis){
return Math.max(...array.flat().map((e) => e[axis]))
}
// const maximumXFromData = Math.max(...data.flat().map((e) => e.x));
// const maximumYFromData = Math.max(...data.flat().map((e) => e.y));

// const digits =
// parseFloat(maximumYFromData.toString()).toFixed(2).length + 1;



// const points = data
// .map((element,index) => {
//   const x = (element[index].x / maximumXFromData) * chartWidth + padding;
//   const y =
//     chartHeight - (element[index].y / maximumYFromData) * chartHeight + padding;
//   return `${x},${y}`;

// })
// .join(" ");
// console.log(points)

function createAxis(values) {
  const Axis = document.createElementNS(
    "http://www.w3.org/2000/svg",
    "polyline"
  );
  Axis.setAttribute("fill", `none`);
  Axis.setAttribute("stroke", "#adadad");
  Axis.setAttribute("stroke-width", `1`);
  Axis.setAttribute("points", `${values}`);
  graph.appendChild(Axis);
}

// const Axis = ({ points }) => (
//   <polyline fill="none" stroke="#ccc" strokeWidth=".5" points={points} />
// );

function makeGridX() {
  let newPoints = `${padding},${chartHeight - padding} ${
    chartWidth
  },${chartHeight - padding}`;
  createAxis(newPoints);
}

// const XAxis = () => (
//   <Axis
//     points={`${padding},${height - padding} ${width - padding},${height -
//       padding}`}
//   />
// );

function makeGridY() {
  let newPoints = `${padding},${padding} ${padding},${chartHeight - padding}`;
  createAxis(newPoints);
}

// const YAxis = () => (
//   <Axis points={`${padding},${padding} ${padding},${height - padding}`} />
// );

const VerticalGuides = () => {
  const guideCount = numberOfVerticalGuides;
  const startY = padding;
  const endY = chartHeight - padding;

  return new Array(guideCount).fill(0).map((_, index) => {
    const ratio = (index + 1) / guideCount;
    const xCoordinate = padding + ratio * (chartWidth - padding);
    const Line = document.createElementNS(
      "http://www.w3.org/2000/svg",
      "polyline"
    );
    Line.setAttribute("fill", `none`);
    Line.setAttribute("stroke", "#adadad");
    Line.setAttribute("stroke-width", `0.5`);
    Line.setAttribute("stroke-linejoin", `round`);
    Line.setAttribute(
      "points",
      `${xCoordinate},${startY} ${xCoordinate},${endY}`
    );
    graph.appendChild(Line);
  });
};

const HorizontalGuides = () => {
  const startX = padding;
  const endX = chartWidth;

  return new Array(numberOfHorizontalGuides).fill(0).map((_, index) => {
    const ratio = (index + 1) / numberOfHorizontalGuides;
    const yCoordinate = chartHeight - chartHeight * ratio + padding;
    const Line = document.createElementNS(
      "http://www.w3.org/2000/svg",
      "polyline"
    );
    Line.setAttribute("fill", `none`);
    Line.setAttribute("stroke", "#adadad");
    Line.setAttribute("stroke-width", `0.5`);
    Line.setAttribute("stroke-linejoin", `round`);
    Line.setAttribute(
      "points",
      `${startX},${yCoordinate} ${endX},${yCoordinate}`
    );
    graph.appendChild(Line);
  });
};

const LabelsXAxis = () => {
  const parts = numberOfVerticalGuides;
  return new Array(parts + 1).fill(0).map((element, index) => {
    const ratio = index / numberOfVerticalGuides;
    const xCoordinate = padding + ratio * (chartWidth - padding);
    const text = document.createElementNS("http://www.w3.org/2000/svg", "text");
    text.setAttribute("x", `${xCoordinate}`);
    text.setAttribute("y", `${chartHeight}`);
    text.textContent = `${parseFloat(
      ((getMaxFromData(data, 'x'))) * (index / parts)
    ).toFixed(1)}`;
    document.querySelector(".x-labels").appendChild(text);
  });
};

const LabelsYAxis = () => {
  const parts = numberOfHorizontalGuides;

  return new Array(parts + 1).fill(0).map((element, index) => {
    const ratio = index / numberOfHorizontalGuides;
    const yCoordinate =
      chartHeight - chartHeight * ratio + (padding + fontSize / 2)*-1;

    const text = document.createElementNS("http://www.w3.org/2000/svg", "text");
    text.setAttribute("x", `${fontSize}`);
    text.setAttribute("y", `${yCoordinate}`);
    text.textContent = `${parseFloat(
      getMaxFromData(data, 'y') * (index / parts)
    ).toFixed(1)}`;
    document.querySelector(".y-labels").appendChild(text);
  });
};

function makeDistances() {
  let circles = Array.from(document.querySelectorAll("circle"));
  let linkCoords = circles.map((link) => {
    let rect = link.getBoundingClientRect();
    return [rect.x, rect.y];
  });

  graph.addEventListener("mousemove", (ev) => {
    popup.setAttribute(
      "style",
      `left:${ev.pageX};top:${
        parseInt(ev.pageY) + padding
      }; display:-webkit-box;`
    );
    let distances = [];
    linkCoords.forEach((linkCoord) => {
      let distance = Math.hypot(
        linkCoord[0] - parseInt(ev.clientX),
        linkCoord[1] - parseInt(ev.clientY)
      );
      distances.push(parseInt(distance));
    });
    let closestLinkIndex = distances.indexOf(Math.min(...distances));
    pointsText.textContent = `x:${circles[closestLinkIndex].getAttribute(
      "cx"
    )}, y:${chartHeight-(circles[closestLinkIndex].getAttribute("cy"))}`;
    circles[closestLinkIndex].setAttribute("r", "10");
    circles[closestLinkIndex].setAttribute(
      "style",
      "transition: ease-in-out 0.3s;"
    );
    setTimeout(function () {
      circles[closestLinkIndex].setAttribute("r", "5");
    }, 500);
  });

  graph.addEventListener("mouseout", function () {
    popup.removeAttribute("style", "display");
  });
}

window.onload = function () {
  dataConvert(data);
  data.forEach((elem, index) => {
    let randomIndex = Math.floor(Math.random() * 6);
    const path = drawPath(index, `${colors[randomIndex]}`);
    path.setAttribute("d", makePath(elem));
    infoSet.appendChild(path);
    elem.forEach((item) => {
      drawCircles(item, `${colors[randomIndex]}`, infoSet);
    });
    
  });
  makeDistances();
  LabelsYAxis();
  LabelsXAxis();
  makeGridX();
  makeGridY();
  VerticalGuides();
  HorizontalGuides();
};
