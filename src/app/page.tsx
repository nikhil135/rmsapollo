import Layout from "./components/Layout";
import DashboardTiles from "./components/DashboardTiles";

export default function Home() {
  return (
    <Layout>
      <h1>Overview</h1>
      <DashboardTiles />
    </Layout>
  );
}
