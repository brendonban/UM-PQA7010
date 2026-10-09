import { Suspense } from "react";
import Console from "@/components/admin/Console";

export const metadata = { title: "Staff console", robots: { index: false, follow: false } };

export default function AdminPage() {
  return (
    <Suspense fallback={null}>
      <Console />
    </Suspense>
  );
}
