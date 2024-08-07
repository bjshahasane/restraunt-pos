import React, { useEffect, useState } from 'react';
import { Table, Button, Form } from 'react-bootstrap';
import { generateOptionId } from '../utils/generateOrderId';
import { useDispatch } from 'react-redux';
import { fetchMenu } from '../slices/menuSlice';

const EditableTable = ({ data, menuId }) => {
  const dispatch = useDispatch();

  const [editableData, setEditableData] = useState(data);
  const [isEditing, setIsEditing] = useState(null);
  const [newItem, setNewItem] = useState({ id: '', name: '', price: '' });

  // useEffect(()=>{
  //   if(editableData || newItem){
  //     dispatch(fetchMenu())
  //   }
  // },[editableData,newItem])

  const handleEditClick = (index) => {
    setIsEditing(index);
  };

  const handleSaveClick = async (index) => {
    const updatedOption = editableData[index];
    try {
      const response = await fetch(`/api/menu?id=${menuId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ updateOption: updatedOption }),
      });
      const data = await response.json();
      console.log(data);

      if (response.status === 200) {
        dispatch(fetchMenu())
        setIsEditing(null);
      } else {
        console.log('Error adding order', data);
      }

    } catch (error) {
      console.error('Error updating option:', error);
    }
  };

  // const handleInputChange = (e, index, key) => {
  //   const newData = [...editableData];
  //   newData[index][key] = e.target.value;
  //   setEditableData(newData);
  // };

  const handleInputChange = (e, index, key) => {
    const newData = [...editableData];
    // Create a new object to avoid direct mutation
    const updatedItem = { ...newData[index] };
    updatedItem[key] = e.target.value;
    newData[index] = updatedItem;
    setEditableData(newData);
};


  const handleNewItemChange = (e) => {
    setNewItem({ ...newItem, [e.target.name]: e.target.value });
  };
  const handleAddNewItem = async () => {
    const newOption = { ...newItem, id: `${menuId}_${generateOptionId()}` };
    console.log("This is add", newOption);
    try {
      const response = await fetch(`/api/menu?id=${menuId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ addOption: newOption }),
      });
      const data = await response.json();

      if (response.status === 200) {
        // Update editableData state correctly
        setEditableData(prevData => [...prevData, newOption]);
        dispatch(fetchMenu());
        setNewItem({ name: '', price: '' });
      } else {
        console.log('Error adding option', data);
      }

    } catch (error) {
      console.error('Error adding option:', error);
    }
  };

  const handleDeleteClick = async (index) => {
    const optionId = editableData[index].id;
    try {
      const response = await fetch(`/api/menu?id=${menuId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ deleteOptionId: optionId }),
      });
      const data = await response.json();
      console.log(data);

      if (response.status === 200) {
        const newData = editableData.filter((_, i) => i !== index);
        dispatch(fetchMenu())
        setEditableData(newData);
      } else {
        console.log('Error deleting menu', data);
      }

    } catch (error) {
      console.error('Error deleting menu:', error);
    }
  };
  return (
    <>
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
                {isEditing === index ? (
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
                {isEditing === index ? (
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
                {isEditing === index ? (
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
    </>
  );
};

export default EditableTable;
