import Stripe from "stripe";
import { Resource } from "sst";
import { Util } from "@sst-notes/core/util";
import { Billing } from "@sst-notes/core/billing";
import { z } from "zod";

const BillingSchema = z.object({
  storage: z.number(),
  source: z.string(),
});

export const main = Util.handler(async (event) => {
  const { storage, source } = BillingSchema.parse(
    JSON.parse(event.body || "{}")
  );
  const amount = Billing.compute(storage);
  const description = "Scratch charge";

  const stripe = new Stripe(Resource.StripeSecretKey.value, {
    apiVersion: "2024-11-20.acacia",
  });

  await stripe.charges.create({
    source,
    amount,
    description,
    currency: "usd",
  });

  return JSON.stringify({ status: true });
});
