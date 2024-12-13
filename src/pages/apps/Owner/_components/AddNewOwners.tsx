import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
} from "@mui/material";
import { useForm, UseFormSetValue } from "react-hook-form";
import Step1OwnerInfo from "../steps/Step1OwnerInfo";
import Step2RestaurantInfo from "../steps/Step2RestaurantInfo";
import Step3GenerateCredentials from "../steps/Step3GenerateCredentials";
import Step4ReviewSubmit from "../steps/Step4ReviewSubmit";
import { 
  useUpdateOwnerProfileApiMutation, 
  useUpdateOwnerApiMutation 
} from "@/redux/api/owner/ownerApi";
import { useCreateSignUpApiMutation } from "@/redux/api/signup/signUpApiSlice";

interface AddNewOwnersProps {
  onClose: () => void;
  refetch: () => void;
}

interface Restaurant {
  id: string;
  name: string;
  location: string;
}

interface FormData {
  name: string;
  email: string;
  country: string;
  address: string;
  contact: string;
  restaurants: Restaurant[];
}

interface Credentials {
  email: string;
  password: string;
}

interface Step2Props extends Pick<{
  restaurants: Restaurant[];
  setRestaurants: React.Dispatch<React.SetStateAction<Restaurant[]>>;
  setValue: UseFormSetValue<{
    name: string;
    email: string;
    country: string;
    address: string;
    contact: string;
    restaurants: Restaurant[];
  }>;
}, 'restaurants' | 'setRestaurants' | 'setValue'> {}

interface Step4Props {
  ownerData: string[];
  restaurantsData: Restaurant[];
  credentials: { email: string; password: string; }[];
}

const AddNewOwners: React.FC<AddNewOwnersProps> = ({ onClose, refetch }) => {
  const [createSignUpApi] = useCreateSignUpApiMutation();
  const [updateOwnerProfile] = useUpdateOwnerProfileApiMutation();
  const [updateOwner] = useUpdateOwnerApiMutation();
  
  const { 
    handleSubmit, 
    formState: { errors }, 
    setValue, 
    register, 
    watch, 
    trigger 
  } = useForm<FormData>({
    defaultValues: {
      restaurants: [{ id: "", name: "", location: "" }]
    }
  });

  const [step, setStep] = useState(1);
  const [restaurants, setRestaurants] = useState<Restaurant[]>([{
    id: "",
    name: "", 
    location: ""
  }]);
  
  const ownerData = watch(["name", "email", "country", "contact", "address"]);
  const restaurantData = watch("restaurants") || [];
  const [credentials, setCredentials] = useState<Credentials[]>([]);

  useEffect(() => {
    setValue('restaurants', restaurants);
  }, [restaurants, setValue]);

  const handleNextStep = async () => {
    const isValid = await trigger(
      step === 1 
        ? ["name", "email", "contact", "country", "address"] 
        : step === 2 
          ? "restaurants" 
          : []
    );
    if (isValid) setStep((prev) => prev + 1);
  };

  const handlePreviousStep = () => setStep((prev) => prev - 1);

  const onSubmit = async (data: FormData) => {
    try {
      if (!credentials[0]) {
        throw new Error("Credentials not generated");
      }

      const response_ = await createSignUpApi({ 
        email: credentials[0].email, 
        password: credentials[0].password 
      }).unwrap();

      if (!response_?.user) {
        throw new Error("User data is missing in the response");
      }

      const profileData = { 
        id: response_.user.id, 
        name: data.name, 
        email: data.email, 
        country: data.country 
      };
      
      await updateOwnerProfile(profileData).unwrap();

      const newData = {
        id: response_.user.id,
        name: data.name,
        email: data.email,
        country: data.country,
        address: data.address,
        contact_no: data.contact,
        restaurant_details: data.restaurants,
        active: true,
        plan: "Free",
        password: credentials[0].password,
      };

      await updateOwner(newData).unwrap();
      refetch();
      setStep((prev) => prev + 1);
    } catch (error: any) {
      console.error("Create Owner API Error:", error);
      alert(`Failed to create owner: ${error.data || error.statusText}`);
    }
  };

  return (
    <Dialog open={true} onClose={onClose} fullWidth maxWidth="md">
      <DialogTitle className="text-xl font-semibold pb-4 border-b border-gray-200">
        {step === 1 
          ? "Add Owner Information" 
          : step === 2 
            ? "Add Restaurant Information" 
            : step === 3 
              ? "Owner Login Credentials" 
              : "Review"
        }
      </DialogTitle>

      <DialogContent className="p-6 space-y-6 bg-gray-50">
        {step === 1 && (
          <Step1OwnerInfo 
            register={register} 
            errors={errors} 
          />
        )}
        {step === 2 && (
          <Step2RestaurantInfo 
            restaurants={restaurants} 
            setRestaurants={setRestaurants}
            setValue={setValue}
          />
        )}
        {step === 3 && (
          <Step3GenerateCredentials 
            email={ownerData[1] || ""}
            setCredentials={setCredentials}
          />
        )}
        {step === 4 && (
          <Step4ReviewSubmit 
            ownerData={ownerData}
            restaurantsData={restaurantData}
            credentials={credentials}
          />
        )}
      </DialogContent>

      <DialogActions className="px-6 py-4 bg-gray-100 border-t border-gray-200">
        <Button 
          onClick={onClose} 
          variant="outlined" 
          color="secondary"
        >
          Close
        </Button>

        {step > 1 && step < 4 && (
          <Button 
            onClick={handlePreviousStep} 
            variant="outlined" 
            color="primary"
          >
            Back
          </Button>
        )}
        
        {step === 1 && (
          <Button 
            onClick={handleNextStep} 
            variant="contained" 
            color="primary"
          >
            Next
          </Button>
        )}

        {step === 2 && (
          <Button
            onClick={handleNextStep}
            variant="contained"
            color="primary"
            disabled={!restaurantData[0]?.name} 
          >
            Next
          </Button>
        )}

        {step === 3 && credentials.length > 0 && (
          <Button 
            onClick={handleSubmit(onSubmit)} 
            variant="contained" 
            color="primary"
          >
            Create Owner Account
          </Button>
        )}
      </DialogActions>
    </Dialog>
  );
};

export default AddNewOwners;