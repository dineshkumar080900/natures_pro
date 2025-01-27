import React, { useState } from "react";
import 'bootstrap/dist/css/bootstrap.min.css';

const QuantitySelector = () => {
  const availableStock = 349; // The available stock
  const [quantity, setQuantity] = useState(1);

  const handleDecrease = () => {
    if (quantity > 0) {
      setQuantity(quantity - 1);
    }
  };

  const handleIncrease = () => {
    if (quantity < availableStock) {
      setQuantity(quantity + 1);
    }
  };

  return (
    <div className="d-flex align-items-center">
      <button style={{borderRadius:"200px",width:"40px"}}
        type="button"
        className="btn btn-outline-secondary"
        data-action="decrease-quantity"
        onClick={handleDecrease}
      >
        <svg
          className="Icon Icon--minus"
          role="presentation"
          viewBox="0 0 16 2"
          width="16"
          height="2"
        >
          <path
            d="M1,1 L15,1"
            stroke="currentColor"
            fill="none"
            fillRule="evenodd"
            strokeLinecap="square"
          ></path>
        </svg>
      </button>
      <input style={{width:"45px"}}
        type="text"
        className="form-control mx-2"
        pattern="[0-9]*"
        min="0"
        max={availableStock}
        name="quantity"
        value={quantity}
        aria-label="Quantity"
        readOnly
      />
      <button style={{borderRadius:"200px",width:"40px"}}
        type="button"
        className="btn btn-outline-secondary"
        data-action="increase-quantity"
        onClick={handleIncrease}
      >
        <svg
          className="Icon Icon--plus"
          role="presentation"
          viewBox="0 0 16 16"
          width="16"
          height="16"
        >
          <g
            stroke="currentColor"
            fill="none"
            fillRule="evenodd"
            strokeLinecap="square"
          >
            <path d="M8,1 L8,15"></path>
            <path d="M1,8 L15,8"></path>
          </g>
        </svg>
      </button>
    </div>
  );
};

export default QuantitySelector;