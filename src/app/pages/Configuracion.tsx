import { useState } from "react";
import { Settings, Bell, Shield, Database, Save, Globe } from "lucide-react";

export default function Configuracion() {
  const [activeTab, setActiveTab] = useState("general");

  return (
    <div className="max-w-5xl mx-auto flex flex-col md:flex-row gap-6">
      {/* Sidebar de Configuración */}
      <div className="md:w-64 flex-shrink-0">
        <h2 className="text-xl font-bold text-gray-800 mb-4 px-2">Configuración</h2>
        <nav className="space-y-1">
          {[
            { id: "general", label: "General", icon: <Globe size={18} /> },
            { id: "notificaciones", label: "Notificaciones", icon: <Bell size={18} /> },
            { id: "seguridad", label: "Seguridad y Roles", icon: <Shield size={18} /> },
            { id: "datos", label: "Gestión de Datos", icon: <Database size={18} /> },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-colors ${
                activeTab === tab.id
                  ? "bg-[#39A900] text-white"
                  : "text-gray-600 hover:bg-gray-100"
              }`}
            >
              {tab.icon}
              {tab.label}
            </button>
          ))}
        </nav>
      </div>

      {/* Contenido Principal */}
      <div className="flex-1 bg-white rounded-2xl border border-gray-100 shadow-sm p-6 md:p-8">
        {activeTab === "general" && (
          <div className="space-y-6">
            <div className="border-b border-gray-100 pb-4">
              <h3 className="text-lg font-semibold text-gray-800">Información del Centro</h3>
              <p className="text-sm text-gray-500 mt-1">Configura la información básica de la plataforma.</p>
            </div>
            
            <div className="space-y-4 max-w-2xl">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Nombre del Centro</label>
                <input type="text" defaultValue="Centro de Comercio y Turismo" className="w-full border border-gray-200 rounded-lg px-4 py-2 text-sm focus:ring-2 focus:ring-[#39A900]/30 outline-none" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Regional</label>
                <input type="text" defaultValue="Quindío" className="w-full border border-gray-200 rounded-lg px-4 py-2 text-sm focus:ring-2 focus:ring-[#39A900]/30 outline-none" />
              </div>
              <div className="pt-4 flex justify-end">
                <button className="flex items-center gap-2 bg-[#39A900] text-white px-5 py-2.5 rounded-lg text-sm hover:bg-[#2d8a00] transition-colors">
                  <Save size={16} /> Guardar Cambios
                </button>
              </div>
            </div>
          </div>
        )}

        {activeTab === "notificaciones" && (
          <div className="space-y-6">
            <div className="border-b border-gray-100 pb-4">
              <h3 className="text-lg font-semibold text-gray-800">Preferencias de Notificación</h3>
              <p className="text-sm text-gray-500 mt-1">Decide qué notificaciones envía el sistema automáticamente.</p>
            </div>
            
            <div className="space-y-4">
              {[
                "Aprobación/Rechazo de Eventos",
                "Nuevas inscripciones a eventos",
                "Apertura de Casos de Bienestar",
                "Actualizaciones de Casos Seguimiento",
                "Reportes mensuales automáticos"
              ].map((item, i) => (
                <div key={i} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                  <span className="text-sm text-gray-700 font-medium">{item}</span>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" defaultChecked={i % 2 === 0} className="sr-only peer" />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#39A900]"></div>
                  </label>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Las otras pestañas quedarían similares, esta es la base */}
        {(activeTab === "seguridad" || activeTab === "datos") && (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <Settings size={48} className="text-gray-300 mb-4" />
            <h3 className="text-lg font-medium text-gray-800">Módulo en Construcción</h3>
            <p className="text-gray-500 text-sm mt-2 max-w-md">
              Esta sección estará disponible cuando se conecte con el backend real para gestionar roles complejos y bases de datos.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
