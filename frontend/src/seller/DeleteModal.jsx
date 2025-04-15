import React, { useState } from "react";
import "./DeleteModal.css";

function DeleteModal({ productId, onDeleteConfirm, onCancel }) {
  const [deleteInput, setDeleteInput] = useState("");

  return (
    <div className="delete-modal-overlay">
      <div className="delete-modal-content">
        <span className="warning-icon">⚠️</span>
        <h3>Are you sure?</h3>
        <p>Type <strong>DELETE</strong> to confirm product deletion.</p>
        <input 
          type="text" 
          placeholder="Type DELETE to confirm" 
          value={deleteInput}
          onChange={(e) => setDeleteInput(e.target.value)}
        />
        <div className="modal-buttons">
          <button className="cancel-btn" onClick={onCancel}>Cancel</button>
          <button 
            className="delete-btn" 
            onClick={() => deleteInput === "DELETE" && onDeleteConfirm(productId)}
            disabled={deleteInput !== "DELETE"} 
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}

export default DeleteModal;
