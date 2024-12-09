"use server";
import { createClient } from "@/lib/supabase/server";

export async function createProject(formData: FormData) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("projects")
    .insert([
      {
        project_name: formData.get("name") as string,
        description: formData.get("description") as string,
        start_date: formData.get("start_date") as string,
        end_date: formData.get("end_date") as string,
      },
    ])
    .select()
    .single();
  console.log(data, error);
  return { data, error };
}
export async function deleteProject(projectName: string) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("projects")
    .delete()
    .eq("project_name", projectName)
    .select()
    .single();
  console.log(data, error);
  return { data, error };
}
