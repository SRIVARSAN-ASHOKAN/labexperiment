import { Link } from "react-router-dom";

const places = [
  { id: 1, name: "Paris" },
  { id: 2, name: "Bali" },
  { id: 3, name: "Tokyo" },
];

function Destinations() {
  return (
    <div style={{ padding: "20px" }}>
      <h2>All Destinations</h2>

      {places.map((place) => (
        <div key={place.id} style={{
          marginBottom: "10px",
          padding: "10px",
          border: "1px solid #ccc"
        }}>
          <Link to={`/destination/${place.id}`}>
            {place.name}
          </Link>
        </div>
      ))}
    </div>
  );
}

export default Destinations;