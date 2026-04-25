import { useState } from "react";
import { useNavigate } from "react-router";
import { Eye, EyeOff, Lock, CheckCircle } from "lucide-react";

export default function ResetPassword() {
  const navigate = useNavigate();
  const [showPass, setShowPass] = useState(false);
  const [showPassConfirm, setShowPassConfirm] = useState(false);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setError("Las contraseñas no coinciden");
      return;
    }
    if (password.length < 8) {
      setError("La contraseña debe tener al menos 8 caracteres");
      return;
    }
    setError("");
    setSubmitted(true);
    setTimeout(() => {
      navigate("/login");
    }, 3000);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#1C2B1A] via-[#2d4a2b] to-[#39A900] p-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-2 bg-[#39A900]"></div>

        {submitted ? (
          <div className="text-center py-8">
            <div className="w-16 h-16 bg-[#e8f5e2] rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle size={32} className="text-[#39A900]" />
            </div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">¡Contraseña actualizada!</h2>
            <p className="text-gray-500 text-sm mb-6">
              Tu contraseña se ha restablecido correctamente. Serás redirigido al inicio de sesión.
            </p>
            <button
              onClick={() => navigate("/login")}
              className="w-full bg-[#39A900] hover:bg-[#2d8a00] text-white font-medium py-3 px-6 rounded-xl transition-colors"
            >
              Ir al Login
            </button>
          </div>
        ) : (
          <>
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-gray-800 mb-2">Crear nueva contraseña</h2>
              <p className="text-gray-500 text-sm">
                Ingresa tu nueva contraseña para acceder a la plataforma EBA.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <div className="bg-red-50 text-red-600 text-sm p-3 rounded-lg border border-red-200">
                  {error}
                </div>
              )}

              <div>
                <label className="block text-gray-700 text-sm font-medium mb-1.5">Nueva contraseña</label>
                <div className="relative">
                  <Lock size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    type={showPass ? "text" : "password"}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full border border-gray-200 rounded-xl pl-10 pr-10 py-3 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#39A900]/30 focus:border-[#39A900] bg-gray-50 transition-all"
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

              <div>
                <label className="block text-gray-700 text-sm font-medium mb-1.5">Confirmar contraseña</label>
                <div className="relative">
                  <Lock size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    type={showPassConfirm ? "text" : "password"}
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full border border-gray-200 rounded-xl pl-10 pr-10 py-3 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#39A900]/30 focus:border-[#39A900] bg-gray-50 transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassConfirm(!showPassConfirm)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showPassConfirm ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                className="w-full bg-[#39A900] hover:bg-[#2d8a00] text-white font-medium py-3 px-6 rounded-xl transition-colors mt-6"
              >
                Restablecer contraseña
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  );
}
