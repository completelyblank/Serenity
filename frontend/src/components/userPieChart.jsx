import React, { useEffect } from 'react';
import * as d3 from 'd3';

const UserPieChart = ({ sentiments, currentTheme }) => {
    useEffect(() => {
        // Clear any existing SVG and legend to prevent overlap
        d3.select('#pie-chart').selectAll('*').remove();
        d3.select('#legend').selectAll('*').remove();

        const width = 200;
        const height = 200;
        const radius = Math.min(width, height) / 2;

        // Append the SVG object
        const svg = d3
            .select('#pie-chart')
            .append('svg')
            .attr('width', width)
            .attr('height', height)
            .append('g')
            .attr('transform', `translate(${width / 2}, ${height / 2})`);

        // Color scale
        const color = d3.scaleOrdinal()
            .domain(sentiments.map(d => d.SENTIMENT))
            .range(sentiments.map(d => {
                if (d.SENTIMENT === 'Positive') return 'green';
                if (d.SENTIMENT === 'Negative') return 'red';
                return 'gray'; // Neutral color
            }));

        // Compute the position of each segment
        const pie = d3.pie().value(d => d['COUNT(SENTIMENT)']);
        const data_ready = pie(sentiments);

        // Shape generator
        const arc = d3.arc()
            .innerRadius(0)
            .outerRadius(radius);

        // Tooltip
        const tooltip = d3.select('#pie-chart')
            .append('div')
            .style('position', 'absolute')
            .style('background-color', currentTheme.backgroundColor)
            .style('padding', '5px')
            .style('border', `1px solid ${currentTheme.borderColor}`)
            .style('color', currentTheme.textColor)
            .style('border-radius', '4px')
            .style('visibility', 'hidden')
            .style('font-size', '0.85em')
            .style('font-family', 'Poppins')
            .style('z-index', '10');

        // Build the pie chart
        const arcs = svg
            .selectAll('path')
            .data(data_ready)
            .enter()
            .append('path')
            .attr('fill', d => color(d.data.SENTIMENT))
            .attr('stroke', d => {
                const fillColor = d3.rgb(color(d.data.SENTIMENT));
                return fillColor.darker(2);
            })
            .style('stroke-width', '2px')
            .style('opacity', 0.7);

        // Apply transition with animation
        arcs.transition()
            .duration(1500)
            .ease(d3.easeCubicOut)
            .attrTween('d', function(d) {
                const interpolate = d3.interpolate(
                    { startAngle: d.startAngle, endAngle: d.startAngle },
                    { startAngle: d.startAngle, endAngle: d.endAngle }
                );
                return function(t) {
                    return arc(interpolate(t));
                };
            });

        // Attach event listeners for interactivity
        arcs.on('mouseover', function(event, d) {
                const label = d.data['COUNT(SENTIMENT)'] === 1 ? 'entry is' : 'entries are';
                tooltip
                    .style('visibility', 'visible')
                    .html(`${d.data['COUNT(SENTIMENT)']} ${label} <strong>${d.data.SENTIMENT}</strong>`);
                d3.select(this).style('opacity', 0.6);
            })
            .on('mousemove', function(event) {
                tooltip
                    .style('top', (event.pageY + 10) + 'px')
                    .style('left', (event.pageX + 10) + 'px');
            })
            .on('mouseout', function() {
                tooltip.style('visibility', 'hidden');
                d3.select(this).style('opacity', 0.7);
            });

        // Legend implementation
        const legendWidth = 150;
        const legendHeight = sentiments.length * 20;
        const legendSvg = d3.select('#legend')
            .append('svg')
            .attr('width', legendWidth)
            .attr('height', legendHeight);

        const legend = legendSvg.selectAll('.legend')
            .data(sentiments)
            .enter()
            .append('g')
            .attr('class', 'legend')
            .attr('transform', (d, i) => `translate(0, ${i * 20})`);

        legend.append('rect')
            .attr('width', 18)
            .attr('height', 18)
            .attr('fill', d => color(d.SENTIMENT))
            .style('stroke', currentTheme.borderColor);

        legend.append('text')
            .attr('x', 30)
            .attr('y', 9)
            .attr('dy', '.35em')
            .text(d => d.SENTIMENT)
            .style('font-size', '0.85em')
            .style('font-family', 'PoppinsBold')
            .style('fill', currentTheme.textColor);

    }, [sentiments, currentTheme]);

    return (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '20px', textAlign: 'center' }}>
            
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '10%' }}>
                <div id="pie-chart" style={{ }}></div>
                <div id="legend" style={{ fontSize: '1.2em', fontFamily: 'PoppinsBold', color: currentTheme.textColor }}></div>
            </div>
        </div>
    );
};

export default UserPieChart;
