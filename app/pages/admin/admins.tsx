import { useState } from "react";
import {
  UserPlus,
  Trash2,
  Check,
  AlertTriangle,
  Search,
  X,
} from "lucide-react";
import { AdminLayout } from "../../components/admin/AdminLayout";
import { useAdmin, type AdminUser } from "../../lib/admin-context";

interface NewAdminFormData {
  name: string;
  email: string;
  role: AdminUser["role"];
}

const INITIAL_FORM: NewAdminFormData = {
  name: "",
  email: "",
  role: "Gestor de Garrafeira",
};

export default function AdminUsersPage() {
  const { admins, addAdmin, removeAdmin, toggleAdminStatus } = useAdmin();

  const [searchTerm, setSearchTerm] = useState("");
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [adminToDelete, setAdminToDelete] = useState<AdminUser | null>(null);
  const [formData, setFormData] = useState<NewAdminFormData>(INITIAL_FORM);
  const [formError, setFormError] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const filteredAdmins = admins.filter((admin) => {
    const q = searchTerm.toLowerCase();
    return (
      !searchTerm ||
      admin.name.toLowerCase().includes(q) ||
      admin.email.toLowerCase().includes(q) ||
      admin.role.toLowerCase().includes(q)
    );
  });

  const handleCreateAdmin = (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    if (!formData.name.trim()) {
      setFormError("Introduza o nome completo.");
      return;
    }
    if (!formData.email.trim() || !formData.email.includes("@")) {
      setFormError("Introduza um e-mail válido.");
      return;
    }

    const exists = admins.some(
      (a) => a.email.toLowerCase() === formData.email.trim().toLowerCase()
    );
    if (exists) {
      setFormError("Este e-mail já está registado.");
      return;
    }

    addAdmin({
      name: formData.name.trim(),
      email: formData.email.trim().toLowerCase(),
      role: formData.role,
    });

    setIsAddModalOpen(false);
    setFormData(INITIAL_FORM);
    showToast(`Administrador "${formData.name}" adicionado.`);
  };

  const handleConfirmDelete = () => {
    if (!adminToDelete) return;
    if (admins.length <= 1) {
      showToast("Não é possível remover o único administrador.");
      setAdminToDelete(null);
      return;
    }

    removeAdmin(adminToDelete.id);
    showToast(`Administrador "${adminToDelete.name}" removido.`);
    setAdminToDelete(null);
  };

  const getInitials = (name: string) => {
    const parts = name.trim().split(" ");
    if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  };

  return (
    <AdminLayout
      title="Admins"
      subtitle="Utilizadores com permissão de acesso ao painel de gestão."
      action={
        <button
          type="button"
          onClick={() => {
            setFormData(INITIAL_FORM);
            setFormError(null);
            setIsAddModalOpen(true);
          }}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white text-black hover:bg-white/90 text-xs font-medium font-sans transition cursor-pointer"
        >
          <UserPlus className="w-3.5 h-3.5" />
          <span>Novo Admin</span>
        </button>
      }
    >
      {/* Toast Feedback */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 px-4 py-3 rounded-xl bg-[#181718] border border-white/10 text-white text-xs font-sans shadow-2xl flex items-center gap-2 animate-fade-in">
          <Check className="w-4 h-4 text-[#C49A4A]" />
          <span>{toastMessage}</span>
        </div>
      )}

      <div className="space-y-6">
        {/* BARRA DE PESQUISA SIMPLES */}
        <div className="flex items-center justify-between gap-4">
          <div className="relative max-w-sm w-full">
            <Search className="w-3.5 h-3.5 text-white/40 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Pesquisar administradores..."
              className="w-full pl-9 pr-8 py-2 rounded-xl bg-[#121112] border border-white/[0.07] text-xs text-white placeholder:text-white/30 focus:outline-none focus:border-white/20 transition font-sans"
            />
            {searchTerm && (
              <button
                type="button"
                onClick={() => setSearchTerm("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-white/40 hover:text-white"
              >
                <X className="w-3 h-3" />
              </button>
            )}
          </div>

          <span className="text-xs text-white/40 font-sans hidden sm:inline">
            {admins.length} membros registados
          </span>
        </div>

        {/* TABELA DE ADMINISTRADORES ULTRA LIMPA */}
        <div className="bg-[#121112] rounded-2xl border border-white/[0.06] overflow-hidden">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-white/[0.06] text-[11px] font-sans text-white/40 uppercase tracking-wider">
                <th className="py-3.5 px-6">Utilizador</th>
                <th className="py-3.5 px-4">Função</th>
                <th className="py-3.5 px-4">Estado</th>
                <th className="py-3.5 px-6 text-right">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/[0.04] text-xs font-sans">
              {filteredAdmins.length === 0 ? (
                <tr>
                  <td colSpan={4} className="py-12 text-center text-white/40">
                    Nenhum administrador encontrado.
                  </td>
                </tr>
              ) : (
                filteredAdmins.map((admin) => {
                  const isLastAdmin = admins.length <= 1;

                  return (
                    <tr
                      key={admin.id}
                      className="hover:bg-white/[0.015] transition"
                    >
                      {/* Utilizador */}
                      <td className="py-3.5 px-6">
                        <div className="flex items-center gap-3">
                          <div
                            className={`w-8 h-8 rounded-full flex items-center justify-center font-brand text-xs text-white shrink-0 ${
                              admin.avatarColor || "bg-[#6B0015]"
                            }`}
                          >
                            {getInitials(admin.name)}
                          </div>
                          <div>
                            <span className="font-medium text-white block">
                              {admin.name}
                            </span>
                            <span className="text-[11px] text-white/40 block">
                              {admin.email}
                            </span>
                          </div>
                        </div>
                      </td>

                      {/* Função */}
                      <td className="py-3.5 px-4">
                        <span className="text-white/70">
                          {admin.role}
                        </span>
                      </td>

                      {/* Estado (Toggle simples) */}
                      <td className="py-3.5 px-4">
                        <button
                          type="button"
                          onClick={() => toggleAdminStatus(admin.id)}
                          className={`px-2.5 py-1 rounded-md text-[11px] font-sans transition cursor-pointer ${
                            admin.status === "Ativo"
                              ? "bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20"
                              : "bg-white/[0.04] text-white/40 hover:text-white"
                          }`}
                        >
                          {admin.status}
                        </button>
                      </td>

                      {/* Ações: Remover */}
                      <td className="py-3.5 px-6 text-right">
                        <button
                          type="button"
                          onClick={() => setAdminToDelete(admin)}
                          disabled={isLastAdmin}
                          className={`p-1.5 rounded-lg text-white/40 transition ${
                            isLastAdmin
                              ? "opacity-20 cursor-not-allowed"
                              : "hover:text-red-400 hover:bg-red-500/10 cursor-pointer"
                          }`}
                          title={
                            isLastAdmin
                              ? "O sistema deve ter pelo menos 1 administrador"
                              : "Remover administrador"
                          }
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* MODAL NOVO ADMINISTRADOR */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
          <div className="bg-[#141314] border border-white/10 rounded-2xl p-6 sm:p-8 max-w-md w-full shadow-2xl relative">
            <button
              type="button"
              onClick={() => setIsAddModalOpen(false)}
              className="absolute top-5 right-5 p-1 text-white/40 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="font-brand uppercase text-xl text-white tracking-wide mb-5">
              Novo Administrador
            </h3>

            {formError && (
              <div className="mb-4 p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-xs text-red-300 font-sans">
                {formError}
              </div>
            )}

            <form onSubmit={handleCreateAdmin} className="space-y-4 text-xs font-sans">
              <div>
                <label className="block text-white/60 mb-1">
                  Nome Completo *
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  placeholder="Ex: Ana Ribeiro"
                  className="w-full px-3.5 py-2 rounded-xl bg-black/40 border border-white/10 text-white focus:outline-none focus:border-white/30"
                />
              </div>

              <div>
                <label className="block text-white/60 mb-1">
                  Endereço de E-mail *
                </label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                  placeholder="Ex: ana@vinicoa.pt"
                  className="w-full px-3.5 py-2 rounded-xl bg-black/40 border border-white/10 text-white focus:outline-none focus:border-white/30"
                />
              </div>

              <div>
                <label className="block text-white/60 mb-1">
                  Função / Permissão
                </label>
                <select
                  value={formData.role}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      role: e.target.value as AdminUser["role"],
                    })
                  }
                  className="w-full px-3 py-2 rounded-xl bg-black/40 border border-white/10 text-white focus:outline-none cursor-pointer"
                >
                  <option value="Super Admin">Super Admin (Acesso completo)</option>
                  <option value="Gestor de Garrafeira">Gestor de Garrafeira (Vinhos & Estoque)</option>
                  <option value="Editor de Catálogo">Editor de Catálogo (Textos & Destaques)</option>
                </select>
              </div>

              <div className="pt-4 flex items-center justify-end gap-3 border-t border-white/[0.08]">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-white/60 hover:text-white transition"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-white text-black hover:bg-white/90 font-medium transition cursor-pointer"
                >
                  Adicionar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL CONFIRMAÇÃO REMOÇÃO */}
      {adminToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
          <div className="bg-[#141314] border border-white/10 rounded-2xl p-6 max-w-sm w-full text-center">
            <AlertTriangle className="w-8 h-8 text-red-400 mx-auto mb-3" />
            <h4 className="font-brand uppercase text-lg text-white mb-1">
              Remover Administrador?
            </h4>
            <p className="text-xs text-white/60 font-sans mb-6">
              Tem a certeza de que pretende retirar o acesso a <strong>"{adminToDelete.name}"</strong>?
            </p>
            <div className="flex items-center justify-center gap-3">
              <button
                type="button"
                onClick={() => setAdminToDelete(null)}
                className="px-4 py-2 rounded-xl text-xs text-white/60 hover:text-white"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={handleConfirmDelete}
                className="px-4 py-2 rounded-xl bg-red-600 hover:bg-red-500 text-white text-xs font-sans transition"
              >
                Sim, Remover
              </button>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}
