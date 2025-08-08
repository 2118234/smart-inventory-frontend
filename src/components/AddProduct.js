import React, { useState } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';

function AddProduct({ token, onSuccessMessage, onErrorMessage, refreshProducts }) {
  const [name, setName] = useState('');
  const [quantity, setQuantity] = useState('');
  const [price, setPrice] = useState('');

  const handleAddProduct = async (e) => {
    e.preventDefault();
    try {
      await axios.post(
        'http://127.0.0.1:5000/products',
        { name, quantity, price },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      onSuccessMessage('Product added successfully!');
      onErrorMessage('');
      setName('');
      setQuantity('');
      setPrice('');
      refreshProducts();
    } catch (err) {
      console.error(err);
      onErrorMessage('Failed to add product.');
      onSuccessMessage('');
    }
  };

  return (
    <form onSubmit={handleAddProduct}>
      <input
        type="text"
        placeholder="Product Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        required
      />
      <input
        type="number"
        placeholder="Quantity"
        value={quantity}
        onChange={(e) => setQuantity(e.target.value)}
        required
      />
      <input
        type="number"
        step="0.01"
        placeholder="Price"
        value={price}
        onChange={(e) => setPrice(e.target.value)}
        required
      />
      <motion.button
        type="submit"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        Add Product
      </motion.button>
    </form>
  );
}

export default AddProduct;
