import express from "express";
import cors from "cors";
import helmet from "helmet";
import authRoutes from "./routes/authRoutes";
import testRoutes from "./routes/testRoutes";
import uploadRoutes from "./routes/uploadRoutes";
import assessmentRoutes from "./routes/assessmentRoutes";
import assessmentFormRoutes from "./routes/assessmentFormRoutes";
import morgan from "morgan";

const app = express();

app.use(morgan("dev"));
app.use(helmet() as any);
app.use(cors());
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/test", testRoutes);
app.use("/api/upload", uploadRoutes);
app.use("/api/assessments", assessmentRoutes);
app.use("/api/forms", assessmentFormRoutes);

app.get("/", (req, res) => res.json({ ok: true }));

export default app;
