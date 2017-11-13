import { ize, Ize } from '../distribution/';

test("action creator creator works", () => {
  const actionCreator = (b) => ({type:"TEST", payload: b});
  const actionCreatorCreator0 = ize(0)((a)=>({b:a}))("q");
  const actionCreatorCreator1 = ize(1)((z)=>({c:z + 1000}))();
  const actionCreatorCreator2 = ize(1)((r,f)=>({d:r, e:f}))("m");
  const ized = Ize(
    actionCreator,
    actionCreatorCreator0,
    actionCreatorCreator1,
    actionCreatorCreator2
  );
  expect(ized(555,23,432)).toEqual({
    type: "TEST",
    payload: 432,
    meta: {
      b: "q",
      c: 1023,
      d: 555,
      e: "m"
    }
  });
});

test("action creator can use action in meta", () => {
  const actionCreator = (b) => ({type:"TEST", payload: b});
  const actionCreatorCreator0 = ize(0)((a, {payload})=>({b:a, z: payload}))("q");
  const ized = Ize(
    actionCreator,
    actionCreatorCreator0
  );
  expect(ized(432)).toEqual({
    type: "TEST",
    payload: 432,
    meta: {
      b: "q",
      z: 432
    }
  });
});
