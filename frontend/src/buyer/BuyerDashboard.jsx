import { Link } from "react-router-dom";
import "../styles/BuyerDashboard.css";

function BuyerDashboard() {
  return (
    <div className="buyer-dashboard">
      <h2>Buyer Dashboard</h2>
      <ul>
        <li><Link to="/buyer/orders">My Orders</Link></li>
        <li><Link to="/buyer/cart">My Cart</Link></li>
        <li><Link to="/buyer/profile">Profile</Link></li>
      </ul>
    </div>
  );
}

export default BuyerDashboard;
