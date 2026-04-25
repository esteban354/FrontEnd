import { useState } from "react";
import { useNavigate, Link } from "react-router";
import { ArrowLeft, Mail, ChevronRight } from "lucide-react";

export default function ForgotPassword() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#1C2B1A] via-[#2d4a2b] to-[#39A900] p-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8 relative overflow-hidden">
        {/* Decoración */}
        <div className="absolute top-0 left-0 w-full h-2 bg-[#39A900]"></div>
        
        <button 
          onClick={() => navigate("/login")}
          className="flex items-center gap-1 text-gray-400 hover:text-gray-700 text-sm mb-6 transition-colors"
        >
          <ArrowLeft size={16} /> Volver al login
        </button>

        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Recuperar contraseña</h2>
          <p className="text-gray-500 text-sm">
            {submitted 
              ? "Revisa tu bandeja de entrada. Te hemos enviado las instrucciones."
              : "Ingresa tu correo institucional y te enviaremos un enlace para restablecerla."}
          </p>
        </div>

        {submitted ? (
          <div className="space-y-6">
            <div className="bg-[#e8f5e2] text-[#2d8a00] p-4 rounded-xl text-sm border border-[#39A900]/20">
              Se ha enviado un correo a <strong>{email}</strong> con el enlace de recuperación.
            </div>
            <button
              onClick={() => navigate("/login")}
              className="w-full bg-[#39A900] hover:bg-[#2d8a00] text-white font-medium py-3 px-6 rounded-xl transition-colors"
            >
              Entendido
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-gray-700 text-sm font-medium mb-1.5">Correo institucional</label>
              <div className="relative">
                <Mail size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="tu.nombre@sena.edu.co"
                  className="w-full border border-gray-200 rounded-xl pl-10 pr-4 py-3 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#39A900]/30 focus:border-[#39A900] bg-gray-50 transition-all"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full bg-[#39A900] hover:bg-[#2d8a00] text-white font-medium py-3 px-6 rounded-xl transition-colors flex items-center justify-center gap-2 group"
            >
              Enviar enlace
              <ChevronRight size={16} className="group-hover:translate-x-1 transition-transform" />
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
