import { hellowWorld } from "../src/index";

test("Hellow World", async () => {
    const data = await hellowWorld()
    expect(data).toBe("Hellow World");
});
