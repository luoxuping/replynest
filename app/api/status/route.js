import { mindsConfigured } from "../../../lib/minds";

export async function GET() {
  return Response.json({
    mindsConfigured: mindsConfigured()
  });
}
