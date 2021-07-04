import * as tape from "tape";
import _ from "highland";

import Subscription from "./subscription";


tape.default("Subscription.js - write subscription", (t: tape.Test) => {
  t.plan(2);

  const sub = new Subscription<string[]>("subject", _(), ()=>{});
  const message_one = ["my message"]
  t.equal(sub.key, "subject")

  sub.each((msg) => {
    t.equal(msg, message_one);
  });

  sub.write(message_one);
});

tape.default("Subscription.js - cancel", (t: tape.Test) => {
  t.plan(1);

  // assemble
  const sub = new Subscription<string>("abc", _(), unsubFn);
  
  // assert
  function unsubFn() {
    t.pass("Subscription unsubscribed");
  };

  // act
  sub.cancel();
});

tape.default("Subscription.js - write to cancelled", (t: tape.Test) => {
  t.plan(2);

  // assemble
  const sub = new Subscription<string>("abc", _(), unsubFn);
  
  // assert
  function unsubFn() {
    t.pass("Subscription unsubscribed");
  };

  // act
  sub.cancel();
  t.throws(()=> sub.write("message"));
});
