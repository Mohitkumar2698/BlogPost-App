import React from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';

// ✅ Yup Validation Schema
const schema = yup.object().shape({
  name: yup           
    .string()
    .min(3, 'Name must be at least 3 characters')
    .required('Name is required'),
  email: yup
    .string()
    .email('Enter a valid email')
    .required('Email is required'),
  phone: yup
    .string()
    .matches(/^[6-9]\d{9}$/, 'Enter a valid Indian phone number')
    .notRequired(),
  password: yup
    .string()
    .min(8, 'Password must be 8+ characters')
    .matches(/[A-Z]/, 'Include an uppercase letter')
    .matches(/[a-z]/, 'Include a lowercase letter')
    .matches(/\d/, 'Include a number')
    .matches(/[@$!%*?&#]/, 'Include a special character')
    .required('Password is required'),
  confirmPassword: yup
    .string()
    .oneOf([yup.ref('password'), null], 'Passwords must match')
    .required('Confirm your password'),
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
    console.log('✅ Form Data:', data);
    // 👉 Call your API to register user here
  };

  return (
    <div style={{ maxWidth: '400px', margin: 'auto' }}>
      <h2>Register</h2>
      <form onSubmit={handleSubmit(onSubmit)}>
        <input placeholder="Name" {...register('name')} />
        <p>{errors.name?.message}</p>

        <input placeholder="Email" {...register('email')} />
        <p>{errors.email?.message}</p>

        <input placeholder="Phone (optional)" {...register('phone')} />
        <p>{errors.phone?.message}</p>

        <input type="password" placeholder="Password" {...register('password')} />
        <p>{errors.password?.message}</p>

        <input type="password" placeholder="Confirm Password" {...register('confirmPassword')} />
        <p>{errors.confirmPassword?.message}</p>

        <button type="submit">Register</button>
      </form>
    </div>
  );
};

export default SignUp;
