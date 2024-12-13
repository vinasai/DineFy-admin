import React, { useState ,useEffect } from "react";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Button,
  Grid,
  Box,
  Tabs,
  Tab,
  Typography,
  Checkbox,
  IconButton,
  Divider,
  Select,
  MenuItem,
  CircularProgress
  
} from "@mui/material";
import { useForm, Controller } from "react-hook-form";
import { useDropzone } from "react-dropzone";
import { DeleteOutline } from "@mui/icons-material";

import RestaurantDetailsViewModal from "./RestaurantDetailsViewModal";
import {useCreateRestaurantApiMutation} from "@/redux/api/restaurant/restaurantApiSlice";


interface OpeningHours {
  open: string | null;
  close: string | null;
}

interface DailyHours {
  [key: string]: OpeningHours;
}

interface Facility {
  [key: string]: boolean;
}

interface FacilityCategory {
  icon: string;
  name: string;
  facilities: Facility;
}

interface NewRestaurant {
  name: string;
  about: string;
  email: string;
  avg_budget: string;
  restaurant_category: string;
  cuisine_type: string;
  contact_number: string;
  location: string;
  country: string;
  postal_code: string;
  qr_code_url: string;
  
  // Social Links
  website: string;
  social_media: {
    twitter: string;
    instagram: string;
    tiktok: string;
  }

  // Opening Hours
  opening_hours: DailyHours;

  // Features/Facilities
  facilities: {
    categories: {
      icon: string;
      name: string;
      facilities: {
        [key: string]: boolean;
      };
    }[];
  };

  // Images
  thumbnail_photo: File | null;
  gallery: File[];

}

