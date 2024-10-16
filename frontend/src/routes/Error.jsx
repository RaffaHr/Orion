import { useNavigate } from "react-router-dom";

const Error = () => {
  const navigate = useNavigate();

  return (
    <main className="items-center justify-center flex h-screen bg-white px-6 py-24 sm:py-32 lg:px-8">
      <div className="text-center">
        <p className="text-base font-semibold text-[#232323]">404</p>
        <h1 className="mt-4 text-3xl font-bold tracking-tight text-gray-900 sm:text-5xl">
          Página não encontrada
        </h1>
        <p className="mt-6 text-base leading-7 text-gray-600">
          Desculpe, a página que está procurando não existe.
        </p>
        <div className="mt-10 flex items-center justify-center gap-x-6">
          <button
            href="#"
            className="cursor-pointer rounded-md bg-[#232323] px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-[#7d7d7d] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2"
            onClick={() => navigate("/app")}
          >
            <span className="cursor-pointer">Voltar</span>
          </button>
          <button
            href="#"
            className="text-sm font-semibold text-gray-900 cursor-pointer"
          >
            Suporte <span aria-hidden="true" className="cursor-pointer">&rarr;</span>
          </button>
        </div>
      </div>
    </main>
  );
};

export default Error;
