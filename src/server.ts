import express from "express";

const app = express();

const port = process.env.PORT || 4000;

app.get("/", (req: Request, res: any) => {
  res.send("Hello World from Express and TypeScript");
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
