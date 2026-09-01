export default function NotFound() {
  return (
    <main className="not-found-shell">
      <section className="not-found-card" aria-labelledby="not-found-title">
        <p className="not-found-mark" aria-hidden="true">
          404
        </p>
        <h1 id="not-found-title">המשימה לא נמצאה</h1>
        <p>כדאי לבדוק את הכתובת ולנסות שוב.</p>
      </section>
    </main>
  );
}
