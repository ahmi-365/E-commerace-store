// src/ProductForm.jsx
import React, { useState } from 'react';
import {
    Container,
    Typography,
    Button,
    TextField,
    Grid,
    Card,
    CardContent,
    CardActions,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
} from '@mui/material'; // Import Material-UI components
import { Link, useNavigate } from 'react-router-dom';

const ProductForm = ({ fetchProducts }) => {
    const [name, setName] = useState('');
    const [price, setPrice] = useState('');
    const [description, setDescription] = useState('');
    const [sku, setSku] = useState(''); // SKU field
    const [brand, setBrand] = useState(''); // Brand field
    const [category, setCategory] = useState(''); // Category field
    const [size, setSize] = useState(''); // Size field
    const [color, setColor] = useState(''); // Color field
    const [image, setImage] = useState(null);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append('name', name);
        formData.append('price', price);
        formData.append('description', description);
        formData.append('sku', sku); // Add SKU to form data
        formData.append('brand', brand); // Add brand to form data
        formData.append('category', category); // Add category to form data
        formData.append('size', size); // Add size to form data
        formData.append('color', color); // Add color to form data
        formData.append('image', image);

        try {
            const response = await fetch('http://localhost:5000/api/products', {
                method: 'POST',
                body: formData,
            });

            if (response.ok) {
                const result = await response.json();
                console.log('Product added successfully:', result);
                setName('');
                setPrice('');
                setDescription('');
                setSku('');
                setBrand('');
                setCategory('');
                setSize('');
                setColor('');
                setImage(null);
                fetchProducts(); // Call fetchProducts to refresh the list
                alert('Product added successfully!');
                navigate('/products');
            } else {
                const errorMessage = await response.text();
                console.error('Failed to add product:', errorMessage);
                alert(`Failed to add product: ${errorMessage}`);
            }
        } catch (error) {
            console.error('Error adding product:', error);
            alert('Error adding product');
        }
    };

    return (
        <Container>
            <Grid container justifyContent="center" sx={{ mt: 5 }}>
                <Grid item xs={12} sm={8} md={6}>
                    <Card>
                        <CardContent>
                            <Typography variant="h5" component="h2" gutterBottom>
                                Add New Product
                            </Typography>
                            <form onSubmit={handleSubmit}>
                                <TextField
                                    fullWidth
                                    label="Name"
                                    variant="outlined"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    required
                                    margin="normal"
                                />
                                <TextField
                                    fullWidth
                                    label="Price"
                                    type="number"
                                    variant="outlined"
                                    value={price}
                                    onChange={(e) => setPrice(e.target.value)}
                                    required
                                    margin="normal"
                                />
                                <TextField
                                    fullWidth
                                    label="Description"
                                    variant="outlined"
                                    multiline
                                    rows={3}
                                    value={description}
                                    onChange={(e) => setDescription(e.target.value)}
                                    required
                                    margin="normal"
                                />
                                <TextField
                                    fullWidth
                                    label="SKU"
                                    variant="outlined"
                                    value={sku}
                                    onChange={(e) => setSku(e.target.value)}
                                    required
                                    margin="normal"
                                />
                                <TextField
                                    fullWidth
                                    label="Brand"
                                    variant="outlined"
                                    value={brand}
                                    onChange={(e) => setBrand(e.target.value)}
                                    required
                                    margin="normal"
                                />
                                <TextField
                                    fullWidth
                                    label="Category"
                                    variant="outlined"
                                    value={category}
                                    onChange={(e) => setCategory(e.target.value)}
                                    required
                                    margin="normal"
                                />
                               
                                <input
                                    accept="image/*"
                                    style={{ display: 'none' }}
                                    id="image-upload"
                                    type="file"
                                    onChange={(e) => setImage(e.target.files[0])}
                                    required
                                />
                                <label htmlFor="image-upload">
                                    <Button variant="contained" component="span" sx={{ mt: 2 }}>
                                        Upload Image
                                    </Button>
                                </label>
                                <Typography variant="body2" color="textSecondary" sx={{ mt: 1 }}>
                                    {image ? image.name : 'No file chosen'}
                                </Typography>
                                <CardActions sx={{ justifyContent: 'space-between', mt: 2 }}>
                                    <Link to="/products" style={{ textDecoration: 'none', color: 'black' }}>
                                        Back to Products
                                    </Link>
                                    <Button variant="contained" color="primary" type="submit">
                                        Add Product
                                    </Button>
                                </CardActions>
                            </form>
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>
        </Container>
    );
};

export default ProductForm;
