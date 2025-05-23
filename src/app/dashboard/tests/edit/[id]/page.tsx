import { PageProps } from "@/types";
import EditTestContainer from "../_components/edit-test-container";

const EditTestPage = async ({ params }: PageProps) => {
  const id = (await params).id as string;

  return (
    <div className="container py-6">
      <EditTestContainer id={id} />
    </div>
  );
}

export default EditTestPage