import { Head, useForm, Link } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useState } from 'react';

export default function Create() {
    const { data, setData, post, processing, errors } = useForm({
        file: null as File | null,
    });
    const [fileName, setFileName] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (!data.file) {
            alert('Please select a file');
            return;
        }

        const formData = new FormData();
        formData.append('file', data.file);

        post('/fileupload', {
            data: formData,
            forceFormData: true,
        });
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setData('file', file);
            setFileName(file.name);
        }
    };

    return (
        <>
            <Head title="Upload File" />
            <AppLayout>
                <div className="container mx-auto py-8 max-w-2xl">
                    <div className="mb-6">
                        <h1 className="text-3xl font-bold mb-2">Upload New File</h1>
                        <p className="text-gray-600">Select a file from your computer to upload</p>
                    </div>

                    <div className="bg-white rounded-lg shadow p-6">
                        <form onSubmit={handleSubmit}>
                            <div className="mb-6">
                                <label className="block text-sm font-medium mb-2">File</label>
                                <div className="border-2 border-dashed rounded-lg p-8 text-center hover:border-gray-400 transition">
                                    <input
                                        type="file"
                                        onChange={handleFileChange}
                                        className="hidden"
                                        id="file-input"
                                    />
                                    <label htmlFor="file-input" className="cursor-pointer">
                                        {fileName ? (
                                            <div>
                                                <p className="text-sm font-medium">{fileName}</p>
                                                <p className="text-xs text-gray-500 mt-1">Click to change</p>
                                            </div>
                                        ) : (
                                            <div>
                                                <p className="text-sm font-medium">Click to select a file</p>
                                                <p className="text-xs text-gray-500 mt-1">or drag and drop</p>
                                            </div>
                                        )}
                                    </label>
                                </div>
                                {errors.file && (
                                    <p className="text-red-500 text-sm mt-2">{errors.file}</p>
                                )}
                            </div>

                            <div className="flex gap-4">
                                <Button type="submit" disabled={processing || !data.file}>
                                    {processing ? 'Uploading...' : 'Upload File'}
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
