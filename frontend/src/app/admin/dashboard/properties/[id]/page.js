import EditPropertyView from "@/components/admin/properties/EditPropertyView";

export const metadata = {
  title: "Edit Property | Al Thajeel Real Estates Admin",
  description: "Modify real estate property listing information.",
};

export default async function EditPropertyPage({ params }) {
  const resolvedParams = await params;
  return <EditPropertyView id={resolvedParams?.id} />;
}
