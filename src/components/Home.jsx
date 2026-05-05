import { Link } from "react-router-dom";

const destinations = [
  { id: 1, name: "Paris" },
  { id: 2, name: "Bali" },
  { id: 3, name: "Tokyo" },
];

function Home() {
  return (
    <div>
      <div style={{
        backgroundColor: "#0f172a",
        color: "white",
        height: "200px",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontSize: "28px"
      }}>
        Explore The World 🌍
      </div>

      <div style={{ padding: "20px" }}>
        <h2>Featured Destinations</h2>
        <ul>
          {destinations.map((place) => (
            <li key={place.id}>
              <Link to={`/destination/${place.id}`}>
                {place.name}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default Home;