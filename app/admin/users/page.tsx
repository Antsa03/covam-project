"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { PageHeader } from "@/components/shared/page-header";
import { DataTable } from "@/components/shared/data-table";
import { ConfirmDialog } from "@/components/shared/confirm-dialog";
import { UserFormModal } from "./_components/user-form-modal";
import {
  useAdminUsers,
  useCreateUser,
  useUpdateUser,
  useDeleteUser,
} from "@/hooks/use-admin-users";
import type { Utilisateur } from "@/types";
import { MoreHorizontal, Pencil, Trash2 } from "lucide-react";

export default function UsersPage() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [role, setRole] = useState<string | undefined>();
  const [createOpen, setCreateOpen] = useState(false);
  const [editItem, setEditItem] = useState<Utilisateur | null>(null);
  const [deleteId, setDeleteId] = useState<number | null>(null);

  const { data, isLoading } = useAdminUsers({ page, search, role });
  const createUser = useCreateUser();
  const updateUser = useUpdateUser();
  const deleteUser = useDeleteUser();

  const columns = [
    {
      key: "name",
      header: "Nom",
      cell: (row: Utilisateur) => (
        <div className="font-medium">
          {row.prenom} {row.nom}
        </div>
      ),
    },
    {
      key: "email",
      header: "Email",
      cell: (row: Utilisateur) => (
        <span className="text-muted-foreground">{row.email}</span>
      ),
    },
    {
      key: "phone",
      header: "Téléphone",
      cell: (row: Utilisateur) => row.phone,
      className: "hidden md:table-cell",
    },
    {
      key: "city",
      header: "Ville",
      cell: (row: Utilisateur) => row.city,
      className: "hidden lg:table-cell",
    },
    {
      key: "role",
      header: "Rôle",
      cell: (row: Utilisateur) => (
        <Badge variant={row.role === "TRANSPORTEUR" ? "default" : "secondary"}>
          {row.role === "TRANSPORTEUR" ? "Transporteur" : "Client"}
        </Badge>
      ),
    },
    {
      key: "actions",
      header: "",
      cell: (row: Utilisateur) => (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon">
              <MoreHorizontal className="h-4 w-4" />
              <span className="sr-only">Actions</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => setEditItem(row)}>
              <Pencil className="mr-2 h-4 w-4" />
              Modifier
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              className="text-destructive"
              onClick={() => setDeleteId(row.id_utilisateur)}
            >
              <Trash2 className="mr-2 h-4 w-4" />
              Supprimer
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ),
      className: "w-10",
    },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Utilisateurs"
        description="Gérez tous les utilisateurs de la plateforme."
        action={{
          label: "Nouvel utilisateur",
          onClick: () => setCreateOpen(true),
        }}
      />

      {/* Filters */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <Input
          placeholder="Rechercher par nom, email…"
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setPage(1);
          }}
          className="sm:max-w-xs"
        />
        <Select
          value={role ?? "ALL"}
          onValueChange={(v) => {
            setRole(v === "ALL" ? undefined : v);
            setPage(1);
          }}
        >
          <SelectTrigger className="w-full sm:w-40">
            <SelectValue placeholder="Tous les rôles" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="ALL">Tous les rôles</SelectItem>
            <SelectItem value="CLIENT">Clients</SelectItem>
            <SelectItem value="TRANSPORTEUR">Transporteurs</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <DataTable
        data={data?.data ?? []}
        columns={columns}
        isLoading={isLoading}
        emptyMessage="Aucun utilisateur trouvé."
        page={page}
        totalPages={data?.meta.totalPages ?? 1}
        onPageChange={setPage}
      />

      {/* Create modal */}
      <UserFormModal
        open={createOpen}
        onOpenChange={setCreateOpen}
        onSubmit={async (d) => {
          await createUser.mutateAsync(d);
          setCreateOpen(false);
        }}
        isLoading={createUser.isPending}
      />

      {/* Edit modal */}
      {editItem && (
        <UserFormModal
          open={!!editItem}
          onOpenChange={(o) => !o && setEditItem(null)}
          initialData={editItem}
          onSubmit={async (d) => {
            await updateUser.mutateAsync(
              d as Parameters<typeof updateUser.mutateAsync>[0],
            );
            setEditItem(null);
          }}
          isLoading={updateUser.isPending}
        />
      )}

      {/* Delete confirm */}
      <ConfirmDialog
        open={!!deleteId}
        onOpenChange={(o) => !o && setDeleteId(null)}
        title="Supprimer l'utilisateur ?"
        description="Cette action est irréversible. Toutes les données associées seront supprimées."
        confirmLabel="Supprimer"
        destructive
        onConfirm={async () => {
          if (deleteId) await deleteUser.mutateAsync(deleteId);
          setDeleteId(null);
        }}
      />
    </div>
  );
}
