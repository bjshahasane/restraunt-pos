'use client';

import React, { useEffect, useState, useCallback } from 'react';
import Layout from '@/app/components/Layout';
import EditableTable from '@/app/components/MenuEditTable';
import { fetchMenu } from '@/app/slices/menuSlice';
import { useDispatch, useSelector } from 'react-redux';
import {
    Accordion,
    AccordionItem,
    AccordionHeader,
    AccordionBody,
    Modal,
    ModalTitle,
    ModalHeader,
    ModalFooter,
    ModalBody,
    FormControl,
    FormLabel
} from 'react-bootstrap';
import { generateMenuId } from '@/app/utils/generateOrderId';
import { useRouter } from 'next/navigation';
import { hideLoader, showLoader } from '@/app/slices/siteSettingSlice';

const Menus = () => {
    const dispatch = useDispatch();
  const router = useRouter();

    const { menu } = useSelector((state) => state.menuReducer);

    const [show, setShow] = useState(false);
    const [catName, setCatName] = useState("");
    const [action, setAction] = useState("");
    const [categ, setCateg] = useState({});
    const [loginToken,setLoginToken] = useState();

    useEffect(() => {
        const token = localStorage.getItem('token'); // Retrieve the JWT token from local storage

        if (!token) {
            // Redirect to login if no token is found
            router.push('/pages/createUser');
            return;
        }else{
            setLoginToken(token);
        }
        dispatch(fetchMenu());
    }, [dispatch]);

    const handleClose = useCallback(() => setShow(false), []);

    const handleShow = useCallback((act, cat = {}) => {
        setAction(act);
        setCateg(cat);
        setCatName(act === "Edit" ? cat.displayName : "");
        setShow(true);
    }, []);

    const handleMenuItem = useCallback(async () => {
        dispatch(showLoader(true));
        let method, url, payload = {};

        if (action === 'Add') {
            payload = {
                id: generateMenuId(),
                categoryName: catName.trim().split(' ').join(''),
                displayName: catName,
                options: []
            };
            method = 'POST';
            url = '/api/menu';
        } else if (action === 'Edit') {
            payload = {
                categoryName: catName.trim().split(' ').join(''),
                displayName: catName
            };
            method = 'PUT';
            url = `/api/menu?id=${categ.id}`;
        } else if (action === 'Delete') {
            method = 'DELETE';
            url = `/api/menu?id=${categ.id}`;
        }

        try {
            const response = await fetch(url, {
                method,
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${loginToken}`,
                },
                body: method !== 'DELETE' ? JSON.stringify(payload) : null
            });
            
            if (response.status === 401 || response.status === 403) {
                // Token is invalid or expired, redirect to login

                router.push('/pages/createUser');
                return;
              }
        
            if (response.status === 200) {
                dispatch(hideLoader(true));
                dispatch(fetchMenu());
                setShow(false);
                console.log(`${action} successful`);
            } else {
                dispatch(hideLoader(true));
                console.error(`Error ${action.toLowerCase()}ing category`, await response.json());
                setShow(false);
            }
        } catch (error) {
            console.error(`Error: ${error.message}`);
        }
    }, [action, catName, categ.id, dispatch]);

    return (
        <Layout>
            <div className='d-flex align-items-center justify-content-end'>
                <button className="m-3 btn add-btn" onClick={() => handleShow('Add')}>
                    + Add New Item
                </button>
            </div>

            <Modal show={show} onHide={handleClose} backdrop="static" keyboard={false}>
                <ModalHeader closeButton>
                    <ModalTitle>{action} Category</ModalTitle>
                </ModalHeader>
                <ModalBody>
                    {action === "Delete" ? (
                        <p>Are you sure you want to delete the category?</p>
                    ) : (
                        <>
                            <FormLabel>Category Name</FormLabel>
                            <FormControl
                                type="text"
                                value={catName}
                                onChange={(e) => setCatName(e.target.value)}
                            />
                        </>
                    )}
                </ModalBody>
                <ModalFooter>
                    <button className='btn add-btn' onClick={handleMenuItem}>
                        {action} Category
                    </button>
                </ModalFooter>
            </Modal>

            <Accordion>
                {menu?.map((category, index) => (
                    <AccordionItem eventKey={index} key={category.id}>
                        <AccordionHeader>{category.displayName}</AccordionHeader>
                        <AccordionBody>
                            <EditableTable data={category.options} menuId={category.id} />
                            <div className='d-flex align-items-center justify-content-end'>
                                <button className='btn add-btn m-3' onClick={() => handleShow('Edit', category)}>Edit</button>
                                <button className='btn edit-btn' onClick={() => handleShow('Delete', category)}>Delete</button>
                            </div>
                        </AccordionBody>
                    </AccordionItem>
                ))}
            </Accordion>
        </Layout>
    );
}

export default Menus;
