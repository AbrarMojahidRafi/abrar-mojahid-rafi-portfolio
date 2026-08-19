import { redirect } from "next/navigation";

export default function LegacyAddCompetitiveProblemPage() {
    redirect("/admin/(dashboard)/competitive/problem/new");
}
