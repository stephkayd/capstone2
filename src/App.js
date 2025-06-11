import './App.css';
import React, { useState, useEffect } from 'react';
import { getAll, post, put, deleteById } from './memdb.js';

function log(message) {
  console.log(message);
}

export function App(params) {
  const blankCustomer = { id: -1, name: "", email: "", password: "" };

  // State for list of customers
  const [customers, setCustomers] = useState([]);
  // State for the currently selected or edited customer
  const [formObject, setFormObject] = useState(blankCustomer);

  // Load customers on mount
  useEffect(() => {
    setCustomers(getAll());
  }, []);

  // Determine mode based on if formObject has valid id
  const mode = (formObject.id >= 0) ? 'Update' : 'Add';

  // Handle clicking on a customer row to select/deselect
  function handleListClick(item) {
    log("in handleListClick()");
    if (formObject.id === item.id) {
      // If clicked the selected item, deselect it
      setFormObject(blankCustomer);
    } else {
      // Otherwise, select the clicked item
      setFormObject(item);
    }
  }

  // Handle form input changes - controlled inputs
  function handleInputChange(event) {
    log("in handleInputChange()");
    const { name, value } = event.target;
    setFormObject(prev => ({
      ...prev,
      [name]: value
    }));
  }

  // Cancel button clears selection/form
  function onCancelClick() {
    log("in onCancelClick()");
    setFormObject(blankCustomer);
  }

  // Delete selected customer
  function onDeleteClick() {
    log("in onDeleteClick()");
    if (formObject.id >= 0) {
      deleteById(formObject.id);
      setCustomers(getAll());
      setFormObject(blankCustomer);
    }
  }

  // Save new or updated customer
  function onSaveClick() {
    log("in onSaveClick()");
    if (formObject.name.trim() === "") {
      alert("Name is required");
      return;
    }
    if (formObject.id >= 0) {
      put(formObject.id, formObject);
    } else {
      post(formObject);
    }
    setCustomers(getAll());
    setFormObject(blankCustomer);
  }

  return (
    <div>
      <div className="boxed">
        <h4>Customer List</h4>
        <table id="customer-list">
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Pass</th>
            </tr>
          </thead>
          <tbody>
            {customers.map((item) => (
              <tr
                key={item.id}
                onClick={() => handleListClick(item)}
                className={item.id === formObject.id ? 'selected' : ''}
                style={{ cursor: 'pointer' }}
              >
                <td>{item.name}</td>
                <td>{item.email}</td>
                <td>{item.password}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="boxed">
        <div>
          <h4>{mode}</h4>
        </div>
        <form>
          <table id="customer-add-update">
            <tbody>
              <tr>
                <td className="label">Name:</td>
                <td>
                  <input
                    type="text"
                    name="name"
                    value={formObject.name}
                    placeholder="Customer Name"
                    onChange={handleInputChange}
                    required
                  />
                </td>
              </tr>
              <tr>
                <td className="label">Email:</td>
                <td>
                  <input
                    type="email"
                    name="email"
                    value={formObject.email}
                    placeholder="name@company.com"
                    onChange={handleInputChange}
                  />
                </td>
              </tr>
              <tr>
                <td className="label">Pass:</td>
                <td>
                  <input
                    type="text"
                    name="password"
                    value={formObject.password}
                    placeholder="password"
                    onChange={handleInputChange}
                  />
                </td>
              </tr>
              <tr className="button-bar">
                <td colSpan="2">
                  <input type="button" value="Delete" onClick={onDeleteClick} disabled={formObject.id < 0} />
                  <input type="button" value="Save" onClick={onSaveClick} />
                  <input type="button" value="Cancel" onClick={onCancelClick} />
                </td>
              </tr>
            </tbody>
          </table>
        </form>
      </div>
    </div>
  );
}

export default App;
