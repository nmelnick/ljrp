import { Loader } from "../../service/Loader";
import { LiveJournal } from "../../service/LiveJournal";

test("Loader loads LiveJournal instance with LiveJournal profile_name", async () => {
    const lj = Loader.load("LiveJournal", null, null, null);
    expect(lj).toBeInstanceOf(LiveJournal);
});

test("Loader throws an error with invalid profile_name", async () => {
    const load = () => {
        Loader.load("WordPress", null, null, null);
    };
    expect(load).toThrow();
});
