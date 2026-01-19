import { Head, useForm, Link } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Button } from '@/components/ui/button';
import FileUpload from '@/components/file-upload';
import { ArrowLeft } from 'lucide-react';

interface FormData {
    files: File | File[] | null;
}

export default function Create() {
    const { data, setData, post, processing, errors } = useForm<FormData>({
        files: null,
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (!data.files) {
            alert('Please select at least one file');
            return;
        }

        const formData = new FormData();

        // Handle both single and multiple files
        if (Array.isArray(data.files)) {
            data.files.forEach((file) => {
                formData.append('files[]', file);
            });
        } else {
            formData.append('file', data.files);
        }

        // Use post with FormData directly - no need for 'data' key
        post('/fileupload', {
            // @ts-ignore - Inertia will handle FormData correctly
            data: formData,
            forceFormData: true,
        });
    };

    return (
        <>
            <Head title="Upload File" />
            <AppLayout>
                <div className="container mx-auto py-8 max-w-4xl">
                    <Link
                        href="/fileupload"
                        className="mb-6 inline-flex items-center gap-2 text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
                    >
                        <ArrowLeft className="h-4 w-4" />
                        Back to Files
                    </Link>

                    <div className="mb-6">
                        <h1 className="text-3xl font-bold mb-2 dark:text-white">Upload New Files</h1>
                        <p className="text-gray-600 dark:text-gray-400">
                            Select files from your computer to upload
                        </p>
                    </div>

                    <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
                        <form onSubmit={handleSubmit}>
                            <div className="mb-6">
                                <label className="block text-sm font-medium mb-2 dark:text-gray-200">
                                    Files
                                </label>

                                <FileUpload
                                    value={data.files}
                                    onChange={(files) => setData('files', files)}
                                    multiple={true}
                                    maxSize={10}
                                    maxFiles={10}
                                    accept="image/*,video/*,.pdf,.doc,.docx,.xls,.xlsx,.csv,.txt"
                                    error={(errors as any).files || (errors as any).file}
                                />
                            </div>

                            <div className="flex gap-4">
                                <Button
                                    type="submit"
                                    disabled={processing || !data.files}
                                >
                                    {processing ? 'Uploading...' : 'Upload Files'}
                                </Button>
                                <Link href="/fileupload">
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