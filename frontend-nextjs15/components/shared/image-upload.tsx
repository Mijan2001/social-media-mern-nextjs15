'use client';

import { useCallback, useState } from 'react';
import Image from 'next/image';
import { useDropzone } from 'react-dropzone';
import { ImagePlus, X } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ImageUploadProps {
    value: File | null | undefined;
    onChange: (file: File) => void;
}

export default function ImageUpload({ value, onChange }: ImageUploadProps) {
    const [preview, setPreview] = useState<string | null>(null);

    const onDrop = useCallback(
        (acceptedFiles: File[]) => {
            const file = acceptedFiles[0];

            if (file) {
                onChange(file);
                const reader = new FileReader();
                reader.onload = () => {
                    setPreview(reader.result as string);
                };
                reader.readAsDataURL(file);
            }
        },
        [onChange]
    );

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept: {
            'image/*': ['.jpeg', '.jpg', '.png', '.gif']
        },
        maxSize: 5 * 1024 * 1024, // 5MB
        maxFiles: 1
    });

    const handleRemove = () => {
        setPreview(null);
        onChange(null as any);
    };

    return (
        <div className="space-y-2">
            {preview ? (
                <div className="relative aspect-square w-full max-w-md mx-auto rounded-md overflow-hidden">
                    <Image
                        src={preview || '/placeholder.svg'}
                        alt="Preview"
                        fill
                        className="object-cover"
                    />
                    <Button
                        type="button"
                        variant="destructive"
                        size="icon"
                        className="absolute top-2 right-2"
                        onClick={handleRemove}
                    >
                        <X className="h-4 w-4" />
                    </Button>
                </div>
            ) : (
                <div
                    {...getRootProps()}
                    className={`border-2 border-dashed rounded-md p-8 text-center cursor-pointer transition-colors ${
                        isDragActive
                            ? 'border-primary bg-primary/10'
                            : 'border-muted-foreground/20'
                    }`}
                >
                    <input {...getInputProps()} />
                    <div className="flex flex-col items-center justify-center gap-2">
                        <ImagePlus className="h-10 w-10 text-muted-foreground" />
                        <p className="text-sm text-muted-foreground">
                            {isDragActive
                                ? 'Drop the image here'
                                : 'Drag & drop an image here, or click to select'}
                        </p>
                        <p className="text-xs text-muted-foreground">
                            (Max size: 5MB)
                        </p>
                    </div>
                </div>
            )}
        </div>
    );
}
