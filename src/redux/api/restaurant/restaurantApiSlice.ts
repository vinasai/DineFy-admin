import { map } from "lodash";
import { apiSlice } from "../apiSlice";
import { supabase } from "@/api/client";



interface PlaceDetails {
  name: string;
  editorial_summary: string;
  rating: number;
  contact_number: string;
  opening_hours: {
    periods: Array<{
      close: { day: number; time: string };
      open: { day: number; time: string };
    }>;
    weekday_text: string[];
  };
  location: string;
  country: string;
  postal_code: string;
  thumbnail_photo: string;
  website: string;
  gallery: string[];
}





interface PlacePhoto {
  photo_reference: string;
  photo_url: string;
}

interface PlaceOpeningHours {
  open_now: boolean;
  periods: {
    close: { day: number; time: string };
    open: { day: number; time: string };
  }[];
  weekday_text: string[];
}

interface PlaceReview {
  author_name: string;
  rating: number;
  text: string;
  time: number;
  relative_time_description: string;
}


// Helper Functions


const extractAddressComponents = (adrAddress: string): { country: string; postalCode: string } => {
  const countryMatch = adrAddress.match(/<span class="country-name">(.*?)<\/span>/);
  const postalMatch = adrAddress.match(/<span class="postal-code">(.*?)<\/span>/);
  
  return {
    country: countryMatch ? countryMatch[1] : '',
    postalCode: postalMatch ? postalMatch[1] : ''
  };
};
const extractHours = (weekdayText: string): { open: string; close: string } => {
  // Handle 24 hours case
  if (weekdayText.includes('Open 24 hours')) {
    return {
      open: '00:00',
      close: '23:59'
    };
  }

  // Handle closed case
  if (weekdayText.includes('Closed')) {
    return {
      open: '',
      close: ''
    };
  }

  // Extract times with optional AM/PM
  const timeMatch = weekdayText.match(/(\d{1,2}):(\d{2})\s*(AM|PM)?\s*[–-]\s*(\d{1,2}):(\d{2})\s*(AM|PM)?/);
  
  if (!timeMatch) {
    return { open: '', close: '' };
  }

  const formatTime = (hours: string, minutes: string, meridiem?: string): string => {
    let hour = parseInt(hours);
    
    // Convert to 24-hour format
    if (meridiem === 'PM' && hour !== 12) hour += 12;
    if (meridiem === 'AM' && hour === 12) hour = 0;

    return `${hour.toString().padStart(2, '0')}:${minutes}`;
  };

  const [, startHour, startMin, startMeridiem, endHour, endMin, endMeridiem] = timeMatch;

  return {
    open: formatTime(startHour, startMin, startMeridiem),
    close: formatTime(endHour, endMin, endMeridiem)
  };
};

const uploadImage = async (file: File, bucket: string, path: string) => {
  const { data, error } = await supabase.storage
    .from(bucket)
    .upload(path, file);
    
  if (error) throw error;
  
  const { data: urlData } = await supabase.storage
    .from(bucket)
    .getPublicUrl(path);
    
  return urlData.publicUrl;
};

const generateQrCode = async (restaurantId: string, restaurantName: string) => {

  try {
    const qrGeneratorCodeUrl = `https://quickchart.io/qr?text=https://dinefy.ca/restaurant/${encodeURIComponent(restaurantId)}&size=800`;
    
    // Fetch the QR code image
    const response = await fetch(qrGeneratorCodeUrl);
    const blob = await response.blob();
    const qrImage = new File([blob], `${restaurantId}.png`, { type: 'image/png' });

    // Define the file path in Supabase storage
    const filePath = `${restaurantName + Date.now()}/${restaurantId}.png`;

    // Upload the QR code image to Supabase storage
    const { data, error } = await supabase.storage.from('restaurant_qr').upload(filePath, qrImage);

    const {data : qrCodeUrlSupabase} = await supabase.storage.from('restaurant_qr').getPublicUrl(filePath);
    if (error) {
      console.error("Error uploading file:", error);
    } else {

      
     
      return qrCodeUrlSupabase.publicUrl;

    }
  } catch (error) {
    console.error("Error generating QR code:", error);
  }
 return null;
};

const RestaurantApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getRestaurantApi: builder.query({
      async queryFn(_arg, _api, _extraOptions, _baseQuery) {
        const { data, error } = await supabase
          .from("restaurant")
          .select("*")
          .is("owner", null);
    
        if (error) {
          return {
            error: {
              status: 500,
              statusText: "Error fetching restaurants",
              data: error.message,
            },
          };
        }   
        return { data };
      },
      
    }),

    getAllRestaurantApi: builder.query({
      async queryFn(_arg, _api, _extraOptions, _baseQuery) {
        const { data, error } = await supabase
          .from("restaurant")
          .select("*")
          .order("created_at", { ascending: false });
    
        if (error) {
          return {
            error: {
              status: 500,
              statusText: "Error fetching restaurants",
              data: error.message,
            },
          };
        }

        return { data };
      },
      
    }),


    createRestaurantApi: builder.mutation({
      async queryFn(newRestaurant, _api, _extraOptions, _baseQuery) {

        interface SocialMedia {
          twitter?: string;
          instagram?: string;
          tiktok?: string;
        }
        
        interface OpeningHours {
          monday: { open: string; close: string };
          tuesday: { open: string; close: string };
          wednesday: { open: string; close: string };
          thursday: { open: string; close: string };
          friday: { open: string; close: string };
          saturday: { open: string; close: string };
          sunday: { open: string; close: string };
        }
        
        interface FacilityCategory {
          icon: string;
          name: string;
          facilities: {
            [key: string]: boolean;
          };
        }
        
        interface RestaurantInput {
          name: string;
          about?: string;
          email?: string;
          avg_budget?: string;
          restaurant_category?: string;
          cuisine_type?: string;
          contact_number?: string;
          location?: string;
          country?: string;
          postal_code?: string;
          website?: string;
          social_media?: SocialMedia;
          opening_hours?: OpeningHours;
          facilities?: {
            categories: FacilityCategory[];
          };
          thumbnail_photo?: {
            path: string;
          };
          gallery?: Array<{ path: string }>;
        }
        
        interface RestaurantTableData {
          name: string | null;
          about: string | null;
          restaurant_email: string | null;
          avg_budget: string | null;
          restaurant_category: string | null;
          cuisine_type: string | null;
          contact_number: string | null;
          location: string | null;
          country: string | null;
          postal_code: string | null;
          website: string | null;
          social_media: SocialMedia;
          opening_hours: OpeningHours;
          facility: {
            categories: FacilityCategory[];
          };
          thumbnail_photo: string | null;
          gallery: string[];
          google_api_fetched: boolean;
        }
        
        const mapRestaurantDataToTable = (
          newRestaurant: RestaurantInput, 
          placeDetails?: PlaceDetails | null
        ): RestaurantTableData => {
          // If we have place details, map the opening hours
          const openingHours = placeDetails?.opening_hours ? {
            monday: extractHours(placeDetails.opening_hours.weekday_text[0]),
            tuesday: extractHours(placeDetails.opening_hours.weekday_text[1]),
            wednesday: extractHours(placeDetails.opening_hours.weekday_text[2]),
            thursday: extractHours(placeDetails.opening_hours.weekday_text[3]),
            friday: extractHours(placeDetails.opening_hours.weekday_text[4]),
            saturday: extractHours(placeDetails.opening_hours.weekday_text[5]),
            sunday: extractHours(placeDetails.opening_hours.weekday_text[6])
          } : newRestaurant.opening_hours;
        
          return {
            name: placeDetails?.name || newRestaurant.name || null,
            about: placeDetails?.editorial_summary || newRestaurant.about || null,
            restaurant_email: newRestaurant.email || null,
            avg_budget: newRestaurant.avg_budget || null,
            restaurant_category: newRestaurant.restaurant_category || "Restaurant",
            cuisine_type: newRestaurant.cuisine_type || null,
            contact_number: placeDetails?.contact_number || newRestaurant.contact_number || null,
            location: placeDetails?.location || newRestaurant.location || null,
            country: placeDetails?.country || newRestaurant.country || null,
            postal_code: placeDetails?.postal_code || newRestaurant.postal_code || null,
            website: placeDetails?.website || newRestaurant.website || null,
            social_media: newRestaurant.social_media || {},
            opening_hours: openingHours || {
              monday: { open: '', close: '' },
              tuesday: { open: '', close: '' },
              wednesday: { open: '', close: '' },
              thursday: { open: '', close: '' },
              friday: { open: '', close: '' },
              saturday: { open: '', close: '' },
              sunday: { open: '', close: '' }
            },
            facility: newRestaurant.facilities || { categories: [] },
            thumbnail_photo: placeDetails?.thumbnail_photo || newRestaurant.thumbnail_photo?.path || null,
            gallery: placeDetails?.gallery || newRestaurant.gallery?.map(item => item.path) || [],
            google_api_fetched: placeDetails ? true : false
          };
        };

        

        try {
          // 1. Fetch place details if place_id exists
          let placeDetails = null;
          if (newRestaurant.place_id) {

            

            
            const response = await  fetch(`https://gutghjvgdvzmklwubsuj.supabase.co/functions/v1/get-place-details?place_id=${newRestaurant.place_id}`);
            const data = await response.json();

            

            interface GooglePlaceResult {
              name: string;
              rating: number;
              formatted_phone_number: string;
              opening_hours: PlaceOpeningHours;
              formatted_address: string;
              photos: PlacePhoto[];
              website?: string;
            }

            placeDetails = {
              name: (data.result as GooglePlaceResult).name,
              editorial_summary: (data.result as GooglePlaceResult).name,
              rating: (data.result as GooglePlaceResult).rating,
              contact_number: (data.result as GooglePlaceResult).formatted_phone_number,
              opening_hours: (data.result as GooglePlaceResult).opening_hours,
              location: (data.result as GooglePlaceResult).formatted_address,
              postal_code: extractAddressComponents(data.result.adr_address).postalCode,
              country: extractAddressComponents(data.result.adr_address).country,
              thumbnail_photo: (data.result as GooglePlaceResult).photos[0].photo_url,
              website: (data.result as GooglePlaceResult).website,
              gallery: (data.result as GooglePlaceResult).photos.map(photo => photo.photo_url)
            } as PlaceDetails;
          

          
            //placeDetails = await fetchPlaceDetails(newRestaurant.place_id);
          }

          // 2. Map restaurant data
          const mappedData = mapRestaurantDataToTable(newRestaurant, placeDetails);


          // 3. Handle thumbnail upload
          if (newRestaurant.thumbnail_photo instanceof File) {
            const filePath = `${newRestaurant.name}_${Date.now()}.${newRestaurant.thumbnail_photo.name.split('.').pop()}`;
            mappedData.thumbnail_photo = await uploadImage(
              newRestaurant.thumbnail_photo,
              'restaurants_thumbnails',
              filePath
            );
          }

          // 4. Handle gallery uploads
          if (Array.isArray(newRestaurant.gallery) && newRestaurant.gallery.length > 0) {
            const folderName = `${newRestaurant.name.toLowerCase().replace(/[^a-z0-9]/g, '_')}_${Date.now()}`;
            interface GalleryFile extends File {
              name: string;
            }

            interface GalleryUploadResult {
              gallery: string[];
            }

                  mappedData.gallery = await Promise.all<string>(
                    newRestaurant.gallery.map((file: GalleryFile, index: number): Promise<string> => {
                    const filePath: string = `${folderName}/${index}_${Date.now()}.${file.name.split('.').pop()}`;
                    return uploadImage(file, 'restaurants_gallery', filePath);
                    })
                  );
          }

          // 5. Insert restaurant data
          const { data: insertedData, error: insertError } = await supabase
            .from("restaurant")
            .insert([mappedData])
            .select('id, name')
            .single();

          if (insertError) throw insertError;

          // 6. Generate and upload QR code
          const qrUrl = await generateQrCode(insertedData.id, insertedData.name);
          if (qrUrl) {
            const { data: updatedData, error: updateError } = await supabase
              .from('restaurant')
              .update({ qr_code: qrUrl })
              .eq('id', insertedData.id)
              .select('*')
              .single();

            if (updateError) throw updateError;

            return { data: updatedData };
          }

          return { data: insertedData };

        } catch (error: any) {
          return {
            error: {
              status: 500,
              statusText: "Failed to create restaurant",
              data: error.message
            }
          };
        }
      }
      
    }),


    updateRestaurantApi: builder.mutation({
      // Update existing data in the "Restaurant" table
      async queryFn(updatedRestaurant, _api, _extraOptions, _baseQuery) {


        interface RestaurantInput {
          name: string;
          about?: string;
          email?: string;
          avg_budget?: number;
          restaurant_category?: string;
          cuisine_type?: string;
          contact_number?: string;
          location?: string;
          country?: string;
          postal_code?: string;
          website?: string;
          social_media?: Record<string, string>;
          opening_hours?: Record<string, Record<string, string>>;
          facilities?: Record<string, boolean>;
          thumbnail_photo?: File | string | null;
          gallery?: (File | string)[];
        }

        interface RestaurantTableData {
          name: string;
          about: string | null;
          restaurant_email: string | null;
          avg_budget: number | null;
          restaurant_category: string | null;
          cuisine_type: string | null;
          contact_number: string | null;
          location: string | null;
          country: string | null;
          postal_code: string | null;
          website: string | null;
          social_media: Record<string, string>;
          opening_hours: Record<string, Record<string, string>>;
          facility: Record<string, boolean>;
          thumbnail_photo: string | null;
          gallery: string[];
        }

        const mapRestaurantDataToTable = (updatedRestaurant: RestaurantInput): RestaurantTableData => {
          return {
            name: updatedRestaurant.name,
            about: updatedRestaurant.about || null,
            restaurant_email: updatedRestaurant.email || null,
            avg_budget: updatedRestaurant.avg_budget || null,
            restaurant_category: updatedRestaurant.restaurant_category || null,
            cuisine_type: updatedRestaurant.cuisine_type || null,
            contact_number: updatedRestaurant.contact_number || null,
            location: updatedRestaurant.location || null,
            country: updatedRestaurant.country || null,
            postal_code: updatedRestaurant.postal_code || null,
            website: updatedRestaurant.website || null,
            social_media: updatedRestaurant.social_media || {},
            opening_hours: updatedRestaurant.opening_hours || {},
            facility: updatedRestaurant.facilities || {},
            thumbnail_photo: updatedRestaurant.thumbnail_photo as string || null,
            gallery: Array.isArray(updatedRestaurant.gallery) 
              ? updatedRestaurant.gallery.filter((item): item is string => typeof item === 'string')
              : [],
          };
        };
    
        const mappedRestaurantData = mapRestaurantDataToTable(updatedRestaurant);
    
        // If there's a new thumbnail photo, upload it
        if (updatedRestaurant.thumbnail_photo instanceof File) {

          
          const file = updatedRestaurant.thumbnail_photo;
          const filePath = updatedRestaurant.name + Date.now() + "." + file.name.split('.').pop();
    
          const { data: Image, error: imageUploadError } = await supabase.storage.from('restaurants_thumbnails').upload(filePath, file);
          if (imageUploadError) {
            console.error("Error uploading file:", imageUploadError);
            return {
              error: {
                status: 500,
                statusText: "Error uploading file",
                data: imageUploadError.message,
              },
            };
          }

          
    
          const { data: ImageUrl } = await supabase.storage.from('restaurants_thumbnails').getPublicUrl(filePath);
          mappedRestaurantData.thumbnail_photo = ImageUrl.publicUrl;
        }

        // In updateRestaurantApi mutation

        
        if (updatedRestaurant.gallery?.length > 0) {
          const newGalleryUrls: string[] = [];
          const existingUrls: string[] = [];

          // Separate new files from existing URLs
          for (const item of updatedRestaurant.gallery) {
            if (item instanceof File) {
              // Create clean folder name
              const folderName = updatedRestaurant.name.toLowerCase().replace(/[^a-z0-9]/g, '_');
              const extension = item.name.split('.').pop();
              const filePath = `${folderName}/gallery/${Date.now()}_${Math.random().toString(36).substring(7)}.${extension}`;

              // Upload new file
              const { data: Image, error: imageUploadError } = await supabase.storage
                .from('restaurants_gallery')
                .upload(filePath, item);

              if (imageUploadError) {
                console.error("Error uploading gallery image:", imageUploadError);
                continue;
              }

              // Get public URL
              const { data: ImageUrl } = await supabase.storage
                .from('restaurants_gallery')
                .getPublicUrl(filePath);

              newGalleryUrls.push(ImageUrl.publicUrl);
            } else if (typeof item === 'string') {
              existingUrls.push(item);
            }
          }

          // Combine existing and new URLs
          mappedRestaurantData.gallery = [...existingUrls, ...newGalleryUrls];
        }
        
       
        const { data, error } = await supabase
          .from("restaurant")
          .update(mappedRestaurantData)
          .eq("id", updatedRestaurant.id);
    
        if (error) {
          return {
            error: {
              status: 500,
              statusText: "Error while updating entry",
              data: error.message,
            },
          };
        }
    
        return { data };
      },
    }),



    deleteRestaurantApi: builder.mutation({
      // Delete a row in the "Restaurant" table by ID
      async queryFn(id, _api, _extraOptions, _baseQuery) {
        const { data, error } = await supabase
          .from("restaurant")
          .delete()
          .eq("id", id);

        if (error) {
          return {
            error: {
              status: 500,
              statusText: "Error while deleting entry",
              data: error.message,
            },
          };
        }

        return { data };
      },
    }),
  }),
  overrideExisting: false,
});

/*
uploadRestaurantThumbnail: builder.mutation({
  // Update existing data in the "Restaurant" table
  async queryFn(arg, _api, _extraOptions, _baseQuery) {
    

    return { data };
  },
}),
*/
export const {
  useGetRestaurantApiQuery,
  useCreateRestaurantApiMutation,
  useUpdateRestaurantApiMutation,
  useDeleteRestaurantApiMutation,
  useGetAllRestaurantApiQuery,
} = RestaurantApi;
export default RestaurantApi.reducer;


