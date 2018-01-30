var margin = { top: 30, right: 30, bottom: 30, left: 30 };
  width = 500 - margin.left - margin.right,
  height = 500 - margin.top - margin.bottom;

////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////// Nahdie's Gooey Example
////////////////////////////////////////////////////////////////////////////////

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


////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////// Gooey grid
////////////////////////////////////////////////////////////////////////////////

  // const svg = d3.select(".chart").append("svg")
  //   .attr("width", width + margin.left + margin.right)
  //   .attr("height", height + margin.top + margin.bottom)
  //   .append("g")
  //   // .style("filter", "url(#gooey)") //Set the filter on the container svg
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

  // const numberOfCircles = 60;
  // const position = width / 2;
  // const transitionEase = d3.easeExp;
  // const radius = 15;
  // let nodes = d3.range(numberOfCircles);

  // d3.csv('data.csv', (error, data) => {
  //   if (error) {
  //     return console.warn(error);
  //   }

  //   var config = {
  //     radius: 15,
  //     gridLength: 10,
  //     gridPadding: 10
  //   };

  //   const xData = d3.range(60).map(function (i) {
  //     return {
  //       r: config.radius,
  //       colour: "purple"
  //     }
  //   });

  //   var xSimulation = d3.forceSimulation(xData)
  //     .force("x", d3.forceX(width / 2))
  //     .force("y", d3.forceY(height))
  //     .force("collide", d3.forceCollide(config.radius + 1.5).iterations(2))
  //     .stop();

  //   var circleGroup = svg.append("g")
  //     .style("filter", "url(#gooey)");

  //   var smallCircles = circleGroup.append("g")
  //     .selectAll("circle").data(xData)
  //       .enter().append("circle")
  //         .attr("class", "small-circle")
  //         .attr("r", config.radius)
  //         .attr("cx", (d, i) => d.x = (i % config.gridLength) * (config.gridPadding + config.radius * 2))
  //         .attr("cy", (d, i) => d.y = Math.floor(i / config.gridLength) * (config.gridPadding + config.radius * 2))
  //         .attr("fill", d => d.colour);

  //   var bigCircle = circleGroup.append("g")
  //     .append("circle")
  //     .attr("class", "big-circle")
  //     .attr("cx", width / 2)
  //     .attr("cy", height / 2)
  //     .attr("r", 0)
  //     .style("fill", "purple");

  //   function clusterDots() {
  //     // Interpolate between gooey filter and no gooey filter
  //     transitionGoo(3000);

  //     for (var i = 0; i < 120; ++i) xSimulation.tick();

  //     d3.selectAll(".small-circle")
  //       .transition()
  //       .duration(1500)
  //       .delay((d, i) => calculateDistance(d, [width / 2, height / 2]) * 30)
  //       .attr("cx", d => d.x)
  //       .attr("cy", d => d.y)

  //     d3.select(".big-circle")
  //       .transition()
  //       .delay(700)
  //       .duration(2500)
  //       .attr("r", Math.sqrt(xData.length) * 1.5 * config.radius);
  //   }

  //   function separateDots() {
  //     transitionGooBack(2000);

  //     d3.select(".big-circle")
  //       .transition()
  //       .duration(2100)
  //       .attr("r", 0);

  //     d3.selectAll(".small-circle")
  //       .transition()
  //       .duration(1500)
  //       .delay((d, i) => 1500 + (config.radius - calculateDistance(d, [width / 2, height / 2])) * 30)
  //       .attr("cx", (d, i) => (i % config.gridLength) * (config.gridPadding + config.radius * 2))
  //       .attr("cy", (d, i) => Math.floor(i / config.gridLength) * (config.gridPadding + config.radius * 2));
  //   }

  //   function loop() {
  //     setTimeout(clusterDots, 1000);
  //     setTimeout(separateDots, xData.length * 150);
  //   }

  //   loop();
  //   setInterval(loop, xData.length * 200);

  //   function transitionGoo(duration) {
  //     d3.selectAll(".blurValues")
  //       .transition().duration(duration)
  //       .attrTween("values", function () {
  //         return d3.interpolateString("1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 6 -6",
  //           "1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 " + config.radius * 8 + " -6");
  //       });
  //   }

  //   function transitionGooBack(duration) {
  //     d3.selectAll(".blurValues")
  //       .transition().duration(duration)
  //       .attrTween("values", function () {
  //         return d3.interpolateString("1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 " + config.radius * 8 + " -6", "1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 6 -6");
  //       });
  //   }

  //   function calculateDistance(d, point) {
  //     return Math.sqrt(Math.pow(point[0] - d.x, 2) + Math.pow(point[1] - d.y, 2))
  //   }

  //   console.log(data);
    // })

////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////// Pile of balls
////////////////////////////////////////////////////////////////////////////////

  // const svg = d3.select(".chart").append("svg")
  //   .attr("width", width + margin.left + margin.right)
  //   .attr("height", height + margin.top + margin.bottom)
  //   .append("g")
  //   // .style("filter", "url(#gooey)") //Set the filter on the container svg
  //   .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

  // const numberOfCircles = 60; 
  // const position = width / 2;
  // const transitionEase = d3.easeExp;
  // const radius = 15;
  // let nodes = d3.range(numberOfCircles);

  // nodes = nodes.map(function (d) { return { id: d }; });

  //   var extent = [[0, width], [0, height]];

  //   var simulation = d3.forceSimulation(nodes)
  //     .force("x", d3.forceX(position))
  //     .force("y", d3.forceY(height))
  //     .force("extent", d3.forceExtent(extent))
  //     .force("collide", d3.forceCollide(radius))
  //     // strength nodes are pushed along the x-axis
  //     .force("forceX", d3.forceX().strength(.1).x(width * .5))
  //     // strength nodes are pushed along the y-axis
  //     .force("forceY", d3.forceY().strength(.1).y(height * .5))
  //     .force("center", d3.forceCenter().x(width * .5).y(height))
  //     .stop();

  //   for (var i = 0; i < 120; ++i) simulation.tick();

  //   var counter = 0;

  //   var legend = svg.append("g")
  //     .append("text")
  //     .attr("class", "counter")
  //     .attr("x", position)
  //     .attr("text-anchor", "middle")
  //     .text(0);

  //   function increment(pile) {
  //     counter++;
  //     legend.text(counter);
  //   }

  //   addCircles(nodes, "a");

  //   function addCircles(data, pile) {

  //     var circle = svg.append("g")
  //       .attr("class", "circles")
  //       .selectAll("g").data(nodes)
  //       .enter().append("g")
  //       .attr("transform", function (d) {
  //         return "translate(" + d.x + "," + (-margin.top - radius * 2) + ")"
  //       });

  //     circle.append("circle")
  //       .attr("r", radius)
  //     circle.append("text")
  //       .attr("class", "coin-text")
  //       .attr("text-anchor", "middle")
  //       .attr("dy", radius / 3)
  //       .text("£");

  //     circle.transition()
  //       .duration(750)
  //       .delay(function (d, i) {
  //         return (height - d.y) * 20;
  //       })
  //       .ease(transitionEase)
  //       .attr("transform", function (d) {
  //         return "translate(" + d.x + ", " + d.y + ")";
  //       })
  //       .on("end", function () {
  //         increment(pile);
  //       });
  //   }
