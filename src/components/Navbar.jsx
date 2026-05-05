import { Link } from "react-router-dom";

function Navbar() {
  return (
    <nav style={{
      padding: "15px",
      backgroundColor: "#1e3a8a",
      display: "flex",
      justifyContent: "space-between",
      color: "white"
    }}>
      <h2>MyTravelBlog</h2>

      <div style={{ display: "flex", gap: "15px" }}>
        <Link to="/" style={{ color: "white" }}>Home</Link>
        <Link to="/destinations" style={{ color: "white" }}>Destinations</Link>
        <Link to="/gallery" style={{ color: "white" }}>Gallery</Link>
        <Link to="/about" style={{ color: "white" }}>About</Link>
        <Link to="/contact" style={{ color: "white" }}>Contact</Link>
      </div>
    </nav>
  );
}

export default Navbar;