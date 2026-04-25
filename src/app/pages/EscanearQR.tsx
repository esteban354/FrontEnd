import { useState } from "react";
import { QrCode, CheckCircle2, AlertCircle, Zap } from "lucide-react";
import { EVENTOS } from "../data/mockData";
import { useApp } from "../context/AppContext";

export default function EscanearQR() {
  const { currentUser } = useApp();
  const [scanning, setScanning] = useState(false);
  const [result, setResult] = useState<"success" | "error" | null>(null);
  const [scannedEvent, setScannedEvent] = useState<typeof EVENTOS[0] | null>(null);

  const handleScan = () => {
    setScanning(true);
    setResult(null);
    setTimeout(() => {
      const ev = EVENTOS.find(e => e.estado === "aprobado");
      if (ev) {
        setScannedEvent(ev);
        setResult("success");
      } else {
        setResult("error");
      }
      setScanning(false);
    }, 2000);
  };

  return (
    <div className="max-w-sm mx-auto space-y-6">
      <div>
        <p className="text-gray-500 text-sm">Escanea el código QR del evento para registrar tu asistencia</p>
      </div>

      {/* Scanner */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 flex flex-col items-center gap-6">
        <div className="relative w-full max-w-xs aspect-square bg-gray-900 rounded-2xl overflow-hidden flex items-center justify-center">
          {/* Corner decorations */}
          <div className="absolute inset-6 border-2 border-transparent rounded-lg">
            <div className="absolute top-0 left-0 w-8 h-8 border-t-3 border-l-3 border-[#39A900] rounded-tl-lg" style={{ borderWidth: "3px" }}></div>
            <div className="absolute top-0 right-0 w-8 h-8 border-t-3 border-r-3 border-[#39A900] rounded-tr-lg" style={{ borderWidth: "3px" }}></div>
            <div className="absolute bottom-0 left-0 w-8 h-8 border-b-3 border-l-3 border-[#39A900] rounded-bl-lg" style={{ borderWidth: "3px" }}></div>
            <div className="absolute bottom-0 right-0 w-8 h-8 border-b-3 border-r-3 border-[#39A900] rounded-br-lg" style={{ borderWidth: "3px" }}></div>
          </div>

          {scanning ? (
            <div className="flex flex-col items-center gap-3">
              <div className="w-10 h-10 border-3 border-[#39A900] border-t-transparent rounded-full animate-spin" style={{ borderWidth: "3px" }}></div>
              <span className="text-white/70 text-sm">Escaneando...</span>
              <div className="absolute w-full h-0.5 bg-[#39A900] opacity-80 animate-pulse" style={{ top: "50%" }}></div>
            </div>
          ) : result === "success" ? (
            <div className="flex flex-col items-center gap-3 z-10">
              <CheckCircle2 size={48} className="text-[#39A900]" />
              <span className="text-white text-sm font-medium">¡Asistencia registrada!</span>
            </div>
          ) : result === "error" ? (
            <div className="flex flex-col items-center gap-3">
              <AlertCircle size={48} className="text-red-400" />
              <span className="text-white text-sm">QR no válido</span>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-3 opacity-40">
              <QrCode size={64} className="text-white" />
              <span className="text-white text-sm">Apunta al código QR</span>
            </div>
          )}
        </div>

        {/* Result card */}
        {result === "success" && scannedEvent && (
          <div className="w-full bg-[#e8f5e2] border border-[#39A900]/30 rounded-xl p-4">
            <div className="flex items-center gap-3">
              <CheckCircle2 size={20} className="text-[#39A900] flex-shrink-0" />
              <div>
                <div className="text-[#39A900] font-semibold text-sm">Asistencia confirmada</div>
                <div className="text-gray-700 text-sm mt-0.5">{scannedEvent.titulo}</div>
                <div className="text-gray-500 text-xs">{scannedEvent.fecha} · {scannedEvent.horaInicio}</div>
              </div>
            </div>
          </div>
        )}

        {result === "error" && (
          <div className="w-full bg-red-50 border border-red-200 rounded-xl p-4 flex items-center gap-3">
            <AlertCircle size={20} className="text-red-500 flex-shrink-0" />
            <div>
              <div className="text-red-700 font-semibold text-sm">Código no reconocido</div>
              <div className="text-red-600 text-xs mt-0.5">El código QR no corresponde a ningún evento activo</div>
            </div>
          </div>
        )}

        <button
          onClick={handleScan}
          disabled={scanning}
          className="w-full flex items-center justify-center gap-3 bg-[#39A900] hover:bg-[#2d8a00] disabled:bg-[#39A900]/60 text-white py-4 rounded-xl font-medium transition-colors"
        >
          {scanning ? (
            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
          ) : (
            <Zap size={20} />
          )}
          {scanning ? "Escaneando..." : result ? "Escanear otro" : "Iniciar escaneo"}
        </button>

        <p className="text-gray-400 text-xs text-center">
          En el dispositivo real, la cámara se activará para detectar el código QR automáticamente
        </p>
      </div>

      {/* Info card */}
      <div className="bg-[#e0f0fa] rounded-xl p-4 border border-[#007AC0]/20">
        <div className="flex items-start gap-3">
          <QrCode size={20} className="text-[#007AC0] flex-shrink-0 mt-0.5" />
          <div>
            <div className="text-[#007AC0] font-semibold text-sm">{currentUser?.nombre} {currentUser?.apellido}</div>
            <div className="text-gray-600 text-xs mt-0.5">Ficha: {currentUser?.ficha} · {currentUser?.programa}</div>
            <div className="text-gray-500 text-xs mt-1">
              Tu asistencia se registrará automáticamente al escanear el QR del evento
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
