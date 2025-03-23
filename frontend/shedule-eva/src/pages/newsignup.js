import React, { useState } from 'react';
import { TextField, Button, Card, CardContent, CardMedia, Box, Container, Alert } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import './newsignup.css'; 
import scheduleLogo from "../images/logo_shedule.png";
import { toast, ToastContainer } from "react-toastify";

const Signup = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    dateOfBirth: '',
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    setErrors({
      ...errors,
      [e.target.name]: '',
    });
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.name) newErrors.name = 'Name is required';
    if (!formData.email) newErrors.email = 'Email is required';
    if (!formData.dateOfBirth) newErrors.dateOfBirth = 'Date of Birth is required';
    return newErrors;
  };
  const handleNext = async () => {
    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
    } else {
      try {
        setIsSubmitting(true); 
        const response = await fetch(`${process.env.REACT_APP_API_URL}/add-user`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            email: formData.email,
            name: formData.name,
            dob: formData.dateOfBirth,
          }),
        });
  
        if (response.ok) {
          const data = await response.json();
          console.log('User added:', data);
  
          sessionStorage.setItem('userEmail', formData.email);
  
  
          navigate('/Calendar'); 
        } 
      } catch (error) {
        console.error('Error:', error);
        toast.error("There was an error with the sign-up process.");
      } finally {
        setIsSubmitting(false); 
      }
    }
  };
  

  return (
    <Container maxWidth="sm">
      <Box className="card-container">
        <Card className="card">
          <CardContent className='card-content'>
            <CardMedia className='card-media'
              component="img"
              height="194"
              image={scheduleLogo}
              alt="Logo"
            />
            <Box marginBottom={2}>
              <TextField
                label="Name"
                variant="outlined"
                fullWidth
                margin="normal"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                error={!!errors.name}
                helperText={errors.name}
                className="text-field"
              />
              <TextField
                label="Email"
                variant="outlined"
                fullWidth
                margin="normal"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleInputChange}
                error={!!errors.email}
                helperText={errors.email}
                className="text-field"
              />
              <TextField
                label="Date of Birth"
                variant="outlined"
                fullWidth
                margin="normal"
                type="date"
                name="dateOfBirth"
                value={formData.dateOfBirth}
                onChange={handleInputChange}
                InputLabelProps={{
                  shrink: true,
                }}
                error={!!errors.dateOfBirth}
                helperText={errors.dateOfBirth}
                className="text-field-height"
              />
            </Box>
            {Object.keys(errors).length > 0 && (
              <Alert className="error-alert" severity="error">
                Please fix the errors above to proceed.
              </Alert>
            )}
            <Box className="button-container">
              <Button
                variant="contained"
                color="secondary"
                onClick={handleNext}
                className="button"
                disabled={isSubmitting} 
              >
                {isSubmitting ? 'Signing Up...' : 'Sign Up'}
              </Button>
            </Box>
          </CardContent>
        </Card>
      </Box>
    </Container>
  );
};

export default Signup;
