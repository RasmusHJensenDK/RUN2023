import React, { useState, useEffect, useLayoutEffect  } from "react";

const Game = () => {
    const [startScreenVisible, setStartScreenVisible] = useState(true);
    const [gameScreenVisible, setGameScreenVisible] = useState(false);
    const [continueScreenVisible, setContinueScreenVisible] = useState(false);
    const [endGameScreenVisible, setEndGameScreenVisible] = useState(false);
    const [sqrAmount, setSqrAmount] = useState(4);
    const [level, setLevel] = useState(1);
    const [lives, setLives] = useState(0);
    const [compareSqrNum, setCompareSqrNum] = useState(1);
    const [allSqrs, setAllSqrs] = useState([]);
    const [strikes, setStrikes] = useState(0);
  
    useLayoutEffect(() => {
        const fetchAllSqrs = async () => {
          const fetchedAllSqrs = Array.from(
            document.querySelectorAll(".playsqrs")
          );
          setAllSqrs(fetchedAllSqrs);
        };
    
        fetchAllSqrs();
      }, []); // Empty dependency array to run once on mount
    
      if (allSqrs.length === 0) {
        // Return a loading state or something until allSqrs is populated
        return <div>Loading...</div>;
      }
  
    const startGame = () => {
      setStartScreenVisible(false);
      setGameScreenVisible(true);
      setSrsFunction();
    };
  
    const continueGame = () => {
      setContinueScreenVisible(false);
      setGameScreenVisible(true);
      setSrsFunction();
    };

  const tryAgain = () => {
    setLives(0);
    setEndGameScreenVisible(false);
    setStartScreenVisible(true);
  };

  const setSrsFunction = () => {
    const updatedAllSqrs = Array.from(document.querySelectorAll(".playsqrs"));
    for (let i = 0; i < sqrAmount; i++) {
      let randomNum = Math.floor(Math.random() * 40);
      while (updatedAllSqrs[randomNum].innerHTML !== "") {
        randomNum = Math.floor(Math.random() * 40);
      }
      updatedAllSqrs[randomNum].innerHTML = i + 1;
      updatedAllSqrs[randomNum].classList.add("withnum");
    }
    setAllSqrs(updatedAllSqrs);
  };
  const winFunc = () => {
    setLevel((prevLevel) => prevLevel + 1);
    setSqrAmount((prevAmount) => prevAmount + 1);
    setCompareSqrNum(1);
    setGameScreenVisible(false);
    setContinueScreenVisible(true);
  };

  const loseFunc = () => {
    setCompareSqrNum(1);
    setGameScreenVisible(false);
    setContinueScreenVisible(true);

    const updatedAllSqrs = allSqrs.map((sqr) => {
      if (sqr.classList.contains("withnum") || sqr.classList.contains("hide")) {
        sqr.classList.remove("hide");
        sqr.classList.remove("withnum");
        sqr.innerHTML = "";
      }
      return sqr;
    });

    setAllSqrs(updatedAllSqrs);

    setLives((prevLives) => prevLives + 1);

    if (lives === 2) {
      fullLoseFunction();
    }
  };

  const fullLoseFunction = () => {
    setContinueScreenVisible(false);
    setEndGameScreenVisible(true);
    setStrikes(0);
    setSqrAmount(4);
    setLevel(1);
  };

  const handleSqrClick = (sqr) => {
    if (sqr.classList.contains("withnum")) {
      if (level === 1) {
        if (sqr.innerHTML == compareSqrNum) {
          setCompareSqrNum((prevNum) => prevNum + 1);
          sqr.classList.remove("withnum");
          sqr.classList.remove("hide");
          sqr.innerHTML = "";
          if (compareSqrNum === sqrAmount + 1) {
            winFunc();
          }
        } else {
          loseFunc();
        }
      } else {
        const updatedAllSqrs = allSqrs.map((currentSqr) =>
          currentSqr === sqr
            ? { ...currentSqr, withnum: false, hide: false, innerHTML: "" }
            : currentSqr
        );

        setAllSqrs(updatedAllSqrs);

        if (sqr.innerHTML == compareSqrNum) {
          sqr.classList.remove("withnum");
          sqr.classList.remove("hide");
          sqr.innerHTML = "";
          setCompareSqrNum((prevNum) => prevNum + 1);
          if (compareSqrNum === sqrAmount + 1) {
            winFunc();
          }
        } else {
          loseFunc();
        }
      }
    }
  };

  return (
    <div>
      <div className={`start-menu ${startScreenVisible ? "" : "hide"}`}>
        {/* ... your start menu JSX ... */}
        <button className="startBtn" onClick={startGame}>
          Start Test
        </button>
      </div>

      <div className={`play-area ${gameScreenVisible ? "" : "hide"}`}>
        {/* ... your play area JSX ... */}
        {allSqrs.map((sqr, index) => (
          <span
            key={index}
            className="playsqrs"
            onClick={() => handleSqrClick(sqr)}
          >
            {sqr.innerHTML}
          </span>
        ))}
      </div>

      <div className={`continue-screen ${continueScreenVisible ? "" : "hide"}`}>
        {/* ... your continue screen JSX ... */}
        <button className="continueBtn" onClick={continueGame}>
          Continue
        </button>
      </div>

      <div className={`end-screen ${endGameScreenVisible ? "" : "hide"}`}>
        {/* ... your end screen JSX ... */}
        <button className="tryAgainBtn" onClick={tryAgain}>
          Try again
        </button>
      </div>
    </div>
  );
};

export default Game;
