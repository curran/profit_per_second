var margin = { top: 30, right: 30, bottom: 30, left: 30 };
width = 300 - margin.left - margin.right,
  height = 300 - margin.top - margin.bottom;

//Create scale
var xScale = d3.scaleLinear()
  .domain([0, 1])
  .range([0, width]);

//Create SVG
var svg = d3.select(".chart").append("svg")
  .attr("width", width + margin.left + margin.right)
  .attr("height", height + margin.top + margin.bottom)
  .append("g")
  .style("filter", "url(#gooey)") //Set the filter on the container svg
  .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

//SVG filter for the gooey effect
//Code taken from http://tympanus.net/codrops/2015/03/10/creative-gooey-effects/
var defs = svg.append('defs');
var filter = defs.append('filter').attr('id', 'gooey');
filter.append('feGaussianBlur')
  .attr('in', 'SourceGraphic')
  .attr('stdDeviation', '10')
  .attr('result', 'blur');
filter.append('feColorMatrix')
  .attr('in', 'blur')
  .attr('mode', 'matrix')
  .attr('values', '1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 18 -7')
  .attr('result', 'gooey');
filter.append('feComposite')
  .attr('in', 'SourceGraphic')
  .attr('in2', 'goo')
  .attr('operator', 'atop');

//Append circle at center
svg.append("circle")
  .attr("class", "centerCircle")
  .attr("cx", 0)
  .attr("cy", 0)
  .attr("r", 20)
  .style("fill", "#81BC00");

//Create a circle that will move out of the center circle
svg.append("circle")
  .attr("class", "flyCircle")
  .attr("cx", 0)
  .attr("cy", 0)
  .attr("r", 15)
  .style("fill", "#81BC00")
  .each(update);

//Continuously keep a circle flying out to a random location along the x-axis
function update() {
  const circle = d3.selectAll(".flyCircle");
  const t1 = d3.transition()
    .duration(1500)
    .ease(d3.easeLinear);
  const t2 = d3.transition()
    .duration(1000)
    .ease(d3.easeLinear);

  (function repeat() {
    circle
      .attr("cx", 0)
      .attr("r", 15)
      .transition(t1).duration(1500)
      .attr("cx", xScale(Math.random()))
      .transition(t2).duration(1000)
      .attr("r", 0)
      .on("end", repeat);
  })();
}//update


// var margin = { top: 50, right: 50, bottom: 50, left: 50 }
// var width = 960 - margin.left - margin.right,
//   height = 500 - margin.top - margin.bottom;

// var svg = d3.select(".chart").append("svg")
//   .attr("width", width + margin.left + margin.right)
//   .attr("height", height + margin.top + margin.bottom)
//   .append("g")
//   .attr("transform", "translate(" + [margin.left, margin.top] + ")")

// var config = {
//   radius: 5,
//   gridLength: 10,
//   gridPadding: 10
// };

// var defs = svg.append('defs');
// var filter = defs.append('filter').attr('id', 'gooey');
// filter.append('feGaussianBlur')
//   .attr('in', 'SourceGraphic')
//   .attr('stdDeviation', config.radius * 1.8)
//   .attr('result', 'blur');
// filter.append('feColorMatrix')
//   .attr("class", "blurValues")
//   .attr('in', 'blur')
//   .attr('mode', 'matrix')
//   .attr('values', '1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 ' + config.radius + ' -6')
//   .attr('result', 'gooey');
// filter.append("feBlend")
//   .attr("in", "SourceGraphic")
//   .attr("in2", "gooey")
//   .attr("operator", "atop");

// var data = d3.range(60).map(function (i) {
//   return {
//     r: config.radius,
//     colour: "purple"
//   }
// });

// var simulation = d3.forceSimulation(data)
//   .force("x", d3.forceX(width / 2))
//   .force("y", d3.forceY(height / 2))
//   .force("collide", d3.forceCollide(config.radius + 1.5).iterations(2))
//   .stop();

// var circleGroup = svg.append("g")
//   .style("filter", "url(#gooey)");

// var smallCircles = circleGroup.append("g").selectAll("circle")
//   .data(data)
//   .enter().append("circle")
//   .attr("class", "small-circle")
//   .attr("r", config.radius)
//   .attr("cx", (d, i) => d.x = (i % config.gridLength) * (config.gridPadding + config.radius * 2))
//   .attr("cy", (d, i) => d.y = Math.floor(i / config.gridLength) * (config.gridPadding + config.radius * 2))
//   .attr("fill", d => d.colour);

// var bigCircle = circleGroup.append("g")
//   .append("circle")
//   .attr("class", "big-circle")
//   .attr("cx", width / 2)
//   .attr("cy", height / 2)
//   .attr("r", 0)
//   .style("fill", "purple");

// function clusterDots() {
//   // Interpolate between gooey filter and no gooey filter
//   transitionGoo(3000);

//   for (var i = 0; i < 120; ++i) simulation.tick();

//   d3.selectAll(".small-circle")
//     .transition()
//     .duration(1500)
//     .delay((d, i) => calculateDistance(d, [width / 2, height / 2]) * 30)
//     .attr("cx", d => d.x)
//     .attr("cy", d => d.y)

//   d3.select(".big-circle")
//     .transition()
//     .delay(700)
//     .duration(2500)
//     .attr("r", Math.sqrt(data.length) * 1.5 * config.radius);
// }

// function separateDots() {
//   transitionGooBack(2000);

//   d3.select(".big-circle")
//     .transition()
//     .duration(2100)
//     .attr("r", 0);

//   d3.selectAll(".small-circle")
//     .transition()
//     .duration(1500)
//     .delay((d, i) => 1500 + (config.radius - calculateDistance(d, [width / 2, height / 2])) * 30)
//     .attr("cx", (d, i) => (i % config.gridLength) * (config.gridPadding + config.radius * 2))
//     .attr("cy", (d, i) => Math.floor(i / config.gridLength) * (config.gridPadding + config.radius * 2));
// }

// function loop() {
//   setTimeout(clusterDots, 1000);
//   setTimeout(separateDots, data.length * 150);
// }

// loop();
// setInterval(loop, data.length * 200);

// function transitionGoo(duration) {
//   d3.selectAll(".blurValues")
//     .transition().duration(duration)
//     .attrTween("values", function () {
//       return d3.interpolateString("1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 6 -6",
//         "1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 " + config.radius * 8 + " -6");
//     });
// }

// function transitionGooBack(duration) {
//   d3.selectAll(".blurValues")
//     .transition().duration(duration)
//     .attrTween("values", function () {
//       return d3.interpolateString("1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 " + config.radius * 8 + " -6", "1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 6 -6");
//     });
// }

// function calculateDistance(d, point) {
//   return Math.sqrt(Math.pow(point[0] - d.x, 2) + Math.pow(point[1] - d.y, 2))
// }