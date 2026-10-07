import Logo from "@/components/common/Logo";

export default function Footer() {
  return (
    <footer className="py-9 px-[clamp(1.2rem,4vw,3rem)] border-t border-[var(--line)] flex flex-wrap gap-4 justify-between items-center pb-[calc(2.2rem+env(safe-area-inset-bottom,0px))] bg-transparent">
      <Logo isFooter={true} />
      <p className="text-[var(--sub)] text-[0.85rem] m-0">
        Office 1204, Business Bay, Dubai, UAE · +971 4 123 4567
      </p>
      <p className="text-[var(--sub)] text-[0.85rem] m-0">
        © 2026 Al Dhiyafah Properties
      </p>
    </footer>
  );
}
