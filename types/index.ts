// ─── Enums ───────────────────────────────────────────────────────────────────

export type StatusPublication = "ACTIVE" | "INACTIVE" | "PENDING";
export type StatusReservation =
  | "PENDING"
  | "CONFIRMED"
  | "CANCELLED"
  | "COMPLETED";
export type StatusPayement = "PENDING" | "PAID" | "FAILED" | "REFUNDED";
export type CargoCategory =
  | "STANDARD"
  | "FRAGILE"
  | "PERISHABLE"
  | "HAZARDOUS"
  | "OVERSIZED";
export type RoleUtilisateur = "CLIENT" | "TRANSPORTEUR";

// ─── Entities ─────────────────────────────────────────────────────────────────

export interface Utilisateur {
  id_utilisateur: number;
  nom: string;
  prenom: string;
  cin: string;
  phone: string;
  adresse: string;
  city: string;
  date_naissance: string;
  email: string;
  role: RoleUtilisateur;
  date_creation: string;
  date_mise_a_jour: string;
  transporteur?: { id_transporteur: number };
  client?: { id_client: number; image?: string | null };
}

export interface Transport {
  id_transport: number;
  description: string;
  marque: string;
  immatriculation: string;
  type: string;
  images: string;
  transporteur_id: number;
}

export interface PbTransport {
  id_pb_transport: number;
  depart: string;
  destination: string;
  capacite_transport: number;
  status: StatusPublication;
  prix_par_kilo: number;
  prix_fragile_par_kilo: number;
  transport_id: number;
  transport?: {
    marque: string;
    type: string;
    immatriculation: string;
    images?: string;
    transporteur?: {
      utilisateur?: { nom: string; prenom: string; phone: string };
    };
  };
  _count?: { reservations: number };
}

export interface TransportReservation {
  id_reservation: number;
  date_reservation: string;
  category: CargoCategory;
  fragile: boolean;
  poids: number;
  dimension: number;
  date_depart: string;
  depart: string;
  destination: string;
  nom_recepteur: string;
  tel_recepteur: string;
  label: string;
  status: StatusReservation;
  pb_transport_id: number;
  client_id: number;
  pb_transport?: PbTransport;
  payement?: {
    status: StatusPayement;
    prix: number;
    date_payement: string;
  } | null;
  cargo_reservation?: CargoReservation | null;
}

export interface CargoReservation {
  id_cargo_reservation: number;
  status: StatusReservation;
  date_reservation: string;
  prix: number;
  reservation_id: number;
  reservation?: TransportReservation;
  payement?: { status: StatusPayement; prix: number } | null;
}

export interface Payement {
  id_payement: number;
  date_payement: string;
  status: StatusPayement;
  prix: number;
  num_telephone: string;
  reservation_id?: number | null;
  cargo_reservation_id?: number | null;
  reservation?: Partial<TransportReservation> | null;
  cargo_reservation?: Partial<CargoReservation> | null;
}

export interface PbMarchandise {
  id_pb_marchandise: number;
  label: string;
  category: CargoCategory;
  fragile: boolean;
  poids: number;
  dimension: number;
  status: StatusPublication;
  date_depart: string;
  depart: string;
  destination: string;
  nom_recepteur: string;
  tel_recepteur: string;
  date_creation: string;
  date_mise_a_jour: string;
  client_id: number;
}

// ─── API Responses ────────────────────────────────────────────────────────────

export interface PaginatedResponse<T> {
  data: T[];
  meta: { total: number; page: number; limit: number; totalPages: number };
}

export interface SingleResponse<T> {
  data: T;
}
