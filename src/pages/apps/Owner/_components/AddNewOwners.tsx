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
import Step4ReviewSubmit from "../steps/Step4ReviewSubmit";
import Step3GenerateCredentials from "../steps/Step3GenerateCredentials";

interface AddNewOwnersProps {
  onClose: () => void;
}

interface FormData {
  name: string;
  email: string;
  country: string;
  location: string;
  restaurant: {
    name: string;
    location: string;
  }[];
}

const AddNewOwners: React.FC<AddNewOwnersProps> = ({ onClose }) => {
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

  const ownerData = watch(["name", "email", "country", "location"]);
  const restaurantData = watch("restaurant");

  const handleNextStep = async () => {
    const isValid = await trigger(
      step === 1
        ? ["name", "email", "country", "location"]
        : step === 2
        ? "restaurant"
        : []
    );
    if (isValid) setStep((prev) => prev + 1);
  };

  const handlePreviousStep = () => {
    setStep((prev) => prev - 1);
  };

  const onSubmit = async (data: FormData) => {
    console.log("Submitting data:", data);
    onClose(); // Close dialog after submission
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
            restaurantData={restaurantData}
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
