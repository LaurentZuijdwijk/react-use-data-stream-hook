import * as tape from "tape";
import Service from "./base-service";
import _ from "highland";

tape.default("Service test - basic test", (t: tape.Test) => {
  t.plan(8);

  const service = new Service();
  t.equal(service.hasSubscription("a"), false, "No subscriptions yet");
  const subscription = service.subscribe("a");
  const subscription2 = service.subscribe("a");
  const subscriptionB = service.subscribe("b");

  t.equal(subscription.constructor.name, "Subscription", "Does subscribe return a subscription");

  t.equal(service.hasSubscription("a"), true, "We have subscriptions");
  t.equal(service.subscriptions.get("a")?.count, 2, "We have in fact 2 subscriptions");

  subscription.each(a => t.equal(a, "abc", "A value has been written to the stream"));
  service.write("a", "abc");
  subscription.cancel();

  t.equal(service.subscriptions.get("a")?.count, 1);
  subscription2.cancel();
  t.equal(service.subscriptions.get("a")?.count, undefined);

  t.equal(service.hasSubscription("a"), false, "All subscriptions removed");
  t.equal(service.hasSubscription("b"), true, "This subscription is this there");
  subscriptionB.cancel();
});

tape.default("Service test - write values", (t: tape.Test) => {
  t.plan(2);

  // Assemble
  const service = new Service();
  const subscriptionA = service.subscribe("subject");
  const subscriptionB = service.subscribe("subject");

  // Assert
  subscriptionA.each(msg => t.equal(msg, "abc", "A value has been written to the stream"));
  subscriptionB.each(msg => t.equal(msg, "abc", "A value has been written to the stream"));

  // Act
  service.write("subject", "abc");
  subscriptionA.cancel();
  subscriptionB.cancel();
});

tape.default("Service test - multiple subscriptions", (t: tape.Test) => {
  t.plan(7);

  // Assemble
  const service = new Service();

  const subscription1 = service.subscribe("a");
  const subscription2 = service.subscribe("a");
  const subscriptionB = service.subscribe("b");

  // Assert
  t.equal(subscription1.constructor.name, "Subscription", "Does subscribe return a subscription");

  t.equal(service.hasSubscription("a"), true, "We have subscriptions");
  t.equal(service.subscriptions.get("a")?.count, 2, "We have in fact 2 subscriptions");

  subscription1.cancel();
  t.equal(service.subscriptions.get("a")?.count, 1);
  subscription2.cancel();

  t.equal(service.subscriptions.get("a")?.count, undefined);
  t.equal(service.hasSubscription("a"), false, "All subscriptions removed");
  t.equal(service.hasSubscription("b"), true, "This subscription is this there");
  subscriptionB.cancel();
});
