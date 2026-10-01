import { createFileRoute, Link } from "@tanstack/react-router";
import { PageShell } from "@/components/PageShell";
import { LessonMovie } from "@/components/LessonMovie";
import { getMovie } from "@/data/lessonMovies";
import { lessons } from "@/lib/game-data";

export const Route = createFileRoute("/learn/$lesson")({
  head: ({ params }) => {
    const l = lessons.find((x) => x.id === params.lesson);
    return { meta: [{ title: `${l?.title ?? "Lesson"} — Diamond In The Sky` }] };
  },
  component: LessonRoute,
  notFoundComponent: () => (
    <PageShell>
      <p>Lesson not found.</p>
    </PageShell>
  ),
});

function LessonRoute() {
  const { lesson } = Route.useParams();
  const movie = getMovie(lesson);

  if (!movie) {
    return (
      <PageShell>
        <p>This lesson's movie isn't ready yet.</p>
        <Link to="/learn" className="text-accent underline">Back to lessons</Link>
      </PageShell>
    );
  }

  return <LessonMovie movie={movie} />;
}
