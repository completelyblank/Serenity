// BarChart.js

import React, { useEffect } from 'react';
import * as d3 from 'd3';
import data from './data.json';

const BarChart = () => {
  useEffect(() => {
    const svg = d3.select('#bar-chart')
      .append('svg')
      .attr('width', 400)
      .attr('height', 200);

    svg.selectAll('rect')
      .data(data)
      .enter()
      .append('rect')
      .attr('x', (d, i) => i * 50)
      .attr('y', (d) => 200 - d.value)
      .attr('width', 40)
      .attr('height', (d) => d.value)
      .style('fill', 'teal');
  }, []);

  return (
    <div id="bar-chart" className="bg-opacity-30 bg-gray-800 rounded-lg p-4">
      {/* Bar Chart */}
    </div>
  );
}

export default BarChart;
