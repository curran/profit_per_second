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
  
  const button = chartG
    .append('circle')
    .attr('class', 'button')
    .attr('cx', 100)
    .attr('cy', 100)
    .attr('r', 100)
    .on('click', startDrip);

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
  // svg
  //   .on('click', mousedown);

  // Set counter to keep track of clicks
  let counter = 0

  // Create the simulation to move your nodes around 
  var simulation = d3.forceSimulation()
    .force("charge", d3.forceManyBody().strength(-30))
    .force("x", d3.forceX(innerWidth / 2))
    .force("y", d3.forceY(innerHeight))
    .on('tick', layoutTick);

  let nodes = simulation.nodes();
  let node = chartG.selectAll('.node');

  // restart();
  let intervalID;
  function startDrip(e) {


    console.log(intervalID);

    this.classList.toggle('clicked');

    if (this.classList.contains('clicked')) {
        // start interval
      intervalID = setInterval(function (d) {
        let node = { 'drip': 'Apple' };
        nodes.push(node);
        restart()
      }, 1000);
    } else {
      console.log(intervalID);
      // end interval
      clearInterval(intervalID);
    }
    
  }

  function mousedown() {
    let node = companyArray[counter];
    nodes.push(node);
      restart();
  }

  function layoutTick(e) {
    node
      .attr('cx', d => d.x)
      .attr('cy', d => d.y);
  }

  function restart() {
    // Apply the general update pattern to the nodes.
    node = node
      .data(nodes);
    node
      .exit().remove();
    node = node
      .enter().append("circle")
      .attr('r', 15)
      // .attr("r", d => circleRadius(d.profit_per_second))
      .merge(node);
    // Update and restart the simulation.
    simulation
      .nodes(nodes);
    simulation
      .alpha(1)
      .restart();
    counter++;
  }
})