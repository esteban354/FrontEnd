import { useNavigate } from "react-router";
import { AlertCircle, Home } from "lucide-react";

export default function NotFound() {
  const navigate = useNavigate();

  return (
    <div className="flex-1 flex flex-col items-center justify-center min-h-[80vh]">
      <div className="bg-gray-50 p-6 rounded-full mb-6">
        <AlertCircle size={64} className="text-gray-400" />
      </div>
      <h1 className="text-6xl font-bold text-gray-800 mb-4">404</h1>
      <h2 className="text-2xl font-semibold text-gray-700 mb-2">Página no encontrada</h2>
      <p className="text-gray-500 mb-8 max-w-md text-center">
        Lo sentimos, la página que estás buscando no existe, ha sido movida o no tienes acceso a ella.
      </p>
      <button
        onClick={() => navigate("/")}
        className="flex items-center gap-2 bg-[#39A900] hover:bg-[#2d8a00] text-white px-6 py-3 rounded-xl transition-colors font-medium shadow-sm hover:shadow-md"
      >
        <Home size={20} />
        Volver al inicio
      </button>
    </div>
  );
}
