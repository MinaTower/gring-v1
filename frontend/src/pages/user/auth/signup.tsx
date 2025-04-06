import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { getCategories, registUser } from "@/api/user-api";
import { useMutation, useQuery } from "@tanstack/react-query";
import { RegUserData } from "@/interface";
import AuthTemplate from "./template";

const Signup = () => {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [category, setCategory] = useState("");
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();

  const { data: categories = [] } = useQuery({
    queryKey: ["categories"],
    queryFn: getCategories,
  });

  const mutation = useMutation({
    mutationFn: (newUser: RegUserData) =>
      registUser(
        newUser.email,
        newUser.name,
        newUser.category,
        newUser.password,
      ),
    onSuccess: () => {
      setEmail("");
      setName("");
      setPassword("");
      setCategory("");
      setSuccess(true);
      setTimeout(() => {
        navigate("/login");
      }, 2000);
    },
    onError: (error) => {
      console.error(error);
    },
  });

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    return mutation.mutateAsync({
      email,
      name,
      password,
      category,
    });
  };

  const items = [
    { text: "Email", type: "email", value: email, onChange: setEmail },
    { text: "Имя", type: "text", value: name, onChange: setName },
    {
      text: "Пароль",
      type: "password",
      value: password,
      onChange: setPassword,
    },
    {
      text: "Любимая категория",
      type: "select",
      value: category,
      onChange: setCategory,
      options: categories,
    },
  ];

  return (
    <>
      <AuthTemplate
        title="Регистрация на GRing"
        items={items}
        buttonText="Зарегистрироваться"
        onSubmit={onSubmit}
        showSignupLink={false}
      />
      {success && (
        <div className="mx-auto mt-4 max-w-sm rounded-lg bg-green-100 p-4 text-green-800 shadow">
          Успешная регистрация! Перенаправляем на страницу входа...
        </div>
      )}
    </>
  );
};

export default Signup;
