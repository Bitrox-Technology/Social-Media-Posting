import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const UserDetail = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    companyName: '',
    avatar: null as File | null,
    logo: null as File | null,
    productCategories: [''],
    keyProducts: [''],
    targetMarket: '',
    annualRevenue: '',
    websiteUrl: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, field: 'avatar' | 'logo') => {
    if (e.target.files && e.target.files[0]) {
      setFormData((prev) => ({ ...prev, [field]: e.target.files[0] }));
    }
  };

  const handleArrayChange = (e: React.ChangeEvent<HTMLInputElement>, field: 'productCategories' | 'keyProducts', index: number) => {
    const newArray = [...formData[field]];
    newArray[index] = e.target.value;
    setFormData((prev) => ({ ...prev, [field]: newArray }));
  };

  const addItem = (field: 'productCategories' | 'keyProducts') => {
    setFormData((prev) => ({ ...prev, [field]: [...prev[field], ''] }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const formDataToSend = new FormData();
    formDataToSend.append('username', formData.username);
    formDataToSend.append('email', formData.email);
    formDataToSend.append('companyName', formData.companyName);
    if (formData.avatar) formDataToSend.append('avatar', formData.avatar);
    if (formData.logo) formDataToSend.append('logo', formData.logo);
    formDataToSend.append('productCategories', JSON.stringify(formData.productCategories.filter((item) => item)));
    formDataToSend.append('keyProducts', JSON.stringify(formData.keyProducts.filter((item) => item)));
    formDataToSend.append('targetMarket', formData.targetMarket);
    formDataToSend.append('annualRevenue', formData.annualRevenue);
    formDataToSend.append('websiteUrl', formData.websiteUrl);

    try {
      const response = await fetch('http://localhost:3000/api/user-details', {
        method: 'POST',
        body: formDataToSend,
      });
      const data = await response.json();
      if (response.ok) {
        console.log('User details saved:', data);
        navigate('/dashboard');
      } else {
        throw new Error(data.message || 'Failed to save user details');
      }
    } catch (error) {
      console.error('Error:', error);
      if (error instanceof Error) {
        alert(error.message);
      } else {
        alert('An unknown error occurred');
      }
     }
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-gray-800 text-white rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold mb-6 text-center">Complete Your Profile</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block mb-1">Username</label>
          <input
            type="text"
            name="username"
            value={formData.username}
            onChange={handleChange}
            className="w-full p-2 rounded bg-gray-700 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-yellow-400"
            required
          />
        </div>
        <div>
          <label className="block mb-1">Email</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className="w-full p-2 rounded bg-gray-700 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-yellow-400"
            required
          />
        </div>
        <div>
          <label className="block mb-1">Company Name</label>
          <input
            type="text"
            name="companyName"
            value={formData.companyName}
            onChange={handleChange}
            className="w-full p-2 rounded bg-gray-700 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-yellow-400"
            required
          />
        </div>
        <div>
          <label className="block mb-1">Avatar</label>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => handleFileChange(e, 'avatar')}
            className="w-full p-2 rounded bg-gray-700 border border-gray-600"
          />
        </div>
        <div>
          <label className="block mb-1">Logo</label>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => handleFileChange(e, 'logo')}
            className="w-full p-2 rounded bg-gray-700 border border-gray-600"
          />
        </div>
        <div>
          <label className="block mb-1">Product Categories</label>
          {formData.productCategories.map((category, index) => (
            <div key={index} className="flex space-x-2 mb-2">
              <input
                type="text"
                value={category}
                onChange={(e) => handleArrayChange(e, 'productCategories', index)}
                className="flex-1 p-2 rounded bg-gray-700 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-yellow-400"
                placeholder="e.g., Electronics, Apparel"
              />
            </div>
          ))}
          <button
            type="button"
            onClick={() => addItem('productCategories')}
            className="mt-2 px-4 py-2 bg-yellow-500 text-gray-900 rounded hover:bg-yellow-600"
          >
            Add Category
          </button>
        </div>
        <div>
          <label className="block mb-1">Key Products</label>
          {formData.keyProducts.map((product, index) => (
            <div key={index} className="flex space-x-2 mb-2">
              <input
                type="text"
                value={product}
                onChange={(e) => handleArrayChange(e, 'keyProducts', index)}
                className="flex-1 p-2 rounded bg-gray-700 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-yellow-400"
                placeholder="e.g., Smartphones, T-shirts"
              />
            </div>
          ))}
          <button
            type="button"
            onClick={() => addItem('keyProducts')}
            className="mt-2 px-4 py-2 bg-yellow-500 text-gray-900 rounded hover:bg-yellow-600"
          >
            Add Product
          </button>
        </div>
        <div>
          <label className="block mb-1">Target Market</label>
          <input
            type="text"
            name="targetMarket"
            value={formData.targetMarket}
            onChange={handleChange}
            className="w-full p-2 rounded bg-gray-700 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-yellow-400"
            placeholder="e.g., Young professionals, Global retailers"
          />
        </div>
        <div>
          <label className="block mb-1">Annual Revenue</label>
          <input
            type="text"
            name="annualRevenue"
            value={formData.annualRevenue}
            onChange={handleChange}
            className="w-full p-2 rounded bg-gray-700 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-yellow-400"
            placeholder="e.g., $500,000"
          />
        </div>
        <div>
          <label className="block mb-1">Website URL</label>
          <input
            type="url"
            name="websiteUrl"
            value={formData.websiteUrl}
            onChange={handleChange}
            className="w-full p-2 rounded bg-gray-700 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-yellow-400"
            placeholder="e.g., https://yourcompany.com"
          />
        </div>
        <button
          type="submit"
          className="w-full px-4 py-2 bg-yellow-500 text-gray-900 rounded hover:bg-yellow-600"
        >
          Submit Details
        </button>
      </form>
    </div>
  );
};

export default UserDetail;