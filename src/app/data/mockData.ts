export type Role = "admin" | "organizador" | "instructor" | "aprendiz" | "general";

export interface User {
  id: string;
  nombre: string;
  apellido: string;
  email: string;
  role: Role;
  ficha?: string;
  programa?: string;
  avatar?: string;
  documento?: string;
}

export interface Evento {
  id: string;
  titulo: string;
  descripcion: string;
  fecha: string;
  horaInicio: string;
  horaFin: string;
  lugar: string;
  categoria: "academico" | "deportivo" | "cultural" | "bienestar" | "institucional";
  estado: "pendiente" | "aprobado" | "rechazado" | "finalizado";
  organizadorId: string;
  capacidad: number;
  inscritos: number;
  imagen?: string;
  qrCode?: string;
  requiereAprobacion: boolean;
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
  tipo: "psicologico" | "social" | "academico" | "familiar" | "economico" | "salud";
  estado: "abierto" | "en_seguimiento" | "cerrado" | "derivado_paedp";
  prioridad: "baja" | "media" | "alta" | "urgente";
  psicologaId: string;
  fechaApertura: string;
  fechaUltimoSeguimiento: string;
  seguimientos: Seguimiento[];
  paedpActivado: boolean;
}

export interface Seguimiento {
  id: string;
  fecha: string;
  descripcion: string;
  accion: string;
  profesional: string;
  proxCita?: string;
}

export interface CasoPAEDP {
  id: string;
  casosBienestarId: string;
  aprendizId: string;
  motivoActivacion: string;
  enfoque: string[];
  fechaActivacion: string;
  estado: "activo" | "en_proceso" | "cerrado";
  responsables: string[];
  acciones: AccionPAEDP[];
}

export interface AccionPAEDP {
  id: string;
  fecha: string;
  descripcion: string;
  responsable: string;
  resultado: string;
}

export interface Asistencia {
  id: string;
  eventoId: string;
  aprendizId: string;
  horaRegistro: string;
  metodo: "qr" | "manual" | "lista";
  registradoPor: string;
}

// ── USUARIOS MOCK ──────────────────────────────────────────────────
export const USERS: User[] = [
  {
    id: "u1",
    nombre: "Carlos",
    apellido: "Rodríguez",
    email: "admin@sena.edu.co",
    role: "admin",
    documento: "1000234567",
    avatar: "CR",
  },
  {
    id: "u2",
    nombre: "Laura",
    apellido: "Gómez",
    email: "organizador@sena.edu.co",
    role: "organizador",
    documento: "1000345678",
    avatar: "LG",
  },
  {
    id: "u3",
    nombre: "Andrés",
    apellido: "Martínez",
    email: "instructor@sena.edu.co",
    role: "instructor",
    documento: "1000456789",
    avatar: "AM",
  },
  {
    id: "u4",
    nombre: "Valentina",
    apellido: "Torres",
    email: "aprendiz@sena.edu.co",
    role: "aprendiz",
    ficha: "2874561",
    programa: "Tecnología en Gestión Empresarial",
    documento: "1088234567",
    avatar: "VT",
  },
  {
    id: "u5",
    nombre: "Diego",
    apellido: "Vargas",
    email: "general@email.com",
    role: "general",
    documento: "1090234567",
    avatar: "DV",
  },
  {
    id: "u6",
    nombre: "Sofía",
    apellido: "Herrera",
    email: "psicologa@sena.edu.co",
    role: "organizador",
    documento: "1000567890",
    avatar: "SH",
  },
  {
    id: "u7",
    nombre: "Miguel",
    apellido: "Ospina",
    email: "aprendiz2@sena.edu.co",
    role: "aprendiz",
    ficha: "2874562",
    programa: "Gastronomía y Culinaria",
    documento: "1095234567",
    avatar: "MO",
  },
  {
    id: "u8",
    nombre: "Camila",
    apellido: "Ríos",
    email: "aprendiz3@sena.edu.co",
    role: "aprendiz",
    ficha: "2874563",
    programa: "Animación y Desarrollo de Videojuegos",
    documento: "1092234567",
    avatar: "CR",
  },
];

