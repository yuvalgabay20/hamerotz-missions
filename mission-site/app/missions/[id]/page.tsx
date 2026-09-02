import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { MissionPage } from "@/components/mission-page";
import { getMission, missionIds } from "@/lib/missions";

type MissionRouteProps = {
  params: Promise<{ id: string }>;
};

export const dynamicParams = false;

export function generateStaticParams() {
  return missionIds.map((id) => ({ id }));
}

export async function generateMetadata({
  params,
}: MissionRouteProps): Promise<Metadata> {
  const { id } = await params;
  const mission = getMission(id);

  if (!mission) {
    notFound();
  }

  return {
    title: mission.pageType,
    robots: { index: false, follow: false },
  };
}

export default async function MissionRoute({ params }: MissionRouteProps) {
  const { id } = await params;
  const mission = getMission(id);

  if (!mission) {
    notFound();
  }

  return <MissionPage mission={mission} />;
}
