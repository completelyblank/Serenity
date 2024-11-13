import React, { useEffect } from 'react';
import * as d3 from 'd3';

const BarChart = ({ moods, animate }) => {
  useEffect(() => {
    if (!animate) return; // Only animate if the prop is true

    // Clean up any previous charts
    d3.select('#bar-chart').selectAll('svg').remove();

    // Set dimensions for the chart
    const width = window.innerWidth * 0.8;
    const height = window.innerHeight * 0.5;
    const margin = { top: 60, right: 50, bottom: 70, left: 70 };

    // Create the SVG container for the chart
    const svg = d3.select('#bar-chart')
      .append('svg')
      .attr('width', width)
      .attr('height', height);

    // Define the chart dimensions after accounting for margins
    const chartWidth = width - margin.left - margin.right;
    const chartHeight = height - margin.top - margin.bottom;

    // Define the X and Y scales
    const xScale = d3.scaleBand()
      .domain(moods.map(d => d.EMOJI))
      .range([0, chartWidth])
      .padding(0.1);

    const yScale = d3.scaleLinear()
      .domain([0, d3.max(moods, d => d['COUNT(F.EMOJI_ID)'])])
      .nice()
      .range([chartHeight, 0]);

    // Append the chart group element to the SVG
    const chart = svg.append('g')
      .attr('transform', `translate(${margin.left}, ${margin.top})`);

    // Define color scheme with added vibrancy
    const colorScale = d3.scaleOrdinal()
      .domain(['Happy', 'Sad', 'Content', 'Blessed', 'Angry', 'Neutral'])
      .range(['#f4c20d', '#2196f3', '#4caf50', '#e91e63', '#ff5722', '#9e9e9e']);

    // Create a tooltip div and hide it initially
    const tooltip = d3.select('#bar-chart')
      .append('div')
      .style('position', 'absolute')
      .style('background-color', '#555555') // Darker background for the tooltip
      .style('padding', '5px')
      .style('border', '1px solid #444444')
      .style('color', '#FFFFFF')
      .style('border-radius', '4px')
      .style('visibility', 'hidden')
      .style('font-family', 'PoppinsBold');

    // Append bars with animation and gradient effect
    chart.selectAll('.bar')
      .data(moods)
      .enter()
      .append('rect')
      .attr('class', 'bar')
      .attr('x', d => xScale(d.EMOJI))
      .attr('y', chartHeight) 
      .attr('width', xScale.bandwidth())
      .attr('height', 0) 
      .style('fill', d => colorScale(d.EMOJI))
      .style('fill-opacity', 0.8) 
      .on('mouseover', function(event, d) {
        const userText = d['COUNT(F.EMOJI_ID)'] === 1 ? 'user' : 'users';
        tooltip.style('visibility', 'visible')
          .html(`<strong>${d['COUNT(F.EMOJI_ID)']}</strong> ${userText} logged<br>feeling <strong>${d.EMOJI}</strong>`)
          .style('color', 'white')
          .style('font-size', '0.9em')
          .style('font-family', 'Poppins');
        d3.select(this).style('opacity', 0.6); 
      })
      .on('mousemove', function(event) {
        tooltip.style('top', (event.pageY - 100) + 'px')
          .style('left', (event.pageX - 20) + 'px');
      })
      .on('mouseout', function() {
        tooltip.style('visibility', 'hidden');
        d3.select(this).style('opacity', 1);
      })
      .transition() 
      .duration(1500) 
      .ease(d3.easeCubicOut)
      .attr('y', d => yScale(d['COUNT(F.EMOJI_ID)'])) 
      .attr('height', d => chartHeight - yScale(d['COUNT(F.EMOJI_ID)'])); 

    chart.selectAll('.label')
      .data(moods)
      .enter()
      .append('text')
      .attr('x', d => xScale(d.EMOJI) + xScale.bandwidth() / 2)
      .attr('y', d => yScale(d['COUNT(F.EMOJI_ID)']) - 5)
      .attr('text-anchor', 'middle')
      .style('fill', 'white')
      .style('font-size', '1em')
      .style('font-family', 'PoppinsBold')
      .text(d => d['COUNT(F.EMOJI_ID)']);

    // Add the X-axis
    chart.append('g')
      .attr('transform', `translate(0, ${chartHeight})`)
      .call(d3.axisBottom(xScale))
      .selectAll('text')
      .style('font-family', 'PoppinsBold')
      .style('font-size', '1.5em');

    // Add the X-axis label
    chart.append('text')
      .attr('y', chartHeight + margin.bottom - 10)
      .attr('x', chartWidth / 2)
      .attr('fill', 'white')
      .style('font-size', '1.2em')
      .style('font-family', 'PoppinsBold')
      .style('text-anchor', 'middle')
      .text('Mood');

    // Add the Y-axis
    chart.append('g')
      .call(d3.axisLeft(yScale).ticks(5))
      .selectAll('text')
      .style('font-family', 'PoppinsBold')
      .style('font-size', '1.5em');

    // Add the Y-axis label
    chart.append('text')
      .attr('transform', 'rotate(-90)')
      .attr('y', -margin.left + 15)
      .attr('x', -chartHeight / 2)
      .attr('fill', 'white')
      .style('font-size', '1.2em')
      .style('font-family', 'PoppinsBold')
      .style('text-anchor', 'middle')
      .text('User Count');
  }, [moods, animate]);

  return <div id="bar-chart"></div>;
};

export default BarChart;
