import React, { useState, useCallback } from 'react';
import { Table, Button, Form } from 'react-bootstrap';
import { generateOptionId } from '../utils/generateOrderId';
import { useDispatch } from 'react-redux';
import { fetchMenu } from '../slices/menuSlice';

const EditableTable = ({ data, menuId }) => {
  const dispatch = useDispatch();

  const [editableData, setEditableData] = useState(data);
  const [editingIndex, setEditingIndex] = useState(null);
  const [newItem, setNewItem] = useState({ id: '', name: '', price: '' });

  const handleEditClick = useCallback((index) => {
    setEditingIndex(index);
  }, []);

  const handleSaveClick = useCallback(async (index) => {
    const updatedOption = editableData[index];
    try {
      const response = await fetch(`/api/menu?id=${menuId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ updateOption: updatedOption }),
      });

      if (response.ok) {
        dispatch(fetchMenu());
        setEditingIndex(null);
      } else {
        console.error('Error saving updated option:', await response.json());
      }
    } catch (error) {
      console.error('Error saving option:', error);
    }
  }, [editableData, dispatch, menuId]);

  const handleInputChange = useCallback((e, index, key) => {
    const updatedItem = { ...editableData[index], [key]: e.target.value };
    setEditableData((prevData) =>
      prevData.map((item, i) => (i === index ? updatedItem : item))
    );
  }, [editableData]);

  const handleNewItemChange = useCallback((e) => {
    setNewItem((prevItem) => ({ ...prevItem, [e.target.name]: e.target.value }));
  }, []);

  const handleAddNewItem = useCallback(async () => {
    const newOption = { ...newItem, id: `${menuId}_${generateOptionId()}` };
    try {
      const response = await fetch(`/api/menu?id=${menuId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ addOption: newOption }),
      });

      if (response.ok) {
        setEditableData((prevData) => [...prevData, newOption]);
        dispatch(fetchMenu());
        setNewItem({ name: '', price: '' });
      } else {
        console.error('Error adding option:', await response.json());
      }
    } catch (error) {
      console.error('Error adding option:', error);
    }
  }, [newItem, menuId, dispatch]);

  const handleDeleteClick = useCallback(async (index) => {
    const optionId = editableData[index].id;
    try {
      const response = await fetch(`/api/menu?id=${menuId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ deleteOptionId: optionId }),
      });

      if (response.ok) {
        setEditableData((prevData) => prevData.filter((_, i) => i !== index));
        dispatch(fetchMenu());
      } else {
        console.error('Error deleting option:', await response.json());
      }
    } catch (error) {
      console.error('Error deleting option:', error);
    }
  }, [editableData, menuId, dispatch]);

  return (
    <Table striped bordered hover>
      <thead>
        <tr>
          <th>Name</th>
          <th>Price</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        {editableData.map((item, index) => (
          <tr key={item.id}>
            <td>
              {editingIndex === index ? (
                <Form.Control
                  type="text"
                  value={item.name}
                  onChange={(e) => handleInputChange(e, index, 'name')}
                />
              ) : (
                item.name
              )}
            </td>
            <td>
              {editingIndex === index ? (
                <Form.Control
                  type="number"
                  value={item.price}
                  onChange={(e) => handleInputChange(e, index, 'price')}
                />
              ) : (
                item.price
              )}
            </td>
            <td>
              {editingIndex === index ? (
                <>
                  <Button variant="success" onClick={() => handleSaveClick(index)}>
                    Save
                  </Button>
                  <Button variant="danger" onClick={() => handleDeleteClick(index)} className="ms-2">
                    Delete
                  </Button>
                </>
              ) : (
                <>
                  <Button variant="primary" onClick={() => handleEditClick(index)}>
                    Edit
                  </Button>
                  <Button variant="danger" onClick={() => handleDeleteClick(index)} className="ms-2">
                    Delete
                  </Button>
                </>
              )}
            </td>
          </tr>
        ))}
        <tr>
          <td>
            <Form.Control
              type="text"
              placeholder="New Item Name"
              name="name"
              value={newItem.name}
              onChange={handleNewItemChange}
            />
          </td>
          <td>
            <Form.Control
              type="number"
              placeholder="New Item Price"
              name="price"
              value={newItem.price}
              onChange={handleNewItemChange}
            />
          </td>
          <td>
            <Button variant="success" onClick={handleAddNewItem}>
              Add
            </Button>
          </td>
        </tr>
      </tbody>
    </Table>
  );
};

export default EditableTable;
