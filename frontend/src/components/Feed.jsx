import Post from "@/components/Post";

export default function Feed({ posts, loadingPosts }) {
  return (
    <div className="flex flex-col w-full gap-4">
      {loadingPosts ? (
        <p className="text-center">Chargement des posts...</p>
      ) : posts && posts.length > 0 ? (
        posts.map((post) => <Post key={post._id} post={post} />)
      ) : (
        <p className="text-center text-gray-500">Aucun post pour le moment.</p>
      )}
    </div>
  );
}
