'use client'

import React, { useEffect, useState } from 'react';
import Layout from '@/app/components/Layout';
// import { categories } from '@/app/js/category';
import EditableTable from '@/app/components/MenuEditTable';
import { fetchMenu } from '@/app/slices/menuSlice';
import { useDispatch, useSelector } from 'react-redux';
import { Accordion, AccordionItem, AccordionHeader, AccordionBody, Modal, ModalTitle, ModalHeader, ModalFooter, ModalBody, FormControl, FormLabel } from 'react-bootstrap';
import { generateMenuId } from '@/app/utils/generateOrderId';

const Menus = () => {
    const dispatch = useDispatch();
    const store = useSelector((state) => state.menuReducer);

    const [show, setShow] = useState(false);
    const [catName, setCatName] = useState("");
    const [action, setAction] = useState("");
    const [menuCat, setMenuCat] = useState([]);
    const [categ, setCateg] = useState({});

    const handleClose = () => setShow(false);

    const handleShow = async (act, cat) => {
        setCateg(cat);
        setAction(act)
        setShow(true);
        if(act == "Edit"){
            setCatName(cat.displayName);
        }
    }

    useEffect(() => {
        dispatch(fetchMenu());
    }, [])

    useEffect(() => {
        if (store.menu) {
            setMenuCat(store.menu)
        }
    }, [store.menu])



    const handleMenuItem = async () => {
        console.log("this is cat Name",catName);
        if (action == 'Add') {
            const payload = {
                id: generateMenuId(),
                categoryName: catName.trim().split(' ').join(''),
                displayName: catName,
                option: []
            }
            try {
                const response = await fetch(`/api/menu`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(payload)
                });

                const data = await response.json();
                console.log(data);

                if (response.status === 200) {
                    console.log('Menu added successfully');
                    dispatch(fetchMenu());

                    setShow(false)
                } else {
                    console.log('Error adding menu', data);
                    setShow(false)

                }
            } catch (error) {
                console.error('Error:', error);
            }
        } else if (action == 'Edit') {
            const payload = {
                categoryName: catName.trim().split(' ').join(''),
                displayName: catName,
            }
            console.log("this is edit payload",payload);
            try {
                const response = await fetch(`/api/menu?id=${categ.id}`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(payload)
                });

                const data = await response.json();
                console.log(data);

                if (response.status === 200) {

                    console.log('Category updated successfully');
                    dispatch(fetchMenu());

                    setShow(false)
                } else {
                    console.log('Error updating category', data);
                    setShow(false)

                }
            } catch (error) {
                console.error('Error:', error);
            }
        } else if (action == 'Delete') {

            try {
                const response = await fetch(`/api/menu?id=${categ.id}`, {
                    method: 'DELETE',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                });

                const data = await response.json();
                console.log(data);

                if (response.status === 200) {
                    console.log('Category deleted successfully');
                    dispatch(fetchMenu());

                    setShow(false)
                } else {
                    console.log('Error deleting category', data);
                    setShow(false)

                }
            } catch (error) {
                console.error('Error:', error);
            }
        }

    }
    return (
        <Layout>
            <div className='d-flex align-items-center justify-content-end'>
                <button className={"m-3 btn add-btn"} onClick={() => handleShow('Add')}>
                    + Add New Item
                </button>
            </div>


            <Modal
                show={show}
                onHide={handleClose}
                backdrop="static"
                keyboard={false}
            >
                <ModalHeader closeButton>
                    <ModalTitle>{action} category</ModalTitle>
                </ModalHeader>
                <ModalBody>
                    {
                        action == "Delete" ? (
                            <p>Are you sure you want to delete the category?</p>
                        ) : (
                            <>
                                <FormLabel>Category Name</FormLabel>
                                <FormControl type="text"
                                    value={catName}
                                    onChange={(e) => setCatName(e.target.value)}
                                />
                            </>
                        )
                    }

                </ModalBody>
                <ModalFooter>
                    <button className='btn add-btn' onClick={handleMenuItem}>
                        {action} Category
                    </button>
                </ModalFooter>
            </Modal>
            <Accordion>
                {
                    menuCat.length > 0 && menuCat.map((category, index) => (
                        <AccordionItem eventKey={index} key={category.id}>
                            <AccordionHeader>{category.displayName}</AccordionHeader>
                            <AccordionBody>
                                <EditableTable data={category.options} menuId={category.id} />
                                <div className='d-flex align-items-center justify-content-end'>
                                    <button className='btn add-btn m-3' onClick={() => handleShow('Edit', category)}>Edit</button>
                                    <button className='btn edit-btn' onClick={() => handleShow('Delete', category)} >Delete</button>
                                </div>
                            </AccordionBody>

                        </AccordionItem>
                    ))
                }

            </Accordion>
        </Layout>

    )
}

export default Menus
