-- CreateEnum
CREATE TYPE "StatusPublication" AS ENUM ('ACTIVE', 'INACTIVE', 'PENDING');

-- CreateEnum
CREATE TYPE "StatusReservation" AS ENUM ('PENDING', 'CONFIRMED', 'CANCELLED', 'COMPLETED');

-- CreateEnum
CREATE TYPE "StatusPayement" AS ENUM ('PENDING', 'PAID', 'FAILED', 'REFUNDED');

-- CreateEnum
CREATE TYPE "CargoCategory" AS ENUM ('STANDARD', 'FRAGILE', 'PERISHABLE', 'HAZARDOUS', 'OVERSIZED');

-- CreateEnum
CREATE TYPE "RoleUtilisateur" AS ENUM ('CLIENT', 'TRANSPORTEUR');

-- CreateTable
CREATE TABLE "Admin" (
    "nom_utilisateur" TEXT NOT NULL,
    "mot_de_passe" TEXT NOT NULL,

    CONSTRAINT "Admin_pkey" PRIMARY KEY ("nom_utilisateur")
);

-- CreateTable
CREATE TABLE "Utilisateur" (
    "id_utilisateur" SERIAL NOT NULL,
    "nom" TEXT NOT NULL,
    "prenom" TEXT NOT NULL,
    "cin" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "adresse" TEXT NOT NULL,
    "city" TEXT NOT NULL,
    "date_naissance" TIMESTAMP(3) NOT NULL,
    "date_mise_a_jour" TIMESTAMP(3) NOT NULL,
    "date_creation" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "email" TEXT NOT NULL,
    "mot_de_passe" TEXT NOT NULL,
    "role" "RoleUtilisateur" NOT NULL,

    CONSTRAINT "Utilisateur_pkey" PRIMARY KEY ("id_utilisateur")
);

-- CreateTable
CREATE TABLE "Transporteur" (
    "id_transporteur" SERIAL NOT NULL,
    "utilisateur_id" INTEGER NOT NULL,

    CONSTRAINT "Transporteur_pkey" PRIMARY KEY ("id_transporteur")
);

-- CreateTable
CREATE TABLE "Client" (
    "id_client" SERIAL NOT NULL,
    "utilisateur_id" INTEGER NOT NULL,
    "image" TEXT,

    CONSTRAINT "Client_pkey" PRIMARY KEY ("id_client")
);

-- CreateTable
CREATE TABLE "Transport" (
    "id_transport" SERIAL NOT NULL,
    "description" TEXT NOT NULL,
    "marque" TEXT NOT NULL,
    "immatriculation" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "images" TEXT NOT NULL,
    "transporteur_id" INTEGER NOT NULL,

    CONSTRAINT "Transport_pkey" PRIMARY KEY ("id_transport")
);

-- CreateTable
CREATE TABLE "PbTransport" (
    "id_pb_transport" SERIAL NOT NULL,
    "depart" TEXT NOT NULL,
    "destination" TEXT NOT NULL,
    "capacite_transport" DOUBLE PRECISION NOT NULL,
    "status" "StatusPublication" NOT NULL,
    "prix_par_kilo" DOUBLE PRECISION NOT NULL,
    "prix_fragile_par_kilo" DOUBLE PRECISION NOT NULL,
    "transport_id" INTEGER NOT NULL,

    CONSTRAINT "PbTransport_pkey" PRIMARY KEY ("id_pb_transport")
);

-- CreateTable
CREATE TABLE "TransportReservation" (
    "id_reservation" SERIAL NOT NULL,
    "date_reservation" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "category" "CargoCategory" NOT NULL,
    "fragile" BOOLEAN NOT NULL,
    "poids" DOUBLE PRECISION NOT NULL,
    "dimension" DOUBLE PRECISION NOT NULL,
    "date_depart" TIMESTAMP(3) NOT NULL,
    "depart" TEXT NOT NULL,
    "destination" TEXT NOT NULL,
    "nom_recepteur" TEXT NOT NULL,
    "tel_recepteur" TEXT NOT NULL,
    "label" TEXT NOT NULL,
    "status" "StatusReservation" NOT NULL,
    "pb_transport_id" INTEGER NOT NULL,
    "client_id" INTEGER NOT NULL,

    CONSTRAINT "TransportReservation_pkey" PRIMARY KEY ("id_reservation")
);

-- CreateTable
CREATE TABLE "CargoReservation" (
    "id_cargo_reservation" SERIAL NOT NULL,
    "status" "StatusReservation" NOT NULL,
    "date_reservation" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "prix" DOUBLE PRECISION NOT NULL,
    "reservation_id" INTEGER NOT NULL,

    CONSTRAINT "CargoReservation_pkey" PRIMARY KEY ("id_cargo_reservation")
);

