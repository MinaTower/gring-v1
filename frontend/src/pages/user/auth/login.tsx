import { loginUser } from "@/api/user-api";
import { LogUserData } from "@/interface";
import { useMutation } from "@tanstack/react-query";
import React, { useState } from "react";
import AuthTemplate from "./template";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const mutation = useMutation({
    mutationFn: (user: LogUserData) => loginUser(user.email, user.password),
    onSuccess: (data) => {
      localStorage.setItem("user", JSON.stringify(data.user));
      localStorage.setItem("token", data.token);
      setEmail("");
      setPassword("");
      window.location.href = "/";
    },
    onError: (error) => {
      console.error(error);
    },
  });

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    await mutation.mutateAsync({
      email,
      password,
    });
  };

  const items = [
    { text: "Email", type: "email", value: email, onChange: setEmail },
    {
      text: "Пароль",
      type: "password",
      value: password,
      onChange: setPassword,
    },
  ];

  return (
    <>
      <AuthTemplate
        title="Войти в GRing"
        items={items}
        buttonText="Войти"
        onSubmit={handleLogin}
        showSignupLink={true}
      />
    </>
  );
};

export default Login;
