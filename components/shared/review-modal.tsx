"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import React, { useEffect } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import z from "zod";
import { useCreateReview } from "@/hooks/review/use-create-review";
import { Product, ReviewCreate } from "@/types";
import { toast } from "sonner";
import { Loader2, Star, X } from "lucide-react";
import { Field, FieldGroup, FieldLabel, FieldSet } from "../ui/field";
import { Button } from "../ui/button";

const createReviewSchema = z.object({
  rating: z.number().min(1).max(5, "Rating must be between 1 and 5"),
  comment: z.string().min(2, "Comment must be at least 2 characters"),
});

type CreateReviewFormFields = z.infer<typeof createReviewSchema>;

interface ReviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  product: Product | null;
}

const ReviewModal = ({ isOpen, onClose, product }: ReviewModalProps) => {
  const { mutate: createReview, isPending: isCreating } = useCreateReview();

  const form = useForm<CreateReviewFormFields>({
    resolver: zodResolver(createReviewSchema),
    defaultValues: {
      rating: 5,
      comment: "",
    },
    mode: "onChange",
  });
  const rating = form.watch("rating");

  useEffect(() => {
    if (isOpen && product) {
      form.reset({
        rating: 5,
        comment: "",
      });
    }
  }, [form, isOpen, product]);

  const onSubmit: SubmitHandler<CreateReviewFormFields> = async (values) => {
    if (!product) return;

    const reviewPayload: ReviewCreate = {
      product_id: product.id,
      rating: values.rating,
      comment: values.comment,
    };

    createReview(reviewPayload, {
      onSuccess: () => {
        toast.success("Review created successfully");
        onClose();
      },
      onError: (error) => {
        console.error("Create failed:", error);
        toast.error("Failed to create review");
      },
    });
  };

  const handleFormError = (errors: Record<string, { message?: string }>) => {
    const firstErrorKey = Object.keys(errors)[0];
    if (firstErrorKey && errors[firstErrorKey]?.message) {
      toast.error(errors[firstErrorKey].message);
    }
  };

  if (!isOpen || !product) return null;

  return (
    <section className="fixed z-50 top-0 left-0 w-full h-full bg-[#32475C80] flex items-center justify-center px-4">
      <div className="w-full max-w-204 bg-white p-8 md:p-12 rounded-lg shadow-md">
        <div className="flex items-center justify-between mb-6">
          <div className="flex flex-col gap-2 text-gray-600">
            <h1 className="text-base font-semibold">Leave a review</h1>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="cursor-pointer transition-all duration-300 text-gray-600 hover:text-red-500"
            aria-label="Close review modal"
          >
            <X size={20} />
          </button>
        </div>

        <div className="flex items-center gap-4 mb-6">
          <img
            src={product.image_url}
            alt={product.name}
            className="w-16 h-16 rounded-2xl object-cover"
          />
          <div className="flex flex-col gap-1">
            <h2 className="text-sm font-semibold text-gray-800">
              {product.name}
            </h2>
            <p className="text-xs capitalize text-gray-500">
              {product.category}
            </p>
          </div>
        </div>

        <form
          onSubmit={form.handleSubmit(onSubmit, handleFormError)}
          className="flex flex-col gap-6"
        >
          <FieldGroup>
            <FieldSet>
              <Field>
                <FieldLabel>Comment</FieldLabel>
                <textarea
                  {...form.register("comment")}
                  placeholder="Write your review here"
                  className="min-h-24 w-full rounded-md border border-[#E2E8F0] px-3 py-2 text-sm outline-none focus:border-primary"
                  autoComplete="off"
                  rows={4}
                />
              </Field>
              <Field>
                <FieldLabel>Rating</FieldLabel>
                <div className="flex items-center gap-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() =>
                        form.setValue("rating", star, {
                          shouldValidate: true,
                          shouldDirty: true,
                        })
                      }
                      className="cursor-pointer transition-colors"
                      aria-label={`Rate ${star} out of 5`}
                    >
                      <Star
                        size={28}
                        fill={star <= rating ? "currentColor" : "transparent"}
                        className={
                          star <= rating ? "text-primary" : "text-[#D9D9D9]"
                        }
                      />
                    </button>
                  ))}
                </div>
              </Field>
            </FieldSet>
          </FieldGroup>

          <Button
            type="submit"
            disabled={isCreating || !form.formState.isValid}
            className="w-full"
          >
            {isCreating && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Submit review
          </Button>
        </form>
      </div>
    </section>
  );
};

export default ReviewModal;
