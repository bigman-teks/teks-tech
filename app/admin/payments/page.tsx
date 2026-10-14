import OrdersTable from "@/components/OrdersTable";
export const dynamic = "force-dynamic";
export default function Page() { return <OrdersTable title="Payments" statuses={["PAID", "REFUNDED"]} />; }
