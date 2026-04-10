import { Jimp } from "jimp";

async function run() {
  const img = new Jimp({ width: 200, height: 200, color: 0xffffffff });
  img.resize({ w: 100 });
  const out = await img.getBuffer("image/jpeg");
  console.log("compressed!", out.length);
}
run().catch(console.error);
