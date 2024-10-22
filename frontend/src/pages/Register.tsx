import { useForm } from "react-hook-form";
import { useMutation, useQueryClient } from "react-query";
import * as apiClient from "../api-client";
import { useAppContext } from "../contexts/AppContext";
import { useNavigate } from "react-router-dom";

export type RegisterFormData = {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  confirmPassword: string;
};

const Register = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const { showToast } = useAppContext();

  const {
    register,
    watch,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterFormData>();

  const mutation = useMutation(apiClient.register, {
    onSuccess: async () => {
      showToast({ message: "Registration Successful!", type: "SUCCESS" });
      await queryClient.invalidateQueries("validateToken");
      navigate("/");
    },
    onError: (error: Error) => {
      showToast({ message: error.message, type: "ERROR" });
    },
  });

  const onSubmit = handleSubmit((data) => {
    mutation.mutate(data);
  });

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md p-8 bg-white shadow-lg rounded-lg">
        <h2 className="text-2xl font-bold mb-6 text-center">Create an Account</h2>
        <form className="space-y-4" onSubmit={onSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-gray-700 font-medium mb-1" htmlFor="firstName">
                First Name
              </label>
              <input
                id="firstName"
                className={`border rounded w-full py-2 px-3 ${errors.firstName ? 'border-red-500' : 'border-gray-300'} focus:outline-none focus:ring-2 focus:ring-blue-500`}
                {...register("firstName", { required: "This field is required" })}
              />
              {errors.firstName && <span className="text-red-500 text-sm">{errors.firstName.message}</span>}
            </div>
            <div>
              <label className="block text-gray-700 font-medium mb-1" htmlFor="lastName">
                Last Name
              </label>
              <input
                id="lastName"
                className={`border rounded w-full py-2 px-3 ${errors.lastName ? 'border-red-500' : 'border-gray-300'} focus:outline-none focus:ring-2 focus:ring-blue-500`}
                {...register("lastName", { required: "This field is required" })}
              />
              {errors.lastName && <span className="text-red-500 text-sm">{errors.lastName.message}</span>}
            </div>
          </div>
          <div>
            <label className="block text-gray-700 font-medium mb-1" htmlFor="email">
              Email
            </label>
            <input
              id="email"
              type="email"
              className={`border rounded w-full py-2 px-3 ${errors.email ? 'border-red-500' : 'border-gray-300'} focus:outline-none focus:ring-2 focus:ring-blue-500`}
              {...register("email", {
                required: "This field is required",
                pattern: {
                  value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                  message: "Please enter a valid email address",
                },
              })}
            />
            {errors.email && <span className="text-red-500 text-sm">{errors.email.message}</span>}
          </div>
          <div>
            <label className="block text-gray-700 font-medium mb-1" htmlFor="password">
              Password
            </label>
            <input
              id="password"
              type="password"
              className={`border rounded w-full py-2 px-3 ${errors.password ? 'border-red-500' : 'border-gray-300'} focus:outline-none focus:ring-2 focus:ring-blue-500`}
              {...register("password", {
                required: "This field is required",
                minLength: {
                  value: 6,
                  message: "Password must be at least 6 characters",
                },
                pattern: {
                  value: /^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,}$/,
                  message:
                    "Password must have at least one uppercase letter, one number, and one special character",
                },
              })}
            />
            {errors.password && <span className="text-red-500 text-sm">{errors.password.message}</span>}
          </div>
          <div>
            <label className="block text-gray-700 font-medium mb-1" htmlFor="confirmPassword">
              Confirm Password
            </label>
            <input
              id="confirmPassword"
              type="password"
              className={`border rounded w-full py-2 px-3 ${errors.confirmPassword ? 'border-red-500' : 'border-gray-300'} focus:outline-none focus:ring-2 focus:ring-blue-500`}
              {...register("confirmPassword", {
                validate: (val) => {
                  if (!val) {
                    return "This field is required";
                  } else if (watch("password") !== val) {
                    return "Passwords do not match";
                  }
                },
              })}
            />
            {errors.confirmPassword && <span className="text-red-500 text-sm">{errors.confirmPassword.message}</span>}
          </div>
          <div>
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-blue-600 text-white text-lg py-2 px-4 rounded-lg font-bold hover:bg-blue-500 transition duration-200 ease-in-out"
            >
              {isSubmitting ? "Creating Account..." : "Create Account"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Register;
