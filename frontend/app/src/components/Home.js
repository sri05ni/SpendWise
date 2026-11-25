import React ,{useEffect} from "react";
import { useLocation } from "react-router-dom";
import {
  Container,
  Row,
  Col,
  Card,
  Button,
} from "react-bootstrap";
import { Link } from "react-router-dom";
// import "./Home.css";

function Home() {
  const isLoggedIn = !!sessionStorage.getItem("token");

  const features = [
    {
      icon: "💰",
      title: "Track Your Income",
      description:
        "Record your income sources and keep track of your monthly earnings.",
    },
    {
      icon: "💸",
      title: "Manage Expenses",
      description:
        "Track your daily expenses and organize your spending by categories.",
    },
    {
      icon: "📊",
      title: "Visual Analytics",
      description:
        "Understand your spending habits with charts and financial summaries.",
    },
    {
      icon: "🎯",
      title: "Financial Planning",
      description:
        "Monitor your savings, balance, and financial goals in one place.",
    },
  ];
const location = useLocation();

useEffect(() => {
  if (!location.hash) return;

  const sectionId = location.hash.replace("#", "");

  const timer = setTimeout(() => {
    const section = document.getElementById(sectionId);

    if (section) {
      window.scrollTo({
        top: section.offsetTop - 90,
        behavior: "smooth",
      });
    }
  }, 300);

  return () => clearTimeout(timer);
}, [location.pathname, location.hash]);

  return (
    <div className="spendwise-home">

      {/* HERO SECTION */}
      <section className="hero-section" id="home">
        <Container>
          <Row className="align-items-center py-5">

            <Col md={6} className="hero-content">
              <h1>
                Welcome to <span className="hero-highlight">SpendWise</span>
              </h1>

              <h3 className="hero-subtitle">
                Your Money. Your Control.
              </h3>

              <p className="hero-description">
                Take control of your finances with SpendWise. Track your
                income, manage expenses, understand your spending habits,
                and make smarter financial decisions.
              </p>

              <div className="hero-buttons">
                {isLoggedIn ? (
                  <Button
                    as={Link}
                    to="/dashboard"
                    className="get-started-btn"
                  >
                    Go to Dashboard →
                  </Button>
                ) : (
                  <>
                    <Button
                      as={Link}
                      to="/signup"
                      className="get-started-btn"
                    >
                      Get Started →
                    </Button>

                    <Button
                      as={Link}
                      to="/login"
                      className="login-hero-btn"
                    >
                      Login
                    </Button>
                  </>
                )}
              </div>
            </Col>

            <Col md={6} className="hero-image-container text-center">
              <img
                src="/images/banner2.jpg"
                alt="SpendWise financial dashboard preview"
                className="preview-image"
                style={{
                  width: "600px",
                  height: "400px",
                  marginTop: 5,
                  maxWidth: "100%",
                  objectFit: "contain",
                }}
              />
            </Col>

          </Row>
        </Container>
      </section>

      {/* FEATURES SECTION */}
      <section className="features-section" id="features">
        <Container className="bg-secondary p-4 rounded-4">
          <div className="section-heading text-center text-dark">
            <h2>What You Can Do With SpendWise</h2>
            <p>
              Everything you need to manage your personal finances
              efficiently.
            </p>
          </div>

          <Row className="g-4">
            {features.map((feature, index) => (
              <Col md={6} lg={3} key={index}>
                <Card className="feature-card h-100">
                  <Card.Body className="text-center">
                    <div className="feature-icon">
                      {feature.icon}
                    </div>

                    <Card.Title className="feature-title">
                      {feature.title}
                    </Card.Title>

                    <Card.Text className="feature-description">
                      {feature.description}
                    </Card.Text>
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>
        </Container>
      </section>

      {/* ABOUT SECTION */}
      <section className="about-section py-5" id="about">
        <Container>
          <Row className="align-items-center">

            <Col md={6} className="about-image-container text-center">
              <img
                src="/images/banner4.gif"
                alt="Personal finance management"
                style={{width:500,height:400}}
                className="about-image"
              />
            </Col>

            <Col md={6} className="about-content">
              <h2>About SpendWise</h2>

              <p>
                SpendWise is a personal finance management application
                designed to help you manage your money in a simple and
                organized way.
              </p>

              <p>
                With SpendWise, you can track your income, record your
                expenses, view your financial summaries, and understand
                where your money goes.
              </p>

              <p>
                Our goal is to help you build better financial habits
                and make smarter decisions for your future.
              </p>

              <Button
                as={Link}
                to={isLoggedIn ? "/dashboard" : "/signup"}
                className="get-started-btn"
              >
                {isLoggedIn
                  ? "Go to Dashboard →"
                  : "Start Managing Money →"}
              </Button>
            </Col>

          </Row>
        </Container>
      </section>

      {/* CALL TO ACTION SECTION */}
      <section className="cta-section py-5 bg-secondary rounded-4 m-4">
        <Container className="text-center ">
          <h2>Take Control of Your Finances Today!</h2>

          <p>
            Start tracking your money and building better financial habits.
          </p>

          <Button
            as={Link}
            to={isLoggedIn ? "/dashboard" : "/signup"}
            className="cta-button"
          >
            {isLoggedIn
              ? "Go to Dashboard →"
              : "Create Your Account →"}
          </Button>
        </Container>
      </section>

      {/* FOOTER */}
      <footer className="spendwise-footer">
        <Container className="text-center">
          <h5>SpendWise</h5>

          <p>
            Manage your money wisely. Build your financial future.
          </p>

          <div className="footer-links">
            <Link to="/home">Home</Link>
            <a href="/home#features">Features</a>
            <a href="/home#about">About</a>

            {isLoggedIn ? (
              <Link to="/dashboard">Dashboard</Link>
            ) : (
              <>
                <Link to="/login">Login</Link>
                <Link to="/signup">Signup</Link>
              </>
            )}
          </div>

          <p className="footer-copyright">
            © {new Date().getFullYear()} SpendWise. All rights reserved.
          </p>
        </Container>
      </footer>

    </div>
  );
}

export default Home;