

export const AvatarInitials = ({ nom, prenom }: { nom: string; prenom: string }) => {
  const initials =
    `${nom.charAt(0)}${prenom.charAt(0)}`.toUpperCase();

  return (
    <div className="size-20 rounded-full bg-linear-to-br from-cyan-400 to-cyan-600 flex items-center justify-center shadow-[0_4px_14px_rgba(8,145,178,0.25)]">
      <span className="font-display text-2xl font-bold text-white tracking-wide">
        {initials}
      </span>
    </div>
  );
}

