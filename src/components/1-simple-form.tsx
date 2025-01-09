import React, { useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import simulatedAPI from "../api/api";
import { FormData } from "../types";

const SimpleForm: React.FC = () => {
  const [formData, setFormData] = useState<FormData>({
    firstName: "",
    lastName: "",
    email: "",
    age: 18,
    gender: "",
    address: { city: "", state: "" },
    hobbies: [{ name: "" }],
    startDate: new Date(),
    subscribe: false,
    referral: "",
  });
  const [errors, setErrors] = useState<any>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value } = e.target;

    if (name.includes("address.")) {
      const addressKey = name.split(".")[1];
      setFormData({
        ...formData,
        address: {
          ...formData.address,
          [addressKey]: value,
        },
      });
    } else {
      setFormData({
        ...formData,
        [name]: value,
      });
    }
  };

  const handleHobbyChange = (
    index: number,
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const { value } = e.target;
    // console.log(value);
    const hobbies = [...formData.hobbies];
    hobbies[index]['name'] = value;
    // console.log(hobbies);
    setFormData({
      ...formData,
      hobbies,
    });
  };

  const addHobby = () => {
    setFormData({
      ...formData,
      hobbies: [...formData.hobbies, { name: "" }],
    });
    // console.log(formData.hobbies);
  };

  const removeHobby = (index: number) => {
    const hobbies = [...formData.hobbies];
    hobbies.splice(index, 1);
    setFormData({
      ...formData,
      hobbies,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrors({});

    const newErrors: any = {};

    if (!formData.firstName) newErrors.firstName = "First name is required!";
    if (!formData.lastName) newErrors.lastName = "Last name is required!";
    if (!formData.email.match(/^\S+@\S+$/i))
      newErrors.email = "Invalid email address!";
    if (formData.age < 18) newErrors.age = "You must be at least 18 years old!";
    if (!formData.gender) newErrors.gender = "Gender is required!";
    if (!formData.address.city)
      newErrors.address = { city: "City is required!" };
    if (!formData.address.state)
      newErrors.address = { ...newErrors.address, state: "State is required!" };

    formData.hobbies.forEach((hobby, index) => {
      if (!hobby.name) {
        if (!newErrors.hobbies) newErrors.hobbies = [];
        newErrors.hobbies[index] = { name: "Hobby name is required" };
      }
    });

    if (formData.subscribe && !formData.referral)
      newErrors.referral =
        "Referral source is required if you're subscribing to our newsletter";

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      setIsSubmitting(false);
      return;
    }

    try {
      const response = await simulatedAPI(formData);
      console.log("Success : ", response);
    } catch (error: any) {
      console.error("Error : ", error);
      setErrors({ root: error.message });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex justify-center items-center h-screen">
      <div className="border-2 border-black p-4 rounded-xl">
        <h1 className="text-3xl font-bold mb-6">
          Simple Forms : Without react-hook-form
        </h1>

        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          {/* firstName */}
          <div>
            <label>First Name : </label>
            <input
              type="text"
              name="firstName"
              value={formData.firstName}
              onChange={handleChange}
              className="border border-black outline-none py-2 px-6 rounded-xl"
            />
            {errors.firstName && (
              <p className="text-red-500 text-sm">{errors.firstName}</p>
            )}
          </div>

          {/* lastName */}
          <div>
            <label>Last Name : </label>
            <input
              type="text"
              name="lastName"
              value={formData.lastName}
              onChange={handleChange}
              className="border border-black outline-none py-2 px-6 rounded-xl"
            />
            {errors.lastName && (
              <p className="text-red-500 text-sm">{errors.lastName}</p>
            )}
          </div>

          {/* email */}
          <div>
            <label>Email : </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="border border-black outline-none py-2 px-6 rounded-xl"
            />
            {errors.email && (
              <p className="text-red-500 text-sm">{errors.email}</p>
            )}
          </div>
          {/* age */}
          <div>
            <label>Age : </label>
            <input
              type="number"
              name="age"
              value={formData.age}
              onChange={handleChange}
              className="border border-black outline-none py-2 px-6 rounded-xl"
            />
            {errors.age && <p className="text-red-500 text-sm">{errors.age}</p>}
          </div>
          {/* gender */}
          <div>
            <label>Gender : </label>
            <select
              name="gender"
              value={formData.gender}
              onChange={handleChange}
            >
              <option value="">.....</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="other">Other</option>
            </select>
            {errors.gender && <p className="text-red-500">{errors.gender}</p>}
          </div>

          {/* Address */}
          <div>
            <label>Address : </label>
            <input
              name="address.city"
              value={formData.address.city}
              onChange={handleChange}
              placeholder="City"
              className="border border-black outline-none py-2 px-6 rounded-xl mr-2"
            />
            {errors.address?.city && (
              <p className="text-red-500">{errors.address.city}</p>
            )}

            <input
              name="address.state"
              value={formData.address.state}
              onChange={handleChange}
              placeholder="State"
              className="border border-black outline-none py-2 px-6 rounded-xl"
            />
            {errors.address?.state && (
              <p className="text-red-500">{errors.address.state}</p>
            )}
          </div>

          {/* Hobbies */}
          <div>
            <label>Hobbies : </label>
            {formData.hobbies.map((hobby, index) => {
              return (
                <div key={index}>
                  <input
                    type="text"
                    name="name"
                    value={hobby.name}
                    onChange={(e) => handleHobbyChange(index, e)}
                    className="border border-black outline-none py-2 px-6 rounded-xl"
                  />

                  {errors.hobbies?.[index]?.name && (
                    <p className="text-red-500">{errors.hobbies[index].name}</p>
                  )}

                  {formData.hobbies.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeHobby(index)}
                      className="border-2 bg-blue-600 p-2 text-white rounded-xl"
                    >
                      Remove Hobby
                    </button>
                  )}
                </div>
              );
            })}

            <button
              type="button"
              onClick={addHobby}
              className="border-2 bg-blue-500 p-2 text-white rounded-xl mt-2"
            >
              Add hobby
            </button>
          </div>

          {/* startDate */}
          <div>
            <label>Start Date : </label>
            <DatePicker
              selected={formData.startDate}
              onChange={(date: Date | null) => {
                setFormData({ ...formData, startDate: date || new Date() });
              }}
              className="border border-black outline-none py-2 px-6 rounded-xl"
            />
          </div>

          {/* Subscribe */}
          <div>
            <label htmlFor="sub">Subscribe to Newsletter : </label>
            <input
              type="checkbox"
              id="sub"
              name="subscribe"
              checked={formData.subscribe}
              onChange={(e) => {
                setFormData({ ...formData, subscribe: e.target.checked });
              }}
            />
          </div>

          {/* referral */}
          {formData.subscribe && (
            <div>
              <label>Referral source :</label>
              <input
                type="text"
                name="referral"
                onChange={handleChange}
                placeholder="How did you hear about us?"
                className="border border-black outline-none py-2 px-6 rounded-xl w-full"
              />
              {errors.referral && (
                <p className="text-red-500">{errors.referral}</p>
              )}
            </div>
          )}

          {errors.root && <p className="text-red-500">{errors.root}</p>}

          <button
            type="submit"
            disabled={isSubmitting}
            className="border-2 bg-blue-600 text-white p-1 rounded-xl"
          >
            {isSubmitting ? "Submitting..." : "Submit"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default SimpleForm;
