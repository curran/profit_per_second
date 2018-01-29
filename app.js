var margin = { top: 30, right: 30, bottom: 30, left: 30 };
width = 300 - margin.left - margin.right,
  height = 300 - margin.top - margin.bottom;

// //Create scale
// var xScale = d3.scaleLinear()
//   .domain([0, 1])
//   .range([0, width]);

// //Create SVG
// var svg = d3.select(".chart").append("svg")
//   .attr("width", width + margin.left + margin.right)
//   .attr("height", height + margin.top + margin.bottom)
//   .append("g")
//   .style("filter", "url(#gooey)") //Set the filter on the container svg
//   .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

// //SVG filter for the gooey effect
// //Code taken from http://tympanus.net/codrops/2015/03/10/creative-gooey-effects/
// var defs = svg.append('defs');
// var filter = defs.append('filter').attr('id', 'gooey');
// filter.append('feGaussianBlur')
//   .attr('in', 'SourceGraphic')
//   .attr('stdDeviation', '10')
//   .attr('result', 'blur');
// filter.append('feColorMatrix')
//   .attr('in', 'blur')
//   .attr('mode', 'matrix')
//   .attr('values', '1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 18 -7')
//   .attr('result', 'gooey');
// filter.append('feComposite')
//   .attr('in', 'SourceGraphic')
//   .attr('in2', 'goo')
//   .attr('operator', 'atop');

// //Append circle at center
// svg.append("circle")
//   .attr("class", "centerCircle")
//   .attr("cx", 0)
//   .attr("cy", 0)
//   .attr("r", 20)
//   .style("fill", "#81BC00");

// //Create a circle that will move out of the center circle
// svg.append("circle")
//   .attr("class", "flyCircle")
//   .attr("cx", 0)
//   .attr("cy", 0)
//   .attr("r", 15)
//   .style("fill", "#81BC00")
//   .each(update);

// //Continuously keep a circle flying out to a random location along the x-axis
// function update() {
//   const circle = d3.selectAll(".flyCircle");
//   const t1 = d3.transition()
//     .duration(1500)
//     .ease(d3.easeLinear);
//   const t2 = d3.transition()
//     .duration(1000)
//     .ease(d3.easeLinear);

//   (function repeat() {
//     circle
//       .attr("cx", 0)
//       .attr("r", 15)
//       .transition(t1).duration(1500)
//       .attr("cx", xScale(Math.random()))
//       .transition(t2).duration(1000)
//       .attr("r", 0)
//       .on("end", repeat);
//   })();
// }//update


////////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////// Let circles pool up
////////////////////////////////////////////////////////////////////////////////////////////////////

const svg = d3.select(".chart").append("svg")
  .attr("width", width + margin.left + margin.right)
  .attr("height", height + margin.top + margin.bottom)
  .append("g")
  .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

const numberOfCircles = 60;
const position = width / 2;
const transitionEase = d3.easeBounce;
const radius = 15;
let nodes = d3.range(numberOfCircles);
 
nodes = nodes.map(function(d) { return { id: d }; } );

console.log(height);

var extent = [[0, width], [0, height]];



d3.forceExtent = function (extent) {
  var nodes;
  if (extent == null) extent = [[0, 800], [0, 500]];
  function force() {
    var i,
      n = nodes.length,
      node,
      r = 0;
    for (i = 0; i < n; ++i) {
      node = nodes[i];
      r = (node.radius || 0);
      node.x = Math.max(Math.min(node.x, extent[0][1] - r), extent[0][0] + r);
      node.y = Math.max(Math.min(node.y, extent[1][1] - r), extent[1][0] + r);
    }
  }
  force.initialize = function (_) { nodes = _; };
  force.extent = function (_) {
    return arguments.length ? (extent = _, force) : extent;
  };
  return force;
};

var simulation = d3.forceSimulation(nodes)
  .force("x", d3.forceX(position))
  .force("y", d3.forceY(height))
  .force("extent", d3.forceExtent(extent))
  .force("collide", d3.forceCollide(radius + 2))
  .stop();

for (var i = 0; i < 120; ++i) simulation.tick();

var counter = 0;

var legendA = svg.append("g")
  .append("text")
  .attr("class", "counter")
  .attr("x", position)
  .attr("text-anchor", "middle")
  .text(0);

function increment(pile) {
  counter++;
  legendA.text(counter);
}

addCircles(nodes, "a");

function addCircles(data, pile) {

  var circle = svg.append("g")
    .attr("class", "circles")
    .selectAll("g").data(nodes)
    .enter().append("g")
    .attr("transform", function (d) {
      return "translate(" + d.x + "," + (-margin.top - radius * 2) + ")"
    });

  circle.append("circle")
    .attr("r", radius)
  circle.append("text")
    .attr("class", "coin-text")
    .attr("text-anchor", "middle")
    .attr("dy", radius / 3)
    .text("£");

  circle.transition()
    .duration(750)
    .delay(function (d, i) {
      return (height - d.y) * 20;
    })
    .ease(transitionEase)
    .attr("transform", function (d) {
      return "translate(" + d.x + ", " + d.y + ")";
    })
    .on("end", function () {
      increment(pile);
    });
}