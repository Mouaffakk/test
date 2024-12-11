import React, { useState, useEffect, useRef } from "react";
import {
  connection,
  startConnection,
  stopConnection,
} from "../../utils/signalr";
import { useEffectOnce } from "../../utils/useEffectOnce";
import "./NumberPicker.css";

const NumberPickerBall = () => {
  const [randomNumber, setRandomNumber] = useState("22");
  const [userNumber, setUserNumber] = useState("");
  const [isWaiting, setIsWaiting] = useState(false);
  const [runInterval, setRunInterval] = useState(true); // Control interval state
  const [connectionSocket, setConnection] = useState(connection);
  const [isAnimating, setIsAnimating] = useState(true);
  const [timer, setTimer] = useState(null)
  const intervalRef = useRef(null);
  const timeoutRef = useRef(null);

  const handleSubmit = () => {
    setIsWaiting(true);
    setRunInterval(false);  // Stop the interval immediately
    setIsAnimating(false); // Stop animation
    clearInterval(intervalRef.current);
    
    // Clear any existing timeout
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    
    // Set a timeout to restart the animation after 5 seconds
    timeoutRef.current = setTimeout(() => {
      // Restart animation
    }, 11000);
  };

  useEffectOnce(()=>{
if(timer === 0){
  setRunInterval(true);
  setIsWaiting(false);
  setIsAnimating(true);
}
  },[timer])
  const animatedBoxRef = useRef(null);

  const checkNumber = async () => {
    if (!connectionSocket) return;
    await startConnection(connectionSocket);
    connectionSocket?.on("NumberSelected", (data) => {
      setUserNumber(data);
      handleSubmit();
    });
  };

  const checkTimer = async () => {
    if (!connectionSocket) return;
    await startConnection(connectionSocket);
    connectionSocket?.on("Timer", (data) => {
      setTimer(data);
      console.log(data);
    });
  };

  useEffectOnce(() => {
    checkNumber();
    return async () => {
      await stopConnection(connectionSocket);
      setConnection();
    };
  }, []);
  useEffectOnce(() => {
    checkTimer()
    return async () => {
      await stopConnection(connectionSocket);
      setConnection();
    };
  }, []);

  useEffect(() => {
    if (runInterval) {
      intervalRef.current = setInterval(() => {
        const randomNum = Math.floor(Math.random() * 100);
        setRandomNumber(randomNum);
      }, 1000);
    }

    return () => {
      clearInterval(intervalRef.current); 
    };
  }, [runInterval]); 

  useEffect(() => {
    // Cleanup function to clear both interval and timeout
    return () => {
      clearInterval(intervalRef.current);
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []); // Empty dependency array to run only on mount/unmount

  // Handle animation after number change
  const handleAnimationIteration = () => {
    if (isWaiting && animatedBoxRef.current) {
      animatedBoxRef.current.style.animation = "none"; // Reset animation
      setRandomNumber(userNumber); // Set user input number
      animatedBoxRef.current.style.animation = "moveAndScale 1s ease-in"; // Restart animation
      animatedBoxRef.current.style.left = "50%";
      animatedBoxRef.current.style.transform =
        "translateY(-50%) translateX(-50%) skewX(0deg)";
      setIsWaiting(false); // Reset waiting state
      setRunInterval(false); // Stop the interval
    }
  };

  return (
    <div className="container">
      <div className="circle">
        <div
          ref={animatedBoxRef}
          className={`animated-box ${isAnimating ? 'animate' : ''}`}
          onAnimationIteration={handleAnimationIteration}
        >
          {isWaiting ? userNumber : randomNumber}
        </div>
      </div>

      {/* <div className="controls">
        <input
          type="number"
          placeholder="Enter number"
          value={userNumber}
          onChange={(e) => setUserNumber(e.target.value)}
        />
        <button onClick={handleSubmit}>Submit</button>
      </div> */}
    </div>
  );
};

export default NumberPickerBall;
