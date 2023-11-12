import React, { Component } from "react";
import { render } from "react-dom";

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      startTime: null,
      currentTime: null,
      distance: 0,
      isRunning: false,
      isPaused: false,
      lastPosition: null,
    };
  }

  componentDidMount() {
    // Start watching the position when the component mounts
    this.watchPosition();
  }

  watchPosition() {
    if (navigator.geolocation) {
      this.positionWatcher = navigator.geolocation.watchPosition(
        (position) => {
          // Calculate distance if the run is active
          if (this.state.isRunning && !this.state.isPaused) {
            const distance = this.calculateDistance(
              this.state.lastPosition,
              position.coords
            );
            this.setState((prevState) => ({
              distance: prevState.distance + distance,
              lastPosition: position.coords,
            }));
          }
        },
        (error) => {
          console.error("Error getting location:", error);
        },
        { enableHighAccuracy: true }
      );
    } else {
      console.error("Geolocation is not supported by this browser.");
    }
  }

  calculateDistance(coord1, coord2) {
    // Simple calculation for demonstration purposes
    // You may want to use a more accurate formula for your needs
    const lat1 = coord1.latitude;
    const lon1 = coord1.longitude;
    const lat2 = coord2.latitude;
    const lon2 = coord2.longitude;

    const R = 6371; // Radius of the Earth in kilometers
    const dLat = (lat2 - lat1) * (Math.PI / 180);
    const dLon = (lon2 - lon1) * (Math.PI / 180);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(lat1 * (Math.PI / 180)) *
        Math.cos(lat2 * (Math.PI / 180)) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = R * c;

    return distance;
  }

  handleStartRun = () => {
    this.setState({
      startTime: new Date(),
      currentTime: new Date(),
      isRunning: true,
      isPaused: false,
    });
  };

  handlePauseRun = () => {
    this.setState({
      isPaused: true,
    });
  };

  handleResumeRun = () => {
    this.setState({
      isPaused: false,
    });
  };

  handleEndRun = () => {
    navigator.geolocation.clearWatch(this.positionWatcher);
    this.setState({
      isRunning: false,
      isPaused: false,
      lastPosition: null,
    });
  };

  render() {
    const { startTime, currentTime, distance, isRunning, isPaused } =
      this.state;

    return (
      <div>
        <h4>Running App</h4>
        <button onClick={this.handleStartRun} disabled={isRunning}>
          Start Run
        </button>
        <button onClick={this.handlePauseRun} disabled={!isRunning || isPaused}>
          Pause Run
        </button>
        <button onClick={this.handleResumeRun} disabled={!isRunning || !isPaused}>
          Resume Run
        </button>
        <button onClick={this.handleEndRun} disabled={!isRunning}>
          End Run
        </button>
        <div>
          <p>Start Time: {startTime && startTime.toLocaleTimeString()}</p>
          <p>Current Time: {currentTime && currentTime.toLocaleTimeString()}</p>
          <p>Distance: {distance.toFixed(2)} km</p>
        </div>
      </div>
    );
  }
}

export default App;

render(<App />, document.getElementById("root"));