interface AddRestaurantProps {
  open: boolean;
  onClose: () => void;
  onSave: (newRestaurant: NewRestaurant) => void;
}

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`restaurant-tabpanel-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

const AddRestaurant: React.FC<AddRestaurantProps> = ({
  open,
  onClose,
  onSave,
}) => {
  const { handleSubmit, control, reset } = useForm<NewRestaurant>({
    defaultValues: {
      name: "",
      about: "",
      email: "",
      avg_budget: "",
      restaurant_category: "",
      cuisine_type: "",
      contact_number: "",
      location: "",
      country: "",
      postal_code: "",
      
      // Social Links
      website: "",
      social_media: {
        twitter: "",
        instagram: "",
        tiktok: "", },
  
      // Opening Hours
      opening_hours: {
        monday: { open: "", close: "" },
        tuesday: { open: "", close: "" },
        wednesday: { open: "", close: "" },
        thursday: { open: "", close: "" },
        friday: { open: "", close: "" },
        saturday: { open: "", close: "" },
        sunday: { open: "", close: "" }
      },
  
      // Features/Facilities
      facilities: {
        categories: [
          {
            icon: "food",
            name: "Food and Dining",
            facilities: {
              patio: false,
              buffet: false,
              veganFood: false,
              halalFoods: false,
              reservations: false,
              nutsFreeFoods: false,
              glutenFreeFoods: false,
              birthdayDiscounts: false,
              creditCardPayment: false,
              birthdayCelebration: false
            }
          },
          {
            icon: "family",
            name: "Family",
            facilities: {
              familyRooms: false,
              kidsPlayArea: false,
              crayonsForKids: false,
              diaperChangeRoom: false,
              highchairForKids: false
            }
          },
          {
            icon: "entertainment",
            name: "Entertainment",
            facilities: {
              dj: false,
              tv: false,
              wifi: false,
              music: false,
              liveBand: false,
              frontDesk: false,
              poolTable: false,
              freeParking: false,
              meetingArea: false,
              conferenceRoom: false
            }
          }
        ]
      },

      // Images
      thumbnail_photo: undefined,
      gallery: [],
  
    }
  });

  const [activeTab, setActiveTab] = useState(0);
  const [uploadedImage, setUploadedImage] = useState<File | null>(null);
  const [uploadedImages, setUploadedImages] = useState<File[]>([]);
  const [qrCodeUrl, setQrCodeUrl] = useState("");
  const [showDetails, setShowDetails] = useState(false);
  const [submittedRestaurant, setSubmittedRestaurant] = useState<NewRestaurant | null>(null);
  const [restaurantOnCreating, setRestaurantOnCreating] = useState<NewRestaurant | boolean>(false);

  const [createRestaurant] = useCreateRestaurantApiMutation();

  const qrCodeText =  "https://www.google.com";

  useEffect(() => {
    if (qrCodeText) {
      setQrCodeUrl(`https://quickchart.io/qr?text=${encodeURIComponent(qrCodeText)}&size=400`);
    }
  }, [qrCodeText]);


  const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
  };


  const onDropThumbnail = (acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      setUploadedImage(acceptedFiles[0]);

    }
  };

  const onDropGallery = (acceptedFiles: File[]) => {
    setUploadedImages((prev) => [...prev, ...acceptedFiles]);
  };

  const { getRootProps: getRootPropsThumbnail, getInputProps: getInputPropsThumbnail, isDragActive: isDragActiveThumbnail } = useDropzone({
    onDrop: onDropThumbnail,
    accept: { "image/*": [] },
    maxFiles: 1,
  });

  const { getRootProps: getRootPropsGallery, getInputProps: getInputPropsGallery, isDragActive: isDragActiveGallery } = useDropzone({
    onDrop: onDropGallery,
    accept: { "image/*": [] },
  });

  const onSubmit = async (data: NewRestaurant) => {
    const restaurantToSave = {
      ...data,
      thumbnail_photo: uploadedImage,
      gallery: uploadedImages,
    };
    if (!(restaurantToSave.about === "" || restaurantToSave.name === "" || restaurantToSave.contact_number === "" || restaurantToSave.location === "" || restaurantToSave.country === "" || restaurantToSave.thumbnail_photo === null || restaurantToSave.restaurant_category === "")) {

      setRestaurantOnCreating(true);
      const response = await createRestaurant(restaurantToSave);
      if ('data' in response) {
        console.log(response.data[0]);

        if (response.data[0]) {
          setSubmittedRestaurant({ ...restaurantToSave, qr_code_url: response.data[0].qr_code });
        }
      } else {
        console.error("Error creating restaurant:", response.error);
      }
      setShowDetails(true);
      setRestaurantOnCreating(false);
      

      setActiveTab(0);
      setUploadedImage(null);
      setUploadedImages([]);
      onClose();
      reset();
      onSave(restaurantToSave);
    }
      else{

        setActiveTab(0);
        setTimeout(() => {
          const missingFields = [
            !data.about && "About",
            !data.name && "Name",
            !data.contact_number && "Contact Number",
            !data.location && "Location",
            !data.country && "Country",
            !data.restaurant_category && "Restaurant Category",
            !data.thumbnail_photo && "Thumbnail Photo"
          ].filter(Boolean).join("\n");

  alert(`Please fill in all the required fields in basic information:\n${missingFields}`);
}, 1000);

      }


      
  
   
  };

  return (
    <>
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="lg">
      <DialogTitle sx={{ textAlign: "center", fontWeight: "bold" }}>
        Add New Restaurant
      </DialogTitle>

           {restaurantOnCreating && (
        <Box
          sx={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            bgcolor: "rgba(0, 0, 0, 0.5)", // Semi-transparent background
            zIndex: 1300, // Ensure it appears above other content
          }}
        >
          <Box sx={{ textAlign: "center", padding: "16px", bgcolor: "#fff", borderRadius: "8px" }}>
            <Typography variant="body1">Creating the restaurant...</Typography>
            <CircularProgress />
          </Box>
        </Box>
      )}

      {/* Tabs */}
      <Tabs
        value={activeTab}
        onChange={handleTabChange}
        aria-label="restaurant information tabs"
        centered
        sx={{
          "& .MuiTabs-flexContainer": {
            justifyContent: "space-around",
          },
          "& .MuiTab-root": {
            flex: 1,
            textAlign: "center",
          },
        }}
      >
        <Tab label="Basic Information" />
        <Tab label="Facilities" />
      </Tabs>

      <DialogContent>
        <form onSubmit={handleSubmit(onSubmit)} style={{ marginTop: "5px" }}>
          {/* Basic Information Tab */}
          <TabPanel value={activeTab} index={0}>
            <Grid container spacing={3}>

              {/* Restaurant Basic Information */}
              <Grid item xs={12}>
                <Typography variant="h5">Restaurant Basic Information</Typography>
                <Divider />
              </Grid>
          
              {/* Restaurant Name */}
              <Grid item xs={12} sm={6}>
                <Controller
                  name="name"
                  control={control}
                  render={({ field }) => (
                    <Box>
                      <label>Restaurant Name:*</label>
                      <input
                        {...field}
                        type="text"
                        required
                        style={{
                          width: "100%",
                          padding: "10px",
                          marginTop: "4px",
                          borderRadius: "6px",
                          border: "1px solid #ccc",
                        }}
                      />
                    </Box>
                  )}
                />
              </Grid>
          
              {/* Contact Number */}
              <Grid item xs={12} sm={6}>
                <Controller
                  name="contact_number"
                  control={control}
                  render={({ field }) => (
                    <Box>
                      <label>Contact Number:*</label>
                      <input
                        {...field}
                        type="text"
                        required
                        style={{
                          width: "100%",
                          padding: "10px",
                          marginTop: "4px",
                          borderRadius: "6px",
                          border: "1px solid #ccc",
                        }}
                      />
                    </Box>
                  )}
                />
              </Grid>

              {/* Email */}
              <Grid item xs={12} sm={6}>
                <Controller
                  name="email"
                  control={control}
                  render={({ field }) => (
                    <Box>
                      <label>Email:</label>
                      <input
                        {...field}
                        type="email"
                        style={{
                          width: "100%",
                          padding: "10px",
                          marginTop: "4px",
                          borderRadius: "6px",
                          border: "1px solid #ccc",
                        }}
                      />
                    </Box>
                  )}
                />
              </Grid>

                            {/* Average Budget */}
              <Grid item xs={12} sm={6}>
                <Controller
                  name="avg_budget"
                  control={control}
                  defaultValue=""
                  render={({ field }) => (
                    <Box>
                      <label>Average Budget:</label>
                      <Select
                        {...field}
                        fullWidth
                        variant="outlined"
                        style={{
                          marginTop: "4px",
                          borderRadius: "6px",
                          border: "1px solid #ccc",
                        }}
                      >
                        <MenuItem value="">
                          <em>None</em>
                        </MenuItem>
                        <MenuItem value="50$ - 100$">$50 - $100</MenuItem>
                        <MenuItem value="100$ - 200$">$100 - $200</MenuItem>
                        <MenuItem value="200$ - 300$">$200 - $300</MenuItem>
                        <MenuItem value="300$ - 400$">$300 - $400</MenuItem>
                        <MenuItem value="400$ - 500$">$400 - $500</MenuItem>
                        <MenuItem value="500$+">$500+</MenuItem>
                      </Select>
                    </Box>
                  )}
                />
              </Grid>
          
              {/* About */}
              <Grid item xs={12}>
                <Controller
                  name="about"
                  control={control}
                  render={({ field }) => (
                    <Box>
                      <label>About:*</label>
                      <textarea
                        {...field}
                        required
                        style={{
                          width: "100%",
                          padding: "10px",
                          marginTop: "4px",
                          borderRadius: "6px",
                          border: "1px solid #ccc",
                          minHeight: "100px",
                        }}
                      />
                    </Box>
                  )}
                />
              </Grid>

              {/* Restaurant Category */}
              <Grid item xs={12} sm={6}>
                <Controller
                  name="restaurant_category"
                  control={control}
                  render={({ field }) => (
                    <Box>
                      <label>Restaurant Category:*</label>
                      <Select
                        {...field}
                        required
                        fullWidth
                        variant="outlined"
                        style={{
                          marginTop: "4px",
                          borderRadius: "6px",
                          border: "1px solid #ccc",
                        }}
                      >
                        <MenuItem value="">
                          <em>None</em>
                        </MenuItem>
                        <MenuItem value="Restaurant">Restaurant</MenuItem>
                        <MenuItem value="Fast Food">Fast Food</MenuItem>
                        <MenuItem value="Casual Dining">Casual Dining</MenuItem>
                        <MenuItem value="Fine Dining">Fine Dining</MenuItem>
                        <MenuItem value="Cafe">Cafe</MenuItem>
                        <MenuItem value="Buffet">Buffet</MenuItem>
                        <MenuItem value="Food Truck">Food Truck</MenuItem>
                        <MenuItem value="Pub">Food Truck</MenuItem>
                        <MenuItem value="Hotel">Food Truck</MenuItem>
                      </Select>
                    </Box>
                  )}
                />
              </Grid>

                            {/* Cuisine Type */}
              <Grid item xs={12} sm={6}>
                <Controller
                  name="cuisine_type"
                  control={control}
                  render={({ field }) => (
                    <Box>
                      <label>Cuisine Type:</label>
                      <Select
                        {...field}
                        fullWidth
                        variant="outlined"
                        style={{
                          marginTop: "4px",
                          borderRadius: "6px",
                          border: "1px solid #ccc",
                        }}
                      >
                        <MenuItem value="">
                          <em>None</em>
                        </MenuItem>
                        <MenuItem value="Italian">Italian</MenuItem>
                        <MenuItem value="Chinese">Chinese</MenuItem>
                        <MenuItem value="Indian">Indian</MenuItem>
                        <MenuItem value="Mexican">Mexican</MenuItem>
                        <MenuItem value="Japanese">Japanese</MenuItem>
                        <MenuItem value="French">French</MenuItem>
                        <MenuItem value="Thai">Thai</MenuItem>
                        <MenuItem value="Mediterranean">Mediterranean</MenuItem>
                      </Select>
                    </Box>
                  )}
                />
              </Grid>

             
                {/* Thumbnail Photo */}
              <Grid item xs={12}>
                <label>Thumbnail Image:*</label>
                <Box
                  {...getRootPropsThumbnail()}
                  style={{
                    padding: "25px",
                    border: "2px dashed #ccc",
                    textAlign: "center",
                    marginTop: "10px",
                    cursor: "pointer",
                    position: "relative",
                  }}
                >
                  <input {...getInputPropsThumbnail()} />
                  {isDragActiveThumbnail ? (
                    <p>Drop the photo here...</p>
                  ) : uploadedImage ? (
                      <Box sx={{ position: "relative", display: "inline-block", textAlign: "center" }}>
                      <img
                        src={URL.createObjectURL(uploadedImage)}
                        alt="Thumbnail"
                        style={{ width: "200px", marginBottom: "10px", borderRadius: "8px", boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)" }}
                      />
                      <Typography variant="body2" sx={{ marginTop: "8px" }}>{uploadedImage.name}</Typography>
                      <IconButton
                        onClick={(e) => {
                          e.stopPropagation();
                          setUploadedImage(null);
                        }}
                        sx={{
                          position: "absolute",
                          top: "5px",
                          right: "5px",
                          backgroundColor: "rgba(255, 255, 255, 0.8)",
                          borderRadius: "50%",
                          boxShadow: "0 2px 4px rgba(0, 0, 0, 0.2)"
                        }}
                        size="small"
                      >
                        <DeleteOutline />
                      </IconButton>
                    </Box>
                  ) : (
                    <p>Drag & drop or click to upload a photo</p>
                  )}
                </Box>
              </Grid>
          
              {/* Social Links */}
              <Grid item xs={12}>
                <Typography variant="h5">Social Links</Typography>
                <Divider />
              </Grid>
          
              {/* Website */}
              <Grid item xs={12} sm={6}>
                <Controller
                  name="website"
                  control={control}
                  render={({ field }) => (
                    <Box>
                      <label>Website:</label>
                      <input
                        {...field}
                        type="url"
                        
                        style={{
                          width: "100%",
                          padding: "10px",
                          marginTop: "4px",
                          borderRadius: "6px",
                          border: "1px solid #ccc",
                        }}
                      />
                    </Box>
                  )}
                />
              </Grid>
          
              
          
              {/* Twitter */}
              <Grid item xs={12} sm={6}>
                <Controller
                  name="social_media.twitter"
                  control={control}
                  render={({ field }) => (
                    <Box>
                      <label>Twitter:</label>
                      <input
                        {...field}
                        type="url"
                        style={{
                          width: "100%",
                          padding: "10px",
                          marginTop: "4px",
                          borderRadius: "6px",
                          border: "1px solid #ccc",
                        }}
                      />
                    </Box>
                  )}
                />
              </Grid>
          
              {/* Instagram */}
              <Grid item xs={12} sm={6}>
                <Controller
                  name="social_media.instagram"
                  control={control}
                  render={({ field }) => (
                    <Box>
                      <label>Instagram:</label>
                      <input
                        {...field}
                        type="url"
                        style={{
                          width: "100%",
                          padding: "10px",
                          marginTop: "4px",
                          borderRadius: "6px",
                          border: "1px solid #ccc",
                        }}
                      />
                    </Box>
                  )}
                />
              </Grid>
          
              {/* TikTok */}
              <Grid item xs={12} sm={6}>
                <Controller
                  name="social_media.tiktok"
                  control={control}
                  render={({ field }) => (
                    <Box>
                      <label>TikTok:</label>
                      <input
                        {...field}
                        type="url"
                        style={{
                          width: "100%",
                          padding: "10px",
                          marginTop: "4px",
                          borderRadius: "6px",
                          border: "1px solid #ccc",
                        }}
                      />
                    </Box>
                  )}
                />
              </Grid>
          
              {/* Location */}
              <Grid item xs={12}>
                <Typography variant="h5">Location</Typography>
                <Divider />
              </Grid>
          
              {/* Location */}
              <Grid item xs={12} sm={6}>
                <Controller
                  name="location"
                  control={control}
                  render={({ field }) => (
                    <Box>
                      <label>Location:*</label>
                      <input
                        {...field}
                        type="text"
                        required
                        style={{
                          width: "100%",
                          padding: "10px",
                          marginTop: "4px",
                          borderRadius: "6px",
                          border: "1px solid #ccc",
                        }}
                      />
                    </Box>
                  )}
                />
              </Grid>
          
             
          
              
          
                            {/* Country */}
              <Grid item xs={12} sm={6}>
                <Controller
                  name="country"
                  control={control}
                  defaultValue="canada"
                  render={({ field }) => (
                    <Box>
                      <label>Country:*</label>
                      <Select
                        {...field}
                        fullWidth
                        variant="outlined"
                        required
                        style={{
                          marginTop: "4px",
                          borderRadius: "6px",
                          border: "1px solid #ccc",
                        }}
                      >
                        <MenuItem value="Canada">Canada</MenuItem>
                        <MenuItem value="Sri Lanka">Sri Lanka</MenuItem>
                      </Select>
                    </Box>
                  )}
                />
              </Grid>
          
              {/* Postal Code */}
              <Grid item xs={12} sm={6}>
                <Controller
                  name="postal_code"
                  control={control}
                  render={({ field }) => (
                    <Box>
                      <label>Postal Code:</label>
                      <input
                        {...field}
                        type="text"
                        style={{
                          width: "100%",
                          padding: "10px",
                          marginTop: "4px",
                          borderRadius: "6px",
                          border: "1px solid #ccc",
                        }}
                      />
                    </Box>
                  )}
                />
              </Grid>


{/* Opening Hours */}
<Grid item xs={12}>
  <Typography variant="h5">Opening Hours</Typography>
  <Divider />
</Grid>

<Grid container spacing={2} sx={{ marginTop: '2px' }}>
  <Grid item xs={12} md={6}>
    {['Monday', 'Tuesday', 'Wednesday', 'Thursday'].map((day) => (
      <Grid container spacing={2} key={day} alignItems="center" style={{ marginTop: '0px', marginLeft: '8px' }}> {/* Reduced marginTop */}
        <Grid item xs={12} sm={6} md={4}>
          <Typography style={{ marginBottom: '2px' }}>{day}</Typography> {/* Reduced margin-bottom */}
        </Grid>
        <Grid item xs={12} sm={6} md={4} style={{ marginTop: '0px', marginLeft: '-50px' }}>
          <Controller
            name={`opening_hours.${day.toLowerCase()}.open`}
            control={control}
            render={({ field }) => (
              <input
                {...field}
                type="time"
                value={field.value ?? ""}
                style={{
                  width: "100%",
                  padding: "10px",
                  marginTop: "0px", // Reduced marginTop to 0px
                  borderRadius: "6px",
                  border: "1px solid #ccc",
                }}
              />
            )}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <Controller
            name={`opening_hours.${day.toLowerCase()}.close`}
            control={control}
            render={({ field }) => (
              <input
                {...field}
                type="time"
                value={field.value ?? ""}
                style={{
                  width: "100%",
                  padding: "10px",
                  marginTop: "0px", // Reduced marginTop to 0px
                  borderRadius: "6px",
                  border: "1px solid #ccc",
                }}
              />
            )}
          />
        </Grid>
      </Grid>
    ))}
  </Grid>
  <Grid item xs={12} md={6} >
    {['Friday', 'Saturday', 'Sunday'].map((day) => (
      <Grid container spacing={2} key={day} alignItems="center" style={{ marginTop: '0px', marginLeft: '20px' }}> {/* Reduced marginTop */}
        <Grid item xs={12} sm={6} md={4} >
          <Typography style={{ marginBottom: '2px' }}>{day}</Typography> {/* Reduced margin-bottom */}
        </Grid>
        <Grid item xs={12} sm={6} md={4} style={{ marginTop: '0px', marginLeft: '-50px' }}>
          <Controller
            name={`opening_hours.${day.toLowerCase()}.open`}
            control={control}
            render={({ field }) => (
              <input
                {...field}
                type="time"
                value={field.value ?? ""}
                style={{
                  width: "100%",
                  padding: "10px",
                  marginTop: "0px", // Reduced marginTop to 0px
                  borderRadius: "6px",
                  border: "1px solid #ccc",
                }}
              />
            )}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <Controller
            name={`opening_hours.${day.toLowerCase()}.close`}
            control={control}
            render={({ field }) => (
              <input
                {...field}
                type="time"
                value={field.value ?? ""}
                style={{
                  width: "100%",
                  padding: "10px",
                  marginTop: "0px", // Reduced marginTop to 0px
                  borderRadius: "6px",
                  border: "1px solid #ccc",
                }}
              />
            )}
          />
        </Grid>
      </Grid>
    ))}
  </Grid>
</Grid>

              
          {/* Gallery Photos */}
          <Grid item xs={12} sx={{ marginTop: '10px' }}>
  <Typography variant="h5">Restaurant Gallery</Typography>
  <Divider />
</Grid>
        <Grid item xs={12}>
          <label>Gallery Photos:</label>
          <Box
            {...getRootPropsGallery()}
            style={{
              padding: "25px",
              border: "2px dashed #ccc", 
              textAlign: "center",
              marginTop: "10px",
              cursor: "pointer",
              position: "relative",
              minHeight: "200px"
            }}
          >
            <input {...getInputPropsGallery()} multiple />
            {isDragActiveGallery ? (
              <p>Drop the photos here...</p>
            ) : uploadedImages.length > 0 ? (
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
                {uploadedImages.map((image, index) => (
                  <Box 
                    key={index} 
                    sx={{
                      position: 'relative',
                      width: 150,
                      height: 150,
                      border: '1px solid #eee',
                      borderRadius: '4px',
                      overflow: 'hidden'
                    }}
                  >
                    <img
                      src={URL.createObjectURL(image)}
                      alt={`Gallery ${index}`}
                      style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover'
                      }}
                    />
                    <IconButton
                      onClick={(e) => {
                        e.stopPropagation();
                        setUploadedImages((prev) => prev.filter((_, i) => i !== index));
                      }}
                      style={{
                        position: "absolute",
                        top: "5px",
                        right: "5px",
                        backgroundColor: "rgba(255,255,255,0.8)",
                        padding: "4px",
                      }}
                      size="small"
                    >
                      <DeleteOutline />
                    </IconButton>
                  </Box>
                ))}
              </Box>
            ) : (
              <p>Drag & drop or click to upload gallery photos</p>
            )}
          </Box>
          {uploadedImages.length > 0 && (
            <Typography variant="caption" color="textSecondary" style={{ marginTop: 8 }}>
              {uploadedImages.length} photo{uploadedImages.length !== 1 ? 's' : ''} selected
            </Typography>
          )}
        </Grid>
        </Grid>
          </TabPanel>

          {/* Facilities Tab */}
          <TabPanel value={activeTab} index={1}>
            <Grid container spacing={3} >
              {/* Food and Dining */}
              <Grid item xs={12}>
                <Controller
                  name={`facilities.categories.0.facilities`}
                  control={control}
                  render={({ field }) => (
                    <Box style={{ padding: '16px', borderRadius: 8, backgroundColor: '#f4f4f4' }}>
                      <Typography variant="h6" style={{ fontWeight: 'bold' }}>Food & Dining:</Typography>
                      <Grid container spacing={2} style={{ marginTop: 8 }}>
                        {[
                          { label: 'Patio', value: 'patio' },
                          { label: 'Buffet', value: 'buffet' },
                          { label: 'Vegan food', value: 'veganFood' },
                          { label: 'Halal foods', value: 'halalFoods' },
                          { label: 'Reservations', value: 'reservations' },
                          { label: 'Nuts-free foods', value: 'nutsFreeFoods' },
                          { label: 'Gluten-free foods', value: 'glutenFreeFoods' },
                          { label: 'Birthday discounts', value: 'birthdayDiscounts' },
                          { label: 'Credit card payment', value: 'creditCardPayment' },
                          { label: 'Birthday celebration', value: 'birthdayCelebration' },
                        ].map((item, index) => (
                          <Grid item xs={12} sm={6} md={4} key={index}>
                            <label style={{ display: 'flex', alignItems: 'center' }}>
                              <Checkbox
                                {...field}
                                value={item.value}
                                checked={field.value?.[item.value] ?? false}
                                onChange={(e) => {
                                  const updatedFacilities = {
                                    ...field.value,
                                    [item.value]: e.target.checked
                                  };
                                  field.onChange(updatedFacilities);
                                }}
                                style={{ marginRight: 4}}
                              />
                              {item.label}
                            </label>
                          </Grid>
                        ))}
                      </Grid>
                    </Box>
                  )}
                />
                
              </Grid>
          
              {/* Family */}
              <Grid item xs={12}>
                <Controller
                   name={`facilities.categories.1.facilities`}
                  control={control}
                  render={({ field }) => (
                    <Box style={{ padding: '16px', borderRadius: 8, backgroundColor: '#f4f4f4' }}>
                      <Typography variant="h6" style={{ fontWeight: 'bold' }}>Family:</Typography>
                      <Grid container spacing={2} style={{ marginTop: 8 }}>
                        {[
                          { label: 'Family rooms', value: 'familyRooms' },
                          { label: 'Kids play area', value: 'kidsPlayArea' },
                          { label: 'Crayons for kids', value: 'crayonsForKids' },
                          { label: 'Diaper change room', value: 'diaperChangeRoom' },
                          { label: 'Highchair for kids', value: 'highchairForKids' },
                        ].map((item, index) => (
                          <Grid item xs={12} sm={6} md={4} key={index}>
                            <label style={{ display: 'flex', alignItems: 'center' }}>
                              <Checkbox
                                {...field}
                                value={item.value}
                                checked={field.value?.[item.value] ?? false}
                                onChange={(e) => {
                                  const updatedFacilities = {
                                    ...field.value,
                                    [item.value]: e.target.checked
                                  };
                                  field.onChange(updatedFacilities);
                                }}
                                style={{ marginRight: 4}}
                              />
                              {item.label}  
                            </label>
                               
                          </Grid>
                        ))}
                      </Grid>
                    </Box>
                  )}
                />
              </Grid>
          
              {/* Entertainment */}
              <Grid item xs={12}>
                <Controller
                   name={`facilities.categories.2.facilities`}
                  control={control}
                  render={({ field }) => (
                    <Box style={{ padding: '16px', borderRadius: 8, backgroundColor: '#f4f4f4' }}>
                      <Typography variant="h6" style={{ fontWeight: 'bold' }}>Entertainment:</Typography>
                      <Grid container spacing={2} style={{ marginTop: 8 }}>
                        {[
                          { label: 'DJ', value: 'dj' },
                          { label: 'TV', value: 'tv' },
                          { label: 'Wifi', value: 'wifi' },
                          { label: 'Music', value: 'music' },
                          { label: 'Live band', value: 'liveBand' },
                          { label: 'Front desk', value: 'frontDesk' },
                          { label: 'Pool table', value: 'poolTable' },
                          { label: 'Free parking', value: 'freeParking' },
                          { label: 'Meeting area', value: 'MeetingArea' },
                          { label: 'Conference room', value: 'conferenceRoom' },
                        ].map((item, index) => (
                          <Grid item xs={12} sm={6} md={4} key={index}>
                            <label style={{ display: 'flex', alignItems: 'center' }}>
                              <Checkbox
                               {...field}
                               value={item.value}
                               checked={field.value?.[item.value] ?? false}
                               onChange={(e) => {
                                const updatedFacilities = {
                                  ...field.value,
                                  [item.value]: e.target.checked
                                };
                                field.onChange(updatedFacilities);
                              }}
                               style={{ marginRight: 4 }}
                              />
                              
                              {item.label}
                            </label>
                          </Grid>
                        ))}
                      </Grid>
                    </Box>
                  )}
                />
              </Grid>
            </Grid>
          </TabPanel>

          <DialogActions>
            <Button onClick={onClose}>Cancel</Button>
            <Button type="submit" color="primary" sx={{backgroundColor: '#1976d2', color: '#fff', '&:hover': { backgroundColor: '#1565c0' }}}>
              Create Restaurant
            </Button>
          </DialogActions>
        </form>
      </DialogContent>
    </Dialog>
    {submittedRestaurant && (
      <RestaurantDetailsViewModal
        open={showDetails}
        onClose={() => setShowDetails(false)}
        restaurant={submittedRestaurant}
      />
    )}
    </>
  );
};

export default AddRestaurant;
