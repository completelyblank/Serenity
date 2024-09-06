// LineChart.js

import React, { useEffect } from 'react';
import * as d3 from 'd3';
import data from './data.json';

const LineChart = () => {
  useEffect(() => {
    const svg = d3.select('#line-chart')
      .append('svg')
      .attr('width', 400)
      .attr('height', 200);

    const line = d3.line()
      .x((d, i) => i * 50 + 25)
      .y(d => 200 - d.value);

    svg.append('path')
      .datum(data)
      .attr('fill', 'none')
      .attr('stroke', 'teal')
      .attr('stroke-width', 2)
      .attr('d', line);
  }, []);

  return (
    <div id="line-chart" className="bg-opacity-30 bg-gray-800 rounded-lg p-4">
      {/* Line Chart */}
    </div>
  );
}

export default LineChart;
