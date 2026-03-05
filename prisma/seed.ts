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
  console.log("✅ 5 PbTransports (annonces) créés.");

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
