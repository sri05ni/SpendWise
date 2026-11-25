
import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
// import "./IntroAnimation.css";

function IntroScreen() {
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => {
      navigate("/home", { replace: true });
    }, 2800);

    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className="spendwise-splash">

      {/* Floating money icons */}
      <div className="money-icon money-1">💰</div>
      <div className="money-icon money-2">💸</div>
      <div className="money-icon money-3">🪙</div>
      <div className="money-icon money-4">📈</div>
      <div className="money-icon money-5">✨</div>

      {/* Logo */}
      <div className="splash-content">

        <div className="splash-logo">
          <span className="splash-wallet">💰</span>
        </div>

        <h1 className="splash-title">
          Spend<span>Wise</span>
        </h1>

        <p className="splash-tagline">
          Your Money. Your Control.
        </p>

        <div className="splash-loader">
          <div className="splash-loader-fill"></div>
        </div>

        <small className="splash-loading-text">
          Preparing your financial journey...
        </small>

      </div>

    </div>
  );
}

export default IntroScreen;
