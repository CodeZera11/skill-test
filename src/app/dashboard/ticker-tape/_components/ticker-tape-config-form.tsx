"use client"

import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useMutation, useQuery } from "convex/react";
import { api } from "~/convex/_generated/api";
import { Form } from "@/components/ui/form";
import InputElement from "@/components/form-elements/input-element";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import {
  TickerTapeConfigRequest,
  TickerTapeConfigSchema,
} from "./add-ticker-tape.schema";

const TickerTapeConfigForm = () => {
  const config = useQuery(api.tickerTape.getTickerTapeConfig);
  const upsertTickerTapeConfig = useMutation(api.tickerTape.upsertTickerTapeConfig);

  const form = useForm<TickerTapeConfigRequest>({
    resolver: zodResolver(TickerTapeConfigSchema),
    defaultValues: {
      speed: 40,
      itemsToShow: 10,
    },
  });

  useEffect(() => {
    if (!config) return;

    form.reset({
      speed: config.speed,
      itemsToShow: config.itemsToShow,
    });
  }, [config, form]);

  const onSubmit = async (values: TickerTapeConfigRequest) => {
    try {
      await toast.promise(
        upsertTickerTapeConfig(values),
        {
          loading: "Saving ticker settings...",
          success: "Ticker settings saved successfully",
          error: "Failed to save ticker settings",
        }
      );
    } catch (error) {
      console.error("Failed to save ticker settings:", error);
    }
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="grid gap-4 rounded-lg border p-4 md:grid-cols-[1fr_1fr_auto]"
      >
        <InputElement
          name="speed"
          type="number"
          label="Speed"
          placeholder="Enter ticker speed"
          description="This directly controls the ticker animation duration."
        />
        <InputElement
          name="itemsToShow"
          type="number"
          label="Number of items to show"
          placeholder="Enter number of items"
          description="Latest published ticker items shown on the landing page."
        />
        <div className="flex items-end">
          <Button type="submit" className="w-full md:w-auto">
            Save Settings
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default TickerTapeConfigForm;
