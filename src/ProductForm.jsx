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
    Box,
    Avatar,
    IconButton,
    CircularProgress,
    styled,
} from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';
import PhotoCamera from '@mui/icons-material/PhotoCamera';
import { Helmet } from 'react-helmet';

// Custom styled components
const StyledCard = styled(Card)(({ theme }) => ({
    borderRadius: 20,
    boxShadow: theme.shadows[10],
    padding: '20px',
    backgroundColor: '#f5f5f5',
    border: '1px solid #e0e0e0',
}));

const UploadButton = styled(Button)(({ theme }) => ({
    backgroundColor: '#1976d2',
    color: 'white',
    '&:hover': {
        backgroundColor: '#115293',
    },
}));

const BackButton = styled(Button)(({ theme }) => ({
    border: '1px solid #1976d2',
    color: '#1976d2',
    '&:hover': {
        backgroundColor: '#e3f2fd',
    },
}));

const ProductForm = ({ fetchProducts }) => {
    const [name, setName] = useState('');
    const [price, setPrice] = useState('');
    const [description, setDescription] = useState('');
    const [sku, setSku] = useState('');
    const [brand, setBrand] = useState('');
    const [category, setCategory] = useState('');
    const [image, setImage] = useState(null);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    // Cloudinary upload function
    const uploadImage = async (file) => {
        const formData = new FormData();
        formData.append('file', file); // The file object being uploaded
        formData.append('upload_preset', 'hzr312jm'); // Use the new unsigned preset

        try {
            const response = await fetch('https://api.cloudinary.com/v1_1/dtc81tvun/image/upload', {
                method: 'POST',
                body: formData,
            });

            if (!response.ok) {
                const errorMessage = await response.text();
                console.error('Error uploading image:', errorMessage);
                throw new Error('Image upload failed');
            }

            const data = await response.json();
            console.log('Uploaded image data:', data); // Log the response data
            return data.secure_url; // Return the secure URL for the uploaded image
        } catch (error) {
            console.error('Image upload failed:', error);
            return null; // Handle the error accordingly
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            // Check if an image is selected
            if (!image) {
                alert('Please select an image to upload.');
                setLoading(false);
                return;
            }

            // Upload image to Cloudinary
            const imageUrl = await uploadImage(image);
            if (!imageUrl) {
                alert('Image upload failed, please try again.');
                setLoading(false);
                return;
            }

            const formData = {
                name,
                price,
                description,
                sku,
                brand,
                category,
                image: imageUrl, // Use the Cloudinary URL here
            };

            const response = await fetch('https://m-store-server-ryl5.onrender.com/api/products', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
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
                setImage(null);
                fetchProducts();
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
        } finally {
            setLoading(false);
        }
    };

    return (
        <Container>
            <Grid container justifyContent="center" sx={{ mt: 5 }}>
                <Grid item xs={12} sm={10} md={8} lg={6}>
                    <StyledCard>
                        <CardContent>
                            <Box display="flex" justifyContent="center" mb={2}>
                                <Avatar sx={{ width: 80, height: 80, backgroundColor: '#1976d2' }}>
                                    <PhotoCamera sx={{ width: 40, height: 40 }} />
                                </Avatar>
                            </Box>
                            <Typography variant="h4" component="h2" align="center" gutterBottom sx={{ fontWeight: 'bold', color: '#333' }}>
                                Add New Product
                            </Typography>
                            <form onSubmit={handleSubmit}>
                                <TextField
                                    fullWidth
                                    label="Product Name"
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
                                    <UploadButton variant="contained" component="span" sx={{ mt: 2 }} startIcon={<PhotoCamera />}>
                                        Upload Image
                                    </UploadButton>
                                </label>
                                <Typography variant="body2" color="textSecondary" sx={{ mt: 1 }}>
                                    {image ? image.name : 'No file chosen'}
                                </Typography>
                                <CardActions sx={{ justifyContent: 'space-between', mt: 2 }}>
                                    <Link to="/products" style={{ textDecoration: 'none' }}>
                                        <BackButton variant="outlined">Back to Products</BackButton>
                                    </Link>
                                    <Button variant="contained" color="primary" type="submit" disabled={loading}>
                                        {loading ? <CircularProgress size={24} color="inherit" /> : 'Add Product'}
                                    </Button>
                                </CardActions>
                            </form>
                        </CardContent>
                    </StyledCard>
                </Grid>
            </Grid>
            <Helmet>
                <title>Add Product - ECommerace</title>
            </Helmet>
        </Container>
    );
};

export default ProductForm;
