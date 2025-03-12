'use client';

import type React from 'react';

import { useState } from 'react';
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
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle
} from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useAppSelector } from '@/lib/redux/hooks';
import { useEditProfileMutation } from '@/lib/redux/api/usersApi';
import { Loader2 } from 'lucide-react';

const formSchema = z.object({
    username: z.string().min(3, 'Username must be at least 3 characters'),
    bio: z.string().optional(),
    profilePicture: z.instanceof(File).optional()
});

type FormValues = z.infer<typeof formSchema>;

export default function EditProfilePage() {
    const router = useRouter();
    const { user } = useAppSelector(state => state.auth);
    const [editProfile, { isLoading }] = useEditProfileMutation();
    const [previewImage, setPreviewImage] = useState<string | null>(null);

    const form = useForm<FormValues>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            username: user?.username || '',
            bio: user?.bio || ''
        }
    });

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            form.setValue('profilePicture', file);
            const reader = new FileReader();
            reader.onload = () => {
                setPreviewImage(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    async function onSubmit(values: FormValues) {
        try {
            const formData = new FormData();
            formData.append('username', values.username);
            if (values.bio) formData.append('bio', values.bio);
            if (values.profilePicture)
                formData.append('profilePicture', values.profilePicture);

            await editProfile(formData).unwrap();

            toast.success('Profile updated successfully');

            router.push(`/profile/${user?._id}`);
            router.refresh();
        } catch (error) {
            console.error(error);
            toast.error('Failed to update profile');
        }
    }

    if (!user) {
        return (
            <div className="container flex items-center justify-center min-h-[80vh]">
                <Loader2 className="h-8 w-8 animate-spin" />
            </div>
        );
    }

    return (
        <div className="container max-w-2xl mx-auto py-10 px-4">
            <Card>
                <CardHeader>
                    <CardTitle>Edit Profile</CardTitle>
                    <CardDescription>
                        Update your profile information
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="flex justify-center mb-6">
                        <div className="relative">
                            <Avatar className="h-24 w-24">
                                <AvatarImage
                                    src={
                                        previewImage || user.profilePicture?.url
                                    }
                                    alt={user.username}
                                />
                                <AvatarFallback className="text-2xl">
                                    {user.username
                                        .substring(0, 2)
                                        .toUpperCase()}
                                </AvatarFallback>
                            </Avatar>
                            <Input
                                type="file"
                                id="profilePicture"
                                accept="image/*"
                                className="hidden"
                                onChange={handleImageChange}
                            />
                            <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                className="absolute bottom-0 right-0"
                                onClick={() =>
                                    document
                                        .getElementById('profilePicture')
                                        ?.click()
                                }
                            >
                                Change
                            </Button>
                        </div>
                    </div>

                    <Form {...form}>
                        <form
                            onSubmit={form.handleSubmit(onSubmit)}
                            className="space-y-6"
                        >
                            <FormField
                                control={form.control}
                                name="username"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Username</FormLabel>
                                        <FormControl>
                                            <Input {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="bio"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Bio</FormLabel>
                                        <FormControl>
                                            <Textarea
                                                placeholder="Tell us about yourself"
                                                className="resize-none"
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <div className="flex justify-end gap-4">
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={() => router.back()}
                                >
                                    Cancel
                                </Button>
                                <Button type="submit" disabled={isLoading}>
                                    {isLoading ? 'Saving...' : 'Save Changes'}
                                </Button>
                            </div>
                        </form>
                    </Form>
                </CardContent>
            </Card>
        </div>
    );
}
