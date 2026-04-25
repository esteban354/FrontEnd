import { useNavigate } from "react-router";
import { ShieldAlert, ArrowLeft } from "lucide-react";

export default function Forbidden() {
  const navigate = useNavigate();

  return (
    <div className="flex-1 flex flex-col items-center justify-center min-h-[80vh]">
      <div className="bg-red-50 p-6 rounded-full mb-6">
        <ShieldAlert size={64} className="text-red-500" />
      </div>
      <h1 className="text-6xl font-bold text-gray-800 mb-4">403</h1>
      <h2 className="text-2xl font-semibold text-gray-700 mb-2">Acceso Denegado</h2>
      <p className="text-gray-500 mb-8 max-w-md text-center">
        No tienes los permisos necesarios para acceder a esta sección. Si crees que es un error, contacta al administrador del sistema.
      </p>
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 bg-gray-800 hover:bg-gray-900 text-white px-6 py-3 rounded-xl transition-colors font-medium shadow-sm"
      >
        <ArrowLeft size={20} />
        Volver atrás
      </button>
    </div>
  );
}
