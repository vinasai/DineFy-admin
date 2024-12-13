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
    <div className="space-y-4 mt-4">
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
  <label className="block mb-1 font-semibold text-gray-700">ContactNo</label>
  <input
    {...register("contact", {
      required: "Contact number is required",
      pattern: {
        value: /^[0-9]{10}$/, 
        message: "Enter a valid 10-digit contact number",
      },
    })}
    className="w-full border border-gray-300 p-3 rounded focus:ring-2 focus:ring-blue-500"
    placeholder="Enter owner's 4-digit contact number"
    onKeyDown={(e) => {

      // Allow only numbers and control keys
      if (!/[0-9]/.test(e.key) && !["Backspace", "Tab", "ArrowLeft", "ArrowRight"].includes(e.key)) {
        e.preventDefault();
      }
    }}
    onInput={(e) => {
      // Ensure value is at most 10 digits
      const input = e.target as HTMLInputElement;
      input.value = input.value.slice(0, 10);
    }}
  />
  {errors.contact && (
    <p className="text-red-500 text-sm">{errors.contact.message}</p>
  )}
</div>


<div>
  <label className="block mb-1 font-semibold text-gray-700">
    Country
  </label>
  <select
    {...register("country")}
    defaultValue="Canada"
    className="w-full border border-gray-300 p-3 rounded focus:ring-2 focus:ring-blue-500"
  >
    <option value="Canada">Canada</option>
    <option value="Sri Lanka">Sri Lanka</option>
  </select>
  {errors.country && (
    <p className="text-red-500 text-sm">{errors.country.message}</p>
  )}
</div>



      <div>
        <label className="block mb-1 font-semibold text-gray-700">
          Address
        </label>
        <input
          {...register("address")}
          className="w-full border border-gray-300 p-3 rounded focus:ring-2 focus:ring-blue-500"
          placeholder="Enter owner's address"
        />
        {errors.address && (
          <p className="text-red-500 text-sm">{errors.address.message}</p>
        )}
      </div>
    </div>
  );
};

export default Step1OwnerInfo;
