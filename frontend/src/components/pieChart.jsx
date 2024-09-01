// PieChart.js

import React, { useEffect } from 'react';
import * as d3 from 'd3';
import data from './data.json';

const PieChart = () => {
  useEffect(() => {
    const width = 400;
    const height = 200;
    const radius = Math.min(width, height) / 2;

    const svg = d3.select('#pie-chart')
      .append('svg')
      .attr('width', width)
      .attr('height', height)
      .append('g')
      .attr('transform', `translate(${width / 2},${height / 2})`);

    const color = d3.scaleOrdinal()
      .domain(data.map(d => d.label))
      .range(['#ff00ff', '#800080', '#0000ff', '#ff1493', '#8a2be2', '#4169e1']); // Pink, Purple, and Blue shades

    const pie = d3.pie()
      .value(d => d.value);

    const arc = d3.arc()
      .innerRadius(0)
      .outerRadius(radius);

    const arcs = svg.selectAll('arc')
      .data(pie(data))
      .enter()
      .append('g')
      .attr('class', 'arc');

    arcs.append('path')
      .attr('d', arc)
      .attr('fill', d => color(d.data.label))
      .attr('stroke', 'white')
      .style('stroke-width', '2px');

  }, []);

  return (
    <div id="pie-chart" className="bg-dark-opaque rounded-lg p-4">
      {/* Pie Chart */}
    </div>
  );
}

export default PieChart;
