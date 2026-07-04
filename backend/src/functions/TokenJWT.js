import jwt from "jsonwebtoken";
// Função para gerar tokens
export function gerarTokens(user) {
    const accessToken = jwt.sign(user, process.env.ACCESS_SECRET, { expiresIn: "60m" });
    const refreshToken = jwt.sign(user, process.env.REFRESH_SECRET, { expiresIn: "1d" });
    return { accessToken, refreshToken };
}
// Middleware para verificar Access Token
export function autenticarJWT(req, res, next) {
    // console.log("Token =>", req.cookies.accessToken);
    const token = req.cookies.accessToken;
    if (!token) return res.status(401).send("Token ausente");

    jwt.verify(token, process.env.ACCESS_SECRET, (err, user) => {
        if (err) return res.status(403).send("Token inválido");
        req.user = user;
        next();
    });
}