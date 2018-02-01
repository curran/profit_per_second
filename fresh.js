// document.addEventListener('click', toggleDrip);

// Set up the D3 margin convention
const margin = { top: 50, right: 50, bottom: 50, left: 50 }
const outerWidth = 960;
const outerHeight = 500;
const innerWidth = outerWidth - margin.left - margin.right;
const innerHeight = outerHeight - margin.top - margin.bottom;
// Append an SVG viewport for our chart
const svg = d3.select('.chart')
  .append('svg')
    .attr('width', outerWidth)
    .attr('height', outerHeight);
// Append a group element that positions our chart within the SVG
const chartG = svg.append('g')
  .attr('transform', `translate(${margin.left},${margin.top})`)
// Access our data
d3.csv('data.csv', (error, data) => {
  if(error) throw error;
  // Create our node array
  const companyArray = data.map(function(d) {
    return {
      'company': d.company,
      'rank': parseInt(d.company_rank),
      'net_income': parseInt(d.net_income),
      'profit_per_second': parseFloat(d.profit_per_second),
      'x': innerWidth / 2,
      'y': 0
    }
  })
  // What's the extent of our profit we'll use as our circel radius
  const profitExtent = d3.extent(companyArray, d => d.profit_per_second);
  // Calculate the max area to be used in the range of our scale
  const maxCircleArea = Math.PI * Math.pow(50, 2);
  // Create the scale to be used in our circle radius function
  const circleAreaScale = d3.scaleLinear()
    .domain(profitExtent)
    .range([0, maxCircleArea]);
  // Calculate a circle radius based on the area scale
  function circleRadius(d) {
    let area;
    area = circleAreaScale(d);
    return Math.sqrt(area / Math.PI);
  };
  // Add the mousedown event to our SVG group
  svg
    .on('mousedown', mousedown);
  // Set counter to keep track of clicks
  let counter = 0
  // let node = chartG.selectAll('circle');
    // .data(nodes)
    // .enter().append('circle')
    // .on("mousedown", mousedown);

  // Set the width of where circle will fall
  const pileExtent = [[0, innerWidth], [0, innerHeight]];
  // Create the simulation to move your nodes around 
  var simulation = d3.forceSimulation()
    .force("charge", d3.forceManyBody().strength(-1000))
    .force("x", d3.forceX())
    .force("y", d3.forceY())
    // .force("extent", d3.forceExtent(pileExtent))
    // .force('charge', d3.forceManyBody())
    // .force('collide', d => d3.forceCollide(d => circleRadius(d.profit_per_second)))
    // .force('center', d3.forceCenter()
    //   .x(innerWidth * .5)
    //   .y(innerHeight))
    // .force('bounce', d3.forceBounce()
    //   .radius(5)
    // )
    .on('tick', layoutTick);

  let nodes = simulation.nodes(),
    node = chartG.selectAll('.node');

  function mousedown() {
    let node = companyArray[counter],
      n = nodes.push(node);
    restart();
    counter++;
  }

  function layoutTick(e) {
    console.log('before ', node);
    node
      .attr('cx', d => d.x)
      .attr('cy', d => d.y);
    console.log('after ', node);
  }

  let circles;

  function restart() {

    if(counter !== 0) {
      circles.remove()
    }

    node = node.data(nodes);

    circles = node.enter().insert("circle");

    circles
      .attr("class", "node")
      .attr('cx', innerWidth / 2)
      .attr('cy', 0)
      .attr("r", d => circleRadius(d.profit_per_second))
      .attr('opacity', .15);

    simulation.restart();
  }

  // mbostock's example of add circles to the force on mousedown
  // var force = d3.layout.force()
  //   .size([width, height])
  //   .nodes([{}]) // initialize with a single node
  //   .charge(-10)
  //   .on("tick", tick);

  // var svg = d3.select("body").append("svg")
  //   .attr("width", width)
  //   .attr("height", height)
  //   .on("mousedown", mousedown);

  // svg.append("rect")
  //   .attr("width", width)
  //   .attr("height", height);

  // var nodes = force.nodes(),
  //   node = svg.selectAll(".node");

  // var cursor = svg.append("circle")
  //   .attr("r", 30)
  //   .attr("transform", "translate(-100,-100)");

  // restart();

  // function mousedown() {
  //   var node = { x: width / 2, y: 0 },
  //     n = nodes.push(node);
  //   restart();
  // }

  // function tick() {
  //   node.attr("cx", function (d) { return d.x; })
  //     .attr("cy", function (d) { return d.y; });
  // }

  // function restart() {

  //   node = node.data(nodes);

  //   node.enter().insert("circle")
  //     .attr("class", "node")
  //     .attr("r", 5);

  //   force.start();
  // }
})

