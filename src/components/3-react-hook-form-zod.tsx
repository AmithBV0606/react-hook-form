import {
  Controller,
  SubmitHandler,
  useFieldArray,
  useForm,
} from "react-hook-form";
import simulatedAPI from "../api/api";
import ReactDatePicker from "react-datepicker";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import React from "react";

const formSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required!"),
  email: z.string().email("Invalid email address!"),
  age: z.number().min(18, "You should atleast be 18 years old!"),
  gender: z.enum(["male", "female", "other"], {
    message: "Gender is required!",
  }),
  address: z.object({
    city: z.string().min(1, "City is required!"),
    state: z.string().min(1, "State is required!"),
  }),
  hobbies: z
    .array(
      z.object({
        name: z.string().min(1, "Hobby name is required!!"),
      })
    )
    .min(1, "At least one hobby is required!"),
  startDate: z.date(),
  subscribe: z.boolean(),
  referral: z.string().default(""),
});

type FormData = z.infer<typeof formSchema>;

const ReactHookFormWithZod: React.FC = () => {
  const {
    handleSubmit,
    register,
    setError,
    formState: { errors, isSubmitting },
    control,
    getValues,
  } = useForm<FormData>({
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      age: 18,
      gender: undefined,
      address: { city: "", state: "" },
      hobbies: [{ name: "" }],
      startDate: new Date(),
      subscribe: true,
      referral: "",
    },
    resolver: zodResolver(formSchema),
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "hobbies",
  });

  const onSubmit: SubmitHandler<FormData> = async (data) => {
    try {
      const response = await simulatedAPI(data);
      console.log("Success : ", response);
    } catch (error: any) {
      console.error("Error : ", error);
      setError("root", { message: error.message });
    }
  };

  return (
    <div className="flex justify-center items-center h-screen">
      <div className="border-2 border-black p-4 rounded-xl">
        <h1 className="text-3xl font-bold mb-6">
          Form built using React-Hook-Form with Zod
        </h1>

        <form className="flex flex-col gap-5" onSubmit={handleSubmit(onSubmit)}>
          {/* firstName */}
          <div>
            <label>First Name : </label>
            <input
              {...register("firstName")}
              className="border border-black outline-none py-2 px-6 rounded-xl"
            />
            {errors.firstName && (
              <p className="text-red-500 text-sm">{errors.firstName.message}</p>
            )}
          </div>

          {/* lastName */}
          <div>
            <label>Last Name : </label>
            <input
              {...register("lastName")}
              className="border border-black outline-none py-2 px-6 rounded-xl"
            />
            {errors.lastName && (
              <p className="text-red-500 text-sm">{errors.lastName.message}</p>
            )}
          </div>

          {/* email */}
          <div>
            <label>Email : </label>
            <input
              {...register("email")}
              className="border border-black outline-none py-2 px-6 rounded-xl"
            />
            {errors.email && (
              <p className="text-red-500 text-sm">{errors.email.message}</p>
            )}
          </div>

          {/* age */}
          <div>
            <label>Age : </label>
            <input
              {...register("age", { valueAsNumber: true })}
              className="border border-black outline-none py-2 px-6 rounded-xl"
            />
            {errors.age && (
              <p className="text-red-500 text-sm">{errors.age.message}</p>
            )}
          </div>

          {/* gender */}
          <div>
            <label>Gender : </label>
            <select {...register("gender")}>
              <option value="">.....</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="other">Other</option>
            </select>
            {errors.gender && (
              <p className="text-red-500">{errors.gender.message}</p>
            )}
          </div>

          {/* Address */}
          <div>
            <label>Address : </label>
            <input
              {...register("address.city")}
              placeholder="City"
              className="border border-black outline-none py-2 px-6 rounded-xl mr-2"
            />
            {errors.address?.city && (
              <p className="text-red-500">{errors.address.city.message}</p>
            )}

            <input
              {...register("address.state")}
              placeholder="State"
              className="border border-black outline-none py-2 px-6 rounded-xl"
            />
            {errors.address?.state && (
              <p className="text-red-500">{errors.address.state.message}</p>
            )}
          </div>

          {/* Hobbies */}
          <div>
            <label>Hobbies : </label>
            {fields.map((hobby, index) => {
              return (
                <div key={hobby.id}>
                  <input
                    {...register(`hobbies.${index}.name`)}
                    placeholder="Hobby name"
                    className="border border-black outline-none py-2 px-6 rounded-xl"
                  />

                  {errors.hobbies?.[index]?.name && (
                    <p className="text-red-500">
                      {errors.hobbies[index].name.message}
                    </p>
                  )}

                  {fields.length > 1 && (
                    <button
                      type="button"
                      onClick={() => remove(index)}
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
              onClick={() => append({ name: "" })}
              className="border-2 bg-blue-500 p-2 text-white rounded-xl mt-2"
            >
              Add hobby
            </button>
          </div>

          {/* startDate */}
          <div>
            <label>Start Date : </label>
            <Controller
              control={control}
              name="startDate"
              render={({ field }) => (
                <ReactDatePicker
                  placeholderText="Select date"
                  onChange={(date: Date | null) => field.onChange(date)}
                  selected={field.value}
                />
              )}
            />
          </div>

          {/* Subscribe */}
          <div>
            <label htmlFor="sub">Subscribe to Newsletter : </label>
            <input type="checkbox" id="sub" {...register("subscribe")} />
          </div>

          {/* referral */}
          {getValues("subscribe") && (
            <div>
              <label>Referral source :</label>
              <input
                {...register("referral")}
                placeholder="How did you hear about us?"
                className="border border-black outline-none py-2 px-6 rounded-xl w-full"
              />
              {errors.referral && (
                <p className="text-red-500">{errors.referral.message}</p>
              )}
            </div>
          )}

          {errors.root && <p className="text-red-500">{errors.root.message}</p>}

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

export default ReactHookFormWithZod;
