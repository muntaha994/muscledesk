// gym-frontend/app/page.js
'use client';
import { useEffect, useState } from 'react';

export default function GymDashboard() {
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState(null);
  
  const [showBmiCalc, setShowBmiCalc] = useState(false);
  const [weight, setWeight] = useState('');
  const [height, setHeight] = useState('');
  const [bmiResult, setBmiResult] = useState(null);
  const [bmiStatus, setBmiStatus] = useState('');

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    joinDate: new Date().toISOString().split('T')[0],
    membership: { id: 1 },
    trainer: { id: 0 } // Default to 0 representing "No Trainer"
  });

  const fetchMembers = () => {
    fetch('http://localhost:8080/api/members')
      .then((res) => res.json())
      .then((data) => {
        setMembers(data);
        setLoading(false);
      })
      .catch((err) => console.error("Error reading records: ", err));
  };

  useEffect(() => {
    fetchMembers();
  }, []);

  const calculateBmi = (e) => {
    e.preventDefault();
    if (!weight || !height) return;
    const heightInMeters = height / 100;
    const bmi = (weight / (heightInMeters * heightInMeters)).toFixed(1);
    setBmiResult(bmi);

    if (bmi < 18.5) setBmiStatus('Underweight 🟡');
    else if (bmi >= 18.5 && bmi < 24.9) setBmiStatus('Normal weight 🟢');
    else if (bmi >= 25 && bmi < 29.9) setBmiStatus('Overweight 🟠');
    else setBmiStatus('Obese 🔴');
  };

  const clearBmi = () => {
    setWeight('');
    setHeight('');
    setBmiResult(null);
    setBmiStatus('');
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === 'membership' || name === 'trainer') {
      const idVal = parseInt(value);
      setFormData({
        ...formData,
        [name]: idVal === 0 ? null : { id: idVal } // Maps 0 to null for the database backend
      });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const startEdit = (member) => {
    setEditingId(member.id);
    setFormData({
      name: member.name,
      email: member.email,
      phone: member.phone || '',
      joinDate: member.joinDate,
      membership: { id: member.membership ? member.membership.id : 1 },
      trainer: member.trainer ? { id: member.trainer.id } : { id: 0 } // Fallback safely to 0 if unassigned
    });
  };

  const cancelEdit = () => {
    setEditingId(null);
    setFormData({
      name: '',
      email: '',
      phone: '',
      joinDate: new Date().toISOString().split('T')[0],
      membership: { id: 1 },
      trainer: { id: 0 }
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const url = editingId ? `http://localhost:8080/api/members/${editingId}` : 'http://localhost:8080/api/members';
    const method = editingId ? 'PUT' : 'POST';

    try {
      const response = await fetch(url, {
        method: method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      if (response.ok) {
        alert(editingId ? 'Member details updated!' : 'Member added successfully!');
        cancelEdit();
        fetchMembers();
      }
    } catch (error) {
      console.error("Error committing form operations: ", error);
    }
  };

  const handleDelete = async (id) => {
    if (confirm('Are you sure you want to remove this member from the database?')) {
      try {
        const response = await fetch(`http://localhost:8080/api/members/${id}`, { method: 'DELETE' });
        if (response.ok) {
          alert('Member deleted!');
          if (editingId === id) cancelEdit();
          fetchMembers();
        }
      } catch (error) {
        console.error("Error deleting member: ", error);
      }
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-6xl mx-auto space-y-8">
        
        {/* Header Section */}
        <header className="relative bg-white p-6 rounded-lg shadow-md flex justify-between items-center border border-gray-200">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">Gym Management Suite</h1>
            <p className="text-gray-500">Relational Database Mutation Portal</p>
          </div>
          
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setShowBmiCalc(!showBmiCalc)}
              className="bg-purple-600 hover:bg-purple-700 text-white font-semibold py-2 px-4 rounded transition duration-200 text-sm flex items-center gap-2 shadow animate-pulse"
            >
              📊 {showBmiCalc ? 'Close Calculator' : 'BMI Calculator'}
            </button>
            <span className="bg-green-100 text-green-800 text-sm font-semibold px-3 py-1 rounded-full hidden sm:inline">
              XAMPP MySQL Active
            </span>
          </div>

          {/* Floating BMI Calculator Card */}
          {showBmiCalc && (
            <div className="absolute right-6 top-24 z-50 w-80 bg-white p-5 rounded-lg shadow-xl border border-gray-300">
              <h3 className="text-md font-bold text-gray-700 mb-3 border-b pb-2">Quick BMI Calculator</h3>
              <form onSubmit={calculateBmi} className="space-y-3">
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">WEIGHT (KG)</label>
                  <input 
                    type="number" required min="1" placeholder="e.g. 70" value={weight} onChange={(e) => setWeight(e.target.value)}
                    className="w-full p-2 border border-gray-400 rounded text-sm bg-gray-50 text-gray-900 font-medium focus:outline-purple-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">HEIGHT (CM)</label>
                  <input 
                    type="number" required min="1" placeholder="e.g. 175" value={height} onChange={(e) => setHeight(e.target.value)}
                    className="w-full p-2 border border-gray-400 rounded text-sm bg-gray-50 text-gray-900 font-medium focus:outline-purple-500"
                  />
                </div>
                <div className="flex gap-2 pt-1">
                  <button type="submit" className="w-full bg-purple-600 hover:bg-purple-700 text-white font-bold py-1.5 rounded text-xs transition">Calculate</button>
                  <button type="button" onClick={clearBmi} className="w-1/2 bg-gray-200 hover:bg-gray-300 text-gray-700 font-bold py-1.5 rounded text-xs transition">Clear</button>
                </div>
              </form>
              {bmiResult && (
                <div className="mt-4 p-3 bg-purple-50 border border-purple-200 rounded text-center">
                  <div className="text-xs text-purple-600 font-semibold uppercase">Resulting Score</div>
                  <div className="text-2xl font-black text-purple-900 my-0.5">{bmiResult}</div>
                  <div className="text-xs font-bold text-gray-700">{bmiStatus}</div>
                </div>
              )}
            </div>
          )}
        </header>

        {/* Form Section */}
        <section className="bg-white p-6 rounded-lg shadow-md border border-gray-200 border-t-4 border-blue-500">
          <h2 className="text-xl font-bold text-gray-800 mb-6">
            {editingId ? `📝 Edit Member Profile (ID: ${editingId})` : '➕ Register New Gym Member'}
          </h2>
          
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1.5">Full Name</label>
              <input type="text" name="name" placeholder="Enter full name" required value={formData.name} onChange={handleChange} className="w-full p-2.5 border-2 border-gray-400 rounded bg-gray-50 text-gray-900 font-medium focus:bg-white focus:border-blue-600 focus:outline-none transition" />
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1.5">Email Address</label>
              <input type="email" name="email" placeholder="name@example.com" required value={formData.email} onChange={handleChange} className="w-full p-2.5 border-2 border-gray-400 rounded bg-gray-50 text-gray-900 font-medium focus:bg-white focus:border-blue-600 focus:outline-none transition" />
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1.5">Phone Number</label>
              <input type="text" name="phone" placeholder="Enter phone number" value={formData.phone} onChange={handleChange} className="w-full p-2.5 border-2 border-gray-400 rounded bg-gray-50 text-gray-900 font-medium focus:bg-white focus:border-blue-600 focus:outline-none transition" />
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1.5">Membership Plan</label>
              <select name="membership" value={formData.membership.id} onChange={handleChange} className="w-full p-2.5 border-2 border-gray-400 rounded bg-gray-50 text-gray-900 font-bold focus:bg-white focus:border-blue-600 focus:outline-none transition cursor-pointer">
                <option value="1">Monthly Basic ($29.99)</option>
                <option value="2">Annual VIP ($299.99)</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1.5">Assign Personal Trainer</label>
              <select 
                name="trainer" 
                value={formData.trainer ? formData.trainer.id : 0} 
                onChange={handleChange} 
                className="w-full p-2.5 border-2 border-gray-400 rounded bg-gray-50 text-gray-900 font-bold focus:bg-white focus:border-blue-600 focus:outline-none transition cursor-pointer"
              >
                {/* NEW: Explicit Empty Option */}
                <option value="0">None / No Personal Trainer</option>
                <option value="1">Mike Mentzer (Bodybuilding)</option>
                <option value="2">Sarah Connor (HIIT)</option>
              </select>
            </div>
            
            <div className="flex gap-2 items-end">
              <button type="submit" className={`w-full text-white font-bold py-2.5 px-4 rounded shadow-md transition duration-200 cursor-pointer ${editingId ? 'bg-amber-500 hover:bg-amber-600' : 'bg-blue-600 hover:bg-blue-700'}`}>
                {editingId ? 'Save Changes' : 'Save to Database'}
              </button>
              {editingId && <button type="button" onClick={cancelEdit} className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2.5 px-4 rounded transition duration-200 cursor-pointer">Cancel</button>}
            </div>
          </form>
        </section>

        {/* Table View */}
        <section className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-200">
          <div className="p-4 bg-gray-800 text-white font-bold">Active Member Directory</div>
          {loading ? (
            <p className="p-4 text-center text-gray-500">Refreshing records...</p>
          ) : (
            <table className="min-w-full text-left text-sm text-gray-700">
              <thead className="bg-gray-100 uppercase text-xs font-bold text-gray-600 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3">ID</th>
                  <th className="px-6 py-3">Member Details</th>
                  <th className="px-6 py-3">Join Date</th>
                  <th className="px-6 py-3">Selected Plan</th>
                  <th className="px-6 py-3">Assigned Trainer</th>
                  <th className="px-6 py-3 text-center">Actions</th>
                </tr>
              </thead>
              <tbody>
                {members.map((member) => (
                  <tr key={member.id} className={`border-b border-gray-200 transition ${editingId === member.id ? 'bg-amber-50 font-medium' : 'hover:bg-gray-50'}`}>
                    <td className="px-6 py-4 font-bold text-gray-900">{member.id}</td>
                    <td className="px-6 py-4">
                      <div className="font-semibold text-gray-800">{member.name}</div>
                      <div className="text-xs text-gray-500">{member.email} • {member.phone || 'No Phone'}</div>
                    </td>
                    <td className="px-6 py-4 text-gray-600">{member.joinDate}</td>
                    <td className="px-6 py-4">
                      <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs font-bold">
                        {member.membership ? member.membership.type : 'No Active Plan'}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      {/* Displays 'Unassigned' cleanly if backend sends null */}
                      <div className="font-medium text-gray-800">
                        {member.trainer ? `🏋️‍♂️ ${member.trainer.name}` : '❌ Unassigned'}
                      </div>
                      {member.trainer && <div className="text-xs text-gray-400">{member.trainer.specialization}</div>}
                    </td>
                    <td className="px-6 py-4 text-center space-x-2">
                      <button onClick={() => startEdit(member)} className="bg-amber-100 text-amber-700 hover:bg-amber-600 hover:text-white font-semibold py-1 px-3 rounded text-xs transition duration-150 cursor-pointer">Edit</button>
                      <button onClick={() => handleDelete(member.id)} className="bg-red-100 text-red-600 hover:bg-red-600 hover:text-white font-semibold py-1 px-3 rounded text-xs transition duration-150 cursor-pointer">Delete</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </section>

      </div>
    </div>
  );
}