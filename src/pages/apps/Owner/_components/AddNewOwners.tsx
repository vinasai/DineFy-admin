import React, { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
} from "@mui/material";
import { useForm } from "react-hook-form";
import Step1OwnerInfo from "../steps/Step1OwnerInfo";
import Step2RestaurantInfo from "../steps/Step2RestaurantInfo";
import Step3GenerateCredentials from "../steps/Step3GenerateCredentials";
import Step4ReviewSubmit from "../steps/Step4ReviewSubmit";
import { useCreateOwnerApiMutation } from "@/redux/api/owner/ownerApi";

interface AddNewOwnersProps {
  onClose: () => void;
  refetch: () => void; // To trigger data refresh in the parent component
}

interface FormData {
  name: string;
  email: string;
  country: string;
  address: string;
  contact: string;
  restaurants: {
    name: string;
    location: string;
  }[];
}

const AddNewOwners: React.FC<AddNewOwnersProps> = ({ onClose, refetch }) => {
  const {
    handleSubmit,
    formState: { errors },
    setValue,
    register,
    watch,
    trigger,
  } = useForm<FormData>();

  const [step, setStep] = useState(1);
  const [restaurants, setRestaurants] = useState([{ name: "", location: "" }]);

  const ownerData = watch(["name", "email", "country", "contact", "address"]);
  const restaurantData = watch("restaurants");

  const [createOwner] = useCreateOwnerApiMutation();

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

  const handlePreviousStep = () => {
    setStep((prev) => prev - 1);
  };

  const onSubmit = async (data: FormData) => {
    console.log("Form Data:", data);  // Log the data being submitted
    try {
      const newData = {
        name: data.name,
        email: data.email,
        country: data.country,
        location: data.address,
        contact_no: data.contact,
    
        restaurant_details: JSON.stringify(data.restaurants),
        active: true,
      };
  
      console.log("Payload being sent to API:", newData);
  
      const response = await createOwner(newData).unwrap();
      console.log("API Response:", response);
  
      refetch();  // Refresh parent table
      onClose();  // Close modal
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
          ? "Generate Credentials"
          : "Review & Submit"}
      </DialogTitle>

      <DialogContent className="p-6 space-y-6 bg-gray-50">
        {step === 1 && <Step1OwnerInfo register={register} errors={errors} />}
        {step === 2 && (
          <Step2RestaurantInfo
            restaurants={restaurants}
            setRestaurants={setRestaurants}
            setValue={setValue}
          />
        )}
        {step === 3 && <Step3GenerateCredentials name={ownerData[0] || ""} />}
        {step === 4 && (
          <Step4ReviewSubmit
            ownerData={ownerData}
            restaurantsData={restaurantData}
          />
        )}
      </DialogContent>

      <DialogActions className="px-6 py-4 bg-gray-100 border-t border-gray-200">
        <Button onClick={onClose} variant="outlined" color="secondary">
          Close
        </Button>
        {step > 1 && (
          <Button
            onClick={handlePreviousStep}
            variant="outlined"
            color="primary"
          >
            Back
          </Button>
        )}
        {step < 4 ? (
          <Button onClick={handleNextStep} variant="contained" color="primary">
            Next
          </Button>
        ) : (
          <Button
            onClick={handleSubmit(onSubmit)}
            variant="contained"
            color="primary"
          >
            Submit
          </Button>
        )}
      </DialogActions>
    </Dialog>
  );
};

export default AddNewOwners;