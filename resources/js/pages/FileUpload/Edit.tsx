import { Head, useForm, Link } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Button } from '@/components/ui/button';
import FileUpload from '@/components/file-upload';
import { ArrowLeft } from 'lucide-react';
import { useState } from 'react';

interface FileUploadType {
    id: number;
    path: string;
    mime_type: string;
    url: string | null;
    name?: string;
    size?: number;
    created_at: string;
    updated_at: string;
}

interface Props {
    fileUpload: FileUploadType;
}

interface FormData {
    file: File | null;
    _method: string;
}

export default function Edit({ fileUpload }: Props) {
    const [existingFiles, setExistingFiles] = useState(
        fileUpload.url ? [fileUpload] : []
    );

    const { data, setData, post, processing, errors } = useForm<FormData>({
        file: null,
        _method: 'PATCH',
    });

    const handleRemoveExisting = (fileId: number | string) => {
        if (confirm('Are you sure you want to remove the existing file? You must upload a new file to replace it.')) {
            setExistingFiles([]);
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (!data.file && existingFiles.length === 0) {
            alert('Please select a file to upload');
            return;
        }

        const formData = new FormData();
        formData.append('_method', 'PATCH');

        if (data.file) {
            formData.append('file', data.file);
        }

        // Use post with FormData directly - no need for 'data' key
        post(`/fileupload/${fileUpload.id}`, {
            // @ts-ignore - Inertia will handle FormData correctly
            data: formData,
            forceFormData: true,
        });
    };

    return (
        <>
            <Head title={`Edit File #${fileUpload.id}`} />
            <AppLayout>
                <div className="container mx-auto py-8 max-w-4xl">
                    <Link
                        href={`/fileupload/${fileUpload.id}`}
                        className="mb-6 inline-flex items-center gap-2 text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
                    >
                        <ArrowLeft className="h-4 w-4" />
                        Back to File
                    </Link>

                    <div className="mb-6">
                        <h1 className="text-3xl font-bold mb-2 dark:text-white">Edit File</h1>
                        <p className="text-gray-600 dark:text-gray-400">
                            Replace the existing file with a new one
                        </p>
                    </div>

                    <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
                        <form onSubmit={handleSubmit}>
                            <div className="mb-6">
                                <label className="block text-sm font-medium mb-2 dark:text-gray-200">
                                    File
                                </label>

                                <FileUpload
                                    value={data.file}
                                    onChange={(file) => setData('file', file as File | null)}
                                    existingFiles={existingFiles.map(f => ({
                                        id: f.id,
                                        path: f.path,
                                        url: f.url || `/storage/${f.path}`,
                                        mime_type: f.mime_type,
                                        name: f.name,
                                        size: f.size,
                                    }))}
                                    onRemoveExisting={handleRemoveExisting}
                                    multiple={false}
                                    maxSize={10}
                                    accept="image/*,video/*,.pdf,.doc,.docx,.xls,.xlsx,.csv,.txt"
                                    error={(errors as any).file}
                                />
                            </div>

                            <div className="flex gap-4">
                                <Button
                                    type="submit"
                                    disabled={processing}
                                >
                                    {processing ? 'Saving...' : 'Save Changes'}
                                </Button>
                                <Link href={`/fileupload/${fileUpload.id}`}>
                                    <Button type="button" variant="outline">
                                        Cancel
                                    </Button>
                                </Link>
                            </div>
                        </form>
                    </div>
                </div>
            </AppLayout>
        </>
    );
}