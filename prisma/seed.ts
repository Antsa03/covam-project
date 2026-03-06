import "dotenv/config";
import { Pool } from "pg";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../lib/generated/prisma/client";
import bcrypt from "bcryptjs";

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

// ─── Villes ──────────────────────────────────────────────────────────────────
const VILLES = [
  "Antananarivo",
  "Toamasina",
  "Mahajanga",
  "Fianarantsoa",
  "Toliara",
  "Antsiranana",
  "Antsirabe",
  "Morondava",
  "Ambositra",
  "Nosy Be",
];

async function main() {
  console.log("🌱 Démarrage du seed...\n");

  // ─── Nettoyage ─────────────────────────────────────────────────────────────
  await prisma.payement.deleteMany();
  await prisma.cargoReservation.deleteMany();
  await prisma.transportReservation.deleteMany();
  await prisma.pbMarchandise.deleteMany();
  await prisma.pbTransport.deleteMany();
  await prisma.transport.deleteMany();
  await prisma.transporteur.deleteMany();
  await prisma.client.deleteMany();
  await prisma.utilisateur.deleteMany();
  await prisma.admin.deleteMany();
  console.log("🗑️  Base de données nettoyée.");

  // ─── Admin ─────────────────────────────────────────────────────────────────
  const adminHash = await bcrypt.hash("admin123", 10);
  await prisma.admin.create({
    data: {
      nom_utilisateur: "admin",
      mot_de_passe: adminHash,
    },
  });
  console.log("✅ Admin créé  →  login: admin / mdp: admin123");

  // ─── Utilisateurs Transporteurs ────────────────────────────────────────────
  const passwordHash = await bcrypt.hash("password123", 10);

  const transporteurUsers = await Promise.all([
    prisma.utilisateur.create({
      data: {
        nom: "Rakoto",
        prenom: "Jean",
        cin: "MG-T-001",
        phone: "+261 34 00 111 22",
        adresse: "Lot II J 67, Ankadifotsy",
        city: "Antananarivo",
        date_naissance: new Date("1982-06-10"),
        email: "jean.rakoto@transport.mg",
        mot_de_passe: passwordHash,
        role: "TRANSPORTEUR",
      },
    }),
    prisma.utilisateur.create({
      data: {
        nom: "Razafy",
        prenom: "Hanta",
        cin: "MG-T-002",
        phone: "+261 33 00 222 33",
        adresse: "Rue de la Mer, Bazar Be",
        city: "Toamasina",
        date_naissance: new Date("1988-11-05"),
        email: "hanta.razafy@transport.mg",
        mot_de_passe: passwordHash,
        role: "TRANSPORTEUR",
      },
    }),
  ]);
  console.log("✅ 2 utilisateurs Transporteur créés.");

  // ─── Transporteurs ─────────────────────────────────────────────────────────
  const [transporteur1, transporteur2] = await Promise.all(
    transporteurUsers.map((u) =>
      prisma.transporteur.create({
        data: { utilisateur_id: u.id_utilisateur },
      }),
    ),
  );
  console.log("✅ 2 Transporteurs créés.");

  // ─── Utilisateurs Clients ──────────────────────────────────────────────────
  const clientUsers = await Promise.all([
    prisma.utilisateur.create({
      data: {
        nom: "Randria",
        prenom: "Noro",
        cin: "MG-C-001",
        phone: "+261 34 00 333 44",
        adresse: "Immeuble Rova, Analakely",
        city: "Antananarivo",
        date_naissance: new Date("1993-02-14"),
        email: "noro.randria@gmail.com",
        mot_de_passe: passwordHash,
        role: "CLIENT",
      },
    }),
    prisma.utilisateur.create({
      data: {
        nom: "Rasolofo",
        prenom: "Fidy",
        cin: "MG-C-002",
        phone: "+261 32 00 444 55",
        adresse: "Quartier Ampasika",
        city: "Fianarantsoa",
        date_naissance: new Date("1990-09-28"),
        email: "fidy.rasolofo@gmail.com",
        mot_de_passe: passwordHash,
        role: "CLIENT",
      },
    }),
    prisma.utilisateur.create({
      data: {
        nom: "Rajaonarison",
        prenom: "Miora",
        cin: "MG-C-003",
        phone: "+261 38 00 555 66",
        adresse: "Rue du Port, Mahajanga Be",
        city: "Mahajanga",
        date_naissance: new Date("1995-05-20"),
        email: "miora.rajaonarison@gmail.com",
        mot_de_passe: passwordHash,
        role: "CLIENT",
      },
    }),
  ]);
  console.log("✅ 3 utilisateurs Client créés.");

  // ─── Clients ────────────────────────────────────────────────────────────────
  const [client1, client2, client3] = await Promise.all(
    clientUsers.map((u) =>
      prisma.client.create({
        data: { utilisateur_id: u.id_utilisateur },
      }),
    ),
  );
  console.log("✅ 3 Clients créés.");

  // ─── Transports (Véhicules) ────────────────────────────────────────────────
  const [transport1, transport2, transport3] = await Promise.all([
    prisma.transport.create({
      data: {
        description: "Camion benne 20 tonnes, état excellent, route nationale",
        marque: "Mercedes-Benz",
        immatriculation: "MG-AA-2234",
        type: "Camion benne",
        images: "/uploads/transports/camion1.jpg",
        transporteur_id: transporteur1.id_transporteur,
      },
    }),
    prisma.transport.create({
      data: {
        description: "Camion frigorifique pour marchandises périssables",
        marque: "Renault",
        immatriculation: "MG-AA-5678",
        type: "Camion frigorifique",
        images: "/uploads/transports/camion2.jpg",
        transporteur_id: transporteur1.id_transporteur,
      },
    }),
    prisma.transport.create({
      data: {
        description: "Fourgonnette rapide pour petits colis, service côtier",
        marque: "Toyota",
        immatriculation: "MG-TM-9012",
        type: "Fourgonnette",
        images: "/uploads/transports/fourgon1.jpg",
        transporteur_id: transporteur2.id_transporteur,
      },
    }),
  ]);
  console.log("✅ 3 Transports créés.");

  // ─── Transporteurs supplémentaires pour enrichir les annonces ─────────────
  const extraUsers = await Promise.all([
    prisma.utilisateur.create({
      data: {
        nom: "Andriamampionona",
        prenom: "Solo",
        cin: "MG-T-003",
        phone: "+261 34 00 777 88",
        adresse: "Quartier Ambalavao",
        city: "Fianarantsoa",
        date_naissance: new Date("1979-04-12"),
        email: "solo.andria@transport.mg",
        mot_de_passe: passwordHash,
        role: "TRANSPORTEUR",
      },
    }),
    prisma.utilisateur.create({
      data: {
        nom: "Ratsiraka",
        prenom: "Lova",
        cin: "MG-T-004",
        phone: "+261 33 00 888 11",
        adresse: "Route Nationale 4, Mahajanga",
        city: "Mahajanga",
        date_naissance: new Date("1985-08-22"),
        email: "lova.ratsiraka@transport.mg",
        mot_de_passe: passwordHash,
        role: "TRANSPORTEUR",
      },
    }),
    prisma.utilisateur.create({
      data: {
        nom: "Rabemananjara",
        prenom: "Fara",
        cin: "MG-T-005",
        phone: "+261 32 00 999 44",
        adresse: "Rue du Commerce, Toamasina",
        city: "Toamasina",
        date_naissance: new Date("1991-01-30"),
        email: "fara.rabe@transport.mg",
        mot_de_passe: passwordHash,
        role: "TRANSPORTEUR",
      },
    }),
  ]);

  const [transporteur3, transporteur4, transporteur5] = await Promise.all(
    extraUsers.map((u) =>
      prisma.transporteur.create({ data: { utilisateur_id: u.id_utilisateur } }),
    ),
  );

  const extraTransports = await Promise.all([
    prisma.transport.create({
      data: {
        description: "Semi-remorque 30 tonnes, long courrier nationaux",
        marque: "Scania",
        immatriculation: "MG-FN-1100",
        type: "Semi-remorque",
        images: "/uploads/transports/semi1.jpg",
        transporteur_id: transporteur3.id_transporteur,
      },
    }),
    prisma.transport.create({
      data: {
        description: "Camion pick-up 4x4, routes difficiles acceptées",
        marque: "Mitsubishi",
        immatriculation: "MG-MJ-2200",
        type: "Pick-up",
        images: "/uploads/transports/pickup1.jpg",
        transporteur_id: transporteur4.id_transporteur,
      },
    }),
    prisma.transport.create({
      data: {
        description: "Camion porteur 10 tonnes, côte est desservie",
        marque: "Isuzu",
        immatriculation: "MG-TM-3300",
        type: "Porteur",
        images: "/uploads/transports/porteur1.jpg",
        transporteur_id: transporteur5.id_transporteur,
      },
    }),
    prisma.transport.create({
      data: {
        description: "Fourgon frigorifique compact, livraisons express",
        marque: "Ford",
        immatriculation: "MG-AA-4400",
        type: "Fourgon frigo",
        images: "/uploads/transports/fourgon2.jpg",
        transporteur_id: transporteur3.id_transporteur,
      },
    }),
  ]);

  console.log("✅ 3 transporteurs supplémentaires + 4 transports créés.");

  // ─── PbTransports (Annonces) ───────────────────────────────────────────────
  const [pb1, pb2, pb3, pb4, pb5] = await Promise.all([
    prisma.pbTransport.create({
      data: {
        depart: "Antananarivo",
        destination: "Toamasina",
        capacite_transport: 15.0,
        status: "ACTIVE",
        prix_par_kilo: 800.0,
        prix_fragile_par_kilo: 1400.0,
        transport_id: transport1.id_transport,
      },
    }),
    prisma.pbTransport.create({
      data: {
        depart: "Antananarivo",
        destination: "Fianarantsoa",
        capacite_transport: 12.0,
        status: "ACTIVE",
        prix_par_kilo: 700.0,
        prix_fragile_par_kilo: 1200.0,
        transport_id: transport1.id_transport,
      },
    }),
    prisma.pbTransport.create({
      data: {
        depart: "Antananarivo",
        destination: "Mahajanga",
        capacite_transport: 10.0,
        status: "ACTIVE",
        prix_par_kilo: 1000.0,
        prix_fragile_par_kilo: 1800.0,
        transport_id: transport2.id_transport,
      },
    }),
    prisma.pbTransport.create({
      data: {
        depart: "Toamasina",
        destination: "Toliara",
        capacite_transport: 8.0,
        status: "INACTIVE",
        prix_par_kilo: 1200.0,
        prix_fragile_par_kilo: 2000.0,
        transport_id: transport2.id_transport,
      },
    }),
    prisma.pbTransport.create({
      data: {
        depart: "Fianarantsoa",
        destination: "Antsirabe",
        capacite_transport: 5.0,
        status: "ACTIVE",
        prix_par_kilo: 500.0,
        prix_fragile_par_kilo: 900.0,
        transport_id: transport3.id_transport,
      },
    }),
  ]);

  // Annonces supplémentaires pour alimenter la recherche
  await Promise.all([
    prisma.pbTransport.create({
      data: {
        depart: "Antananarivo",
        destination: "Toliara",
        capacite_transport: 20.0,
        status: "ACTIVE",
        prix_par_kilo: 1100.0,
        prix_fragile_par_kilo: 1900.0,
        transport_id: extraTransports[0].id_transport,
      },
    }),
    prisma.pbTransport.create({
      data: {
        depart: "Antananarivo",
        destination: "Antsiranana",
        capacite_transport: 25.0,
        status: "ACTIVE",
        prix_par_kilo: 1300.0,
        prix_fragile_par_kilo: 2200.0,
        transport_id: extraTransports[0].id_transport,
      },
    }),
    prisma.pbTransport.create({
      data: {
        depart: "Mahajanga",
        destination: "Antananarivo",
        capacite_transport: 6.0,
        status: "ACTIVE",
        prix_par_kilo: 950.0,
        prix_fragile_par_kilo: 1600.0,
        transport_id: extraTransports[1].id_transport,
      },
    }),
    prisma.pbTransport.create({
      data: {
        depart: "Toamasina",
        destination: "Antananarivo",
        capacite_transport: 9.0,
        status: "ACTIVE",
        prix_par_kilo: 820.0,
        prix_fragile_par_kilo: 1450.0,
        transport_id: extraTransports[2].id_transport,
      },
    }),
    prisma.pbTransport.create({
      data: {
        depart: "Toamasina",
        destination: "Fianarantsoa",
        capacite_transport: 7.0,
        status: "ACTIVE",
        prix_par_kilo: 900.0,
        prix_fragile_par_kilo: 1550.0,
        transport_id: extraTransports[2].id_transport,
      },
    }),
    prisma.pbTransport.create({
      data: {
        depart: "Fianarantsoa",
        destination: "Toliara",
        capacite_transport: 8.0,
        status: "ACTIVE",
        prix_par_kilo: 650.0,
        prix_fragile_par_kilo: 1100.0,
        transport_id: extraTransports[0].id_transport,
      },
    }),
    prisma.pbTransport.create({
      data: {
        depart: "Antsirabe",
        destination: "Antananarivo",
        capacite_transport: 4.0,
        status: "ACTIVE",
        prix_par_kilo: 450.0,
        prix_fragile_par_kilo: 800.0,
        transport_id: extraTransports[3].id_transport,
      },
    }),
    prisma.pbTransport.create({
      data: {
        depart: "Morondava",
        destination: "Antananarivo",
        capacite_transport: 10.0,
        status: "ACTIVE",
        prix_par_kilo: 1050.0,
        prix_fragile_par_kilo: 1750.0,
        transport_id: extraTransports[1].id_transport,
      },
    }),
    prisma.pbTransport.create({
      data: {
        depart: "Antananarivo",
        destination: "Morondava",
        capacite_transport: 11.0,
        status: "ACTIVE",
        prix_par_kilo: 1050.0,
        prix_fragile_par_kilo: 1750.0,
        transport_id: extraTransports[1].id_transport,
      },
    }),
    prisma.pbTransport.create({
      data: {
        depart: "Antananarivo",
        destination: "Antsirabe",
        capacite_transport: 8.0,
        status: "ACTIVE",
        prix_par_kilo: 420.0,
        prix_fragile_par_kilo: 750.0,
        transport_id: transport3.id_transport,
      },
    }),
    prisma.pbTransport.create({
      data: {
        depart: "Nosy Be",
        destination: "Antananarivo",
        capacite_transport: 3.0,
        status: "ACTIVE",
        prix_par_kilo: 1500.0,
        prix_fragile_par_kilo: 2500.0,
        transport_id: extraTransports[3].id_transport,
      },
    }),
    prisma.pbTransport.create({
      data: {
        depart: "Antsiranana",
        destination: "Mahajanga",
        capacite_transport: 12.0,
        status: "ACTIVE",
        prix_par_kilo: 1100.0,
        prix_fragile_par_kilo: 1900.0,
        transport_id: extraTransports[0].id_transport,
      },
    }),
  ]);
  console.log("✅ 17 PbTransports (annonces) créés.");

  // ─── Transporteurs & véhicules supplémentaires (lot 2) ────────────────────
  const extraUsers2 = await Promise.all([
    prisma.utilisateur.create({
      data: {
        nom: "Randrianarison",
        prenom: "Tojo",
        cin: "MG-T-006",
        phone: "+261 34 01 001 11",
        adresse: "Rue Principale, Antsirabe",
        city: "Antsirabe",
        date_naissance: new Date("1983-07-18"),
        email: "tojo.randrianarison@transport.mg",
        mot_de_passe: passwordHash,
        role: "TRANSPORTEUR",
      },
    }),
    prisma.utilisateur.create({
      data: {
        nom: "Raharinirina",
        prenom: "Dimby",
        cin: "MG-T-007",
        phone: "+261 32 01 102 22",
        adresse: "Avenue du Port, Morondava",
        city: "Morondava",
        date_naissance: new Date("1977-03-25"),
        email: "dimby.raharinirina@transport.mg",
        mot_de_passe: passwordHash,
        role: "TRANSPORTEUR",
      },
    }),
    prisma.utilisateur.create({
      data: {
        nom: "Andrianasolo",
        prenom: "Mija",
        cin: "MG-T-008",
        phone: "+261 33 01 203 33",
        adresse: "Rue des Cocotiers, Nosy Be",
        city: "Nosy Be",
        date_naissance: new Date("1992-12-04"),
        email: "mija.andrianasolo@transport.mg",
        mot_de_passe: passwordHash,
        role: "TRANSPORTEUR",
      },
    }),
    prisma.utilisateur.create({
      data: {
        nom: "Ravolamanana",
        prenom: "Aina",
        cin: "MG-T-009",
        phone: "+261 38 01 304 44",
        adresse: "Quartier Central, Ambositra",
        city: "Ambositra",
        date_naissance: new Date("1986-09-11"),
        email: "aina.ravolamanana@transport.mg",
        mot_de_passe: passwordHash,
        role: "TRANSPORTEUR",
      },
    }),
  ]);

  const [transporteur6, transporteur7, transporteur8, transporteur9] =
    await Promise.all(
      extraUsers2.map((u) =>
        prisma.transporteur.create({ data: { utilisateur_id: u.id_utilisateur } }),
      ),
    );

  const extraTransports2 = await Promise.all([
    prisma.transport.create({
      data: {
        description: "Camion benne solide pour trajets côte Ouest",
        marque: "Hino",
        immatriculation: "MG-AS-5500",
        type: "Camion benne",
        images: "/uploads/transports/fourgon1.jpg",
        transporteur_id: transporteur6.id_transporteur,
      },
    }),
    prisma.transport.create({
      data: {
        description: "Mini-camion polyvalent, disponible toute saison",
        marque: "Nissan",
        immatriculation: "MG-MO-6600",
        type: "Mini-camion",
        images: "/uploads/transports/fourgon1.jpg",
        transporteur_id: transporteur7.id_transporteur,
      },
    }),
    prisma.transport.create({
      data: {
        description: "Fourgonnette rapide pour livraisons express",
        marque: "Peugeot",
        immatriculation: "MG-NB-7700",
        type: "Fourgonnette",
        images: "/uploads/transports/fourgon1.jpg",
        transporteur_id: transporteur8.id_transporteur,
      },
    }),
    prisma.transport.create({
      data: {
        description: "Camion porteur double essieu, grandes distances",
        marque: "Man",
        immatriculation: "MG-AM-8800",
        type: "Porteur",
        images: "/uploads/transports/fourgon1.jpg",
        transporteur_id: transporteur9.id_transporteur,
      },
    }),
  ]);
  console.log("✅ 4 transporteurs + 4 véhicules supplémentaires créés.");

  // ─── Annonces supplémentaires — volume pour pagination ────────────────────
  const allTids = [
    transport1.id_transport,
    transport2.id_transport,
    transport3.id_transport,
    extraTransports[0].id_transport,
    extraTransports[1].id_transport,
    extraTransports[2].id_transport,
    extraTransports[3].id_transport,
    extraTransports2[0].id_transport,
    extraTransports2[1].id_transport,
    extraTransports2[2].id_transport,
    extraTransports2[3].id_transport,
  ];

  await Promise.all([
    prisma.pbTransport.create({ data: { depart: "Antananarivo", destination: "Nosy Be",       capacite_transport: 5.0,  status: "ACTIVE", prix_par_kilo: 1600, prix_fragile_par_kilo: 2700, transport_id: allTids[0] } }),
    prisma.pbTransport.create({ data: { depart: "Antananarivo", destination: "Ambositra",    capacite_transport: 7.0,  status: "ACTIVE", prix_par_kilo: 380,  prix_fragile_par_kilo: 680,  transport_id: allTids[1] } }),
    prisma.pbTransport.create({ data: { depart: "Toamasina",   destination: "Mahajanga",    capacite_transport: 11.0, status: "ACTIVE", prix_par_kilo: 1050, prix_fragile_par_kilo: 1800, transport_id: allTids[2] } }),
    prisma.pbTransport.create({ data: { depart: "Toamasina",   destination: "Antsiranana",  capacite_transport: 14.0, status: "ACTIVE", prix_par_kilo: 1200, prix_fragile_par_kilo: 2000, transport_id: allTids[3] } }),
    prisma.pbTransport.create({ data: { depart: "Mahajanga",   destination: "Toamasina",    capacite_transport: 9.0,  status: "ACTIVE", prix_par_kilo: 1000, prix_fragile_par_kilo: 1700, transport_id: allTids[4] } }),
    prisma.pbTransport.create({ data: { depart: "Mahajanga",   destination: "Morondava",    capacite_transport: 6.0,  status: "ACTIVE", prix_par_kilo: 720,  prix_fragile_par_kilo: 1250, transport_id: allTids[5] } }),
    prisma.pbTransport.create({ data: { depart: "Fianarantsoa",destination: "Toamasina",    capacite_transport: 8.0,  status: "ACTIVE", prix_par_kilo: 850,  prix_fragile_par_kilo: 1450, transport_id: allTids[6] } }),
    prisma.pbTransport.create({ data: { depart: "Fianarantsoa",destination: "Morondava",    capacite_transport: 10.0, status: "ACTIVE", prix_par_kilo: 900,  prix_fragile_par_kilo: 1550, transport_id: allTids[7] } }),
    prisma.pbTransport.create({ data: { depart: "Toliara",     destination: "Antananarivo", capacite_transport: 13.0, status: "ACTIVE", prix_par_kilo: 1100, prix_fragile_par_kilo: 1900, transport_id: allTids[8] } }),
    prisma.pbTransport.create({ data: { depart: "Toliara",     destination: "Fianarantsoa", capacite_transport: 9.0,  status: "ACTIVE", prix_par_kilo: 750,  prix_fragile_par_kilo: 1300, transport_id: allTids[9] } }),
    prisma.pbTransport.create({ data: { depart: "Antsiranana", destination: "Antananarivo", capacite_transport: 15.0, status: "ACTIVE", prix_par_kilo: 1350, prix_fragile_par_kilo: 2250, transport_id: allTids[10] } }),
    prisma.pbTransport.create({ data: { depart: "Antsirabe",   destination: "Toamasina",    capacite_transport: 7.0,  status: "ACTIVE", prix_par_kilo: 620,  prix_fragile_par_kilo: 1050, transport_id: allTids[0] } }),
    prisma.pbTransport.create({ data: { depart: "Morondava",   destination: "Toliara",      capacite_transport: 8.0,  status: "ACTIVE", prix_par_kilo: 680,  prix_fragile_par_kilo: 1150, transport_id: allTids[1] } }),
    prisma.pbTransport.create({ data: { depart: "Ambositra",   destination: "Antananarivo", capacite_transport: 5.0,  status: "ACTIVE", prix_par_kilo: 430,  prix_fragile_par_kilo: 770,  transport_id: allTids[2] } }),
    prisma.pbTransport.create({ data: { depart: "Ambositra",   destination: "Toamasina",    capacite_transport: 6.0,  status: "ACTIVE", prix_par_kilo: 570,  prix_fragile_par_kilo: 970,  transport_id: allTids[3] } }),
    prisma.pbTransport.create({ data: { depart: "Nosy Be",     destination: "Mahajanga",    capacite_transport: 4.0,  status: "ACTIVE", prix_par_kilo: 1100, prix_fragile_par_kilo: 1850, transport_id: allTids[4] } }),
    prisma.pbTransport.create({ data: { depart: "Nosy Be",     destination: "Antsiranana",  capacite_transport: 3.0,  status: "ACTIVE", prix_par_kilo: 950,  prix_fragile_par_kilo: 1600, transport_id: allTids[5] } }),
    prisma.pbTransport.create({ data: { depart: "Mahajanga",   destination: "Fianarantsoa", capacite_transport: 11.0, status: "ACTIVE", prix_par_kilo: 1150, prix_fragile_par_kilo: 1950, transport_id: allTids[6] } }),
    prisma.pbTransport.create({ data: { depart: "Antananarivo",destination: "Ambositra",    capacite_transport: 8.0,  status: "ACTIVE", prix_par_kilo: 380,  prix_fragile_par_kilo: 680,  transport_id: allTids[7] } }),
    prisma.pbTransport.create({ data: { depart: "Toamasina",   destination: "Morondava",    capacite_transport: 10.0, status: "ACTIVE", prix_par_kilo: 970,  prix_fragile_par_kilo: 1650, transport_id: allTids[8] } }),
    prisma.pbTransport.create({ data: { depart: "Antsirabe",   destination: "Mahajanga",    capacite_transport: 9.0,  status: "ACTIVE", prix_par_kilo: 850,  prix_fragile_par_kilo: 1450, transport_id: allTids[9] } }),
    prisma.pbTransport.create({ data: { depart: "Morondava",   destination: "Antananarivo", capacite_transport: 12.0, status: "ACTIVE", prix_par_kilo: 1100, prix_fragile_par_kilo: 1850, transport_id: allTids[10] } }),
    prisma.pbTransport.create({ data: { depart: "Ambositra",   destination: "Fianarantsoa", capacite_transport: 5.0,  status: "ACTIVE", prix_par_kilo: 340,  prix_fragile_par_kilo: 600,  transport_id: allTids[0] } }),
    prisma.pbTransport.create({ data: { depart: "Antsiranana", destination: "Toamasina",    capacite_transport: 8.0,  status: "ACTIVE", prix_par_kilo: 1250, prix_fragile_par_kilo: 2100, transport_id: allTids[1] } }),
    prisma.pbTransport.create({ data: { depart: "Toliara",     destination: "Morondava",    capacite_transport: 7.0,  status: "ACTIVE", prix_par_kilo: 580,  prix_fragile_par_kilo: 990,  transport_id: allTids[2] } }),
  ]);
  console.log("✅ 25 annonces supplémentaires créées (total ~41 routes actives).");

  // ─── PbMarchandises (Annonces Clients) ────────────────────────────────────
  await Promise.all([
    prisma.pbMarchandise.create({
      data: {
        label: "Électroménager (réfrigérateur)",
        category: "FRAGILE",
        fragile: true,
        poids: 45.0,
        dimension: 1.2,
        status: "ACTIVE",
        date_depart: new Date("2026-03-15"),
        depart: "Antananarivo",
        destination: "Toamasina",
        nom_recepteur: "Rakoto Maminirina",
        tel_recepteur: "+261 34 00 666 77",
        client_id: client1.id_client,
      },
    }),
    prisma.pbMarchandise.create({
      data: {
        label: "Produits alimentaires en gros (riz et légumes)",
        category: "PERISHABLE",
        fragile: false,
        poids: 120.0,
        dimension: 3.5,
        status: "ACTIVE",
        date_depart: new Date("2026-03-20"),
        depart: "Fianarantsoa",
        destination: "Antananarivo",
        nom_recepteur: "Ramiandrisoa Lova",
        tel_recepteur: "+261 32 00 777 88",
        client_id: client2.id_client,
      },
    }),
    prisma.pbMarchandise.create({
      data: {
        label: "Matériaux de construction (ciment et tôles)",
        category: "OVERSIZED",
        fragile: false,
        poids: 500.0,
        dimension: 15.0,
        status: "PENDING",
        date_depart: new Date("2026-04-01"),
        depart: "Mahajanga",
        destination: "Antananarivo",
        nom_recepteur: "Andriantsoa Fara",
        tel_recepteur: "+261 33 00 888 99",
        client_id: client3.id_client,
      },
    }),
    prisma.pbMarchandise.create({
      data: {
        label: "Vêtements et textiles traditionnels (lamba)",
        category: "STANDARD",
        fragile: false,
        poids: 30.0,
        dimension: 0.8,
        status: "INACTIVE",
        date_depart: new Date("2026-03-10"),
        depart: "Antananarivo",
        destination: "Antsirabe",
        nom_recepteur: "Ratsimba Voahangy",
        tel_recepteur: "+261 38 00 999 00",
        client_id: client1.id_client,
      },
    }),
  ]);
  console.log("✅ 4 PbMarchandises créées.");

  // ─── TransportReservations ─────────────────────────────────────────────────
  const futureDate1 = new Date("2026-03-18");
  const futureDate2 = new Date("2026-03-25");
  const futureDate3 = new Date("2026-04-05");
  const pastDate = new Date("2026-02-20");

  const [res1, res2, res3, , res5] = await Promise.all([
    // Réservation CONFIRMÉE (payée)
    prisma.transportReservation.create({
      data: {
        category: "STANDARD",
        fragile: false,
        poids: 25.0,
        dimension: 0.6,
        date_depart: futureDate1,
        depart: "Antananarivo",
        destination: "Toamasina",
        nom_recepteur: "Rakoto Rivo",
        tel_recepteur: "+261 34 01 111 22",
        label: "Colis textile 25kg",
        status: "CONFIRMED",
        pb_transport_id: pb1.id_pb_transport,
        client_id: client1.id_client,
      },
    }),
    // Réservation EN ATTENTE
    prisma.transportReservation.create({
      data: {
        category: "FRAGILE",
        fragile: true,
        poids: 10.0,
        dimension: 0.3,
        date_depart: futureDate2,
        depart: "Antananarivo",
        destination: "Fianarantsoa",
        nom_recepteur: "Andriamahefa Solo",
        tel_recepteur: "+261 32 01 222 33",
        label: "Écrans LCD 10kg",
        status: "PENDING",
        pb_transport_id: pb2.id_pb_transport,
        client_id: client2.id_client,
      },
    }),
    // Réservation COMPLÉTÉE (historique)
    prisma.transportReservation.create({
      data: {
        category: "PERISHABLE",
        fragile: false,
        poids: 50.0,
        dimension: 1.5,
        date_depart: pastDate,
        depart: "Antananarivo",
        destination: "Mahajanga",
        nom_recepteur: "Rajaobelina Tina",
        tel_recepteur: "+261 33 01 333 44",
        label: "Produits frais 50kg",
        status: "COMPLETED",
        pb_transport_id: pb3.id_pb_transport,
        client_id: client3.id_client,
      },
    }),
    // Réservation ANNULÉE
    prisma.transportReservation.create({
      data: {
        category: "STANDARD",
        fragile: false,
        poids: 15.0,
        dimension: 0.4,
        date_depart: futureDate3,
        depart: "Fianarantsoa",
        destination: "Antsirabe",
        nom_recepteur: "Randrianasolo Mamy",
        tel_recepteur: "+261 38 01 444 55",
        label: "Matériel de bureau 15kg",
        status: "CANCELLED",
        pb_transport_id: pb5.id_pb_transport,
        client_id: client1.id_client,
      },
    }),
    // Réservation CONFIRMÉE (cargo)
    prisma.transportReservation.create({
      data: {
        category: "HAZARDOUS",
        fragile: false,
        poids: 200.0,
        dimension: 5.0,
        date_depart: futureDate2,
        depart: "Antananarivo",
        destination: "Toamasina",
        nom_recepteur: "Andrianjafy Lala",
        tel_recepteur: "+261 34 01 555 66",
        label: "Produits chimiques industriels",
        status: "CONFIRMED",
        pb_transport_id: pb1.id_pb_transport,
        client_id: client2.id_client,
      },
    }),
  ]);
  console.log("✅ 5 TransportReservations créées.");

  // ─── CargoReservations ─────────────────────────────────────────────────────
  const [cargo1, cargo2] = await Promise.all([
    prisma.cargoReservation.create({
      data: {
        status: "CONFIRMED",
        prix: 20000.0, // 25kg × 800 Ar/kg
        reservation_id: res1.id_reservation,
      },
    }),
    prisma.cargoReservation.create({
      data: {
        status: "COMPLETED",
        prix: 50000.0, // 50kg × 1000 Ar/kg
        reservation_id: res3.id_reservation,
      },
    }),
  ]);
  console.log("✅ 2 CargoReservations créées.");

  // ─── Payements ─────────────────────────────────────────────────────────────
  await Promise.all([
    // Paiement sur réservation directe (confirmée)
    prisma.payement.create({
      data: {
        status: "PAID",
        prix: 20000.0,
        num_telephone: "+261 34 00 111 22",
        reservation_id: res1.id_reservation,
      },
    }),
    // Paiement sur cargo (complété)
    prisma.payement.create({
      data: {
        status: "PAID",
        prix: 50000.0,
        num_telephone: "+261 38 00 555 66",
        cargo_reservation_id: cargo2.id_cargo_reservation,
      },
    }),
    // Paiement en attente
    prisma.payement.create({
      data: {
        status: "PENDING",
        prix: 7000.0,
        num_telephone: "+261 32 00 444 55",
        reservation_id: res2.id_reservation,
      },
    }),
    // Paiement sur cargo (confirmé, pas encore réglé)
    prisma.payement.create({
      data: {
        status: "PENDING",
        prix: 20000.0,
        num_telephone: "+261 34 01 555 66",
        cargo_reservation_id: cargo1.id_cargo_reservation,
      },
    }),
    // Paiement pour réservation cargo
    prisma.payement.create({
      data: {
        status: "PAID",
        prix: 160000.0, // 200kg × 800 Ar/kg
        num_telephone: "+261 32 00 444 55",
        reservation_id: res5.id_reservation,
      },
    }),
  ]);
  console.log("✅ 5 Payements créés.");

  // ─── Résumé ────────────────────────────────────────────────────────────────
  console.log("\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
  console.log("🎉 Seed terminé avec succès !\n");
  console.log("📋 Comptes de connexion :");
  console.log(
    "  Admin           →  login: admin              /  mdp: admin123",
  );
  console.log(
    "  Transporteur 1  →  email: jean.rakoto@transport.mg   /  mdp: password123",
  );
  console.log(
    "  Transporteur 2  →  email: hanta.razafy@transport.mg  /  mdp: password123",
  );
  console.log(
    "  Client 1        →  email: noro.randria@gmail.com      /  mdp: password123",
  );
  console.log(
    "  Client 2        →  email: fidy.rasolofo@gmail.com     /  mdp: password123",
  );
  console.log(
    "  Client 3        →  email: miora.rajaonarison@gmail.com  /  mdp: password123",
  );
  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n");
  console.log("🗺️  Villes couvertes :", VILLES.join(", "));
}

main()
  .catch((e) => {
    console.error("❌ Erreur lors du seed :", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
    await pool.end();
  });
