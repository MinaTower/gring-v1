import { WrapperTemplateProps } from "@/interface";

const WrapperTemplate = ({ children }: WrapperTemplateProps) => {
  return (
    <section className="mt-6">
      <div className="mx-auto w-full max-w-screen-xl">{children}</div>
    </section>
  );
};

export default WrapperTemplate;
