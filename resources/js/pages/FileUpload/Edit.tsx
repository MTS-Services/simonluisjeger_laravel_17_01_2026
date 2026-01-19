import { Head, useForm, Link } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ArrowLeft } from 'lucide-react';

interface FileUpload {
    id: number;
    path: string;
    mime_type: string;
    created_at: string;
    updated_at: string;
}

interface Props {
    fileUpload: FileUpload;
}

export default function Edit({ fileUpload }: Props) {
    const { data, setData, patch, processing, errors } = useForm({
        mime_type: fileUpload.mime_type,
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        patch(`/fileupload/${fileUpload.id}`);
    };

    return (
        <>
            <Head title={`Edit File #${fileUpload.id}`} />
            <AppLayout>
                <div className="container mx-auto py-8 max-w-2xl">
                    <Link href={`/fileupload/${fileUpload.id}`} className="mb-6 inline-flex items-center gap-2 text-blue-600 hover:text-blue-800">
                        <ArrowLeft className="h-4 w-4" />
                        Back to File
                    </Link>

                    <div className="bg-white rounded-lg shadow p-6">
                        <h1 className="text-3xl font-bold mb-6">Edit File</h1>

                        <form onSubmit={handleSubmit}>
                            <div className="mb-6">
                                <label className="block text-sm font-medium mb-2">File Path</label>
                                <Input
                                    type="text"
                                    value={fileUpload.path}
                                    disabled
                                    className="bg-gray-100"
                                />
                                <p className="text-xs text-gray-500 mt-1">File path cannot be changed</p>
                            </div>

                            <div className="mb-6">
                                <label className="block text-sm font-medium mb-2">MIME Type</label>
                                <Input
                                    type="text"
                                    value={data.mime_type}
                                    onChange={(e) => setData('mime_type', e.target.value)}
                                    placeholder="e.g., application/pdf"
                                />
                                {errors.mime_type && (
                                    <p className="text-red-500 text-sm mt-2">{errors.mime_type}</p>
                                )}
                            </div>

                            <div className="flex gap-4">
                                <Button type="submit" disabled={processing}>
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
