import { useState } from "react";
import { useApp } from "../context/AppContext";
import { Camera, Mail, Shield, User as UserIcon, Lock, Save, BookOpen } from "lucide-react";

export default function Perfil() {
  const { currentUser } = useApp();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    nombre: currentUser?.nombre || "",
    apellido: currentUser?.apellido || "",
    email: currentUser?.email || "",
    documento: currentUser?.documento || "",
  });

  if (!currentUser) return null;

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Cabecera del Perfil */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="h-32 bg-gradient-to-r from-[#1C2B1A] to-[#39A900]"></div>
        <div className="px-8 pb-8 relative">
          <div className="absolute -top-12 flex items-end gap-5">
            <div className="relative group">
              <div className="w-24 h-24 rounded-2xl bg-white p-1 shadow-md">
                <div className="w-full h-full rounded-xl bg-gray-100 flex items-center justify-center overflow-hidden">
                  {currentUser.avatar ? (
                    <div className="w-full h-full bg-[#39A900] text-white flex items-center justify-center text-3xl font-bold">
                      {currentUser.avatar}
                    </div>
                  ) : (
                    <UserIcon size={40} className="text-gray-400" />
                  )}
                </div>
              </div>
              <button className="absolute bottom-2 right-2 p-1.5 bg-white rounded-full text-gray-600 shadow-sm opacity-0 group-hover:opacity-100 transition-opacity hover:text-[#39A900]">
                <Camera size={16} />
              </button>
            </div>
            <div className="pb-2">
              <h1 className="text-2xl font-bold text-gray-800">
                {currentUser.nombre} {currentUser.apellido}
              </h1>
              <div className="flex items-center gap-2 mt-1">
                <span className="bg-[#e8f5e2] text-[#39A900] text-xs px-2.5 py-1 rounded-full font-medium capitalize border border-[#39A900]/20">
                  Rol: {currentUser.role}
                </span>
                {currentUser.ficha && (
                  <span className="bg-gray-100 text-gray-600 text-xs px-2.5 py-1 rounded-full font-medium border border-gray-200">
                    Ficha: {currentUser.ficha}
                  </span>
                )}
              </div>
            </div>
          </div>
          
          <div className="mt-16 flex justify-end">
             {isEditing ? (
               <div className="flex gap-2">
                 <button onClick={() => setIsEditing(false)} className="px-4 py-2 border border-gray-200 text-gray-600 rounded-lg text-sm hover:bg-gray-50 transition-colors">
                   Cancelar
                 </button>
                 <button onClick={() => setIsEditing(false)} className="flex items-center gap-2 bg-[#39A900] text-white px-4 py-2 rounded-lg text-sm hover:bg-[#2d8a00] transition-colors">
                   <Save size={16} />
                   Guardar cambios
                 </button>
               </div>
             ) : (
               <button onClick={() => setIsEditing(true)} className="px-4 py-2 border border-gray-200 text-gray-700 rounded-lg text-sm hover:bg-gray-50 transition-colors font-medium">
                 Editar Perfil
               </button>
             )}
          </div>
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        {/* Columna Izquierda - Info */}
        <div className="md:col-span-2 space-y-6">
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
            <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
              <UserIcon size={20} className="text-[#39A900]" />
              Información Personal
            </h2>
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">Nombre</label>
                <input
                  type="text"
                  disabled={!isEditing}
                  value={formData.nombre}
                  onChange={(e) => setFormData({...formData, nombre: e.target.value})}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm bg-gray-50 disabled:opacity-70 disabled:cursor-not-allowed focus:ring-2 focus:ring-[#39A900]/30 focus:border-[#39A900] outline-none transition-all"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">Apellido</label>
                <input
                  type="text"
                  disabled={!isEditing}
                  value={formData.apellido}
                  onChange={(e) => setFormData({...formData, apellido: e.target.value})}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm bg-gray-50 disabled:opacity-70 disabled:cursor-not-allowed focus:ring-2 focus:ring-[#39A900]/30 focus:border-[#39A900] outline-none transition-all"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">Correo Electrónico</label>
                <div className="relative">
                  <Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    type="email"
                    disabled={!isEditing}
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                    className="w-full border border-gray-200 rounded-lg pl-9 pr-3 py-2 text-sm bg-gray-50 disabled:opacity-70 disabled:cursor-not-allowed focus:ring-2 focus:ring-[#39A900]/30 focus:border-[#39A900] outline-none transition-all"
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">Documento de Identidad</label>
                <input
                  type="text"
                  disabled={!isEditing}
                  value={formData.documento}
                  onChange={(e) => setFormData({...formData, documento: e.target.value})}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm bg-gray-50 disabled:opacity-70 disabled:cursor-not-allowed focus:ring-2 focus:ring-[#39A900]/30 focus:border-[#39A900] outline-none transition-all"
                />
              </div>
              {currentUser.programa && (
                <div className="sm:col-span-2">
                  <label className="block text-xs font-medium text-gray-500 mb-1">Programa de Formación</label>
                  <div className="relative">
                    <BookOpen size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input
                      type="text"
                      disabled
                      value={currentUser.programa}
                      className="w-full border border-gray-200 rounded-lg pl-9 pr-3 py-2 text-sm bg-gray-100 text-gray-500 cursor-not-allowed"
                    />
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Columna Derecha - Seguridad */}
        <div className="space-y-6">
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
            <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
              <Shield size={20} className="text-[#007AC0]" />
              Seguridad
            </h2>
            <div className="space-y-4">
              <p className="text-sm text-gray-500">
                Mantén tu cuenta segura actualizando tu contraseña regularmente.
              </p>
              <button className="w-full flex items-center justify-center gap-2 border border-gray-200 text-gray-700 py-2.5 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors">
                <Lock size={16} />
                Cambiar contraseña
              </button>
            </div>
          </div>
          
          <div className="bg-gradient-to-br from-[#f0f9e8] to-[#e8f5e2] rounded-2xl border border-[#39A900]/20 p-6">
            <h3 className="font-semibold text-[#2d8a00] mb-2">¿Necesitas ayuda?</h3>
            <p className="text-sm text-[#39A900]/80 mb-4">
              Si tienes problemas con tu cuenta, contacta al administrador de bienestar de tu centro.
            </p>
            <button className="text-[#2d8a00] text-sm font-medium hover:underline">
              Soporte Técnico →
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
