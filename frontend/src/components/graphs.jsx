// GraphSection.js

import React from 'react';
import BarChart from '../components/barChart.jsx';
import LineChart from '../components/lineChart';
import PieChart from '../components/pieChart';

const GraphSection = () => {
  return (
    <div className="grid grid-cols-2 gap-4">
      <div className="bg-opacity-30 bg-gray-800 rounded-lg p-4">
        <BarChart />
      </div>
      <div className="bg-opacity-30 bg-gray-800 rounded-lg p-4">
        <LineChart />
      </div>
      <div className="bg-opacity-30 bg-gray-800 rounded-lg p-4">
        <PieChart />
      </div>
      <div className="bg-opacity-30 bg-gray-800 rounded-lg p-4">
        {/* Add another type of chart here */}
      </div>
    </div>
  );
}

export default GraphSection;
