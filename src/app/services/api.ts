import type { Evento, User } from "../data/domain";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? "http://localhost:8080/api";

type HttpMethod = "GET" | "POST" | "PUT" | "PATCH" | "DELETE";

interface RequestOptions {
  method?: HttpMethod;
  body?: unknown;
  token?: string | null;
}

export interface AuthResponse {
  token: string;
  user: User;
}

export async function apiRequest<T>(path: string, options: RequestOptions = {}): Promise<T> {
  const { method = "GET", body, token = localStorage.getItem("auth_token") } = options;
  const response = await fetch(`${API_BASE_URL}${path}`, {
    method,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: body ? JSON.stringify(body) : undefined,
  });

  if (!response.ok) {
    let message = `Error HTTP ${response.status}`;
    try {
      const errorData = await response.json();
      if (errorData && errorData.message) {
        message = errorData.message;
      }
    } catch {
      message = await response.text() || message;
    }
    throw new Error(message);
  }

  if (response.status === 204) {
    return undefined as T;
  }

  return response.json() as Promise<T>;
}

export async function uploadRequest<T>(path: string, file: File): Promise<T> {
  const token = localStorage.getItem("auth_token");
  const formData = new FormData();
  formData.append("file", file);

  const response = await fetch(`${API_BASE_URL}${path}`, {
    method: "POST",
    headers: {
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: formData,
  });

  if (!response.ok) {
    let message = `Error HTTP ${response.status}`;
    try {
      const errorData = await response.json();
      if (errorData && errorData.message) {
        message = errorData.message;
      }
    } catch {
      message = await response.text() || message;
    }
    throw new Error(message);
  }

  return response.json() as Promise<T>;
}

export const authApi = {
  login: (documento: string, password: string) =>
    apiRequest<AuthResponse>("/auth/login", {
      method: "POST",
      body: { documento, password },
      token: null,
    }),
  me: () => apiRequest<User>("/auth/me"),
  cambiarPassword: (passwordActual: string, passwordNueva: string) =>
    apiRequest<void>("/auth/cambiar-password", {
      method: "PUT",
      body: { passwordActual, passwordNueva },
    }),
};

export const usersApi = {
  findAll: (rol?: string) => apiRequest<User[]>(rol ? `/users?rol=${rol}` : "/users"),
  create: (usuario: { nombres: string; apellidos: string; documento: string; email?: string; rol?: string; fichaId?: number }) =>
    apiRequest<User>("/users", {
      method: "POST",
      body: usuario,
    }),
};

export interface ImagenUploadResponse {
  fileName: string;
  contentType: string;
  size: number;
  imageUrl: string;
  simulated: boolean;
}

export const eventosApi = {
  findAll: () => apiRequest<Evento[]>("/eventos"),
  findById: (id: string) => apiRequest<Evento>(`/eventos/${id}`),
  create: (evento: {
    titulo: string;
    descripcion: string;
    fecha: string;
    horaInicio: string;
    horaFin: string;
    lugar: string;
    categoria: string;
    capacidad: number;
    imagenUrl?: string;
  }) =>
    apiRequest<Evento>("/eventos", {
      method: "POST",
      body: {
        ...evento,
        lugar: evento.lugar.toUpperCase(),
        categoria: evento.categoria.toUpperCase(),
      },
    }),
  simulateImageUpload: (file: File) => uploadRequest<ImagenUploadResponse>("/eventos/imagenes/simular", file),
};

export const endpoints = {
  users: "/users",
  eventos: "/eventos",
  inscripciones: "/inscripciones",
  bienestar: "/bienestar/casos",  asistencia: "/asistencias",
  aprendices: "/aprendices",
};
