import React, { useState, useEffect, Component } from 'react';
import Navbar from '../components/navbar';
import Spinner from '../components/spinner';
import "react-responsive-carousel/lib/styles/carousel.min.css";
import { Carousel } from 'react-responsive-carousel';
import BarChart from '../components/barChart';
import LineChart from '../components/lineChart';
import PieChart from '../components/pieChart';
import axios from 'axios';

class DemoCarousel extends Component {
  constructor(props) {
    super(props);
    this.state = {
      activeIndex: 0, // Track which slide is active
    };
  }

  handleSlideChange = (index) => {
    this.setState({ activeIndex: index });
  };

  render() {
    const { moods, num, logs, tags } = this.props;
    const { activeIndex } = this.state;

    return (
      <div style={{ width: '100%', margin: '0 auto', padding: '20px' }}>
        <Carousel
          showThumbs={false}
          showStatus={false}
          infiniteLoop
          useKeyboardArrows
          interval={3000}
          transitionTime={600}
          dynamicHeight
          onChange={this.handleSlideChange}
          autoPlay
        >
          <div className="flex flex-col carousel-slide" style={{ backgroundImage: `url('analysis.jpg')` }}>
            <h2 className="carousel-title" style={{ fontFamily: 'PoppinsBold', fontSize: '3em', textShadow: '2px 2px 8px rgba(0, 0, 0, 0.5)' }}>
              Welcome to the Analysis
            </h2>
            <h2 className="carousel-title" style={{ fontFamily: 'PoppinsBold', fontSize: '1.8em', textShadow: '2px 2px 8px rgba(0, 0, 0, 0.5)' }}>
              Dive Into Mood Trends
            </h2>
            <h2 className="carousel-title" style={{ fontFamily: 'PoppinsBold', marginTop: '10%', fontSize: '1.5em', textShadow: '2px 2px 8px rgba(0, 0, 0, 0.5)' }}>
              {num} Community Members & Counting!
            </h2>
          </div>

          <div className="carousel-slide" style={{ backgroundImage: `url('analysis.jpg')`, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <h2 className="carousel-title" style={{ fontFamily: 'PoppinsBold', fontSize: '3em', textAlign: 'center', textShadow: '2px 2px 8px rgba(0, 0, 0, 0.5)' }}>
              Mood Trends Over Time
            </h2>
            <BarChart moods={moods} animate={activeIndex === 1} />
          </div>

          <div className="carousel-slide" style={{ backgroundImage: `url('analysis.jpg')`, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <h2 className="carousel-title" style={{ fontFamily: 'PoppinsBold', fontSize: '3em', textAlign: 'center', textShadow: '2px 2px 8px rgba(0, 0, 0, 0.5)' }}>
              The Rhythm of Mood Logging
            </h2>
            <LineChart logs={logs} animate={activeIndex === 2} />
          </div>

          <div className="carousel-slide" style={{ backgroundImage: `url('analysis.jpg')`, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <h2 className="carousel-title" style={{ marginTop: '-1%', fontFamily: 'PoppinsBold', fontSize: '3em', textAlign: 'center', textShadow: '2px 2px 8px rgba(0, 0, 0, 0.5)' }}>
              Top 5 Most Used Mood Tags
            </h2>
            <PieChart tags={tags} animate={activeIndex === 3} />
          </div>

          <div className="carousel-slide" style={{ backgroundImage: `url('analysis.jpg')`, color: '#E8EAF6' }}>
            <h2 className="carousel-title" style={{ fontFamily: 'PoppinsBold', fontSize: '3em', margin: 'auto', padding: '2em', textShadow: '2px 2px 8px rgba(0, 0, 0, 0.5)' }}>
              Thank You for Exploring!
            </h2>
          </div>
        </Carousel>
      </div>
    );
  }
}

function Analysis() {
  const [loading, setLoading] = useState(true);
  const [showSpinner, setShowSpinner] = useState(true);
  const [moods, setMoods] = useState([]);
  const [num, setNum] = useState(0);
  const [logs, setLogs] = useState([]);
  const [tags, setTags] = useState([]);

  useEffect(() => {
    const spinnerTimeout = setTimeout(() => {
      setShowSpinner(false);
    }, 1000);

    const fetchData = async () => {
      try {
        const response = await axios.get('http://localhost:3000/analysis');
        setMoods(response.data.moods);
        setLogs(response.data.logs);
        setTags(response.data.tags);
        console.log(response.data.tags);
        const users = await axios.get('http://localhost:3000/login');
        const data = users.data;
        setNum(data.num);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();

    return () => clearTimeout(spinnerTimeout);
  }, []);

  if (loading || showSpinner) {
    return (
      <div className="h-screen overflow-y-auto" style={{ backgroundColor: '#b2dfdb' }}>
        <Navbar />
        <Spinner />
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-cover bg-center bg-fixed text-white" style={{ backgroundImage: `url("dream_analysis.jpg")` }}>
      <Navbar />
      <div className="flex-1 p-4">
        <DemoCarousel moods={moods} num={num} logs={logs} tags={tags} />
      </div>
    </div>
  );
}

export default Analysis;
