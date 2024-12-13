import React ,{useEffect} from "react";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Button,
  Typography,
  Grid,
  Chip,
} from "@mui/material";
import {useFetchOwnerDataByIdMutation} from "@/redux/api/owner/ownerApi";
import { Twitter } from "@mui/icons-material";


interface Restaurant {
  name: string;
  about: string;
  location: string;
  country: string;
  contact_number: string;
  email: string;
  website: string;
  social_media: {
    twitter: string;
    instagram: string;
    facebook: string;
  };
  opening_hours: {
    monday: { open: string; close: string };
    tuesday: { open: string; close: string };
    wednesday: { open: string; close: string };
    thursday: { open: string; close: string };
    friday: { open: string; close: string };
    saturday: { open: string; close: string };
    sunday: { open: string; close: string };
  };
  contact_person_name: string;
  contact_person_position: string;
  restaurant_category: string;
  avg_budget: string;
  avg_rating: number;
  subscription: string;
  isActive: boolean;
  thumbnail_photo: string;
  owner: string;
  qr_code: string;
  gallery: string[];
}

interface RestaurantDetailsModalProps {
  open: boolean;
  restaurant: Restaurant | null;
  onClose: () => void;
}

const RestaurantDetailsModal: React.FC<RestaurantDetailsModalProps> = ({
  open,
  restaurant,
  onClose,
}) => {
  
  const [fetchOwnerDataById, { data: ownerData, error, isLoading  }] = useFetchOwnerDataByIdMutation();
  useEffect(() => {
    if (open && restaurant?.owner) {
      fetchOwnerDataById({ id: restaurant.owner });
    }
  }, [open, restaurant?.owner, fetchOwnerDataById]);
  const daysOrder: (keyof Restaurant["opening_hours"])[] = ["monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday"];
  if (!restaurant) return null;

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
    <Dialog
  open={open}
  onClose={onClose}
  fullWidth
  maxWidth="xl"
  PaperProps={{
    sx: {
      borderRadius: "12px",
      boxShadow: "0 4px 20px rgba(0, 0, 0, 0.1)",
      height: "90vh", // Set the desired height
      maxHeight: "90vh", // Ensure it doesn't exceed the viewport height
    },
  }}
>
      <DialogTitle className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white p-6 rounded-t-xl flex felx-row items-center">
        <Typography variant="h5" className="font-semibold">
          {restaurant.name}
        </Typography>
        <Chip
          label={restaurant.isActive ? "Active" : "Inactive"}
          color={restaurant.isActive ? "success" : "error"} 
          size="small"
          sx={{ ml: 2 }}
        />
      </DialogTitle>
      <DialogContent className="p-6 space-y-0 bg-white rounded-b-xl flex">
        {/* Fixed Left Side - Restaurant Image */}
        <div className="w-1/3 pr-4 flex-shrink-0 mt-6">
          <div className="rounded-lg overflow-hidden shadow-lg h-[70vh] sticky top-0">
            <img
              src={restaurant.thumbnail_photo}
              alt={restaurant.name}
              className="w-full h-full object-cover"
            />
          </div>
        </div>

        {/* Scrollable Right Side */}
        <div className="w-2/3 pl-4 overflow-y-auto max-h-[90vh] py-6 px-2 ">
          <Grid container spacing={3}>
            {/* About Section - Full Width */}
            <Grid item xs={12}>
              <div className="bg-gray-50 p-4 rounded-lg shadow-md">
                <Typography
                  variant="h6"
                  className="font-semibold text-gray-800 mb-2"
                >
                  About
                </Typography>
                <Typography variant="body2" className="text-gray-500">
                  {restaurant.about}
                </Typography>
                <div className="flex flex-row items-center">
                    <div className="rounded-lg overflow-hidden shadow-lg h-[100px] w-[100px] sticky mt-6">
                        <img
                          src={restaurant.qr_code}
                          alt={restaurant.name}
                          className="w-full h-full object-cover"
                        />
                        
                  </div>
                <Button
                        variant="contained"
                        color="primary"
                      sx={{ ml: 2, mt: 2 , height: 40}}
                      onClick={() => handleDownload(restaurant.qr_code)}
                      >
                        Download QR Code
              </Button>
             </div>
              </div>
            
              
            </Grid>

            {/* Location Section */}
            <Grid item xs={12}>
              <div className="bg-gray-50 p-4 rounded-lg shadow-md">
                <Typography
                  variant="h6"
                  className="font-semibold text-gray-800 mb-2"
                >
                  Owner
                </Typography>

                {isLoading ? (
                    <Typography>Loading...</Typography>
                  ) : ownerData ? (
                    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                      <tbody>
                        <tr>
                          <td style={{ border: '1px solid #e0e0e0', padding: '8px' }}><strong>Owner:</strong></td>
                          <td style={{ border: '1px solid #e0e0e0', padding: '8px' }}>{ownerData[0]?.name || "No owner assigned"}</td>
                        </tr>
                        <tr>
                          <td style={{ border: '1px solid #e0e0e0', padding: '8px' }}><strong>UUID:</strong></td>
                          <td style={{ border: '1px solid #e0e0e0', padding: '8px' }}>{ownerData[0]?.id || "No owner assigned"}</td>
                        </tr>
                        <tr>
                          <td style={{ border: '1px solid #e0e0e0', padding: '8px' }}><strong>Contact:</strong></td>
                          <td style={{ border: '1px solid #e0e0e0', padding: '8px' }}>{ownerData[0]?.contact_no || "No owner assigned"}</td>
                        </tr>
                        <tr>
                          <td style={{ border: '1px solid #e0e0e0', padding: '8px' }}><strong>Email:</strong></td>
                          <td style={{ border: '1px solid #e0e0e0', padding: '8px' }}>{ownerData[0]?.email || "No owner assigned"}</td>
                        </tr>
                      </tbody>
                    </table>
                  ) : (
                    <Typography variant="body2" className="text-gray-500">
                      No owner assigned
                    </Typography>
                  )}
              </div>
            </Grid>

           
            {/* Two Column Section */}
            <Grid item xs={12} sm={6}>
              <div className="bg-gray-50 p-4 rounded-lg shadow-md h-full">
                <Typography
                  variant="h6"
                  className="font-semibold text-gray-800 "
                >
                  Contact Details
                </Typography>
                <div className="mt-2 space-y-1 mb-4">
                  <Typography variant="body2" className="text-gray-700">
                    <strong>Phone:</strong> {restaurant.contact_number}
                  </Typography>
                  <Typography variant="body2" className="text-gray-700">
                    <strong>Email:</strong> {restaurant.email || "N/A"}
                  </Typography>
                </div>
                <Typography
                  variant="h6"
                  className="font-semibold text-gray-800"
                >
                  Social Links
                </Typography>
                <div className="mt-2 space-y-1">
                  <Typography variant="body2" className="text-gray-700">
                    <strong>Website:</strong> {restaurant.website || "N/A"}
                  </Typography>
                  
                  <div className="flex space-x-2 mt-2">
                    {restaurant.social_media?.twitter && (
                      <><Typography variant="body2" className="text-gray-700">
                      <strong>Twitter:</strong> {restaurant.website || "N/A"}
                    </Typography>
                        <a
                          href={restaurant.social_media.twitter}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          
                          {restaurant.social_media.twitter}
                        </a>
                      </>
                    )}
                    {restaurant.social_media.instagram && (
                      <>       
                       <Typography variant="body2" className="text-gray-700">
                      <strong>Instagram:</strong> {restaurant.website || "N/A"}
                    </Typography>               <a
                        href={restaurant.social_media?.instagram}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                       
                      </a>
                      </>

                    )}
                    {restaurant.social_media.facebook && (
                      <>
                       <Typography variant="body2" className="text-gray-700">
                      <strong>Facebook:</strong> {restaurant.website || "N/A"}
                    </Typography>
                      
                      <a
                        href={restaurant.social_media?.facebook}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                       
                      </a>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </Grid>

            <Grid item xs={12} sm={6}>
              <div className="bg-gray-50 p-4 rounded-lg shadow-md h-full">
                <Typography
                  variant="h6"
                  className="font-semibold text-gray-800 mb-2"
                >
                  Location
                </Typography>
                <div className="mt-2 space-y-1 mb-4">
                  <Typography variant="body2" className="text-gray-700">
                    <strong>Address:</strong> {restaurant.location}
                  </Typography>
                  <Typography variant="body2" className="text-gray-700">
                    <strong>Country:</strong> {restaurant.country}
                  </Typography>
                </div>

                <Typography
                  variant="h6"
                  className="font-semibold text-gray-800 mb-2"
                >
                  Additional Information
                </Typography>
                <div className="mt-2 space-y-1 mb-4">
                  <Typography variant="body2" className="text-gray-700">
                    <strong>Category:</strong> {restaurant.restaurant_category}
                  </Typography>

                  <Typography variant="body2" className="text-gray-700">
                    <strong>Average Budget:</strong> {restaurant.avg_budget}
                  </Typography>
                  <Typography variant="body2" className="text-gray-700">
                    <strong>Average Rating:</strong> {restaurant.avg_rating}
                  </Typography>
                </div>
              </div>
            </Grid>

            {/* Opening Hours Section - Full Width */}
                        <Grid item xs={12}>
              <div className="bg-gray-50 p-4 rounded-lg shadow-md">
                <Typography
                  variant="h6"
                  className="font-semibold text-gray-800 mb-2"
                >
                  Opening Hours
                </Typography>
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Day
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Open
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Close
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
  {daysOrder.map((day) => {
    const hours = restaurant.opening_hours[day as keyof typeof restaurant.opening_hours];
    return (
      <tr key={day}>
        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
          {day.charAt(0).toUpperCase() + day.slice(1)}
        </td>
        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
          {hours?.open || "N/A"}
        </td>
        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
          {hours?.close || "N/A"}
        </td>
      </tr>
    );
  })}
</tbody>
                </table>
              </div>
            </Grid>

            <Grid item xs={12}>
              <div className="bg-gray-50 p-4 rounded-lg shadow-md">
                <Typography
                  variant="h6"
                  className="font-semibold text-gray-800 mb-2"
                >
                  Gallery
                </Typography>

                  {restaurant.gallery.length === 0 && (
                    <Typography variant="body2" className="text-gray-500">
                      No gallery images available.
                    </Typography>
                  )}
                <div className="grid grid-cols-3 gap-2 mt-2">
                {restaurant.gallery.map((image: string, index: number) => (
                    <img
                      key={index}
                      src={image}
                      alt={`Gallery Image ${index}`}
                      className="w-full h-32 object-cover rounded-lg"
                    />
                  ))}
                </div>
              </div>
            </Grid>
          </Grid>
        </div>
      </DialogContent>
      <DialogActions>
        <Button
          onClick={onClose}
          color="primary"
          variant="contained"
          className="bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg px-6 py-2"
        >
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default RestaurantDetailsModal;