////////////////////////////////////////////////////////////////////////////////
// DRIP CIRCLES TO BUILD UP A BAR

// const chartG = svg.append('g')
//   .attr('transform', `translate(${margin.left}, ${margin.top})`);

// const rect = chartG.append('rect')
//   .attr('x', innerWidth / 2)
//   .attr('y', innerHeight)
//   .attr('width', 50)
//   .attr('height', 1);


// let intervalState;

// function toggleDrip(e) {
//   if (intervalState) {
//     clearInterval(intervalState);
//     intervaleState = false;
//   } else {
//     intervalState = setInterval(function (d, i) {
//       // Add circles to DOM
//       const circle = chartG.append('circle')
//         .attr('cx', innerWidth / 2)
//         .attr('cy', 0)
//         .attr('r', 0)
//         .transition().duration(500)
//         .attr('r', 15)
//         .transition().duration(5000)
//         .attr('cy', innerHeight)
//         .on('end', function () {
//           console.log(rect.attr('height'));
//           rect
//             .attr('y', +rect.attr('y') - 15)
//             .attr('height', +rect.attr('height') + 15);
//         })
//         .remove();
//     }, 1000)
//   }
//   console.log(intervalState);
// }

////////////////////////////////////////////////////////////////////////////////
// NADIEH'S GOOEY EFFECT

// //Create scale
//   var xScale = d3.scaleLinear()
//     .domain([0, 1])
//     .range([0, innerWidth]);

//   //Create SVG
//   const chartG = svg.append('g')
//     .style("filter", "url(#gooey)") //Set the filter on the container svg
//     .attr('transform', `translate(${margin.left}, ${margin.top})`);
//   //SVG filter for the gooey effect
//   //Code taken from http://tympanus.net/codrops/2015/03/10/creative-gooey-effects/
//   var defs = svg.append('defs');
//   var filter = defs.append('filter').attr('id', 'gooey');
//   filter.append('feGaussianBlur')
//     .attr('in', 'SourceGraphic')
//     .attr('stdDeviation', '10')
//     .attr('result', 'blur');
//   filter.append('feColorMatrix')
//     .attr('in', 'blur')
//     .attr('mode', 'matrix')
//     .attr('values', '1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 18 -7')
//     .attr('result', 'gooey');
//   filter.append('feComposite')
//     .attr('in', 'SourceGraphic')
//     .attr('in2', 'goo')
//     .attr('operator', 'atop');
//   //Append circle at center
//   svg.append("circle")
//     .attr("class", "centerCircle")
//     .attr("cx", innerWidth / 2)
//     .attr("cy", innerHeight / 2)
//     .attr("r", 20)
//     .style("fill", "#81BC00");
//   //Create a circle that will move out of the center circle
//   svg.append("circle")
//     .attr("class", "flyCircle")
//     .attr("cx", innerWidth / 2)
//     .attr("cy", innerHeight / 2)
//     .attr("r", 15)
//     .style("fill", "#81BC00")
//     .each(update);

//   //Continuously keep a circle flying out to a random location along the x-axis
//   function update() {
//     const circle = d3.selectAll(".flyCircle");
//     const t1 = d3.transition()
//       .duration(1500)
//       .ease(d3.easeLinear);
//     const t2 = d3.transition()
//       .duration(1000)
//       .ease(d3.easeLinear);

//     (function repeat() {
//       circle
//         .attr("cx", innerWidth / 2)
//         .attr("r", 15)
//         .transition(t1).duration(1500)
//         .attr("cx", xScale(Math.random()))
//         .transition(t2).duration(1000)
//         .attr("r", 0)
//         .on("end", repeat);
//     })();
//   }//update