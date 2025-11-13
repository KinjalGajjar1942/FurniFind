
'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import type { z } from 'zod';
import { furnitureSchema } from '@/lib/schema';
import type { Furniture, FurnitureImage } from '@/lib/types';
import { generateImageHintAction } from '@/app/actions';
import { addFurniture, updateFurniture, uploadImageAndGetUrl } from '@/lib/firebase/client';
import { useCollection } from '@/firebase/firestore/use-collection';
import { useFirebase, useFirestore, useMemoFirebase } from '@/firebase';
import { collection, type Firestore } from 'firebase/firestore';
import type { FirebaseStorage } from 'firebase/storage';

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
import { UploadCloud, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

type FurnitureFormValues = z.infer<typeof furnitureSchema>;

interface FurnitureFormProps {
  initialData?: Furniture;
}

interface Category {
    id: string;
    name: string;
}

export default function FurnitureForm({ initialData }: FurnitureFormProps) {
  const { toast } = useToast();
  const router = useRouter();
  const [isPending, startTransition] = React.useTransition();
  const [imagePreviews, setImagePreviews] = React.useState<FurnitureImage[]>(initialData?.images || []);
  const [isUploading, setIsUploading] = React.useState(false);
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const firestore = useFirestore();
  const { storage } = useFirebase();
  const categoriesQuery = useMemoFirebase(() => firestore ? collection(firestore, 'categories') : null, [firestore]);
  const { data: categories, isLoading: isLoadingCategories } = useCollection<Category>(categoriesQuery);

  const form = useForm<FurnitureFormValues>({
    resolver: zodResolver(furnitureSchema),
    defaultValues: initialData
      ? {
          ...initialData,
        }
      : {
          name: '',
          description: '',
          images: [],
          category: '',
        },
  });

  React.useEffect(() => {
    form.setValue('images', imagePreviews);
  }, [imagePreviews, form]);

  const handleImageChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && storage) {
      setIsUploading(true);
      try {
        const imageUrl = await uploadImageAndGetUrl(storage, file);

        const arrayBuffer = await file.arrayBuffer();
        const base64 = Buffer.from(arrayBuffer).toString('base64');
        const dataURI = `data:${file.type};base64,${base64}`;

        const imageHint = await generateImageHintAction(dataURI);

        const newImage: FurnitureImage = { url: imageUrl, hint: imageHint };
        setImagePreviews(prev => [...prev, newImage]);

      } catch (error) {
        console.error("Error uploading image:", error);
        toast({
          variant: 'destructive',
          title: 'Upload Failed',
          description: 'There was a problem with the image upload. Please check storage rules and network.',
        });
      } finally {
        setIsUploading(false);
        if(fileInputRef.current) {
          fileInputRef.current.value = '';
        }
      }
    }
  };

  const removeImage = (index: number) => {
    setImagePreviews(prev => prev.filter((_, i) => i !== index));
  };

  const onSubmit = (values: FurnitureFormValues) => {
    startTransition(async () => {
      try {
        if (initialData) {
          await updateFurniture(firestore, initialData.id, values);
          toast({
            title: 'Success!',
            description: 'Furniture item has been updated.',
          });
          router.push(`/furniture/${initialData.id}`);
        } else {
          await addFurniture(firestore, values);
          toast({
            title: 'Success!',
            description: 'New furniture item has been added.',
          });
          router.push('/');
        }
      } catch (error) {
        console.error("Error saving furniture:", error);
        toast({
          variant: 'destructive',
          title: 'Uh oh! Something went wrong.',
          description: 'There was a problem saving your item.',
        });
      }
    });
  };

  return (
    <Card className="max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle className="font-headline text-2xl">
          {initialData ? 'Edit Furniture' : 'Add New Furniture'}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormItem>
              <FormLabel>Furniture Images</FormLabel>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {imagePreviews.map((image, index) => (
                  <div key={index} className="relative group aspect-square">
                    <Image
                      src={image.url}
                      alt={`Preview ${index + 1}`}
                      fill
                      className="object-cover rounded-lg"
                    />
                    <Button
                      type="button"
                      variant="destructive"
                      size="icon"
                      className="absolute top-2 right-2 h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
                      onClick={() => removeImage(index)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
                 <FormControl>
                  <div
                    className={cn(
                      "relative mt-2 flex justify-center items-center aspect-square rounded-lg border-2 border-dashed border-border text-center cursor-pointer hover:border-primary transition-colors",
                      { 'border-primary': isUploading }
                    )}
                    onClick={() => !isUploading && fileInputRef.current?.click()}
                  >
                    {isUploading ? (
                      <div className="flex flex-col items-center gap-2 text-muted-foreground">
                          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                          <p>Uploading...</p>
                      </div>
                    ) : (
                      <div className="flex flex-col items-center gap-2 text-muted-foreground">
                        <UploadCloud className="h-10 w-10" />
                        <p className="text-sm">Click to upload</p>
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
              </div>
               <FormMessage>{form.formState.errors.images?.message}</FormMessage>
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
              name="category"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Category</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value} disabled={isLoadingCategories}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder={isLoadingCategories ? "Loading categories..." : "Select a category"} />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {categories?.map((category) => (
                        <SelectItem key={category.id} value={category.name}>{category.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
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