// ── EVENTOS MOCK ───────────────────────────────────────────────────
export const EVENTOS: Evento[] = [
  {
    id: "e1",
    titulo: "Feria de Emprendimiento SENA 2025",
    descripcion: "Exposición de proyectos productivos de los aprendices del Centro de Comercio y Turismo. Presenta tu idea de negocio ante jurados especializados y emprendedores del Quindío.",
    fecha: "2025-05-15",
    horaInicio: "08:00",
    horaFin: "17:00",
    lugar: "Auditorio Principal - SENA Quindío",
    categoria: "academico",
    estado: "aprobado",
    organizadorId: "u2",
    capacidad: 200,
    inscritos: 147,
    imagen: "https://images.unsplash.com/photo-1541265337361-e60178d43b83?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxTRU5BJTIwQ29sb21iaWElMjBzdHVkZW50cyUyMGxlYXJuaW5nJTIwd29ya3Nob3B8ZW58MXx8fHwxNzc2ODAyNjcyfDA&ixlib=rb-4.1.0&q=80&w=1080",
    requiereAprobacion: false,
  },
  {
    id: "e2",
    titulo: "Torneo Deportivo Interfichas",
    descripcion: "Competencia deportiva entre fichas de formación en modalidades de fútbol, baloncesto y voleibol. Promueve la integración y el trabajo en equipo.",
    fecha: "2025-05-22",
    horaInicio: "14:00",
    horaFin: "18:00",
    lugar: "Cancha Polideportiva - SENA Quindío",
    categoria: "deportivo",
    estado: "aprobado",
    organizadorId: "u2",
    capacidad: 150,
    inscritos: 98,
    imagen: "https://images.unsplash.com/photo-1770668951936-3bf67d737ec0?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzcG9ydCUyMHRvdXJuYW1lbnQlMjBzdHVkZW50cyUyMGNvbXBldGl0aW9ufGVufDF8fHx8MTc3NjgwMjY3NXww&ixlib=rb-4.1.0&q=80&w=1080",
    requiereAprobacion: false,
  },
  {
    id: "e3",
    titulo: "Festival Cultural de Talentos",
    descripcion: "Muestra artística y cultural de los aprendices del Centro. Música, danza, teatro y artes visuales en un evento para toda la comunidad SENA.",
    fecha: "2025-06-05",
    horaInicio: "15:00",
    horaFin: "20:00",
    lugar: "Plaza Central - SENA Quindío",
    categoria: "cultural",
    estado: "pendiente",
    organizadorId: "u2",
    capacidad: 300,
    inscritos: 45,
    imagen: "https://images.unsplash.com/photo-1774301815164-290fc5ec893a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjdWx0dXJhbCUyMGV2ZW50JTIwbXVzaWMlMjBwZXJmb3JtYW5jZSUyMHlvdXRofGVufDF8fHx8MTc3NjgwMjY3NXww&ixlib=rb-4.1.0&q=80&w=1080",
    requiereAprobacion: true,
  },
  {
    id: "e4",
    titulo: "Conferencia: Salud Mental en el Trabajo",
    descripcion: "Taller de bienestar integral enfocado en el manejo del estrés, la inteligencia emocional y el equilibrio vida-trabajo para aprendices e instructores.",
    fecha: "2025-05-28",
    horaInicio: "09:00",
    horaFin: "12:00",
    lugar: "Sala de Capacitación B - Bloque 2",
    categoria: "bienestar",
    estado: "aprobado",
    organizadorId: "u6",
    capacidad: 50,
    inscritos: 48,
    imagen: "https://images.unsplash.com/photo-1714976695031-a8977db2f095?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzdHVkZW50JTIwd2VsbG5lc3MlMjBwc3ljaG9sb2d5JTIwc3VwcG9ydHxlbnwxfHx8fDE3NzY4MDI2NzJ8MA&ixlib=rb-4.1.0&q=80&w=1080",
    requiereAprobacion: false,
  },
  {
    id: "e5",
    titulo: "Ceremonia de Graduación - Primer Semestre 2025",
    descripcion: "Acto protocolario de graduación de los aprendices que culminaron su proceso de formación. Evento institucional de gran relevancia para el Centro.",
    fecha: "2025-06-20",
    horaInicio: "10:00",
    horaFin: "13:00",
    lugar: "Auditorio Principal - SENA Quindío",
    categoria: "institucional",
    estado: "pendiente",
    organizadorId: "u2",
    capacidad: 500,
    inscritos: 312,
    imagen: "https://images.unsplash.com/photo-1633125093609-99ab69cd273e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb3Jwb3JhdGUlMjBldmVudCUyMGNvbmZlcmVuY2UlMjBoYWxsJTIwQ29sb21iaWF8ZW58MXx8fHwxNzc2ODAyNjcxfDA&ixlib=rb-4.1.0&q=80&w=1080",
    requiereAprobacion: true,
  },
  {
    id: "e6",
    titulo: "Hackathon: Innovación Digital 2025",
    descripcion: "Maratón de programación e innovación digital para aprendices de tecnología. Compite en equipos y desarrolla soluciones tecnológicas para problemáticas reales.",
    fecha: "2025-04-10",
    horaInicio: "08:00",
    horaFin: "20:00",
    lugar: "Laboratorio de Cómputo - Bloque 3",
    categoria: "academico",
    estado: "finalizado",
    organizadorId: "u2",
    capacidad: 80,
    inscritos: 80,
    imagen: "https://images.unsplash.com/photo-1541265337361-e60178d43b83?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxTRU5BJTIwQ29sb21iaWElMjBzdHVkZW50cyUyMGxlYXJuaW5nJTIwd29ya3Nob3B8ZW58MXx8fHwxNzc2ODAyNjcyfDA&ixlib=rb-4.1.0&q=80&w=1080",
    requiereAprobacion: false,
  },
];

