import React from "react";

interface Step1OwnerInfoProps {
  register: any;
  errors: any;
}

const Step1OwnerInfo: React.FC<Step1OwnerInfoProps> = ({
  register,
  errors,
}) => {
  return (
    <div className="space-y-4">
      <div>
        <label className="block mb-1 font-semibold text-gray-700">Name</label>
        <input
          {...register("name", { required: "Name is required" })}
          className="w-full border border-gray-300 p-3 rounded focus:ring-2 focus:ring-blue-500"
          placeholder="Enter owner's name"
        />
        {errors.name && (
          <p className="text-red-500 text-sm">{errors.name.message}</p>
        )}
      </div>

      <div>
        <label className="block mb-1 font-semibold text-gray-700">Email</label>
        <input
          {...register("email", {
            required: "Email is required",
            pattern: {
              value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
              message: "Enter a valid email",
            },
          })}
          className="w-full border border-gray-300 p-3 rounded focus:ring-2 focus:ring-blue-500"
          placeholder="Enter owner's email"
        />
        {errors.email && (
          <p className="text-red-500 text-sm">{errors.email.message}</p>
        )}
      </div>

      <div>
        <label className="block mb-1 font-semibold text-gray-700">
          Country
        </label>
        <input
          {...register("country", { required: "Country is required" })}
          className="w-full border border-gray-300 p-3 rounded focus:ring-2 focus:ring-blue-500"
          placeholder="Enter owner's country"
        />
        {errors.country && (
          <p className="text-red-500 text-sm">{errors.country.message}</p>
        )}
      </div>

      <div>
        <label className="block mb-1 font-semibold text-gray-700">
          Address
        </label>
        <input
          {...register("location", { required: "Address is required" })}
          className="w-full border border-gray-300 p-3 rounded focus:ring-2 focus:ring-blue-500"
          placeholder="Enter owner's address"
        />
        {errors.location && (
          <p className="text-red-500 text-sm">{errors.location.message}</p>
        )}
      </div>
    </div>
  );
};

export default Step1OwnerInfo;
