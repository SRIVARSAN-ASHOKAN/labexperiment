import { useParams } from "react-router-dom";

const data = [
  {
    id: 1,
    name: "Paris",
    description: "City of love and lights.",
    tips: "Visit Eiffel Tower early.",
    budget: "$2000"
  },
  {
    id: 2,
    name: "Bali",
    description: "Island of gods.",
    tips: "Explore beaches and temples.",
    budget: "$1200"
  },
  {
    id: 3,
    name: "Tokyo",
    description: "Modern meets tradition.",
    tips: "Try sushi and visit Shibuya.",
    budget: "$3000"
  }
];

function DestinationDetails() {
  const { id } = useParams();
  const destination = data.find(
    (item) => item.id === Number(id)
  );

  if (!destination) {
    return <h2 style={{ padding: "20px" }}>Destination Not Found</h2>;
  }

  return (
    <div style={{ padding: "20px" }}>
      <h2>{destination.name}</h2>
      <p><strong>Description:</strong> {destination.description}</p>
      <p><strong>Travel Tips:</strong> {destination.tips}</p>
      <p><strong>Budget:</strong> {destination.budget}</p>
    </div>
  );
}

export default DestinationDetails;