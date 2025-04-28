type ParamsType = {
  params: Promise<{ userId: string }>;
};

export default async function UserProfilePage({ params }: ParamsType) {
  const { userId } = await params;

  return (
    <div>
      <h1 className="text-center p-2 my-8">
        Profile page with the userID:{" "}
        <span className="p-2 rounded bg-orange-500 text-black">{userId}</span>
      </h1>
    </div>
  );
}
