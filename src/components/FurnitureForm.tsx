'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import type { z } from 'zod';
import { furnitureSchema } from '@/lib/schema';
import type { Furniture } from '@/lib/types';
import { createFurnitureAction, updateFurnitureAction } from '@/app/actions';

import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { useRouter } from 'next/navigation';
import React from 'react';

type FurnitureFormValues = z.infer<typeof furnitureSchema>;

interface FurnitureFormProps {
  initialData?: Furniture;
}

export default function FurnitureForm({ initialData }: FurnitureFormProps) {
  const { toast } = useToast();
  const router = useRouter();
  const [isPending, startTransition] = React.useTransition();

  const form = useForm<FurnitureFormValues>({
    resolver: zodResolver(furnitureSchema),
    defaultValues: initialData
      ? {
          ...initialData,
        }
      : {
          name: '',
          description: '',
          price: 0,
          imageUrl: '',
          sellerContact: '',
        },
  });

  const onSubmit = (values: FurnitureFormValues) => {
    startTransition(async () => {
      try {
        if (initialData) {
          await updateFurnitureAction(initialData.id, values);
          toast({
            title: 'Success!',
            description: 'Furniture item has been updated.',
          });
        } else {
          await createFurnitureAction(values);
          toast({
            title: 'Success!',
            description: 'New furniture item has been added.',
          });
        }
      } catch (error) {
        toast({
          variant: 'destructive',
          title: 'Uh oh! Something went wrong.',
          description: 'There was a problem with your request.',
        });
      }
    });
  };

  return (
    <Card className="max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="font-headline text-2xl">
          {initialData ? 'Edit Furniture' : 'Add New Furniture'}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Furniture Name</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., Velvet Sofa" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Describe the furniture item..."
                      className="resize-none"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="price"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Price</FormLabel>
                  <FormControl>
                    <Input type="number" placeholder="e.g., 899.99" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="imageUrl"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Image URL</FormLabel>
                  <FormControl>
                    <Input placeholder="https://example.com/image.jpg" {...field} />
                  </FormControl>
                  <FormDescription>
                    Provide a direct link to a photo of the item.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="sellerContact"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Seller Contact Email</FormLabel>
                  <FormControl>
                    <Input type="email" placeholder="you@example.com" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex justify-end gap-4">
               <Button type="button" variant="outline" onClick={() => router.back()}>
                Cancel
              </Button>
              <Button type="submit" disabled={isPending}>
                {isPending ? 'Saving...' : (initialData ? 'Save Changes' : 'Add Item')}
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
