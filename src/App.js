import React, { Component } from "react";
import { render } from "react-dom";

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      runData: [],
      timer: 0,
      isRunning: false,
      isPaused: false,
      distance: 0,
    };
  }

  componentDidMount() {
    navigator.geolocation.getCurrentPosition((position) => {
      console.log("Latitude is :", position.coords.latitude);
      console.log("Longitude is :", position.coords.longitude);
    });
  }

  startRun = () => {
    this.setState({
      isRunning: true,
      isPaused: false,
      runData: [],
      timer: 0,
      distance: 0,
    });
    this.getUserLocation();
  };

  pauseRun = () => {
    this.setState({ isPaused: true });
  };

  resumeRun = () => {
    this.setState({ isPaused: false });
    this.getUserLocation();
  };

  endRun = () => {
    this.setState({ isRunning: false, isPaused: false });
    this.calculateDistance();
  };

  calculateDistance = () => {
    const { runData } = this.state;

    if (runData.length < 2) {
      return;
    }

    let totalDistance = 0;

    for (let i = 1; i < runData.length; i++) {
      const prevLocation = runData[i - 1];
      const currentLocation = runData[i];

      const lat1 = prevLocation.latitude;
      const lon1 = prevLocation.longitude;
      const lat2 = currentLocation.latitude;
      const lon2 = currentLocation.longitude;

      const R = 6371e3; // Earth radius in meters
      const φ1 = (lat1 * Math.PI) / 180;
      const φ2 = (lat2 * Math.PI) / 180;
      const Δφ = ((lat2 - lat1) * Math.PI) / 180;
      const Δλ = ((lon2 - lon1) * Math.PI) / 180;

      const a =
        Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
        Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);

      const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

      const distance = R * c;

      totalDistance += distance;
    }

    // Convert distance to centimeters (1 meter = 100 centimeters)
    const distanceInCentimeters = totalDistance * 100;

    this.setState({ distance: distanceInCentimeters });
    console.log("Distance: ", distanceInCentimeters);
  };

  getUserLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          this.setState((prevState) => ({
            runData: [...prevState.runData, { latitude, longitude }],
          }));

          if (this.state.isRunning && !this.state.isPaused) {
            setTimeout(this.getUserLocation, 1000);
          }
        },
        (error) => {
          console.log("Error getting location: ", error);
        }
      );
    }
  };

  render() {
    const { isRunning, isPaused, distance, timer } = this.state;

    return (
      <div>
        <h4>Using geolocation JavaScript API in React</h4>
        {isRunning && <h2>Time: {timer} seconds</h2>}
        {isRunning && !isPaused && (
          <h2>Distance: {distance.toFixed(2)} centimeters</h2>
        )}
        {!isRunning ? (
          <button onClick={this.startRun}>Start Run</button>
        ) : (
          <>
            <button onClick={this.pauseRun}>Pause</button>
            <button onClick={this.resumeRun}>Resume</button>
            <button onClick={this.endRun}>End Run</button>
          </>
        )}
      </div>
    );
  }
}
export default App;
render(<App />, document.getElementById("root"));
