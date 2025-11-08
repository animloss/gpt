export function LoadingState({ mesaj = "Yükleniyor..." }: { mesaj?: string }) {
  return (
    <div className="flex w-full items-center justify-center rounded-lg border border-dashed border-slate-300 bg-white py-12 text-slate-500">
      {mesaj}
    </div>
  );
}
