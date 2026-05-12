export type Role = "admin" | "organizador" | "instructor" | "aprendiz";

export type LocacionEvento =
  | "centro_comercio_turismo"
  | "centro_agroindustrial"
  | "centro_sena_construccion";

export interface User {
  id: string;
  nombre: string;
  apellido: string;
  documento?: string;
  email?: string;
  role: Role;
  ficha?: string;
  programa?: string;
  avatar?: string;
}

export interface Evento {
  id: string;
  titulo: string;
  descripcion: string;
  fecha: string;
  horaInicio: string;
  horaFin: string;
  lugar: LocacionEvento;
  categoria: "academico" | "deportivo" | "cultural" | "bienestar" | "institucional";
  estado: "pendiente" | "iniciado" | "terminado" | "cancelado";
  organizadorId: string;
  capacidad: number;
  inscritos: number;
  imagen?: string;
}

export interface Inscripcion {
  id: string;
  eventoId: string;
  aprendizId: string;
  fechaInscripcion: string;
  estado: "inscrito" | "asistio" | "no_asistio" | "cancelado";
  confirmado: boolean;
}

export interface CasosBienestar {
  id: string;
  aprendizId: string;
  titulo: string;
  descripcion: string;
  tipo?: "psicologico" | "social" | "academico" | "familiar" | "economico" | "salud";
  estado: "abierto" | "en_seguimiento" | "cerrado";
  prioridad?: "baja" | "media" | "alta" | "urgente";
  profesionalId?: string;
  psicologaId?: string;
  fechaApertura: string;
  fechaUltimoSeguimiento: string;
  seguimientos: Seguimiento[];
  SeguimientoActivado?: boolean;
}

export interface Seguimiento {
  id: string;
  fecha: string;
  descripcion: string;
  accion: string;
  profesional: string;
  proxCita?: string;
}

export interface Asistencia {
  id: string;
  eventoId: string;
  aprendizId: string;
  horaRegistro: string;
  metodo: "manual" | "lista";
  registradoPor: string;
}

export interface AprendizFicha {
  id: string;
  nombre: string;
  ficha: string;
  programa: string;
  documento: string;
}

export const USERS: User[] = [];
export const EVENTOS: Evento[] = [];
export const INSCRIPCIONES: Inscripcion[] = [];
export const CASOS_BIENESTAR: CasosBienestar[] = [];
export const ASISTENCIAS: Asistencia[] = [];
export const APRENDICES_FICHA: AprendizFicha[] = [];

export const LOCACIONES_EVENTO_LABELS: Record<LocacionEvento, string> = {
  centro_comercio_turismo: "Centro de Comercio y Turismo",
  centro_agroindustrial: "Centro Agroindustrial",
  centro_sena_construccion: "Centro SENA Construccion",
};

export const CATEGORIAS_LABELS: Record<Evento["categoria"], string> = {
  academico: "Academico",
  deportivo: "Deportivo",
  cultural: "Cultural",
  bienestar: "Bienestar",
  institucional: "Institucional",
};

export const ESTADO_EVENTO_LABELS: Record<Evento["estado"], string> = {
  pendiente: "Pendiente",
  iniciado: "Iniciado",
  terminado: "Terminado",
  cancelado: "Cancelado",
};

export const TIPO_BIENESTAR_LABELS: Record<NonNullable<CasosBienestar["tipo"]>, string> = {
  psicologico: "Psicologico",
  social: "Social",
  academico: "Academico",
  familiar: "Familiar",
  economico: "Economico",
  salud: "Salud",
};

export const ESTADO_BIENESTAR_LABELS: Record<CasosBienestar["estado"], string> = {
  abierto: "Abierto",
  en_seguimiento: "En seguimiento",
  cerrado: "Cerrado",
};
