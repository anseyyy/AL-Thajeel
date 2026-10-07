export default function ContactInfo() {
  return (
    <div className="flex flex-col">
      <b className="block text-[0.92rem] font-bold text-[var(--ink)] mb-1">
        Phone
      </b>
      <p className="text-[var(--sub)] text-[0.92rem] -mt-1 mb-5">
        +971 4 123 4567
      </p>

      <b className="block text-[0.92rem] font-bold text-[var(--ink)] mb-1">
        Email
      </b>
      <p className="text-[var(--sub)] text-[0.92rem] -mt-1 mb-5">
        hello@aldhiyafah.example
      </p>

      <b className="block text-[0.92rem] font-bold text-[var(--ink)] mb-1">
        Office
      </b>
      <p className="text-[var(--sub)] text-[0.92rem] -mt-1 mb-5">
        Office 1204, Business Bay, Dubai, UAE
      </p>

      <b className="block text-[0.92rem] font-bold text-[var(--ink)] mb-1">
        Hours
      </b>
      <p className="text-[var(--sub)] text-[0.92rem] -mt-1 mb-0">
        Sat–Thu, 9am–7pm Gulf Standard Time
      </p>
    </div>
  );
}
