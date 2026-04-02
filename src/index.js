import dotenv from "dotenv";

dotenv.config({
    path: "./.env",
});

const PORT = process.env.PORT || 8000;

const bootstrap = async () => {
    const [{ default: app }, { default: connectDB }] = await Promise.all([
        import("./app.js"),
        import("./db/mongo.js"),
    ]);

    await connectDB();

    app.listen(PORT, () => {
        console.log(`Server is running on PORT : ${PORT}`);
    });
};

bootstrap().catch((err) => {
    console.log("Connection failed", err);
});





