import { useState } from "react";

function Contact() {
  const [message, setMessage] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    setMessage("Message sent successfully!");
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2>Contact</h2>

      <form onSubmit={handleSubmit}>
        <input type="text" placeholder="Your Name" required />
        <br /><br />
        <textarea placeholder="Your Message" required />
        <br /><br />
        <button type="submit">Send</button>
      </form>

      <p>{message}</p>
    </div>
  );
}

export default Contact;