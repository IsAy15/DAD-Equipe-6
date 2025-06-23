export default function UserMessagesPage({ params }) {
  // Utilisez React.use() pour obtenir les params
  const { userId } = params;

  return (
    <main style={{ minHeight: "1000vh" }}>
      <h1>Messages for User ID: {userId}</h1>
      {/* Vous pouvez ajouter ici le composant pour afficher les messages de l'utilisateur */}
    </main>
  );
}
