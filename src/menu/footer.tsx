import "./footer.css";

function Header() {
  return (
    <footer className="footer">
      <div className="header-inner">
        <a className="header-logo" href="index.html">
          <img src="logo.png" alt="Ideatter Logo" />
        </a>
        <div className="userDisplay">
          User: user
        </div>
      </div>
    </footer>
  );
}

export default Header;