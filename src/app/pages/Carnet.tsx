import { useApp } from "../context/AppContext";
import { Download, Share2, QrCode } from "lucide-react";

export default function Carnet() {
  const { currentUser } = useApp();

  if (!currentUser) return null;

  return (
    <div className="max-w-lg mx-auto space-y-6">
      <div>
        <p className="text-gray-500 text-sm">Tu carnet digital de aprendiz SENA</p>
      </div>

      {/* Card front */}
      <div className="relative">
        <div
          className="rounded-3xl overflow-hidden shadow-2xl"
          style={{
            background: "linear-gradient(135deg, #1C2B1A 0%, #2d4a2b 40%, #39A900 100%)",
            aspectRatio: "1.586",
          }}
        >
          {/* Background pattern */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-4 right-4 w-32 h-32 rounded-full border-4 border-white"></div>
            <div className="absolute top-16 right-16 w-16 h-16 rounded-full border-2 border-white"></div>
            <div className="absolute bottom-4 left-4 w-24 h-24 rounded-full border-2 border-white"></div>
          </div>

          <div className="relative p-6 h-full flex flex-col justify-between">
            {/* Top: Logo + SENA */}
            <div className="flex items-start justify-between">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center">
                    <span className="text-white font-bold text-xs">EBA</span>
                  </div>
                  <div>
                    <div className="text-white font-bold text-sm">SENA</div>
                    <div className="text-white/70 text-xs leading-tight">Centro de Comercio<br />y Turismo</div>
                  </div>
                </div>
              </div>
              <div className="text-right">
                <div className="text-white/60 text-xs">Regional</div>
                <div className="text-white font-semibold text-sm">Quindío</div>
              </div>
            </div>

            {/* Middle: User info */}
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center text-white font-bold text-xl border-2 border-white/30 flex-shrink-0">
                {currentUser.nombre[0]}{currentUser.apellido[0]}
              </div>
              <div>
                <div className="text-white/70 text-xs uppercase tracking-wide">Aprendiz</div>
                <div className="text-white font-bold text-lg leading-tight">{currentUser.nombre}</div>
                <div className="text-white font-bold text-lg leading-tight">{currentUser.apellido}</div>
              </div>
            </div>

            {/* Bottom: Details */}
            <div className="flex items-end justify-between">
              <div className="space-y-1">
                <div>
                  <div className="text-white/50 text-xs uppercase tracking-wide">Programa</div>
                  <div className="text-white text-xs font-medium">{currentUser.programa}</div>
                </div>
                <div className="flex gap-4">
                  <div>
                    <div className="text-white/50 text-xs">Ficha</div>
                    <div className="text-white text-sm font-mono font-bold">{currentUser.ficha}</div>
                  </div>
                  <div>
                    <div className="text-white/50 text-xs">Documento</div>
                    <div className="text-white text-sm font-mono font-bold">{currentUser.documento}</div>
                  </div>
                </div>
              </div>

              {/* QR */}
              <div className="bg-white p-1.5 rounded-xl">
                <svg width="56" height="56" viewBox="0 0 100 100">
                  <rect x="10" y="10" width="30" height="30" rx="3" fill="none" stroke="#1C2B1A" strokeWidth="4"/>
                  <rect x="16" y="16" width="18" height="18" rx="1" fill="#1C2B1A"/>
                  <rect x="60" y="10" width="30" height="30" rx="3" fill="none" stroke="#1C2B1A" strokeWidth="4"/>
                  <rect x="66" y="16" width="18" height="18" rx="1" fill="#1C2B1A"/>
                  <rect x="10" y="60" width="30" height="30" rx="3" fill="none" stroke="#1C2B1A" strokeWidth="4"/>
                  <rect x="16" y="66" width="18" height="18" rx="1" fill="#1C2B1A"/>
                  <rect x="44" y="44" width="4" height="4" fill="#1C2B1A"/>
                  <rect x="52" y="44" width="4" height="4" fill="#1C2B1A"/>
                  <rect x="60" y="44" width="4" height="4" fill="#1C2B1A"/>
                  <rect x="68" y="44" width="4" height="4" fill="#1C2B1A"/>
                  <rect x="76" y="44" width="4" height="4" fill="#1C2B1A"/>
                  <rect x="44" y="52" width="4" height="4" fill="#1C2B1A"/>
                  <rect x="60" y="52" width="4" height="4" fill="#1C2B1A"/>
                  <rect x="76" y="52" width="4" height="4" fill="#1C2B1A"/>
                  <rect x="44" y="60" width="4" height="4" fill="#1C2B1A"/>
                  <rect x="52" y="60" width="4" height="4" fill="#1C2B1A"/>
                  <rect x="68" y="60" width="4" height="4" fill="#1C2B1A"/>
                  <rect x="44" y="68" width="4" height="4" fill="#1C2B1A"/>
                  <rect x="60" y="68" width="4" height="4" fill="#1C2B1A"/>
                  <rect x="76" y="68" width="4" height="4" fill="#1C2B1A"/>
                  <rect x="52" y="76" width="4" height="4" fill="#1C2B1A"/>
                  <rect x="68" y="76" width="4" height="4" fill="#1C2B1A"/>
                  <rect x="76" y="76" width="4" height="4" fill="#1C2B1A"/>
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* Shine effect */}
        <div className="absolute inset-0 rounded-3xl pointer-events-none" style={{
          background: "linear-gradient(135deg, rgba(255,255,255,0.1) 0%, transparent 50%, rgba(255,255,255,0.05) 100%)"
        }}></div>
      </div>

      {/* Card back (info) */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 space-y-4">
        <h3 className="text-gray-800 font-semibold text-sm">Información del carnet</h3>
        <div className="grid grid-cols-2 gap-4">
          {[
            { label: "Nombre completo", value: `${currentUser.nombre} ${currentUser.apellido}` },
            { label: "Documento de identidad", value: currentUser.documento || "—" },
            { label: "Número de ficha", value: currentUser.ficha || "—" },
            { label: "Programa de formación", value: currentUser.programa || "—" },
            { label: "Centro de formación", value: "Centro de Comercio y Turismo" },
            { label: "Regional", value: "Quindío" },
            { label: "Correo institucional", value: currentUser.email },
            { label: "Estado", value: "Activo ✅" },
          ].map(({ label, value }) => (
            <div key={label}>
              <div className="text-gray-400 text-xs uppercase tracking-wide">{label}</div>
              <div className="text-gray-800 text-sm font-medium mt-0.5">{value}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Actions */}
      <div className="flex gap-3">
        <button className="flex-1 flex items-center justify-center gap-2 bg-[#39A900] hover:bg-[#2d8a00] text-white py-3 rounded-xl font-medium text-sm transition-colors">
          <Download size={18} /> Descargar PDF
        </button>
        <button className="flex items-center justify-center gap-2 bg-white border border-gray-200 hover:border-[#39A900] text-gray-700 py-3 px-5 rounded-xl font-medium text-sm transition-colors">
          <Share2 size={18} /> Compartir
        </button>
        <button className="flex items-center justify-center gap-2 bg-white border border-gray-200 hover:border-[#007AC0] text-gray-700 py-3 px-5 rounded-xl font-medium text-sm transition-colors">
          <QrCode size={18} /> Solo QR
        </button>
      </div>

      <p className="text-gray-400 text-xs text-center">
        Este carnet es un documento oficial del SENA. El código QR permite verificar la identidad del aprendiz en eventos y actividades institucionales.
      </p>
    </div>
  );
}
