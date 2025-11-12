'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import type { z } from 'zod';
import { furnitureSchema } from '@/lib/schema';
import type { Furniture } from '@/lib/types';
import { createFurnitureAction, updateFurnitureAction, handleImageUploadAction } from '@/app/actions';

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
import Image from 'next/image';
import { UploadCloud } from 'lucide-react';
import { cn } from '@/lib/utils';

type FurnitureFormValues = z.infer<typeof furnitureSchema>;

interface FurnitureFormProps {
  initialData?: Furniture;
}

export default function FurnitureForm({ initialData }: FurnitureFormProps) {
  const { toast } = useToast();
  const router = useRouter();
  const [isPending, startTransition] = React.useTransition();
  const [imagePreview, setImagePreview] = React.useState<string | null>(initialData?.imageUrl || null);
  const [isUploading, setIsUploading] = React.useState(false);
  const fileInputRef = React.useRef<HTMLInputElement>(null);

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

  const handleImageChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setIsUploading(true);
      const formData = new FormData();
      formData.append('image', file);

      try {
        const result = await handleImageUploadAction(formData);
        if ('imageUrl' in result) {
          form.setValue('imageUrl', result.imageUrl, { shouldValidate: true });
          // The flow does not return a hint, so we'll leave it empty or you can add a default
          // form.setValue('imageHint', result.imageHint); 
          setImagePreview(result.imageUrl);
        } else {
          toast({
            variant: 'destructive',
            title: 'Upload Failed',
            description: result.error,
          });
        }
      } catch (error) {
        toast({
          variant: 'destructive',
          title: 'Uh oh! Something went wrong.',
          description: 'There was a problem with the image upload.',
        });
      } finally {
        setIsUploading(false);
      }
    }
  };


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
            <FormItem>
              <FormLabel>Furniture Image</FormLabel>
              <FormControl>
                <div
                  className={cn(
                    "relative mt-2 flex justify-center items-center h-64 rounded-lg border-2 border-dashed border-border text-center cursor-pointer hover:border-primary transition-colors",
                    { 'border-primary': isUploading }
                  )}
                  onClick={() => fileInputRef.current?.click()}
                >
                  {isUploading ? (
                     <div className="flex flex-col items-center gap-2 text-muted-foreground">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                        <p>Uploading...</p>
                    </div>
                  ) : imagePreview ? (
                    <Image
                      src={imagePreview}
                      alt="Preview"
                      fill
                      className="object-contain rounded-lg p-2"
                    />
                  ) : (
                    <div className="flex flex-col items-center gap-2 text-muted-foreground">
                      <UploadCloud className="h-10 w-10" />
                      <p>Click to upload an image</p>
                      <p className="text-xs">PNG, JPG, GIF up to 10MB</p>
                    </div>
                  )}
                  <Input
                    ref={fileInputRef}
                    type="file"
                    className="sr-only"
                    accept="image/*"
                    onChange={handleImageChange}
                    disabled={isUploading || isPending}
                  />
                </div>
              </FormControl>
               <FormMessage>{form.formState.errors.imageUrl?.message}</FormMessage>
            </FormItem>

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
              <Button type="submit" disabled={isPending || isUploading}>
                {isPending ? 'Saving...' : (initialData ? 'Save Changes' : 'Add Item')}
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
