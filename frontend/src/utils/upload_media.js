import { v2 as cloudinary } from "cloudinary";
import formidable from "formidable";

export const config = {
  api: {
    bodyParser: false,
  },
};

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Méthode non autorisée" });
  }

  const form = formidable({ multiples: false });

  form.parse(req, async (err, fields, files) => {
    if (err) return res.status(500).json({ error: "Erreur de parsing" });

    const file = files.file[0];
    const upload = await cloudinary.uploader.upload(file.filepath, {
      folder: "next_uploads",
      format: "webp", // conversion automatique en WebP
      transformation: [
        { width: 1024, crop: "limit" }, // limite la largeur à 1024px sans couper
      ],
    });

    res.status(200).json({ url: upload.secure_url });
  });
}
