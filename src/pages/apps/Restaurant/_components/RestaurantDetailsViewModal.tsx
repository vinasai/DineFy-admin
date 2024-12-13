import React from 'react';
import { 
  Dialog, 
  DialogTitle, 
  DialogContent, 
  DialogActions,
  Button,
  Typography, 
  Grid, 
  Chip, 
  Box, 
  Divider 
} from '@mui/material';
import { Language, Twitter, Instagram } from '@mui/icons-material';

interface OpeningHours {
  open: string | null;
  close: string | null;
}

interface DailyHours {
  [key: string]: OpeningHours;
}


interface RestaurantDetailsProps {
  open: boolean;
  onClose: () => void;
  restaurant: {
    name: string;
    contact_number: string;
    email?: string;
    restaurant_category: string;
    cuisine_type?: string;
    avg_budget?: string;
    about: string;
    location: string;
    country: string;
    postal_code?: string;
    opening_hours: DailyHours;
    facilities: {
      categories: {
        name: string;
        facilities: {
          [key: string]: boolean;
        };
      }[];
    };
    website?: string;
    social_media: {
      twitter?: string;
      instagram?: string;
      tiktok?: string;
    };
    qr_code_url: string;
    thumbnail_photo: File | null;
    gallery: File[];
  };
  
}