// ── INSCRIPCIONES MOCK ─────────────────────────────────────────────
export const INSCRIPCIONES: Inscripcion[] = [
  { id: "i1", eventoId: "e1", aprendizId: "u4", fechaInscripcion: "2025-04-20", estado: "inscrito", confirmado: true },
  { id: "i2", eventoId: "e2", aprendizId: "u4", fechaInscripcion: "2025-04-21", estado: "inscrito", confirmado: false },
  { id: "i3", eventoId: "e4", aprendizId: "u4", fechaInscripcion: "2025-04-18", estado: "inscrito", confirmado: true },
  { id: "i4", eventoId: "e6", aprendizId: "u4", fechaInscripcion: "2025-03-25", estado: "asistio", confirmado: true },
  { id: "i5", eventoId: "e1", aprendizId: "u7", fechaInscripcion: "2025-04-19", estado: "inscrito", confirmado: true },
  { id: "i6", eventoId: "e6", aprendizId: "u7", fechaInscripcion: "2025-03-26", estado: "asistio", confirmado: true },
  { id: "i7", eventoId: "e6", aprendizId: "u8", fechaInscripcion: "2025-03-27", estado: "no_asistio", confirmado: false },
];

// ── CASOS BIENESTAR MOCK ───────────────────────────────────────────
export const CASOS_BIENESTAR: CasosBienestar[] = [
  {
    id: "cb1",
    aprendizId: "u4",
    titulo: "Dificultades de adaptación al ambiente formativo",
    descripcion: "El aprendiz presenta dificultades para adaptarse al ritmo de aprendizaje y muestra signos de ansiedad académica.",
    tipo: "psicologico",
    estado: "en_seguimiento",
    prioridad: "media",
    psicologaId: "u6",
    fechaApertura: "2025-03-10",
    fechaUltimoSeguimiento: "2025-04-15",
    paedpActivado: false,
    seguimientos: [
      {
        id: "s1",
        fecha: "2025-03-10",
        descripcion: "Primera consulta. El aprendiz expresa dificultades con el manejo del tiempo y ansiedad ante evaluaciones.",
        accion: "Remisión a atención psicológica individual. Plan de seguimiento quincenal.",
        profesional: "Sofía Herrera",
        proxCita: "2025-03-24",
      },
      {
        id: "s2",
        fecha: "2025-03-24",
        descripcion: "Segunda sesión. Se observa leve mejoría en manejo de ansiedad. Implementa técnicas de respiración.",
        accion: "Continuar seguimiento. Se coordina con instructor para apoyo académico.",
        profesional: "Sofía Herrera",
        proxCita: "2025-04-07",
      },
      {
        id: "s3",
        fecha: "2025-04-07",
        descripcion: "Tercera sesión. El aprendiz muestra avances significativos. Mejora en rendimiento académico.",
        accion: "Seguimiento mensual. Cierre parcial de intervención en crisis.",
        profesional: "Sofía Herrera",
        proxCita: "2025-05-07",
      },
      {
        id: "s4",
        fecha: "2025-04-15",
        descripcion: "Llamada de seguimiento. El aprendiz reporta bienestar general. Continúa con técnicas aprendidas.",
        accion: "Mantener apoyo. Próxima cita en mayo.",
        profesional: "Sofía Herrera",
        proxCita: "2025-05-07",
      },
    ],
  },
  {
    id: "cb2",
    aprendizId: "u7",
    titulo: "Situación de vulnerabilidad socioeconómica",
    descripcion: "El aprendiz reporta dificultades económicas que afectan su continuidad en la formación. Ausencias por falta de transporte y alimentación.",
    tipo: "economico",
    estado: "abierto",
    prioridad: "alta",
    psicologaId: "u6",
    fechaApertura: "2025-04-08",
    fechaUltimoSeguimiento: "2025-04-08",
    paedpActivado: false,
    seguimientos: [
      {
        id: "s5",
        fecha: "2025-04-08",
        descripcion: "El aprendiz llega al área de bienestar reportando dificultades económicas graves. No tiene para transporte ni alimentación.",
        accion: "Se gestiona subsidio de transporte y acceso al comedor estudiantil. Remisión a trabajadora social.",
        profesional: "Sofía Herrera",
        proxCita: "2025-04-22",
      },
    ],
  },
  {
    id: "cb3",
    aprendizId: "u8",
    titulo: "Conflicto con compañeros de ficha - Posible matoneo",
    descripcion: "Se reportan situaciones de exclusión y bullying por parte de compañeros de la ficha de formación. El aprendiz presenta cambios de comportamiento.",
    tipo: "social",
    estado: "derivado_paedp",
    prioridad: "urgente",
    psicologaId: "u6",
    fechaApertura: "2025-03-25",
    fechaUltimoSeguimiento: "2025-04-18",
    paedpActivado: true,
    seguimientos: [
      {
        id: "s6",
        fecha: "2025-03-25",
        descripcion: "Instructor reporta cambio de comportamiento en aprendiz. Se realiza entrevista individual y se identifican situaciones de matoneo.",
        accion: "Intervención inmediata. Reunión con ficha. Activación de ruta PAEDP por enfoque de género y convivencia.",
        profesional: "Sofía Herrera",
        proxCita: "2025-04-01",
      },
      {
        id: "s7",
        fecha: "2025-04-01",
        descripcion: "Reunión con coordinación académica e instructores. Se establecen compromisos con aprendices involucrados.",
        accion: "Plan de convivencia activado. Seguimiento semanal con aprendiz afectada.",
        profesional: "Sofía Herrera",
        proxCita: "2025-04-08",
      },
      {
        id: "s8",
        fecha: "2025-04-18",
        descripcion: "Mejoría en ambiente grupal. El aprendiz reporta sentirse mejor. Los compromisos se están cumpliendo.",
        accion: "Continuar seguimiento quincenal. Cierre de ruta PAEDP en proceso.",
        profesional: "Sofía Herrera",
        proxCita: "2025-05-02",
      },
    ],
  },
  {
    id: "cb4",
    aprendizId: "u4",
    titulo: "Apoyo en proceso de duelo familiar",
    descripcion: "El aprendiz atraviesa un proceso de duelo por pérdida de familiar cercano. Afecta su concentración y asistencia.",
    tipo: "familiar",
    estado: "cerrado",
    prioridad: "media",
    psicologaId: "u6",
    fechaApertura: "2025-02-01",
    fechaUltimoSeguimiento: "2025-03-15",
    paedpActivado: false,
    seguimientos: [
      {
        id: "s9",
        fecha: "2025-02-01",
        descripcion: "El aprendiz solicita atención psicológica tras pérdida de familiar. Se brinda acompañamiento inicial.",
        accion: "Atención en duelo. Permisos académicos gestionados con coordinación.",
        profesional: "Sofía Herrera",
        proxCita: "2025-02-15",
      },
      {
        id: "s10",
        fecha: "2025-03-15",
        descripcion: "El aprendiz ha transitado satisfactoriamente el proceso de duelo. Retoma actividades con normalidad.",
        accion: "Cierre del caso. El aprendiz cuenta con habilidades de afrontamiento adecuadas.",
        profesional: "Sofía Herrera",
      },
    ],
  },
];

