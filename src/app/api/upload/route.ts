import { handleUpload, type HandleUploadBody } from "@vercel/blob/client";
import { AdminAuthError, requireAdmin } from "@/lib/admin-auth";
import { ALLOWED_IMAGE_TYPES, MAX_UPLOAD_BYTES } from "@/lib/upload-rules";

/** Issues short-lived Blob upload tokens to signed-in admins, limited to images up to 8 MB. */
export async function POST(request: Request) {
  try {
    await requireAdmin();
  } catch (error) {
    if (error instanceof AdminAuthError) {
      return Response.json({ error: error.message }, { status: error.kind === "forbidden" ? 403 : 401 });
    }
    throw error;
  }

  try {
    const body = (await request.json()) as HandleUploadBody;
    const json = await handleUpload({
      body,
      request,
      onBeforeGenerateToken: async () => ({
        allowedContentTypes: [...ALLOWED_IMAGE_TYPES],
        maximumSizeInBytes: MAX_UPLOAD_BYTES,
        addRandomSuffix: true,
      }),
    });
    return Response.json(json);
  } catch (error) {
    console.error("Upload token request failed", error);
    return Response.json(
      { error: "The upload could not be started. Try again, or use a smaller image." },
      { status: 400 },
    );
  }
}
