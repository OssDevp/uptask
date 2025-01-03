import server from "./server";
import colors from "colors";

const port = process.env.PORT || 3000;

server.listen(port, async () => {
  console.log(
    colors.bold.bgMagenta(` -- Server funcionando en el puerto: ${port} `),
  );
});
