import { useState } from "react";
import { useNavigate } from "react-router";
import { LOCACIONES_EVENTO_LABELS } from "../data/domain";
import { eventosApi } from "../services/api";
import { ArrowLeft, CalendarDays, MapPin, Users, Upload, CheckCircle2, Info } from "lucide-react";

export default function CrearEvento() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [imageName, setImageName] = useState("");
  const [form, setForm] = useState({
    titulo: "",
    descripcion: "",
    fecha: "",
    horaInicio: "",
    horaFin: "",
    lugar: "",
    categoria: "",
    capacidad: "",
    requiereAprobacion: false,
    requiereInscripcion: true,
    imagenUrl: "",
  });

  const handleChange = (field: string, value: any) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleImageChange = async (file?: File) => {
    if (!file) return;
    setError("");
    setImageName(file.name);

    try {
      const response = await eventosApi.simulateImageUpload(file);
      handleChange("imagenUrl", response.imageUrl);
    } catch {
      setError("No se pudo simular la carga de imagen.");
      setImageName("");
    }
  };

  const handleSubmit = async () => {
    setError("");
    
    if (!form.titulo || !form.descripcion || !form.fecha || !form.horaInicio || !form.horaFin || !form.lugar || !form.categoria || !form.capacidad) {
      setError("Por favor completa todos los campos obligatorios.");
      return;
    }
    
    if (Number(form.capacidad) < 1) {
      setError("La capacidad debe ser mayor a 0.");
      return;
    }

    if (form.horaInicio >= form.horaFin) {
      setError("La hora final debe ser posterior a la inicial.");
      return;
    }

    const anio = new Date(form.fecha).getFullYear();
    if (anio < 2026) {
      setError("El año del evento debe ser 2026 o posterior.");
      return;
    }
    if (anio > 9999) {
      setError("El año del evento no puede tener más de 4 dígitos.");
      return;
    }

    setLoading(true);

    try {
      await eventosApi.create({
        titulo: form.titulo,
        descripcion: form.descripcion,
        fecha: form.fecha,
        horaInicio: form.horaInicio,
        horaFin: form.horaFin,
        lugar: form.lugar,
        categoria: form.categoria,
        capacidad: Number(form.capacidad),
        imagenUrl: form.imagenUrl || undefined,
      });
      setSubmitted(true);
    } catch (err: any) {
      setError(err.message || "No se pudo crear el evento. Revisa los datos y confirma que el backend este activo.");
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <div className="max-w-lg mx-auto text-center py-16">
        <div className="w-20 h-20 bg-[#e8f5e2] rounded-full flex items-center justify-center mx-auto mb-5">
          <CheckCircle2 size={40} className="text-[#39A900]" />
        </div>
        <h2 className="text-gray-800 font-bold mb-2">¡Evento creado exitosamente!</h2>
        <p className="text-gray-500 text-sm mb-6">
          Tu evento ha sido enviado para aprobación. Recibirás una notificación cuando sea revisado por el administrador.
        </p>
        <div className="bg-[#f0f9e8] border border-[#39A900]/20 rounded-xl p-4 mb-8 text-left">
          <div className="font-semibold text-gray-800 mb-2">{form.titulo || "Nuevo Evento"}</div>
          <div className="text-gray-500 text-sm">{form.fecha} · {form.horaInicio} – {form.horaFin}</div>
          <div className="text-gray-500 text-sm">{form.lugar}</div>
          <div className="mt-2">
            <span className="text-xs bg-yellow-100 text-yellow-700 px-2 py-0.5 rounded-full">Pendiente de aprobación</span>
          </div>
        </div>
        <div className="flex gap-3 justify-center">
          <button onClick={() => navigate("/eventos")} className="px-6 py-2 border border-gray-200 rounded-xl text-gray-700 hover:bg-gray-50 transition-colors text-sm">
            Ver todos los eventos
          </button>
          <button onClick={() => { setSubmitted(false); setStep(1); setImageName(""); setForm({ titulo: "", descripcion: "", fecha: "", horaInicio: "", horaFin: "", lugar: "", categoria: "", capacidad: "", requiereAprobacion: false, requiereInscripcion: true, imagenUrl: "" }); }} className="px-6 py-2 bg-[#39A900] hover:bg-[#2d8a00] text-white rounded-xl text-sm transition-colors">
            Crear otro evento
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl space-y-6">
      {/* Back */}
      <button onClick={() => navigate("/eventos")} className="flex items-center gap-2 text-gray-500 hover:text-gray-700 text-sm transition-colors">
        <ArrowLeft size={16} /> Volver a eventos
      </button>

      {/* Steps indicator */}
      <div className="flex items-center gap-3">
        {[1, 2, 3].map((s) => (
          <div key={s} className="flex items-center gap-3">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold transition-all ${
              s === step ? "bg-[#39A900] text-white" :
              s < step ? "bg-[#e8f5e2] text-[#39A900]" :
              "bg-gray-100 text-gray-400"
            }`}>
              {s < step ? <CheckCircle2 size={16} /> : s}
            </div>
            <span className={`text-sm hidden sm:block ${s === step ? "text-gray-800 font-medium" : "text-gray-400"}`}>
              {s === 1 ? "Información básica" : s === 2 ? "Detalles del evento" : "Configuración"}
            </span>
            {s < 3 && <div className={`w-12 h-0.5 hidden sm:block ${s < step ? "bg-[#39A900]" : "bg-gray-200"}`}></div>}
          </div>
        ))}
      </div>

      {/* Form card */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
        {error && <div className="mb-4 bg-red-50 border border-red-200 text-red-600 rounded-xl p-3 text-sm">{error}</div>}
        {step === 1 && (
          <div className="space-y-5">
            <h3 className="text-gray-800 font-semibold">Información básica del evento</h3>

            <div>
              <label className="block text-gray-700 text-sm mb-1.5">Título del evento *</label>
              <input
                type="text"
                value={form.titulo}
                onChange={(e) => handleChange("titulo", e.target.value)}
                placeholder="Ej: Feria de Emprendimiento 2025"
                className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#39A900]/30 focus:border-[#39A900] bg-gray-50 transition-all"
              />
            </div>

            <div>
              <label className="block text-gray-700 text-sm mb-1.5">Descripción *</label>
              <textarea
                value={form.descripcion}
                onChange={(e) => handleChange("descripcion", e.target.value)}
                placeholder="Describe el propósito y actividades del evento..."
                rows={4}
                className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#39A900]/30 focus:border-[#39A900] bg-gray-50 transition-all resize-none"
              />
            </div>

            <div>
              <label className="block text-gray-700 text-sm mb-1.5">Categoría *</label>
              <select
                value={form.categoria}
                onChange={(e) => handleChange("categoria", e.target.value)}
                className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#39A900]/30 focus:border-[#39A900] bg-gray-50 transition-all text-gray-700"
              >
                <option value="">Selecciona una categoría</option>
                <option value="academico">Académico</option>
                <option value="deportivo">Deportivo</option>
                <option value="cultural">Cultural</option>
                <option value="bienestar">Bienestar</option>
                <option value="institucional">Institucional</option>
              </select>
            </div>

            {/* Image upload */}
            <div>
              <label className="block text-gray-700 text-sm mb-1.5">Imagen del evento</label>
              <label className="block border-2 border-dashed border-gray-200 rounded-xl p-8 text-center hover:border-[#39A900] transition-colors cursor-pointer">
                <Upload size={28} className="text-gray-300 mx-auto mb-2" />
                <p className="text-gray-500 text-sm">{imageName || "Haz clic para subir una imagen"}</p>
                <p className="text-gray-400 text-xs mt-1">PNG, JPG hasta 5MB</p>
                <input type="file" accept="image/*" className="hidden" onChange={(e) => handleImageChange(e.target.files?.[0])} />
              </label>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-5">
            <h3 className="text-gray-800 font-semibold">Detalles de fecha, hora y lugar</h3>

            <div>
              <label className="block text-gray-700 text-sm mb-1.5">Fecha del evento *</label>
              <div className="relative">
                <CalendarDays size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="date"
                  value={form.fecha}
                  onChange={(e) => handleChange("fecha", e.target.value)}
                  className="w-full border border-gray-200 rounded-xl pl-9 pr-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#39A900]/30 focus:border-[#39A900] bg-gray-50 transition-all text-gray-700"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-gray-700 text-sm mb-1.5">Hora de inicio *</label>
                <input
                  type="time"
                  value={form.horaInicio}
                  onChange={(e) => handleChange("horaInicio", e.target.value)}
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#39A900]/30 focus:border-[#39A900] bg-gray-50 transition-all text-gray-700"
                />
              </div>
              <div>
                <label className="block text-gray-700 text-sm mb-1.5">Hora de fin *</label>
                <input
                  type="time"
                  value={form.horaFin}
                  onChange={(e) => handleChange("horaFin", e.target.value)}
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#39A900]/30 focus:border-[#39A900] bg-gray-50 transition-all text-gray-700"
                />
              </div>
            </div>

            <div>
              <label className="block text-gray-700 text-sm mb-1.5">Lugar / Sede *</label>
              <div className="relative">
                <MapPin size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <select
                  value={form.lugar}
                  onChange={(e) => handleChange("lugar", e.target.value)}
                  className="w-full border border-gray-200 rounded-xl pl-9 pr-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#39A900]/30 focus:border-[#39A900] bg-gray-50 transition-all text-gray-700"
                >
                  <option value="">Selecciona una sede</option>
                  {Object.entries(LOCACIONES_EVENTO_LABELS).map(([key, label]) => (
                    <option key={key} value={key}>{label}</option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-gray-700 text-sm mb-1.5">Capacidad máxima *</label>
              <div className="relative">
                <Users size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="number"
                  value={form.capacidad}
                  onChange={(e) => handleChange("capacidad", e.target.value)}
                  placeholder="Ej: 100"
                  min="1"
                  className="w-full border border-gray-200 rounded-xl pl-9 pr-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#39A900]/30 focus:border-[#39A900] bg-gray-50 transition-all"
                />
              </div>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-5">
            <h3 className="text-gray-800 font-semibold">Configuración del evento</h3>

            <div className="space-y-3">
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                <div>
                  <div className="text-gray-800 text-sm font-medium">Requiere inscripción previa</div>
                  <div className="text-gray-500 text-xs mt-0.5">Los participantes deben inscribirse antes del evento</div>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={form.requiereInscripcion}
                    onChange={(e) => handleChange("requiereInscripcion", e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#39A900]"></div>
                </label>
              </div>

              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                <div>
                  <div className="text-gray-800 text-sm font-medium">Requiere aprobación de asistentes</div>
                  <div className="text-gray-500 text-xs mt-0.5">Cada inscripción será revisada y aprobada manualmente</div>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={form.requiereAprobacion}
                    onChange={(e) => handleChange("requiereAprobacion", e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#39A900]"></div>
                </label>
              </div>
            </div>

            {/* Summary */}
            <div className="bg-[#f0f9e8] border border-[#39A900]/20 rounded-xl p-4 space-y-2">
              <div className="flex items-center gap-2 text-[#39A900] font-medium text-sm mb-3">
                <Info size={16} /> Resumen del evento
              </div>
              {[
                { label: "Título", value: form.titulo || "—" },
                { label: "Categoría", value: form.categoria || "—" },
                { label: "Fecha", value: form.fecha || "—" },
                { label: "Horario", value: form.horaInicio && form.horaFin ? `${form.horaInicio} – ${form.horaFin}` : "—" },
                { label: "Lugar", value: form.lugar ? LOCACIONES_EVENTO_LABELS[form.lugar as keyof typeof LOCACIONES_EVENTO_LABELS] : "—" },
                { label: "Capacidad", value: form.capacidad ? `${form.capacidad} personas` : "—" },
              ].map(({ label, value }) => (
                <div key={label} className="flex justify-between text-sm">
                  <span className="text-gray-500">{label}:</span>
                  <span className="text-gray-800 font-medium">{value}</span>
                </div>
              ))}
            </div>

            <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 flex gap-3">
              <Info size={18} className="text-yellow-600 flex-shrink-0 mt-0.5" />
              <p className="text-yellow-700 text-sm">
                El evento será enviado para revisión y aprobación por el administrador del Centro antes de ser publicado.
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Navigation buttons */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => step > 1 ? setStep(s => s - 1) : navigate("/eventos")}
          className="flex items-center gap-2 px-5 py-2.5 border border-gray-200 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors text-sm"
        >
          <ArrowLeft size={16} /> {step > 1 ? "Anterior" : "Cancelar"}
        </button>

        {step < 3 ? (
          <button
            onClick={() => setStep(s => s + 1)}
            className="px-6 py-2.5 bg-[#39A900] hover:bg-[#2d8a00] text-white rounded-xl font-medium transition-colors text-sm"
          >
            Siguiente →
          </button>
        ) : (
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="flex items-center gap-2 px-6 py-2.5 bg-[#39A900] hover:bg-[#2d8a00] text-white rounded-xl font-medium transition-colors text-sm"
          >
            <CheckCircle2 size={16} /> {loading ? "Creando..." : "Crear Evento"}
          </button>
        )}
      </div>
    </div>
  );
}
