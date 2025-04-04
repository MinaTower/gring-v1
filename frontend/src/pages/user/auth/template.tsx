import Logo from "@/img/logo.svg";
import { Link } from "react-router-dom";
import { AuthTemplateProps, OptionCategory } from "@/interface";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const AuthTemplate = ({
  title,
  items,
  buttonText,
  onSubmit,
  showSignupLink = false,
}: AuthTemplateProps) => {
  return (
    <>
      <div className="flex flex-col items-center">
        <Link to="/">
          <img src={Logo} width={48} className="mt-6 select-none" />
        </Link>
        <h1 className="mb-2 text-2xl">{title}</h1>
      </div>
      <form
        onSubmit={onSubmit}
        className="mx-auto flex w-full max-w-sm flex-col rounded-lg bg-white p-6 shadow-md"
      >
        <div className="space-y-2">
          {items.map((item, index) => (
            <div className="flex w-full flex-col" key={index}>
              <label
                htmlFor={`input-${index}`}
                className="mb-1 select-none text-sm font-medium text-gray-700"
              >
                {item.text}
              </label>
              {item.type === "select" ? (
                <select
                  id={`input-${index}`}
                  value={item.value}
                  onChange={(e) => item.onChange(e.target.value)}
                  required
                  className="transition-color w-full rounded-md border border-gray-300 px-3 py-2"
                >
                  <option value="">Выберите категорию</option>
                  {item.options?.map((option: OptionCategory) => (
                    <option key={option.id} value={option.name}>
                      {option.name}
                    </option>
                  ))}
                </select>
              ) : (
                <Input
                  id={`input-${index}`}
                  type={item.type}
                  value={item.value}
                  onChange={(e) => item.onChange(e.target.value)}
                  required
                  className="transition-color w-full rounded-md border border-gray-300 px-3 py-2"
                />
              )}
            </div>
          ))}
        </div>
        <div className="mt-2">
          <Button
            type="submit"
            className="w-full select-none bg-yellow-400 text-black hover:bg-yellow-400 active:bg-yellow-500"
          >
            {buttonText}
          </Button>
        </div>
      </form>
      {showSignupLink && (
        <div className="mx-auto mt-4 flex w-full max-w-sm justify-center rounded-lg bg-white p-2 shadow-md">
          <span>
            Нет аккаунта?{" "}
            <Link to="/signup" className="underline">
              Зарегистрируйтесь
            </Link>
          </span>
        </div>
      )}
    </>
  );
};

export default AuthTemplate;