-- CreateTable
CREATE TABLE "Payement" (
    "id_payement" SERIAL NOT NULL,
    "date_payement" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "status" "StatusPayement" NOT NULL,
    "prix" DOUBLE PRECISION NOT NULL,
    "num_telephone" TEXT NOT NULL,
    "reservation_id" INTEGER,
    "cargo_reservation_id" INTEGER,

    CONSTRAINT "Payement_pkey" PRIMARY KEY ("id_payement")
);

-- CreateTable
CREATE TABLE "PbMarchandise" (
    "id_pb_marchandise" SERIAL NOT NULL,
    "label" TEXT NOT NULL,
    "category" "CargoCategory" NOT NULL,
    "fragile" BOOLEAN NOT NULL,
    "poids" DOUBLE PRECISION NOT NULL,
    "dimension" DOUBLE PRECISION NOT NULL,
    "status" "StatusPublication" NOT NULL,
    "date_depart" TIMESTAMP(3) NOT NULL,
    "depart" TEXT NOT NULL,
    "destination" TEXT NOT NULL,
    "nom_recepteur" TEXT NOT NULL,
    "tel_recepteur" TEXT NOT NULL,
    "date_creation" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "date_mise_a_jour" TIMESTAMP(3) NOT NULL,
    "client_id" INTEGER NOT NULL,

    CONSTRAINT "PbMarchandise_pkey" PRIMARY KEY ("id_pb_marchandise")
);

-- CreateIndex
CREATE UNIQUE INDEX "Utilisateur_cin_key" ON "Utilisateur"("cin");

-- CreateIndex
CREATE UNIQUE INDEX "Utilisateur_email_key" ON "Utilisateur"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Transporteur_utilisateur_id_key" ON "Transporteur"("utilisateur_id");

-- CreateIndex
CREATE UNIQUE INDEX "Client_utilisateur_id_key" ON "Client"("utilisateur_id");

-- CreateIndex
CREATE UNIQUE INDEX "Transport_immatriculation_key" ON "Transport"("immatriculation");

-- CreateIndex
CREATE UNIQUE INDEX "CargoReservation_reservation_id_key" ON "CargoReservation"("reservation_id");

-- CreateIndex
CREATE UNIQUE INDEX "Payement_reservation_id_key" ON "Payement"("reservation_id");

-- CreateIndex
CREATE UNIQUE INDEX "Payement_cargo_reservation_id_key" ON "Payement"("cargo_reservation_id");

-- AddForeignKey
ALTER TABLE "Transporteur" ADD CONSTRAINT "Transporteur_utilisateur_id_fkey" FOREIGN KEY ("utilisateur_id") REFERENCES "Utilisateur"("id_utilisateur") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Client" ADD CONSTRAINT "Client_utilisateur_id_fkey" FOREIGN KEY ("utilisateur_id") REFERENCES "Utilisateur"("id_utilisateur") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Transport" ADD CONSTRAINT "Transport_transporteur_id_fkey" FOREIGN KEY ("transporteur_id") REFERENCES "Transporteur"("id_transporteur") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PbTransport" ADD CONSTRAINT "PbTransport_transport_id_fkey" FOREIGN KEY ("transport_id") REFERENCES "Transport"("id_transport") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TransportReservation" ADD CONSTRAINT "TransportReservation_pb_transport_id_fkey" FOREIGN KEY ("pb_transport_id") REFERENCES "PbTransport"("id_pb_transport") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TransportReservation" ADD CONSTRAINT "TransportReservation_client_id_fkey" FOREIGN KEY ("client_id") REFERENCES "Client"("id_client") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CargoReservation" ADD CONSTRAINT "CargoReservation_reservation_id_fkey" FOREIGN KEY ("reservation_id") REFERENCES "TransportReservation"("id_reservation") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Payement" ADD CONSTRAINT "Payement_reservation_id_fkey" FOREIGN KEY ("reservation_id") REFERENCES "TransportReservation"("id_reservation") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Payement" ADD CONSTRAINT "Payement_cargo_reservation_id_fkey" FOREIGN KEY ("cargo_reservation_id") REFERENCES "CargoReservation"("id_cargo_reservation") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PbMarchandise" ADD CONSTRAINT "PbMarchandise_client_id_fkey" FOREIGN KEY ("client_id") REFERENCES "Client"("id_client") ON DELETE RESTRICT ON UPDATE CASCADE;
