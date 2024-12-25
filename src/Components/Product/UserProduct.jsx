import React, { useState, useEffect } from "react";
import AspectRatio from "@mui/joy/AspectRatio";
import Button from "@mui/joy/Button";
import Card from "@mui/joy/Card";
import CardContent from "@mui/joy/CardContent";
import CardOverflow from "@mui/joy/CardOverflow";
import Chip from "@mui/joy/Chip";
import Typography from "@mui/joy/Typography";
import ArrowOutwardIcon from "@mui/icons-material/ArrowOutward";
import { Grid, TextField, MenuItem, Paper, Pagination } from "@mui/material";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Link as RouterLink } from "react-router-dom";
import { Helmet } from "react-helmet";

const UserProductList = ({ addToCart }) => {
  const [products, setProducts] = useState([]);
  const [currentPage, setCurrentPage] = useState(Number(localStorage.getItem("currentPage")) || 1);
  const [totalPages, setTotalPages] = useState(1);
  const [filters, setFilters] = useState({
    category: "",
    name: "",
    minPrice: "",
    maxPrice: "",
    brand: "",
  });

  useEffect(() => {
    fetchProducts();
  }, [currentPage, filters]);

  const fetchProducts = async () => {
    const filterParams = new URLSearchParams({
      page: currentPage,
      pageSize: 9,
      ...(filters.category && { category: filters.category }),
      ...(filters.name && { name: filters.name }),
      ...(filters.minPrice && { minPrice: filters.minPrice }),
      ...(filters.maxPrice && { maxPrice: filters.maxPrice }),
      ...(filters.brand && { brand: filters.brand }),
    }).toString();

    try {
      const response = await fetch(`https://m-store-server.vercel.app/api/products?${filterParams}`);
      const data = await response.json();
      setProducts(data.products);
      setTotalPages(data.totalPages);
    } catch (error) {
      toast.error("Failed to fetch products.", { autoClose: 3000 });
    }
  };

  const handleAddToCart = (product) => {
    addToCart(product);
    toast.success(`${product.name} added to cart!`, { position: "top-center", autoClose: 3000 });
  };

  const applyFilters = () => {
    setCurrentPage(1);
    fetchProducts();
  };

  const handleFilterChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  const handlePageChange = (event, value) => {
    setCurrentPage(value);
    localStorage.setItem("currentPage", value);
  };

  return (
    <>
      <Grid container spacing={3} sx={{ mt: 5 }}>
        {/* Filter Box */}
        <Grid item xs={12} sm={4} md={3}>
          <Paper elevation={3} sx={{ padding: 2 }}>
            <Typography variant="h6" sx={{ mb: 2 }}>Filters</Typography>
            <TextField label="Category" name="category" value={filters.category} onChange={handleFilterChange} fullWidth sx={{ mb: 2 }} />
            <TextField label="Name" name="name" value={filters.name} onChange={handleFilterChange} fullWidth sx={{ mb: 2 }} />
            <Grid container spacing={2} sx={{ mb: 2 }}>
              <Grid item xs={6}>
                <TextField label="Min Price" name="minPrice" type="number" value={filters.minPrice} onChange={handleFilterChange} fullWidth />
              </Grid>
              <Grid item xs={6}>
                <TextField label="Max Price" name="maxPrice" type="number" value={filters.maxPrice} onChange={handleFilterChange} fullWidth />
              </Grid>
            </Grid>
            <TextField label="Brand" name="brand" value={filters.brand} onChange={handleFilterChange} fullWidth sx={{ mb: 2 }} />
            <Button variant="contained" color="primary" onClick={applyFilters} fullWidth>Apply Filters</Button>
          </Paper>
        </Grid>

        <Helmet><title>Products - ECommerce</title></Helmet>

        {/* Product List */}
        <Grid item xs={12} sm={8} md={9}>
          <Grid container spacing={3}>
            {products.length > 0 ? (
              products.map((product) => (
                <Grid item xs={12} sm={6} md={4} key={product._id}>
                  <Card sx={{ maxWidth: "100%", boxShadow: "lg" }}>
                    <CardOverflow>
                      <AspectRatio sx={{ minWidth: 200 }}>
                        {product.imageUrl ? (
                          <img
                            src={product.imageUrl}
                            alt={product.name}
                            style={{ width: "100%", height: "auto" }}
                          />
                        ) : (
                          <Typography>No image available</Typography>
                        )}
                      </AspectRatio>
                    </CardOverflow>
                    <CardContent>
                      <Typography level="body-xs">{product.category}</Typography>
                      <RouterLink to={`/product/${product._id}`} style={{ color: "inherit", textDecoration: "none" }}>
                        <Typography level="body-lg" sx={{ fontWeight: "md" }}>{product.name}</Typography>
                      </RouterLink>
                      <Typography level="title-lg" sx={{ mt: 1, fontWeight: "xl" }}>
                        ${product.price}
                        <Chip component="span" size="sm" variant="soft" color="success">Available</Chip>
                      </Typography>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                        <Typography level="body-sm">(Only <b>{product.stock}</b> left in stock!)</Typography>
                        <RouterLink to={`/product/${product._id}`} style={{ textDecoration: "none", display: "flex", alignItems: "center" }}>
                          <Typography>Details</Typography>
                          <ArrowOutwardIcon sx={{ fontSize: 15, ml: 0.5 }} />
                        </RouterLink>
                      </div>
                    </CardContent>
                    <CardOverflow sx={{ bgcolor: "background.level1", display: "flex", justifyContent: "space-between", gap: 1, py: 1.5, px: "var(--Card-padding)" }}>
                      <Button variant="solid" color="danger" size="lg" onClick={() => handleAddToCart(product)}>Add to cart</Button>
                    </CardOverflow>
                  </Card>
                </Grid>
              ))
            ) : (
              <Typography>No products found.</Typography>
            )}
          </Grid>
          <Pagination count={totalPages} page={currentPage} onChange={handlePageChange} color="primary" variant="outlined" shape="rounded" sx={{ mt: 3 }} />
        </Grid>
      </Grid>
      <ToastContainer />
    </>
  );
};

export default UserProductList;
