"use client"

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Form } from "@/components/ui/form";
import InputElement from "@/components/form-elements/input-element";
import { Button } from "@/components/ui/button";
import { useMutation } from "convex/react";
import { api } from "~/convex/_generated/api";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import {
  AddTickerTapeRequest,
  AddTickerTapeSchema,
} from "./add-ticker-tape.schema";
import { PageRoutes } from "@/constants/page-routes";

interface AddTickerTapeFormProps {
  afterSubmit?: () => void;
}

const AddTickerTapeForm: React.FC<AddTickerTapeFormProps> = ({
  afterSubmit,
}) => {
  const router = useRouter();
  const createTickerTapeItem = useMutation(api.tickerTape.createTickerTapeItem);

  const form = useForm<AddTickerTapeRequest>({
    resolver: zodResolver(AddTickerTapeSchema),
    defaultValues: {
      title: "",
      link: "",
      isPublished: false,
    },
  });

  const onSubmit = async (values: AddTickerTapeRequest) => {
    try {
      toast.promise(
        createTickerTapeItem({
          title: values.title,
          link: values.link || undefined,
          isPublished: false,
        }),
        {
          loading: "Creating ticker item...",
          success: () => {
            afterSubmit?.();
            return "Ticker item created successfully";
          },
          error: "Failed to create ticker item",
        }
      );
      router.push(PageRoutes.DASHBOARD.TICKER_TAPE);
    } catch (error) {
      console.error("Failed to create ticker item:", error);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="space-y-6 max-h-[70vh] overflow-y-auto pr-4">
          <InputElement
            name="title"
            label="Title"
            placeholder="Enter ticker title"
          />
          <InputElement
            name="link"
            label="Link"
            placeholder="Enter a valid URL"
            isOptional
            description="If provided, users will open this link when they click the ticker item."
          />
        </div>
        <Button type="submit" className="w-full">
          Add Ticker Item
        </Button>
      </form>
    </Form>
  );
};

export default AddTickerTapeForm;
