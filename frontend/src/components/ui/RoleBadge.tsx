import type { UserRole } from "@/lib/types/user";

const RoleBadge: React.FC<{ userRole: UserRole }> = ({ userRole }) => {
    const label =
        userRole === 'PRO'
            ? 'Propriétaire Pro'
            : userRole === 'CLIENT'
                ? 'Client'
                : 'Administrateur';

    return (
        <div className="p-3 border-t border-slate-100">
            <div className="bg-linear-to-br from-cyan-50 to-cyan-100/60 rounded-xl p-3 border border-cyan-100">
                <p className="text-xs font-semibold text-cyan-800">Compte {label}</p>
                <p className="text-[10px] text-cyan-500 mt-0.5">ImmoNet · Afrique Centrale</p>
            </div>
        </div>
    );
};

export default RoleBadge;