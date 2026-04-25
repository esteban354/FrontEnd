import { useState } from "react";
import { useNavigate, Navigate } from "react-router";
import { useApp } from "../context/AppContext";
import { Role } from "../data/mockData";
import { Eye, EyeOff, ChevronRight, Shield, Star, Users, Heart } from "lucide-react";

const DEMO_ROLES: { role: Role; label: string; email: string; color: string; desc: string }[] = [
  { role: "admin", label: "Administrador", email: "admin@sena.edu.co", color: "bg-[#d4183d]", desc: "Gestión global y aprobaciones" },
  { role: "organizador", label: "Organizador", email: "organizador@sena.edu.co", color: "bg-[#007AC0]", desc: "Crear y gestionar eventos" },
  { role: "instructor", label: "Instructor", email: "instructor@sena.edu.co", color: "bg-[#7c3aed]", desc: "Asistencia y aprendices" },
  { role: "aprendiz", label: "Aprendiz", email: "aprendiz@sena.edu.co", color: "bg-[#39A900]", desc: "Inscripciones y carnet" },
];

export default function Login() {
  const { login, isAuthenticated } = useApp();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  if (isAuthenticated) return <Navigate to="/dashboard" replace />;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    await new Promise((r) => setTimeout(r, 600));
    const ok = login(email);
    if (ok) {
      navigate("/dashboard");
    } else {
      setError("Credenciales incorrectas. Usa un correo de demostración.");
    }
    setLoading(false);
  };

  const handleDemoLogin = (role: Role) => {
    login("", role);
    navigate("/dashboard");
  };

  return (
    <div className="min-h-screen flex">
      {/* Left panel */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-[#1C2B1A] via-[#2d4a2b] to-[#39A900] relative overflow-hidden flex-col justify-between p-12">
        {/* Pattern overlay */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 left-10 w-32 h-32 rounded-full border-2 border-white"></div>
          <div className="absolute top-32 left-32 w-16 h-16 rounded-full border border-white"></div>
          <div className="absolute bottom-20 right-10 w-48 h-48 rounded-full border-2 border-white"></div>
          <div className="absolute bottom-40 right-40 w-24 h-24 rounded-full border border-white"></div>
        </div>

        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-16">
            <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
              <span className="text-white font-bold text-lg">EBA</span>
            </div>
            <div>
              <div className="text-white font-bold text-xl">EBA</div>
              <div className="text-white/70 text-sm">Centro de Comercio y Turismo</div>
            </div>
          </div>

          <h2 className="text-white font-bold mb-4" style={{ fontSize: "2.2rem", lineHeight: "1.2" }}>
            Plataforma Integral<br />de Bienestar SENA
          </h2>
          <p className="text-white/80 text-lg leading-relaxed mb-12">
            Gestiona eventos, controla asistencia y acompaña el bienestar de los aprendices del Centro de Comercio y Turismo del SENA Quindío.
          </p>

          <div className="grid grid-cols-2 gap-4">
            {[
              { icon: <Star size={20} />, label: "Gestión de Eventos", desc: "Crea y administra eventos institucionales" },
              { icon: <Users size={20} />, label: "Control de Asistencia", desc: "Registro por QR o llamado de lista" },
              { icon: <Heart size={20} />, label: "Bienestar Integral", desc: "Seguimiento psicológico y social" },
              { icon: <Shield size={20} />, label: "Ruta PAEDP", desc: "Atención con enfoque diferencial" },
            ].map((f) => (
              <div key={f.label} className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/10">
                <div className="text-[#7dd956] mb-2">{f.icon}</div>
                <div className="text-white font-medium text-sm">{f.label}</div>
                <div className="text-white/60 text-xs mt-1">{f.desc}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="relative z-10 text-white/40 text-sm">
          © 2025 SENA – Servicio Nacional de Aprendizaje · Regional Quindío
        </div>
      </div>

      {/* Right panel */}
      <div className="flex-1 flex items-center justify-center bg-white p-8">
        <div className="w-full max-w-md">
          {/* Mobile logo */}
          <div className="flex items-center gap-3 mb-8 lg:hidden">
            <div className="w-10 h-10 bg-[#39A900] rounded-xl flex items-center justify-center">
              <span className="text-white font-bold">EBA</span>
            </div>
            <div>
              <div className="text-gray-800 font-bold">EBA · SENA Quindío</div>
              <div className="text-gray-500 text-sm">Plataforma de Bienestar</div>
            </div>
          </div>

          <div className="mb-8">
            <h2 className="text-gray-900 font-bold mb-2">Iniciar sesión</h2>
            <p className="text-gray-500 text-sm">Ingresa con tus credenciales institucionales del SENA</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4 mb-8">
            <div>
              <label className="block text-gray-700 text-sm mb-1.5">Correo institucional</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="tu.nombre@sena.edu.co"
                className="w-full border border-gray-200 rounded-lg px-4 py-3 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#39A900]/30 focus:border-[#39A900] bg-gray-50 transition-all"
              />
            </div>

            <div>
              <label className="block text-gray-700 text-sm mb-1.5">Contraseña</label>
              <div className="relative">
                <input
                  type={showPass ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full border border-gray-200 rounded-lg px-4 py-3 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#39A900]/30 focus:border-[#39A900] bg-gray-50 pr-10 transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPass(!showPass)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-600 text-sm px-4 py-3 rounded-lg">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#39A900] hover:bg-[#2d8a00] disabled:bg-[#39A900]/60 text-white font-medium py-3 px-6 rounded-lg transition-colors flex items-center justify-center gap-2"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
              ) : (
                <>
                  Ingresar
                  <ChevronRight size={16} />
                </>
              )}
            </button>
          </form>

          {/* Demo access */}
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="flex-1 border-t border-gray-200"></div>
              <span className="text-gray-400 text-xs px-2">Acceso de demostración</span>
              <div className="flex-1 border-t border-gray-200"></div>
            </div>

            <div className="grid grid-cols-2 gap-2">
              {DEMO_ROLES.map((dr) => (
                <button
                  key={dr.role}
                  onClick={() => handleDemoLogin(dr.role)}
                  className="flex items-center gap-3 p-3 border border-gray-200 rounded-lg hover:border-[#39A900] hover:bg-[#f0f9e8] transition-all group text-left"
                >
                  <div className={`w-8 h-8 ${dr.color} rounded-lg flex items-center justify-center text-white text-xs font-bold flex-shrink-0`}>
                    {dr.label[0]}
                  </div>
                  <div className="min-w-0">
                    <div className="text-gray-800 text-xs font-medium">{dr.label}</div>
                    <div className="text-gray-400 text-xs truncate">{dr.desc}</div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
