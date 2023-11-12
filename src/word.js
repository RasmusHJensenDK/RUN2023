import React, { useState, useEffect, useCallback, useMemo } from "react";
import "./word.css";

const WordScrambleGame = () => {
  const [correctWord, setCorrectWord] = useState("");
  const [timer, setTimer] = useState(30);
  const [scrambledWord, setScrambledWord] = useState("");
  const [userInput, setUserInput] = useState("");
  const [hint, setHint] = useState("");

  const words = useMemo(
    () => [
      {
        word: "London",
        hint: "By i England",
      },
      {
        word: "Rasmus",
        hint: "Flot fyr",
      },
      {
        word: "Mette",
        hint: "Den vilde veninde",
      },
      {
        word: "Max",
        hint: "Kæreste lille hund",
      },
      {
        word: "Trine",
        hint: "Farlig billist?",
      },
      {
        word: "Idiot",
        hint: "Rasmus kan godt nogen gange være een?",
      },
      // ... other words
    ],
    []
  );

  const initGame = useCallback(() => {
    setTimer(30);

    const randomWord = words[Math.floor(Math.random() * words.length)];
    setCorrectWord(randomWord.word.toLowerCase());
    setHint(randomWord.hint);
  }, [words]);

  useEffect(() => {
    initGame();
  }, [initGame]); // Run only once on component mount

  useEffect(() => {
    // Scramble the word whenever correctWord changes
    const wordArray = correctWord.split("").sort(() => Math.random() - 0.5);
    setScrambledWord(wordArray.join(""));
  }, [correctWord]);

  useEffect(() => {
    // Timer logic
    const interval = setInterval(() => {
      setTimer((prev) => {
        if (prev > 0) {
          return prev - 1;
        } else {
          alert(`Du fandme langsom hva?! ${correctWord.toUpperCase()} sku du ha gættet.`);
          initGame();
          return prev;
        }
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [correctWord, initGame]);

  const checkWord = () => {
    const userWord = userInput.toLowerCase();
    if (!userWord) return alert("No word");
    if (userWord !== correctWord)
      return alert(`Tillykke, du ka kalde dig dummere end en ugle. ${userWord} var forkert`);
    alert(
      `Tillykke, du hermed klogere end en ugle! ${correctWord.toUpperCase()} er helt korrekt!`
    );
    initGame();
  };

  return (
    <div className="container">
      <h2>Scrambler</h2>
      <div className="content">
        <p className="word">{scrambledWord}</p>
        <div className="details">
          <p className="hint">
            Hint: <span>{hint}</span>
          </p>
          <p className="time">
            Time Left: <span><b>{timer}</b>s</span>
          </p>
        </div>
        <input
          type="text"
          spellCheck="false"
          placeholder="Enter a valid word"
          value={userInput}
          onChange={(e) => setUserInput(e.target.value)}
        />
        <div className="buttons">
          <button onClick={initGame}>Nyt ord</button>
          <button onClick={checkWord}>Jeg er sikker!</button>
        </div>
      </div>
    </div>
  );
};

export default WordScrambleGame;
