import React, { useState, useEffect, useCallback } from 'react';
import {
  Container,
  Typography,
  Box,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  Alert,
  Snackbar,
  InputAdornment,
  Card,
  CardContent,
  Chip,
  Avatar,
  Fade,
  CircularProgress,
  Tooltip,
  useTheme,
  useMediaQuery,
  ThemeProvider,
  createTheme
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Search as SearchIcon,
  Person as PersonIcon,
  Email as EmailIcon,
  Work as WorkIcon,
  Refresh as RefreshIcon
} from '@mui/icons-material';
import axios from 'axios';
import './App.css';

const API_BASE = 'http://localhost:3001/api';

// Black & White Theme
const blackWhiteTheme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#ffffff',
      contrastText: '#000000',
    },
    secondary: {
      main: '#000000',
      contrastText: '#ffffff',
    },
    background: {
      default: '#000000',
      paper: 'rgba(255, 255, 255, 0.05)',
    },
    text: {
      primary: '#ffffff',
      secondary: '#cccccc',
    },
    error: {
      main: '#ffffff',
      contrastText: '#000000',
    },
    warning: {
      main: '#ffffff',
      contrastText: '#000000',
    },
    info: {
      main: '#ffffff',
      contrastText: '#000000',
    },
    success: {
      main: '#ffffff',
      contrastText: '#000000',
    },
  },
  typography: {
    fontFamily: '"Segoe UI", "Roboto", "Helvetica", "Arial", sans-serif',
    h3: {
      fontWeight: 700,
      letterSpacing: '-0.02em',
    },
    h6: {
      fontWeight: 400,
      letterSpacing: '0.01em',
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          textTransform: 'none',
          fontWeight: 600,
          border: '2px solid',
          borderColor: '#ffffff',
          color: '#000000',
          backgroundColor: '#ffffff',
          '&:hover': {
            backgroundColor: '#000000',
            color: '#ffffff',
            borderColor: '#ffffff',
          },
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            borderRadius: 8,
            backgroundColor: 'rgba(255, 255, 255, 0.05)',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            '&:hover': {
              border: '1px solid rgba(255, 255, 255, 0.4)',
            },
            '&.Mui-focused': {
              border: '2px solid #ffffff',
            },
          },
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundColor: 'rgba(255, 255, 255, 0.05)',
          backdropFilter: 'blur(10px)',
          border: '1px solid rgba(255, 255, 255, 0.1)',
        },
      },
    },
    MuiTableHead: {
      styleOverrides: {
        root: {
          backgroundColor: '#ffffff',
          '& .MuiTableCell-head': {
            color: '#000000',
            fontWeight: 700,
            borderBottom: '2px solid #000000',
          },
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          backgroundColor: 'rgba(255, 255, 255, 0.1)',
          color: '#ffffff',
          border: '1px solid rgba(255, 255, 255, 0.3)',
        },
      },
    },
  },
});

