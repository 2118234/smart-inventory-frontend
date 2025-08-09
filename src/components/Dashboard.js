import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './Dashboard.css';
import { Bar } from 'react-chartjs-2';
import { FaPlus, FaEdit, FaTrash, FaSearch } from 'react-icons/fa';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

function Dashboard() {
  const [searchTerm, setSearchTerm] = useState('');
  const [products, setProducts] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [newProduct, setNewProduct] = useState({ name: '', quantity: '', price: '' });

  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
    } else {
      axios
        .get('http://localhost:5000/products', {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((res) => setProducts(res.data))
        .catch((err) => {
          console.error(err);
          localStorage.removeItem('token');
          navigate('/login');
        });
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  const handleAddProduct = () => {
    const token = localStorage.getItem('token');
    axios
      .post(
        'http://localhost:5000/products',
        { ...newProduct },
        { headers: { Authorization: `Bearer ${token}` } }
      )
      .then((res) => {
        setProducts([...products, res.data]);
        setShowAddModal(false);
        setNewProduct({ name: '', quantity: '', price: '' });
      })
      .catch((err) => console.error(err));
  };

  const handleDeleteProduct = () => {
    const token = localStorage.getItem('token');
    axios
      .delete(`http://localhost:5000/products/${selectedProduct?.id}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then(() => {
        setProducts(products.filter((p) => p.id !== selectedProduct?.id));
        setShowDeleteModal(false);
        setSelectedProduct(null);
      })
      .catch((err) => console.error(err));
  };

  const totalProducts = products.length;
  const highestProduct = products.reduce((max, p) => (p.quantity > max.quantity ? p : max), products[0] || {});
  const lowestProduct = products.reduce((min, p) => (p.quantity < min.quantity ? p : min), products[0] || {});

  const filteredProducts = products.filter(product =>
    (product.name || "").toLowerCase().includes(searchTerm.toLowerCase())
  );


  const chartData = {
    labels: products.map((p) => p.name),
    datasets: [
      {
        label: 'Quantity',
        data: products.map((p) => p.quantity),
        backgroundColor: 'rgba(128, 0, 128, 0.6)',
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: { position: 'top' },
      title: { display: true, text: 'Product Quantities' },
    },
  };


  return (
    <div className="dashboard-container">
      <aside className="sidebar">
        <h2 className="app-logo">Smart Inventory</h2>
        <button title="Add Product" onClick={() => setShowAddModal(true)}><FaPlus /> Add</button>
        <button
          title="Edit Product"
          onClick={() => {
            if (filteredProducts.length > 0) {
              setSelectedProduct(filteredProducts[0]);
              setShowEditModal(true);
            }
          }}
        >
          <FaEdit /> Edit
        </button>
        <button
          title="Delete Product"
          onClick={() => {
            if (filteredProducts.length > 0) {
              setSelectedProduct(filteredProducts[0]);
              setShowDeleteModal(true);
            }
          }}
        >
          <FaTrash /> Delete
        </button>
        <button className="logout-button" onClick={handleLogout}>
          Logout
        </button>
      </aside>

      <main className="main-content">
        <div className="topbar">
          <h1>Dashboard</h1>
        </div>

        <section className="stats-section">
          <div className="stat-card">
            <h3>Total Products</h3>
            <p>{totalProducts}</p>
          </div>
          <div className="stat-card">
            <h3>Highest Stock</h3>
            <p>{highestProduct?.name || '-'} ({highestProduct?.quantity || 0})</p>
          </div>
          <div className="stat-card">
            <h3>Lowest Stock</h3>
            <p>{lowestProduct?.name || '-'} ({lowestProduct?.quantity || 0})</p>
          </div>
        </section>

        <div className="search-bar">
          <FaSearch color="#6a0dad" />
          <input
            type="text"
            placeholder="Search product..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />

        </div>

        <section className="product-section">
          <h2 className="section-title">Product List</h2>
          <div className="product-grid">
            {filteredProducts.map((product) => (
              <div className="product-card" key={product.id}>
                <h3>{product.name}</h3>
                <p>Quantity: {product.quantity}</p>
                <p>Price: ₦{product.price}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="chart-section">
          <h2 className="section-title">Inventory Statistics</h2>
          <Bar data={chartData} options={chartOptions} />
        </section>
      </main>

      {/* Add Modal */}
      {showAddModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h2>Add Product</h2>
            <input
              type="text"
              placeholder="Product Name"
              value={newProduct.name}
              onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
            />
            <input
              type="number"
              placeholder="Quantity"
              value={newProduct.quantity}
              onChange={(e) => setNewProduct({ ...newProduct, quantity: e.target.value })}
            />
            <input
              type="number"
              placeholder="Price"
              value={newProduct.price}
              onChange={(e) => setNewProduct({ ...newProduct, price: e.target.value })}
            />
            <button onClick={handleAddProduct}>Add</button>
            <button onClick={() => setShowAddModal(false)}>Cancel</button>
          </div>
        </div>
      )}

      {/* Delete Modal */}
      {showDeleteModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h2>Delete Product</h2>
            <p>Are you sure you want to delete <strong>{selectedProduct?.name}</strong>?</p>
            <button onClick={handleDeleteProduct}>Yes, Delete</button>
            <button onClick={() => setShowDeleteModal(false)}>Cancel</button>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {showEditModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h2>Edit Product</h2>
            <p>Coming soon...</p>
            <button onClick={() => setShowEditModal(false)}>Close</button>
          </div>
        </div>
      )}
    </div>
  );
}

export default Dashboard;