// ── CASOS PAEDP MOCK ──────────────────────────────────────────────
export const CASOS_PAEDP: CasoPAEDP[] = [
  {
    id: "p1",
    casosBienestarId: "cb3",
    aprendizId: "u8",
    motivoActivacion: "Situación de matoneo y exclusión social con componente de género identificado en la ficha de formación.",
    enfoque: ["Género", "Convivencia", "Inclusión"],
    fechaActivacion: "2025-03-25",
    estado: "en_proceso",
    responsables: ["Sofía Herrera - Psicóloga", "Carlos López - Coordinador Académico", "Andrés Martínez - Instructor"],
    acciones: [
      {
        id: "a1",
        fecha: "2025-03-25",
        descripcion: "Activación formal de la ruta PAEDP. Convocatoria del equipo interdisciplinario.",
        responsable: "Sofía Herrera",
        resultado: "Equipo conformado y primer plan de acción definido.",
      },
      {
        id: "a2",
        fecha: "2025-04-01",
        descripcion: "Taller de convivencia con la ficha 2874563. Trabajo en valores y respeto a la diferencia.",
        responsable: "Andrés Martínez",
        resultado: "Participación activa del 95% de los aprendices. Compromisos firmados.",
      },
      {
        id: "a3",
        fecha: "2025-04-18",
        descripcion: "Seguimiento individual con aprendiz afectada y entrevistas con presuntos agresores.",
        responsable: "Sofía Herrera",
        resultado: "Se evidencia cambio positivo en la dinámica grupal. Proceso en cierre.",
      },
    ],
  },
];

