import React, { useEffect } from 'react';
import * as d3 from 'd3';

const LineChart = ({ logs, animate }) => {
  useEffect(() => {
    // Clean up any previous charts
    d3.select('#line-chart').selectAll('svg').remove();

    // Set dimensions for the chart
    const width = window.innerWidth * 0.8;
    const height = window.innerHeight * 0.5;
    const margin = { top: 60, right: 50, bottom: 70, left: 70 };

    // Create the SVG container for the chart
    const svg = d3.select('#line-chart')
      .append('svg')
      .attr('width', width)
      .attr('height', height);

    // Define the chart dimensions after accounting for margins
    const chartWidth = width - margin.left - margin.right;
    const chartHeight = height - margin.top - margin.bottom;

    // Append the chart group element to the SVG
    const chart = svg.append('g')
      .attr('transform', `translate(${margin.left}, ${margin.top})`);

    // Prepare the data by ensuring all hours are present
    const data = [];
    for (let i = 0; i < 24; i++) {
      const log = logs.find(log => parseInt(log.HOURS, 10) === i);
      data.push({
        hour: i,
        value: log ? log.COUNT : 0, // If the hour is missing, set value to 0
      });
    }

    // Define the X and Y scales
    const xScale = d3.scaleLinear()
      .domain([0, 23]) // 24-hour range
      .range([0, chartWidth]);

    const yScale = d3.scaleLinear()
      .domain([0, d3.max(data, d => d.value)])
      .nice()
      .range([chartHeight, 0]);

    // Create the line generator
    const line = d3.line()
      .x(d => xScale(d.hour)) // Use hour for X-axis
      .y(d => yScale(d.value))
      .curve(d3.curveMonotoneX);

    // Append the path element to draw the line
    const path = chart.append('path')
      .datum(data)
      .attr('fill', 'none')
      .attr('stroke', '#40E0D0') // Bright turquoise
      .attr('stroke-width', 2)
      .attr('d', line);

    // Add animation to the line path if animate is true
    if (animate) {
      const totalLength = path.node().getTotalLength();
      path
        .attr('stroke-dasharray', `${totalLength} ${totalLength}`)
        .attr('stroke-dashoffset', totalLength)
        .transition()
        .duration(1500)
        .ease(d3.easeLinear)
        .attr('stroke-dashoffset', 0);
    }

    // Add circles at data points
    const dots = chart.selectAll('.dot')
      .data(data)
      .enter()
      .append('circle')
      .attr('class', 'dot')
      .attr('cx', d => xScale(d.hour))
      .attr('cy', d => yScale(d.value))
      .attr('r', 0) // Start with radius 0 for animation
      .style('fill', '#32CD32') // Neon green
      .style('cursor', 'pointer');

    // Animate circles if animate is true
    if (animate) {
      dots.transition()
        .delay((d, i) => i * 50)
        .duration(800)
        .attr('r', 6);
    } else {
      dots.attr('r', 6); // Set radius to 6 if no animation
    }

    // Tooltip setup
    const tooltip = d3.select('#line-chart')
      .append('div')
      .style('position', 'absolute')
      .style('background-color', '#555555') // Darker background for the tooltip
      .style('padding', '5px')
      .style('border', '1px solid #444444') // Softer border
      .style('border-radius', '4px')
      .style('color', '#FFFFFF') // White text for better contrast
      .style('visibility', 'hidden')
      .style('font-family', 'PoppinsBold');

    dots
      .on('mouseover', function(event, d) {
        const userLabel = d.value === 1 ? 'user' : 'users'; 
        tooltip.style('visibility', 'visible')
          .html(`<strong>${d.value}</strong> ${userLabel} logged at <strong>${d.hour}:00</strong>`)
          .style('color', '#FFFFFF')
          .style('font-size', '0.9em')
          .style('font-family', 'Poppins');
        d3.select(this).style('opacity', 0.6);
        d3.select(this).attr('r', 8);
      })
      .on('mousemove', function(event) {
        tooltip.style('top', (event.pageY - 100) + 'px')
          .style('left', (event.pageX - 20) + 'px');
      })
      .on('mouseout', function() {
        tooltip.style('visibility', 'hidden');
        d3.select(this).style('opacity', 1);
        d3.select(this).attr('r', 6);
      });

    // Add X-axis
    chart.append('g')
      .attr('transform', `translate(0, ${chartHeight})`)
      .call(d3.axisBottom(xScale).ticks(24).tickFormat(d => `${d}:00`))
      .selectAll('text')
      .style('font-family', 'PoppinsBold')
      .style('text-anchor', 'middle')
      .style('fill', '#E6E6FA'); // Light lavender

    // Add Y-axis
    chart.append('g')
      .call(d3.axisLeft(yScale).ticks(5))
      .selectAll('text')
      .style('font-family', 'PoppinsBold')
      .style('fill', '#E6E6FA'); // Light lavender

    // X-axis label
    chart.append('text')
      .attr('y', chartHeight + margin.bottom - 10)
      .attr('x', chartWidth / 2)
      .attr('fill', 'white')
      .style('font-size', '1.2em')
      .style('font-family', 'PoppinsBold')
      .style('text-anchor', 'middle')
      .text('Hour of the Day');

    // Y-axis label
    chart.append('text')
      .attr('transform', 'rotate(-90)')
      .attr('y', -margin.left + 15)
      .attr('x', -chartHeight / 2)
      .attr('fill', 'white')
      .style('font-size', '1.2em')
      .style('font-family', 'PoppinsBold')
      .style('text-anchor', 'middle')
      .text('User Count');
  }, [logs, animate]);

  return <div id="line-chart"></div>;
};

export default LineChart;
