import * as tape from "tape";
import _ from "highland";

import Subscription from "./subscription";

tape.default("Subscription.js - test", (t: tape.Test) => {
  t.plan(1);

  const unsubFn = () => {
    t.pass();
  };
  const sub = new Subscription("abc", _(), unsubFn);
  sub.cancel();
});
