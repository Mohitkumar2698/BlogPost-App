import React from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
import Input from "../../components/ui/input";
import Button from "../../components/ui/button";

const schema = yup.object().shape({
  name: yup
    .string()
    .min(3, "Name must be at least 3 characters")
    .required("Name is required"),
  email: yup
    .string()
    .email("Enter a valid email")
    .required("Email is required"),
  phone: yup
    .string()
    .matches(/^[6-9]\d{9}$/, "Enter a valid Indian phone number")
    .notRequired(),
  password: yup
    .string()
    .min(8, "Password must be 8+ characters")
    .matches(/[A-Z]/, "Include an uppercase letter")
    .matches(/[a-z]/, "Include a lowercase letter")
    .matches(/\d/, "Include a number")
    .matches(/[@$!%*?&#]/, "Include a special character")
    .required("Password is required"),
  confirmPassword: yup
    .string()
    .oneOf([yup.ref("password"), null], "Passwords must match")
    .required("Confirm your password"),
});

const SignUp = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });

  const onSubmit = (data) => {
    console.log("Form Data:", data);
  };

  return (
    <div className="min-h-125 bg-gray-100 flex items-center justify-center px-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-3xl text-center">Register</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
            <Input placeholder="Name" {...register("name")} />
            <p className="text-sm text-rose-600">{errors.name?.message}</p>

            <Input placeholder="Email" {...register("email")} />
            <p className="text-sm text-rose-600">{errors.email?.message}</p>

            <Input placeholder="Phone (optional)" {...register("phone")} />
            <p className="text-sm text-rose-600">{errors.phone?.message}</p>

            <Input type="password" placeholder="Password" {...register("password")} />
            <p className="text-sm text-rose-600">{errors.password?.message}</p>

            <Input
              type="password"
              placeholder="Confirm Password"
              {...register("confirmPassword")}
            />
            <p className="text-sm text-rose-600">{errors.confirmPassword?.message}</p>

            <Button type="submit" className="w-full">
              Register
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default SignUp;
