export interface LogUserData {
  email: string;
  password: string;
}

export interface OptionCategory {
  id: string;
  name: string;
}

export interface AuthTemplateItem {
  text: string;
  type: string;
  value: string;
  onChange: (value: string) => void;
  options?: OptionCategory[];
}

export interface AuthTemplateProps {
  title: string;
  items: AuthTemplateItem[];
  buttonText: string;
  onSubmit: (e: React.FormEvent) => Promise<void>;
  showSignupLink?: boolean;
}

export interface RegUserData {
  email: string;
  name: string;
  password: string;
  category: string;
}

export interface WrapperTemplateProps {
  children: React.ReactNode;
}
