'use client';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage
} from '@/components/ui/form';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import { useCreatePostMutation } from '@/lib/redux/api/postsApi';
import ImageUpload from '@/components/shared/image-upload';

const formSchema = z.object({
    caption: z.string().min(1, 'Caption is required'),
    image: z.instanceof(File, { message: 'Image is required' })
});

type FormValues = z.infer<typeof formSchema>;

export default function CreatePostPage() {
    const router = useRouter();
    const [createPost, { isLoading }] = useCreatePostMutation();

    const form = useForm<FormValues>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            caption: ''
        }
    });

    async function onSubmit(values: FormValues) {
        try {
            const formData = new FormData();
            formData.append('caption', values.caption);
            formData.append('image', values.image);

            await createPost(formData).unwrap();

            toast.success('Post created successfully');

            router.push('/');
            router.refresh();
        } catch (error) {
            console.error(error);
            toast.error('Failed to create post');
        }
    }

    return (
        <div className="container max-w-2xl mx-auto py-10 px-4">
            <h1 className="text-3xl font-bold mb-8">Create Post</h1>

            <Form {...form}>
                <form
                    onSubmit={form.handleSubmit(onSubmit)}
                    className="space-y-8"
                >
                    <FormField
                        control={form.control}
                        name="image"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Image</FormLabel>
                                <FormControl>
                                    <ImageUpload
                                        value={field.value}
                                        onChange={field.onChange}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="caption"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Caption</FormLabel>
                                <FormControl>
                                    <Textarea
                                        placeholder="Write a caption..."
                                        className="resize-none"
                                        {...field}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <Button type="submit" disabled={isLoading}>
                        {isLoading ? 'Creating...' : 'Create Post'}
                    </Button>
                </form>
            </Form>
        </div>
    );
}
