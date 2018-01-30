document.addEventListener('click', toggleDrip);

const margin = { top: 30, right: 30, bottom: 30, left: 30 }
const outerWidth = 960;
const outerHeight = 500;
const innerWidth = outerWidth - margin.left - margin.right;
const innerHeight = outerHeight - margin.top - margin.bottom;

const svg = d3.select('.chart')
  .append('svg')
    .attr('width', outerWidth)
    .attr('height', outerHeight);

const chartG = svg.append('g')
  .attr('transform', `translate(${margin.left}, ${margin.top})`);

const rect = chartG.append('rect')
  .attr('x', innerWidth / 2)
  .attr('y', innerHeight)
  .attr('width', 50)
  .attr('height', 1);


let intervalState;

function toggleDrip(e) {
  if (intervalState) {
    clearInterval(intervalState);
    intervaleState = false;
  } else {
    intervalState = setInterval(function (d, i) {
      // Add circles to DOM
      const circle = chartG.append('circle')
        .attr('cx', innerWidth / 2)
        .attr('cy', 0)
        .attr('r', 0)
        .transition().duration(500)
        .attr('r', 15)
        .transition().duration(5000)
        .attr('cy', innerHeight)
        .on('end', function () {
          console.log(rect.attr('height'));
          rect
            .attr('y', +rect.attr('y') - 15)
            .attr('height', +rect.attr('height') + 15);
        })
        .remove();
    }, 1000)
  }
  console.log(intervalState);
}