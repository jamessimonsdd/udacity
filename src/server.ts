import express, { Request, Response } from "express";
import bodyParser from "body-parser";
import { filterImageFromURL, deleteLocalFiles } from "./util/util";

(async () => {
  // Init the Express application
  const app = express();

  // Set the network port
  const port = process.env.PORT || 8082;

  // Use the body parser middleware for post requests
  app.use(bodyParser.json());

  app.get("/", async (req, res) => {
    res.send("try GET /filtered-image?url={{}}");
  });

  app.get(
    "/filtered-image",
    async (req: Request<{}, {}, {}, { url: string }>, res: Response) => {
      const url = req.query.url;
      if (!url) {
        res.status(400).send("please provide an url");
      }
      const filteredImage = await filterImageFromURL(url);
      if (!filteredImage) {
        res.status(400).send("failed to filter image");
      }
      res.sendFile(filteredImage, () => {
        deleteLocalFiles([filteredImage]);
      });
    }
  );

  // Start the Server
  app.listen(port, () => {
    console.log(`server running http://localhost:${port}`);
    console.log(`press CTRL+C to stop server`);
  });
})();
