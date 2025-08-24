import "./header.css";

function Header() {
  return (
    <header className="header">
      <div className="header-inner">
        <a className="header-logo" href="index.html">
          <img src="logo.png" alt="Ideatter Logo" />
        </a>
        {/* <div className="userDisplay">
          User: user
        </div> */}
      </div>
    </header>
  );
}

export default Header;