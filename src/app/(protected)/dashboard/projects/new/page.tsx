import CreateProject from "@/components/project/create-project";

export default async function NewProjectPage() {
  return (
    <div className="container p-4">
      <h1 className="text-2xl font-bold mb-4">Create New Project</h1>

      <CreateProject />
    </div>
  );
}
