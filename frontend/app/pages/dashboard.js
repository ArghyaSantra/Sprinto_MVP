import { gql, useQuery } from "@apollo/client";
import { useRouter } from "next/router";

const GET_POLICIES = gql`
  query {
    policies {
      id
      title
      description
    }
  }
`;

export default function Dashboard() {
  const router = useRouter();
  const { data, loading, error } = useQuery(GET_POLICIES);

  if (!localStorage.getItem("token")) {
    router.push("/");
    return null;
  }

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold">Policies</h1>
      {loading && <p>Loading...</p>}
      {error && <p>Error: {error.message}</p>}
      <ul>
        {data?.policies.map((policy) => (
          <li key={policy.id} className="border p-4 my-2">
            {policy.title}: {policy.description}
          </li>
        ))}
      </ul>
    </div>
  );
}