const RestaurantDetailsViewModal: React.FC<RestaurantDetailsProps> = ({ 
  open, 
  onClose, 
  restaurant 
}) => {
  interface OpeningHours {
    open?: string;
    close?: string;
  }

  const formatOpeningHours = (hours: OpeningHours) => {
    if (!hours.open || !hours.close) return 'Closed';
    return `${hours.open} - ${hours.close}`;
  };

  const getSelectedFacilities = (facilities: { [key: string]: boolean }) => {
    return Object.entries(facilities)
      .filter(([_, value]) => value)
      .map(([key]) => 
        key.replace(/([A-Z])/g, ' $1')
           .replace(/^./, str => str.toUpperCase())
      );
  };

  const handleDownload = async (qrCodeUrl: string) => {
    try {
      const response = await fetch(qrCodeUrl);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `${restaurant.name} - QR Code.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Failed to download QR code:", error);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="md">
      <DialogTitle sx={{ textAlign: "center", fontWeight: "bold", bgcolor: "#f8f9fa" }}>
        Restaurant Details
      </DialogTitle>
      <DialogContent sx={{ p: 3 }}>
        {/* Thumbnail */}
        <Box sx={{ textAlign: 'center', mb: 4, mt: 2 }}>
          <img 
            src={restaurant?.thumbnail_photo ? URL.createObjectURL(restaurant.thumbnail_photo) : undefined} 
            alt="Thumbnail" 
            style={{
              width: 150,
              height: 150,
              objectFit: 'cover',
              borderRadius: '50%',
              boxShadow: '0 4px 12px rgba(0, 0, 0, 0.2)'
            }}
          />
        </Box>

        {/* Basic Information */}
        <Box sx={{ mb: 4, p: 2, border: '1px solid #e0e0e0', borderRadius: '8px' }}>
          <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold', color: '#495057' }}>
            Basic Information
          </Typography>
          <Divider sx={{ mb: 2 }} />
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <tbody>
              <tr>
                <td style={{ border: '1px solid #e0e0e0', padding: '8px' }}><strong>Name:</strong></td>
                <td style={{ border: '1px solid #e0e0e0', padding: '8px' }}>{restaurant.name}</td>
              </tr>
              <tr>
                <td style={{ border: '1px solid #e0e0e0', padding: '8px' }}><strong>Contact:</strong></td>
                <td style={{ border: '1px solid #e0e0e0', padding: '8px' }}>{restaurant.contact_number}</td>
              </tr>
              <tr>
                <td style={{ border: '1px solid #e0e0e0', padding: '8px' }}><strong>Email:</strong></td>
                <td style={{ border: '1px solid #e0e0e0', padding: '8px' }}>{restaurant.email || 'N/A'}</td>
              </tr>
              <tr>
                <td style={{ border: '1px solid #e0e0e0', padding: '8px' }}><strong>Category:</strong></td>
                <td style={{ border: '1px solid #e0e0e0', padding: '8px' }}>{restaurant.restaurant_category}</td>
              </tr>
              <tr>
                <td style={{ border: '1px solid #e0e0e0', padding: '8px' }}><strong>Cuisine:</strong></td>
                <td style={{ border: '1px solid #e0e0e0', padding: '8px' }}>{restaurant.cuisine_type || 'N/A'}</td>
              </tr>
              <tr>
                <td style={{ border: '1px solid #e0e0e0', padding: '8px' }}><strong>Avg Budget:</strong></td>
                <td style={{ border: '1px solid #e0e0e0', padding: '8px' }}>{restaurant.avg_budget || 'N/A'}</td>
              </tr>
              <tr>
                <td style={{ border: '1px solid #e0e0e0', padding: '8px' }}><strong>About:</strong></td>
                <td style={{ border: '1px solid #e0e0e0', padding: '8px' }}>{restaurant.about}</td>
              </tr>
            </tbody>
          </table>
        </Box>

        {/* Location */}
        <Box sx={{ mb: 4, p: 2, border: '1px solid #e0e0e0', borderRadius: '8px' }}>
          <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold', color: '#495057' }}>
            Location
          </Typography>
          <Divider sx={{ mb: 2 }} />
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={12} sm={6}>
              <Typography><strong>Address:</strong> {restaurant.location}</Typography>
              <Typography><strong>Country:</strong> {restaurant.country}</Typography>
              <Typography><strong>Postal Code:</strong> {restaurant.postal_code || 'N/A'}</Typography>
            </Grid>
          </Grid>
        </Box>

        {/* Opening Hours */}
        <Box sx={{ mb: 4, p: 2, border: '1px solid #e0e0e0', borderRadius: '8px' }}>
          <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold', color: '#495057' }}>
            Opening Hours
          </Typography>
          <Divider sx={{ mb: 2 }} />
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr>
                <th style={{ border: '1px solid #e0e0e0', padding: '8px', textAlign: 'left' }}>Day</th>
                <th style={{ border: '1px solid #e0e0e0', padding: '8px', textAlign: 'left' }}>Open</th>
                <th style={{ border: '1px solid #e0e0e0', padding: '8px', textAlign: 'left' }}>Close</th>
              </tr>
            </thead>
            <tbody>
              {Object.entries(restaurant.opening_hours).map(([day, hours]) => (
                <tr key={day}>
                  <td style={{ border: '1px solid #e0e0e0', padding: '8px' }}>{day.charAt(0).toUpperCase() + day.slice(1)}</td>
                  <td style={{ border: '1px solid #e0e0e0', padding: '8px' }}>{hours.open ? hours.open : 'N/A'}</td>
                  <td style={{ border: '1px solid #e0e0e0', padding: '8px' }}>{hours.close ? hours.close : 'N/A'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </Box>

        {/* Facilities */}
        <Box sx={{ mb: 4, p: 2, border: '1px solid #e0e0e0', borderRadius: '8px' }}>
          <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold', color: '#495057' }}>
            Facilities
          </Typography>
          <Divider sx={{ mb: 2 }} />
          {restaurant.facilities.categories.map((category) => (
            <Box key={category.name} sx={{ mb: 2 }}>
              <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
                {category.name}
              </Typography>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                {getSelectedFacilities(category.facilities).map((facility) => (
                  <Chip key={facility} label={facility} variant="outlined" />
                ))}
              </Box>
            </Box>
          ))}
        </Box>

        {/* Social Links */}
        <Box sx={{ mb: 4, p: 2, border: '1px solid #e0e0e0', borderRadius: '8px' }}>
          <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold', color: '#495057' }}>
            Social Links
          </Typography>
          <Divider sx={{ mb: 2 }} />
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
            <Typography>
              <Language sx={{ verticalAlign: 'middle', mr: 1 }} /> 
              Website: {restaurant.website || 'N/A'}
            </Typography>
            <Typography>
              <Twitter sx={{ verticalAlign: 'middle', mr: 1 }} /> 
              Twitter: {restaurant.social_media.twitter || 'N/A'}
            </Typography>
            <Typography>
              <Instagram sx={{ verticalAlign: 'middle', mr: 1 }} /> 
              Instagram: {restaurant.social_media.instagram || 'N/A'}
            </Typography>
            <Typography>
              TikTok: {restaurant.social_media.tiktok || 'N/A'}
            </Typography>
          </Box>
        </Box>


        {/* Social Links */}
        <Box sx={{ mb: 4, p: 2, border: '1px solid #e0e0e0', borderRadius: '8px' }}>
          <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold', color: '#495057' }}>
            Restaurant QR Code
          </Typography>
          <Divider sx={{ mb: 2 }} />
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
          <img 
            src={restaurant?.qr_code_url} 
            alt="Thumbnail" 
            style={{
              width: 175,
              height: 175,
              objectFit: 'cover',
              boxShadow: '0 4px 12px rgba(0, 0, 0, 0.2)'
            }}
          />
          </Box>
          <Button 
            variant="contained" 
            color="primary"
            onClick={() => handleDownload(restaurant.qr_code_url)}
            sx={{ mt: 2 }}
          >
            Download QR Code
          </Button>
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="primary" variant="contained">
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default RestaurantDetailsViewModal;