// ── ASISTENCIA MOCK ────────────────────────────────────────────────
export const ASISTENCIA_MOCK: Asistencia[] = [
  { id: "as1", eventoId: "e6", aprendizId: "u4", horaRegistro: "08:15", metodo: "qr", registradoPor: "u4" },
  { id: "as2", eventoId: "e6", aprendizId: "u7", horaRegistro: "08:22", metodo: "qr", registradoPor: "u7" },
  { id: "as3", eventoId: "e6", aprendizId: "u8", horaRegistro: "08:45", metodo: "manual", registradoPor: "u3" },
];

// ── APRENDICES POR FICHA MOCK ──────────────────────────────────────
export const APRENDICES_FICHA = [
  { id: "u4", nombre: "Valentina Torres", ficha: "2874561", programa: "Tecnología en Gestión Empresarial", documento: "1088234567" },
  { id: "u7", nombre: "Miguel Ospina", ficha: "2874562", programa: "Gastronomía y Culinaria", documento: "1095234567" },
  { id: "u8", nombre: "Camila Ríos", ficha: "2874563", programa: "Animación y Desarrollo de Videojuegos", documento: "1092234567" },
  { id: "u9", nombre: "Juan Pérez", ficha: "2874561", programa: "Tecnología en Gestión Empresarial", documento: "1099234567" },
  { id: "u10", nombre: "María Salcedo", ficha: "2874561", programa: "Tecnología en Gestión Empresarial", documento: "1087234567" },
  { id: "u11", nombre: "Andrés Cano", ficha: "2874562", programa: "Gastronomía y Culinaria", documento: "1096234567" },
  { id: "u12", nombre: "Luisa Fernanda Muñoz", ficha: "2874563", programa: "Animación y Desarrollo de Videojuegos", documento: "1093234567" },
  { id: "u13", nombre: "Sebastián Gómez", ficha: "2874561", programa: "Tecnología en Gestión Empresarial", documento: "1085234567" },
];

export const CATEGORIAS_LABELS: Record<string, string> = {
  academico: "Académico",
  deportivo: "Deportivo",
  cultural: "Cultural",
  bienestar: "Bienestar",
  institucional: "Institucional",
};

export const ESTADO_EVENTO_LABELS: Record<string, string> = {
  pendiente: "Pendiente",
  aprobado: "Aprobado",
  rechazado: "Rechazado",
  finalizado: "Finalizado",
};

export const TIPO_BIENESTAR_LABELS: Record<string, string> = {
  psicologico: "Psicológico",
  social: "Social",
  academico: "Académico",
  familiar: "Familiar",
  economico: "Económico",
  salud: "Salud",
};

export const ESTADO_BIENESTAR_LABELS: Record<string, string> = {
  abierto: "Abierto",
  en_seguimiento: "En seguimiento",
  cerrado: "Cerrado",
  derivado_paedp: "Derivado PAEDP",
};