function App() {
  const theme = useTheme();
  // const isMobile = useMediaQuery(theme.breakpoints.down('md')); // Reserved for future responsive features
  
  const [employees, setEmployees] = useState([]);
  const [filteredEmployees, setFilteredEmployees] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [openDialog, setOpenDialog] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState(null);
  const [formData, setFormData] = useState({ name: '', email: '', position: '' });
  const [errors, setErrors] = useState({});
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState('');

  const fetchEmployees = useCallback(async () => {
    try {
      setLoading(true);
      setApiError('');
      const response = await axios.get(`${API_BASE}/employees`);
      setEmployees(response.data);
      console.log('Fetched employees:', response.data);
    } catch (error) {
      console.error('Error fetching employees:', error);
      const errorMessage = error.response?.data?.error || error.message || 'Failed to fetch employees';
      setApiError(errorMessage);
      showSnackbar(errorMessage, 'error');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchEmployees();
  }, [fetchEmployees]);

  useEffect(() => {
    const filtered = employees.filter(emp =>
      emp.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      emp.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      emp.position.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredEmployees(filtered);
  }, [employees, searchTerm]);

  const validateForm = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = 'Name is required';
    if (!formData.email.trim()) newErrors.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Email is invalid';
    if (!formData.position.trim()) newErrors.position = 'Position is required';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    try {
      setLoading(true);
      if (editingEmployee) {
        const response = await axios.put(`${API_BASE}/employees/${editingEmployee.id}`, formData);
        console.log('Updated employee:', response.data);
        showSnackbar('Employee updated successfully');
      } else {
        const response = await axios.post(`${API_BASE}/employees`, formData);
        console.log('Created employee:', response.data);
        showSnackbar('Employee added successfully');
      }
      await fetchEmployees();
      handleCloseDialog();
    } catch (error) {
      console.error('Error saving employee:', error);
      const errorMessage = error.response?.data?.error || error.message || 'Failed to save employee';
      showSnackbar(errorMessage, 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this employee?')) {
      try {
        setLoading(true);
        await axios.delete(`${API_BASE}/employees/${id}`);
        showSnackbar('Employee deleted successfully');
        await fetchEmployees();
      } catch (error) {
        console.error('Error deleting employee:', error);
        const errorMessage = error.response?.data?.error || error.message || 'Failed to delete employee';
        showSnackbar(errorMessage, 'error');
      } finally {
        setLoading(false);
      }
    }
  };

  const handleEdit = (employee) => {
    setEditingEmployee(employee);
    setFormData({ name: employee.name, email: employee.email, position: employee.position });
    setOpenDialog(true);
  };

  const handleAdd = () => {
    setEditingEmployee(null);
    setFormData({ name: '', email: '', position: '' });
    setErrors({});
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setEditingEmployee(null);
    setFormData({ name: '', email: '', position: '' });
    setErrors({});
  };

  const showSnackbar = (message, severity = 'success') => {
    setSnackbar({ open: true, message, severity });
  };

  return (
    <ThemeProvider theme={blackWhiteTheme}>
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Fade in timeout={1000}>
          <Box>
            {/* Header */}
            <Box sx={{ mb: 4, textAlign: 'center' }}>
              <Typography 
                variant="h3" 
                component="h1" 
                gutterBottom 
                sx={{ 
                  color: '#ffffff',
                  fontWeight: 'bold',
                  textShadow: '2px 2px 4px rgba(0,0,0,0.8)',
                  mb: 1,
                  letterSpacing: '-0.02em'
                }}
              >
                 Employee Management 
              </Typography>
              <Typography 
                variant="h6" 
                sx={{ 
                  color: '#cccccc',
                  textShadow: '1px 1px 2px rgba(0,0,0,0.8)',
                  mb: 4,
                  fontWeight: 300
                }}
              >
                Minimalist. Efficient. Professional.
              </Typography>
            </Box>

            {/* API Error Alert */}
            {apiError && (
              <Alert 
                severity="error" 
                sx={{ 
                  mb: 3,
                  backgroundColor: 'rgba(255, 255, 255, 0.1)',
                  color: '#ffffff',
                  border: '1px solid rgba(255, 255, 255, 0.3)'
                }} 
                onClose={() => setApiError('')}
              >
                {apiError}
              </Alert>
            )}

            {/* Search and Add Section */}
            <Card 
              sx={{ 
                mb: 3, 
                background: 'rgba(255, 255, 255, 0.05)',
                backdropFilter: 'blur(20px)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                borderRadius: 3
              }}
            >
              <CardContent sx={{ p: 3 }}>
                <Box sx={{ 
                  display: 'flex', 
                  flexDirection: { xs: 'column', md: 'row' }, 
                  gap: 2, 
                  alignItems: 'center' 
                }}>
                  <Box sx={{ flex: { xs: 1, md: 2 }, width: '100%' }}>
                    <TextField
                      fullWidth
                      placeholder="Search employees by name, email, or position..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      variant="outlined"
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <SearchIcon sx={{ color: '#ffffff' }} />
                          </InputAdornment>
                        ),
                      }}
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          borderRadius: 2,
                          color: '#ffffff',
                          '& fieldset': {
                            borderColor: 'rgba(255, 255, 255, 0.3)',
                          },
                          '&:hover fieldset': {
                            borderColor: 'rgba(255, 255, 255, 0.5)',
                          },
                          '&.Mui-focused fieldset': {
                            borderColor: '#ffffff',
                            borderWidth: '2px',
                          },
                          '& input': {
                            color: '#ffffff',
                          },
                          '& input::placeholder': {
                            color: '#cccccc',
                            opacity: 1,
                          },
                        },
                      }}
                    />
                  </Box>
                  <Box sx={{ 
                    display: 'flex', 
                    gap: 1, 
                    flex: { xs: 1, md: 1 }, 
                    width: { xs: '100%', md: 'auto' } 
                  }}>
                    <Tooltip title="Refresh employees">
                      <IconButton
                        onClick={fetchEmployees}
                        disabled={loading}
                        sx={{ 
                          background: 'rgba(255, 255, 255, 0.1)',
                          border: '1px solid rgba(255, 255, 255, 0.3)',
                          color: '#ffffff',
                          '&:hover': { 
                            background: 'rgba(255, 255, 255, 0.2)',
                            border: '1px solid rgba(255, 255, 255, 0.5)'
                          }
                        }}
                      >
                        <RefreshIcon />
                      </IconButton>
                    </Tooltip>
                    <Button
                      variant="contained"
                      startIcon={<AddIcon />}
                      onClick={handleAdd}
                      disabled={loading}
                      size="large"
                      sx={{ 
                        borderRadius: 2,
                        backgroundColor: '#ffffff',
                        color: '#000000',
                        border: '2px solid #ffffff',
                        fontWeight: 700,
                        '&:hover': {
                          backgroundColor: '#000000',
                          color: '#ffffff',
                          border: '2px solid #ffffff'
                        }
                      }}
                    >
                      Add Employee
                    </Button>
                  </Box>
                </Box>
                
                {/* Statistics */}
                <Box sx={{ mt: 2, display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                  <Chip 
                    icon={<PersonIcon sx={{ color: '#ffffff !important' }} />} 
                    label={`Total: ${employees.length}`}
                    sx={{
                      backgroundColor: 'rgba(255, 255, 255, 0.1)',
                      color: '#ffffff',
                      border: '1px solid rgba(255, 255, 255, 0.3)',
                      fontWeight: 600
                    }}
                  />
                  {searchTerm && (
                    <Chip 
                      icon={<SearchIcon sx={{ color: '#ffffff !important' }} />} 
                      label={`Found: ${filteredEmployees.length}`}
                      sx={{
                        backgroundColor: 'rgba(255, 255, 255, 0.15)',
                        color: '#ffffff',
                        border: '1px solid rgba(255, 255, 255, 0.4)',
                        fontWeight: 600
                      }}
                    />
                  )}
                </Box>
              </CardContent>
            </Card>

            {/* Employee Table */}
            <TableContainer 
              component={Paper} 
              sx={{ 
                background: 'rgba(255, 255, 255, 0.05)',
                backdropFilter: 'blur(20px)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                borderRadius: 3,
                overflow: 'hidden'
              }}
            >
              {loading && (
                <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
                  <CircularProgress sx={{ color: '#ffffff' }} />
                </Box>
              )}
              
              <Table>
                <TableHead>
                  <TableRow sx={{ background: '#ffffff' }}>
                    <TableCell sx={{ color: '#000000', fontWeight: 'bold', fontSize: '1.1rem' }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <PersonIcon sx={{ color: '#000000' }} />
                        Name
                      </Box>
                    </TableCell>
                    <TableCell sx={{ color: '#000000', fontWeight: 'bold', fontSize: '1.1rem' }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <EmailIcon sx={{ color: '#000000' }} />
                        Email
                      </Box>
                    </TableCell>
                    <TableCell sx={{ color: '#000000', fontWeight: 'bold', fontSize: '1.1rem' }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <WorkIcon sx={{ color: '#000000' }} />
                        Position
                      </Box>
                    </TableCell>
                    <TableCell sx={{ color: '#000000', fontWeight: 'bold', fontSize: '1.1rem' }} align="center">
                      Actions
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {filteredEmployees.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={4} align="center" sx={{ py: 6, borderBottom: 'none' }}>
                        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
                          <PersonIcon sx={{ fontSize: 64, color: '#ffffff', opacity: 0.3 }} />
                          <Typography variant="h6" sx={{ color: '#ffffff' }}>
                            {searchTerm ? 'No employees found matching your search' : 'No employees yet. Add one to get started!'}
                          </Typography>
                          {!searchTerm && (
                            <Button 
                              variant="contained" 
                              startIcon={<AddIcon />} 
                              onClick={handleAdd}
                              sx={{ 
                                mt: 1,
                                backgroundColor: '#ffffff',
                                color: '#000000',
                                '&:hover': {
                                  backgroundColor: '#000000',
                                  color: '#ffffff',
                                  border: '1px solid #ffffff'
                                }
                              }}
                            >
                              Add First Employee
                            </Button>
                          )}
                        </Box>
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredEmployees.map((employee, index) => (
                      <TableRow 
                        key={employee.id} 
                        hover
                        sx={{ 
                          '&:nth-of-type(odd)': { backgroundColor: 'rgba(255, 255, 255, 0.02)' },
                          '&:hover': { backgroundColor: 'rgba(255, 255, 255, 0.08)' },
                          transition: 'background-color 0.2s',
                          borderBottom: '1px solid rgba(255, 255, 255, 0.1)'
                        }}
                      >
                        <TableCell sx={{ borderBottom: '1px solid rgba(255, 255, 255, 0.1)' }}>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                            <Avatar 
                              sx={{ 
                                bgcolor: index % 2 === 0 ? '#ffffff' : '#000000',
                                color: index % 2 === 0 ? '#000000' : '#ffffff',
                                border: '2px solid',
                                borderColor: index % 2 === 0 ? '#000000' : '#ffffff'
                              }}
                            >
                              {employee.name.charAt(0).toUpperCase()}
                            </Avatar>
                            <Typography variant="body1" fontWeight="medium" sx={{ color: '#ffffff' }}>
                              {employee.name}
                            </Typography>
                          </Box>
                        </TableCell>
                        <TableCell sx={{ borderBottom: '1px solid rgba(255, 255, 255, 0.1)' }}>
                          <Typography variant="body2" sx={{ color: '#cccccc' }}>
                            {employee.email}
                          </Typography>
                        </TableCell>
                        <TableCell sx={{ borderBottom: '1px solid rgba(255, 255, 255, 0.1)' }}>
                          <Chip 
                            label={employee.position}
                            size="small"
                            sx={{ 
                              backgroundColor: 'rgba(255, 255, 255, 0.1)',
                              color: '#ffffff',
                              border: '1px solid rgba(255, 255, 255, 0.3)',
                              fontWeight: 'medium'
                            }}
                          />
                        </TableCell>
                        <TableCell align="center" sx={{ borderBottom: '1px solid rgba(255, 255, 255, 0.1)' }}>
                          <Box sx={{ display: 'flex', justifyContent: 'center', gap: 1 }}>
                            <Tooltip title="Edit employee">
                              <IconButton
                                onClick={() => handleEdit(employee)}
                                disabled={loading}
                                size="small"
                                sx={{ 
                                  color: '#ffffff',
                                  border: '1px solid rgba(255, 255, 255, 0.3)',
                                  '&:hover': { 
                                    backgroundColor: 'rgba(255, 255, 255, 0.1)',
                                    border: '1px solid rgba(255, 255, 255, 0.5)'
                                  }
                                }}
                              >
                                <EditIcon />
                              </IconButton>
                            </Tooltip>
                            <Tooltip title="Delete employee">
                              <IconButton
                                onClick={() => handleDelete(employee.id)}
                                disabled={loading}
                                size="small"
                                sx={{ 
                                  color: '#ffffff',
                                  border: '1px solid rgba(255, 255, 255, 0.3)',
                                  '&:hover': { 
                                    backgroundColor: 'rgba(255, 255, 255, 0.1)',
                                    border: '1px solid rgba(255, 255, 255, 0.5)'
                                  }
                                }}
                              >
                                <DeleteIcon />
                              </IconButton>
                            </Tooltip>
                          </Box>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </TableContainer>

            {/* Add/Edit Dialog */}
            <Dialog 
              open={openDialog} 
              onClose={handleCloseDialog} 
              maxWidth="sm" 
              fullWidth
              PaperProps={{
                sx: {
                  borderRadius: 3,
                  background: 'rgba(0, 0, 0, 0.9)',
                  backdropFilter: 'blur(20px)',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  color: '#ffffff'
                }
              }}
            >
              <DialogTitle sx={{ pb: 2, color: '#ffffff', borderBottom: '1px solid rgba(255, 255, 255, 0.1)' }}>
                <Typography variant="h4" component="div" fontWeight="bold" sx={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: 2,
                  fontSize: '1.5rem'
                }}>
                  {editingEmployee ? (
                    <>
                      <Box sx={{ 
                        width: 12, 
                        height: 12, 
                        borderRadius: '50%', 
                        backgroundColor: '#ffffff' 
                      }} />
                      Edit Employee
                    </>
                  ) : (
                    <>
                      <Box sx={{ 
                        width: 12, 
                        height: 12, 
                        borderRadius: '50%', 
                        border: '2px solid #ffffff',
                        backgroundColor: 'transparent'
                      }} />
                      Add New Employee
                    </>
                  )}
                </Typography>
              </DialogTitle>
              <DialogContent sx={{ pt: 4, pb: 2, px: 3 }}>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                  <TextField
                    fullWidth
                    label="Full Name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    error={!!errors.name}
                    helperText={errors.name}
                    variant="outlined"
                    autoComplete="name"
                    size="medium"
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <PersonIcon sx={{ color: '#ffffff', mr: 1 }} />
                        </InputAdornment>
                      ),
                      sx: {
                        height: '56px',
                        fontSize: '1rem',
                      }
                    }}
                    InputLabelProps={{
                      shrink: true,
                      sx: {
                        fontSize: '1rem',
                        fontWeight: 500,
                        transform: 'translate(14px, -9px) scale(0.75)',
                        '&.Mui-focused': {
                          transform: 'translate(14px, -9px) scale(0.75)',
                        }
                      }
                    }}
                    sx={{
                      mt: 2,
                      '& .MuiOutlinedInput-root': {
                        borderRadius: '8px',
                        color: '#ffffff !important',
                        backgroundColor: 'rgba(255, 255, 255, 0.02)',
                        '& input': {
                          color: '#ffffff !important',
                          backgroundColor: 'transparent !important',
                          fontSize: '1rem',
                          padding: '16px 14px',
                          '&:-webkit-autofill': {
                            WebkitBoxShadow: '0 0 0 1000px transparent inset !important',
                            WebkitTextFillColor: '#ffffff !important',
                            backgroundColor: 'transparent !important',
                          },
                          '&:-webkit-autofill:hover': {
                            WebkitBoxShadow: '0 0 0 1000px transparent inset !important',
                            WebkitTextFillColor: '#ffffff !important',
                          },
                          '&:-webkit-autofill:focus': {
                            WebkitBoxShadow: '0 0 0 1000px transparent inset !important',
                            WebkitTextFillColor: '#ffffff !important',
                          },
                        },
                        '& fieldset': {
                          borderColor: 'rgba(255, 255, 255, 0.3)',
                          borderWidth: '1px',
                        },
                        '&:hover fieldset': {
                          borderColor: 'rgba(255, 255, 255, 0.6)',
                        },
                        '&.Mui-focused fieldset': {
                          borderColor: '#ffffff',
                          borderWidth: '2px',
                        },
                      },
                      '& .MuiInputLabel-root': {
                        color: '#cccccc !important',
                        backgroundColor: 'transparent',
                        padding: '0 4px',
                        '&.Mui-focused': {
                          color: '#ffffff !important',
                        },
                        '&.MuiInputLabel-shrink': {
                          backgroundColor: 'rgba(0, 0, 0, 0.8)',
                          borderRadius: '4px',
                        }
                      },
                      '& .MuiFormHelperText-root': {
                        color: '#ffffff',
                        marginLeft: '14px',
                        fontSize: '0.875rem',
                      },
                    }}
                  />
                  <TextField
                    fullWidth
                    label="Email Address"
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    error={!!errors.email}
                    helperText={errors.email}
                    variant="outlined"
                    autoComplete="email"
                    size="medium"
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <EmailIcon sx={{ color: '#ffffff', mr: 1 }} />
                        </InputAdornment>
                      ),
                      sx: {
                        height: '56px',
                        fontSize: '1rem',
                      }
                    }}
                    InputLabelProps={{
                      shrink: true,
                      sx: {
                        fontSize: '1rem',
                        fontWeight: 500,
                        transform: 'translate(14px, -9px) scale(0.75)',
                        '&.Mui-focused': {
                          transform: 'translate(14px, -9px) scale(0.75)',
                        }
                      }
                    }}
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        borderRadius: '8px',
                        color: '#ffffff !important',
                        backgroundColor: 'rgba(255, 255, 255, 0.02)',
                        '& input': {
                          color: '#ffffff !important',
                          backgroundColor: 'transparent !important',
                          fontSize: '1rem',
                          padding: '16px 14px',
                          '&:-webkit-autofill': {
                            WebkitBoxShadow: '0 0 0 1000px transparent inset !important',
                            WebkitTextFillColor: '#ffffff !important',
                            backgroundColor: 'transparent !important',
                          },
                          '&:-webkit-autofill:hover': {
                            WebkitBoxShadow: '0 0 0 1000px transparent inset !important',
                            WebkitTextFillColor: '#ffffff !important',
                          },
                          '&:-webkit-autofill:focus': {
                            WebkitBoxShadow: '0 0 0 1000px transparent inset !important',
                            WebkitTextFillColor: '#ffffff !important',
                          },
                        },
                        '& fieldset': {
                          borderColor: 'rgba(255, 255, 255, 0.3)',
                          borderWidth: '1px',
                        },
                        '&:hover fieldset': {
                          borderColor: 'rgba(255, 255, 255, 0.6)',
                        },
                        '&.Mui-focused fieldset': {
                          borderColor: '#ffffff',
                          borderWidth: '2px',
                        },
                      },
                      '& .MuiInputLabel-root': {
                        color: '#cccccc !important',
                        backgroundColor: 'transparent',
                        padding: '0 4px',
                        '&.Mui-focused': {
                          color: '#ffffff !important',
                        },
                        '&.MuiInputLabel-shrink': {
                          backgroundColor: 'rgba(0, 0, 0, 0.8)',
                          borderRadius: '4px',
                        }
                      },
                      '& .MuiFormHelperText-root': {
                        color: '#ffffff',
                        marginLeft: '14px',
                        fontSize: '0.875rem',
                      },
                    }}
                  />
                  <TextField
                    fullWidth
                    label="Job Position"
                    value={formData.position}
                    onChange={(e) => setFormData({ ...formData, position: e.target.value })}
                    error={!!errors.position}
                    helperText={errors.position}
                    variant="outlined"
                    autoComplete="organization-title"
                    size="medium"
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <WorkIcon sx={{ color: '#ffffff', mr: 1 }} />
                        </InputAdornment>
                      ),
                      sx: {
                        height: '56px',
                        fontSize: '1rem',
                      }
                    }}
                    InputLabelProps={{
                      shrink: true,
                      sx: {
                        fontSize: '1rem',
                        fontWeight: 500,
                        transform: 'translate(14px, -9px) scale(0.75)',
                        '&.Mui-focused': {
                          transform: 'translate(14px, -9px) scale(0.75)',
                        }
                      }
                    }}
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        borderRadius: '8px',
                        color: '#ffffff !important',
                        backgroundColor: 'rgba(255, 255, 255, 0.02)',
                        '& input': {
                          color: '#ffffff !important',
                          backgroundColor: 'transparent !important',
                          fontSize: '1rem',
                          padding: '16px 14px',
                          '&:-webkit-autofill': {
                            WebkitBoxShadow: '0 0 0 1000px transparent inset !important',
                            WebkitTextFillColor: '#ffffff !important',
                            backgroundColor: 'transparent !important',
                          },
                          '&:-webkit-autofill:hover': {
                            WebkitBoxShadow: '0 0 0 1000px transparent inset !important',
                            WebkitTextFillColor: '#ffffff !important',
                          },
                          '&:-webkit-autofill:focus': {
                            WebkitBoxShadow: '0 0 0 1000px transparent inset !important',
                            WebkitTextFillColor: '#ffffff !important',
                          },
                        },
                        '& fieldset': {
                          borderColor: 'rgba(255, 255, 255, 0.3)',
                          borderWidth: '1px',
                        },
                        '&:hover fieldset': {
                          borderColor: 'rgba(255, 255, 255, 0.6)',
                        },
                        '&.Mui-focused fieldset': {
                          borderColor: '#ffffff',
                          borderWidth: '2px',
                        },
                      },
                      '& .MuiInputLabel-root': {
                        color: '#cccccc !important',
                        backgroundColor: 'transparent',
                        padding: '0 4px',
                        '&.Mui-focused': {
                          color: '#ffffff !important',
                        },
                        '&.MuiInputLabel-shrink': {
                          backgroundColor: 'rgba(0, 0, 0, 0.8)',
                          borderRadius: '4px',
                        }
                      },
                      '& .MuiFormHelperText-root': {
                        color: '#ffffff',
                        marginLeft: '14px',
                        fontSize: '0.875rem',
                      },
                    }}
                  />
                </Box>
              </DialogContent>
              <DialogActions sx={{ p: 3, pt: 2, gap: 2, display: 'flex', justifyContent: 'flex-end' }}>
                <Button 
                  onClick={handleCloseDialog}
                  disabled={loading}
                  variant="outlined"
                  sx={{ 
                    borderRadius: 3,
                    minWidth: 100,
                    height: 48,
                    color: '#ffffff',
                    borderColor: 'rgba(255, 255, 255, 0.5)',
                    backgroundColor: 'transparent',
                    fontWeight: 'medium',
                    textTransform: 'none',
                    fontSize: '1rem',
                    '&:hover': {
                      backgroundColor: 'rgba(255, 255, 255, 0.1)',
                      borderColor: '#ffffff',
                      color: '#ffffff'
                    },
                    '&:disabled': {
                      color: 'rgba(255, 255, 255, 0.5)',
                      borderColor: 'rgba(255, 255, 255, 0.3)'
                    }
                  }}
                >
                  Cancel
                </Button>
                <Button 
                  onClick={handleSubmit} 
                  variant="contained"
                  disabled={loading}
                  startIcon={loading ? <CircularProgress size={20} sx={{ color: '#000000' }} /> : null}
                  sx={{ 
                    borderRadius: 3,
                    minWidth: 120,
                    height: 48,
                    backgroundColor: '#ffffff',
                    color: '#000000',
                    fontWeight: 'bold',
                    textTransform: 'none',
                    fontSize: '1rem',
                    boxShadow: '0 4px 12px rgba(255, 255, 255, 0.3)',
                    '&:hover': {
                      backgroundColor: '#f0f0f0',
                      boxShadow: '0 6px 16px rgba(255, 255, 255, 0.4)',
                      transform: 'translateY(-1px)'
                    },
                    '&:disabled': {
                      backgroundColor: 'rgba(255, 255, 255, 0.6)',
                      color: 'rgba(0, 0, 0, 0.6)',
                      boxShadow: 'none'
                    },
                    transition: 'all 0.2s ease-in-out'
                  }}
                >
                  {loading ? 'Saving...' : (editingEmployee ? 'Update Employee' : 'Add Employee')}
                </Button>
              </DialogActions>
            </Dialog>

            {/* Snackbar for notifications */}
            <Snackbar
              open={snackbar.open}
              autoHideDuration={4000}
              onClose={() => setSnackbar({ ...snackbar, open: false })}
              anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
            >
              <Alert 
                severity={snackbar.severity} 
                onClose={() => setSnackbar({ ...snackbar, open: false })}
                sx={{ 
                  borderRadius: 2,
                  backgroundColor: snackbar.severity === 'error' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(255, 255, 255, 0.1)',
                  color: '#ffffff',
                  border: '1px solid rgba(255, 255, 255, 0.3)'
                }}
              >
                {snackbar.message}
              </Alert>
            </Snackbar>
          </Box>
        </Fade>
      </Container>
    </ThemeProvider>
  );
}

export default App;
