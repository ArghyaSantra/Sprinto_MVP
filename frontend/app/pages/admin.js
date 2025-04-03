import { useState } from "react";
import { gql, useMutation } from "@apollo/client";

const CREATE_POLICY = gql`
  mutation CreatePolicy($title: String!, $description: String!) {
    createPolicy(title: $title, description: $description) {
      id
      title
      description
    }
  }
`;

export default function Admin() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [createPolicy, { data, loading, error }] = useMutation(CREATE_POLICY);

  const handleSubmit = async (e) => {
    e.preventDefault();
    await createPolicy({ variables: { title, description } });
    setTitle("");
    setDescription("");
  };

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold">Admin Panel</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          placeholder="Title"
          className="p-2 border"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
        <input
          type="text"
          placeholder="Description"
          className="p-2 border"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
        />
        <button type="submit" className="bg-blue-500 text-white p-2">
          {loading ? "Creating..." : "Create Policy"}
        </button>
      </form>
      {error && <p className="text-red-500">Error: {error.message}</p>}
    </div>
  );
}
