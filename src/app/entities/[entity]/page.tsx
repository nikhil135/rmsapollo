import Layout from "@/app/components/Layout";
import EntityDetailsClient from "./ui/EntityDetailsClient";

type PageProps = {
  params: { entity: string } | Promise<{ entity: string }>;
};

export default async function EntityDetailsPage({ params }: PageProps) {
  const resolvedParams = await params;
  return (
    <Layout>
      <EntityDetailsClient entity={resolvedParams.entity} />
    </Layout>
  );
}
